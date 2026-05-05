"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Check, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  aiOptions,
  defaultRobotConfig,
  motionOptions,
  perceptionOptions,
  powerOptions,
  robotStorageKey,
  type ComponentOption,
  type RobotConfig,
} from "@/lib/robot-config";
import { RobotPanel } from "@/components/sections/RobotPanel";
import { StationCard } from "@/components/sections/StationCard";

// ─── Typing animation ────────────────────────────────────────────────────────

const TYPING_WORDS = ["Learning.", "Programming.", "Thinking."];
const CHAR_DELAY_MS = 75;
const ERASE_DELAY_MS = 38;
const PAUSE_MS = 1800;

function TypingText() {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const word = TYPING_WORDS[wordIdx];
    if (typing) {
      if (text.length < word.length) {
        const t = setTimeout(() => setText(word.slice(0, text.length + 1)), CHAR_DELAY_MS);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setTyping(false), PAUSE_MS);
      return () => clearTimeout(t);
    } else {
      if (text.length > 0) {
        const t = setTimeout(() => setText((s) => s.slice(0, -1)), ERASE_DELAY_MS);
        return () => clearTimeout(t);
      }
      setWordIdx((i) => (i + 1) % TYPING_WORDS.length);
      setTyping(true);
    }
  }, [text, wordIdx, typing]);

  return (
    <span className="text-cyan-soft" aria-live="polite" aria-label={TYPING_WORDS[wordIdx]}>
      {text}
      <span className="animate-pulse opacity-80">|</span>
    </span>
  );
}

// ─── Floating decorative shapes ───────────────────────────────────────────────

const SHAPES = [
  { top: "12%", left: "6%", size: 18, delay: 0, duration: 4.2, rotate: 45 },
  { top: "28%", left: "88%", size: 12, delay: 1.1, duration: 5.0, rotate: 30 },
  { top: "60%", left: "4%", size: 10, delay: 0.6, duration: 3.8, rotate: 60 },
  { top: "70%", left: "91%", size: 14, delay: 1.8, duration: 4.6, rotate: 15 },
  { top: "44%", left: "95%", size: 8, delay: 0.3, duration: 3.2, rotate: 75 },
] as const;

function FloatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {SHAPES.map((s, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            transform: `rotate(${s.rotate}deg)`,
          }}
          className="border border-cyan-soft/20 bg-cyan-soft/5"
        />
      ))}
    </div>
  );
}

// ─── Station config ───────────────────────────────────────────────────────────

type Station =
  | { id: "brain"; kind: "static"; options?: never }
  | { id: "power" | "motion" | "ai"; kind: "single"; options: ComponentOption[] }
  | { id: "perception"; kind: "multi"; options: ComponentOption[] };

const stations: Station[] = [
  { id: "brain", kind: "static" },
  { id: "power", kind: "single", options: powerOptions },
  { id: "perception", kind: "multi", options: perceptionOptions },
  { id: "motion", kind: "single", options: motionOptions },
  { id: "ai", kind: "single", options: aiOptions },
];

