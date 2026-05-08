import { getTranslations } from "next-intl/server";

import { languageOptions } from "@/lib/robot-config";
import { cn } from "@/lib/utils";

const borderColors = [
  "border-cyan-soft/40",
  "border-violet-soft/40",
  "border-pink-soft/40",
  "border-amber-soft/40",
] as const;

const glowColors = [
  "shadow-[0_0_24px_var(--glow-cyan)]",
  "shadow-[0_0_24px_var(--glow-pink)]",
  "shadow-[0_0_24px_var(--glow-cyan)]",
  "shadow-[0_0_24px_var(--glow-pink)]",
] as const;

const iconColors = [
  "text-cyan-soft",
  "text-violet-soft",
  "text-pink-soft",
  "text-amber-soft",
] as const;

const dotColors = ["bg-cyan-soft", "bg-violet-soft", "bg-pink-soft", "bg-amber-soft"] as const;

export async function LanguagesSection() {
  const t = await getTranslations();

  return (
    <section
      id="languages"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby="languages-heading"
    >
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-soft">
          {t("sections.languages.kicker")}
        </p>
        <h2 id="languages-heading" className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          {t("sections.languages.title")}
        </h2>
        <p className="mt-3 max-w-2xl text-lg leading-7 text-muted">
          {t("sections.languages.copy")}
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {languageOptions.map((language, index) => {
          const Icon = language.icon;
          const paletteIndex = index % 4;
          const rawUseCases = t.raw(`components.${language.id}.useCases`);
          const useCases = Array.isArray(rawUseCases)
            ? rawUseCases.filter((item): item is string => typeof item === "string")
            : language.useCases;

          return (
            <div
              key={language.id}
              className={cn(
                "rounded-xl border bg-surface/80 p-6",
                borderColors[paletteIndex],
                glowColors[paletteIndex],
              )}
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-lg border bg-background/60",
                  borderColors[paletteIndex],
                )}
              >
                <Icon size={20} className={iconColors[paletteIndex]} aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">
                {t(`components.${language.id}.name`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t(`components.${language.id}.desc`)}
              </p>
              <ul className="mt-4 space-y-1.5">
                {useCases.map((useCase) => (
                  <li key={useCase} className="flex items-center gap-2 text-xs text-muted">
                    <span
                      className={cn("size-1 flex-shrink-0 rounded-full", dotColors[paletteIndex])}
                      aria-hidden="true"
                    />
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
