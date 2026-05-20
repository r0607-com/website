import Link from "next/link";
import Image from "next/image";
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
    <section className="site-shell relative flex min-h-[calc(100vh-4rem)] items-center py-16 sm:py-20 lg:py-24">
      <div className="w-full">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-soft/40 bg-surface/80 px-4 py-2 font-mono text-xs uppercase tracking-widest text-cyan-soft lg:mb-10 lg:px-5 lg:py-2.5 lg:text-sm">
          <span className="size-1.5 animate-pulse rounded-full bg-green-soft" aria-hidden="true" />
          {t("hero.badge")}
        </div>
        <h1 className="flex flex-wrap items-center gap-[clamp(1rem,3vw,2rem)]">
          <span className="flex items-center gap-[clamp(0.75rem,2vw,1.5rem)]" aria-hidden="true">
            <Image
              src="/icon.svg"
              alt=""
              width={160}
              height={160}
              className="brand-mark size-[clamp(3.5rem,10vw,7rem)]"
              priority
            />
            <Image
              src="/icon2.svg"
              alt=""
              width={160}
              height={160}
              className="brand-mark size-[clamp(3.5rem,10vw,7rem)]"
              priority
            />
          </span>
          <span className="hero-brand-wordmark logo-gradient">R0607</span>
        </h1>
        <p className="hero-slogan slogan-gradient mt-6">{t("hero.heading")}</p>
        <p className="lead-copy hero-copy mt-6">{t("hero.copy")}</p>
        <div className="mt-8 flex flex-wrap gap-3 lg:mt-10 lg:gap-4">
          <a
            href="#brain"
            className="focus-ring rounded-xl bg-cyan-soft px-6 py-3 font-semibold text-background shadow-[0_0_24px_var(--glow-cyan)] transition hover:shadow-[0_0_40px_var(--glow-cyan)] lg:px-8 lg:py-4 lg:text-lg"
          >
            {t("hero.start")}
          </a>
          <Link
            href={`/${locale}/events`}
            className="focus-ring rounded-xl border border-border bg-surface px-6 py-3 font-semibold text-foreground transition hover:border-cyan-soft lg:px-8 lg:py-4 lg:text-lg"
          >
            {t("hero.workshops")}
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-4">
          {(["brain", "code", "aiva", "privacy"] as const).map((key) => {
            const Icon = STAT_ICONS[key];
            return (
              <div
                key={key}
                className="flex min-h-14 items-center gap-3 rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm text-muted lg:px-5 lg:py-4 lg:text-base"
              >
                <Icon size={18} className="flex-shrink-0 text-cyan-soft" aria-hidden="true" />
                {t(`hero.stats.${key}`)}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