function selectedCount(config: RobotConfig) {
  return [config.power, config.motion, config.ai, ...config.perception].filter(Boolean).length;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RobotBuilder() {
  const t = useTranslations();
  const locale = useLocale();
  const [config, setConfig] = useState<RobotConfig>(defaultRobotConfig);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(robotStorageKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as RobotConfig;
      window.requestAnimationFrame(() => {
        setConfig({
          power: parsed.power ?? null,
          perception: Array.isArray(parsed.perception) ? parsed.perception : [],
          motion: parsed.motion ?? null,
          ai: parsed.ai ?? null,
        });
        setSaved(true);
      });
    } catch {
      window.localStorage.removeItem(robotStorageKey);
    }
  }, []);

  const specItems = useMemo(() => {
    const ids = [
      "brain_brick",
      config.power,
      ...config.perception,
      config.motion,
      config.ai,
    ].filter(Boolean) as string[];
    return ids.map((id) => t(`components.${id}.name`));
  }, [config, t]);

  function selectOption(option: ComponentOption) {
    setSaved(false);
    setConfig((current) => {
      if (option.station === "power") return { ...current, power: option.id };
      if (option.station === "motion") return { ...current, motion: option.id };
      if (option.station === "ai") return { ...current, ai: option.id };
      const exists = current.perception.includes(option.id);
      const next = exists
        ? current.perception.filter((item) => item !== option.id)
        : [...current.perception, option.id].slice(0, 3);
      return { ...current, perception: next };
    });
  }

  function saveConfig() {
    window.localStorage.setItem(robotStorageKey, JSON.stringify(config));
    setSaved(true);
  }

  function resetConfig() {
    window.localStorage.removeItem(robotStorageKey);
    setConfig(defaultRobotConfig);
    setSaved(false);
  }

  return (
    <main className="tron-grid crosshair-cursor pt-16">
      <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <FloatingShapes />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-cyan-soft/50 bg-surface/80 px-3 py-2 font-mono text-xs uppercase text-cyan-soft">
            <span className="size-2 rounded-full bg-green-soft" />
            {t("hero.badge")}
          </div>
          <h1 className="scanline font-display text-5xl font-bold leading-tight sm:text-7xl lg:text-8xl">
            R<span className="text-cyan-soft">0</span>6
            <span className="text-cyan-soft">0</span>7
          </h1>
          <p className="mt-5 max-w-2xl text-2xl font-medium leading-snug text-foreground sm:text-3xl">
            {t("hero.heading")}
          </p>
          <p className="mt-4 max-w-2xl font-mono text-lg text-muted">
            <TypingText />
          </p>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-muted">
            {t("hero.copy")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#brain"
              className="focus-ring rounded-md bg-cyan-soft px-5 py-3 font-medium text-background shadow-[0_0_30px_var(--glow-cyan)] transition hover:scale-[1.02]"
            >
              {t("hero.start")}
            </a>
            <Link
              href={`/${locale}/events`}
              className="focus-ring rounded-md border border-border bg-surface px-5 py-3 font-medium text-foreground transition hover:border-cyan-soft"
            >
              {t("hero.workshops")}
            </Link>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["brain", "code", "aiva", "privacy"].map((key) => (
              <div
                key={key}
                className="rounded-lg border border-border bg-surface/78 p-4 text-sm text-muted"
              >
                {t(`hero.stats.${key}`)}
              </div>
            ))}
          </div>
        </motion.div>
        <RobotPanel config={config} selected={selectedCount(config)} />
      </section>

      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="space-y-8">
          {stations.map((station, index) => (
            <StationCard
              key={station.id}
              station={station}
              index={index}
              config={config}
              onSelect={selectOption}
            />
          ))}
          <section
            id="result"
            className="rounded-lg border border-cyan-soft/50 bg-surface/85 p-6 shadow-[0_0_50px_var(--glow-cyan)] sm:p-8"
          >
            <p className="font-mono text-sm uppercase text-cyan-soft">
              {t("sections.result.kicker")}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold">
              {t("sections.result.title")}
            </h2>
            <p className="mt-4 max-w-2xl text-muted">
              {t("sections.result.copy")}
            </p>
            <div className="mt-6 rounded-md border border-border bg-background/70 p-4 font-mono text-sm">
              {specItems.map((item) => (
                <div key={item} className="flex items-center gap-2 py-1">
                  <Check size={15} className="text-green-soft" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={saveConfig}
                className="focus-ring inline-flex items-center gap-2 rounded-md bg-green-soft px-4 py-3 font-medium text-background"
              >
                <Save size={18} />
                {saved ? t("ui.saved") : t("ui.save")}
              </button>
              <button
                type="button"
                onClick={resetConfig}
                className="focus-ring inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-3 font-medium text-muted transition hover:border-pink-soft hover:text-foreground"
              >
                <Trash2 size={18} />
                {t("ui.startFresh")}
              </button>
              <Link
                href={`/${locale}/learn`}
                className="focus-ring inline-flex items-center gap-2 rounded-md border border-cyan-soft bg-surface px-4 py-3 font-medium text-foreground"
              >
                {t("sections.result.learnMore")}
              </Link>
            </div>
          </section>
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <RobotPanel config={config} selected={selectedCount(config)} />
          </div>
        </div>
      </div>
    </main>
  );
}
