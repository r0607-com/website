import Link from "next/link";
import { Brain, Code2, Mic2, ShieldCheck } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

const STAT_ICONS = {
  brain: Brain,
  code: Code2,
  aiva: Mic2,
  privacy: ShieldCheck,
} as const;

export async function HeroSection() {
  const [t, locale] = await Promise.all([getTranslations(), getLocale()]);

  return (
    <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="w-full">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-soft/40 bg-surface/80 px-4 py-2 font-mono text-xs uppercase tracking-widest text-cyan-soft">
          <span className="size-1.5 animate-pulse rounded-full bg-green-soft" aria-hidden="true" />
          {t("hero.badge")}
        </div>
        <h1 className="font-display text-[clamp(4rem,15vw,10rem)] font-bold leading-none tracking-tight">
          <span className="text-foreground">R</span>
          <span className="text-cyan-soft drop-shadow-[0_0_32px_var(--cyan-soft)]">0</span>
          <span className="text-foreground">6</span>
          <span className="text-cyan-soft drop-shadow-[0_0_32px_var(--cyan-soft)]">0</span>
          <span className="text-foreground">7</span>
        </h1>
        <p className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">
          {t("hero.heading")}{" "}
          <span className="text-cyan-soft">{t("hero.subheading")}</span>
        </p>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{t("hero.copy")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#brain"
            className="focus-ring rounded-xl bg-cyan-soft px-6 py-3 font-semibold text-background shadow-[0_0_24px_var(--glow-cyan)] transition hover:shadow-[0_0_40px_var(--glow-cyan)]"
          >
            {t("hero.start")}
          </a>
          <Link
            href={`/${locale}/events`}
            className="focus-ring rounded-xl border border-border bg-surface px-6 py-3 font-semibold text-foreground transition hover:border-cyan-soft"
          >
            {t("hero.workshops")}
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["brain", "code", "aiva", "privacy"] as const).map((key) => {
            const Icon = STAT_ICONS[key];
            return (
              <div
                key={key}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm text-muted"
              >
                <Icon size={16} className="flex-shrink-0 text-cyan-soft" aria-hidden="true" />
                {t(`hero.stats.${key}`)}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
