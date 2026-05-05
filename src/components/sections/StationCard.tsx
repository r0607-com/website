"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import type { ComponentOption, RobotConfig } from "@/lib/robot-config";
import { cn } from "@/lib/utils";

interface Station {
  id: "brain" | "power" | "motion" | "ai" | "perception";
  kind: "static" | "single" | "multi";
  options?: ComponentOption[];
}

const ALL_STATIONS: Station[] = [
  { id: "brain", kind: "static" },
  { id: "power", kind: "single" },
  { id: "perception", kind: "multi" },
  { id: "motion", kind: "single" },
  { id: "ai", kind: "single" },
];

function optionSelected(option: ComponentOption, config: RobotConfig): boolean {
  if (option.station === "power") return config.power === option.id;
  if (option.station === "motion") return config.motion === option.id;
  if (option.station === "ai") return config.ai === option.id;
  return config.perception.includes(option.id);
}

interface StationCardProps {
  station: Station;
  index: number;
  config: RobotConfig;
  onSelect: (option: ComponentOption) => void;
}

export function StationCard({ station, index, config, onSelect }: StationCardProps) {
  const t = useTranslations();
  const nextStationId = ALL_STATIONS[index + 1]?.id ?? "result";

  return (
    <motion.section
      id={station.id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.35 }}
      className="rounded-lg border border-border bg-surface/85 p-6 sm:p-8"
    >
      <p className="font-mono text-sm uppercase text-cyan-soft">
        {String(index).padStart(2, "0")} / {t(`sections.${station.id}.kicker`)}
      </p>
      <h2 className="mt-3 font-display text-3xl font-bold">
        {t(`sections.${station.id}.title`)}
      </h2>
      <p className="mt-3 max-w-2xl text-lg font-medium text-foreground">
        {t(`sections.${station.id}.tagline`)}
      </p>
      <p className="mt-4 max-w-2xl leading-7 text-muted">
        {t(`sections.${station.id}.copy`)}
      </p>

      {station.kind === "static" ? (
        <div className="mt-6 rounded-md border border-cyan-soft/40 bg-background/70 p-5">
          <p className="font-mono text-sm text-cyan-soft">
            {t("components.brain_brick.name")}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            {t("components.brain_brick.desc")}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {station.options?.map((option) => {
            const Icon = option.icon;
            const selected = optionSelected(option, config);

            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => onSelect(option)}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 380, damping: 22 } }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "focus-ring group min-h-36 rounded-lg border bg-background/75 p-4 text-left transition-colors hover:border-cyan-soft hover:shadow-[0_0_34px_var(--glow-cyan)]",
                  selected
                    ? "border-green-soft shadow-[0_0_30px_var(--glow-cyan)]"
                    : "border-border",
                  station.id === "power" && selected && "energy-flow-border",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 place-items-center rounded-md border border-border bg-surface text-cyan-soft">
                    <Icon size={20} />
                  </span>
                  {selected ? (
                    <motion.span
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-background",
                        station.id === "perception" ? "sensor-pulse bg-violet-soft" : "bg-green-soft",
                      )}
                    >
                      <Check size={13} />
                      {t("ui.selected")}
                    </motion.span>
                  ) : null}
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">
                  {t(`components.${option.id}.name`)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {t(`components.${option.id}.desc`)}
                </p>
              </motion.button>
            );
          })}
        </div>
      )}

      {station.id !== "ai" ? (
        <a
          href={`#${nextStationId}`}
          className="focus-ring mt-6 inline-flex rounded-md border border-border bg-surface px-4 py-3 text-sm font-medium text-muted transition hover:border-cyan-soft hover:text-foreground"
        >
          {t("ui.next")}
        </a>
      ) : null}
    </motion.section>
  );
}
