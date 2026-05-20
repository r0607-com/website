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
      className="site-shell py-16 lg:py-24"
      aria-labelledby="languages-heading"
    >
      <div className="mb-10 lg:mb-12">
        <p className="section-kicker">
          {t("sections.languages.kicker")}
        </p>
        <h2 id="languages-heading" className="section-title mt-3">
          {t("sections.languages.title")}
        </h2>
        <p className="lead-copy mt-4">
          {t("sections.languages.copy")}
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
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
                "rounded-xl border bg-surface/80 p-6 lg:p-7",
                borderColors[paletteIndex],
                glowColors[paletteIndex],
              )}
            >
              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-lg border bg-background/60",
                  borderColors[paletteIndex],
                )}
              >
                <Icon size={22} className={iconColors[paletteIndex]} aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold lg:text-2xl">
                {t(`components.${language.id}.name`)}
              </h3>
              <p className="body-copy mt-3">
                {t(`components.${language.id}.desc`)}
              </p>
              <ul className="mt-5 space-y-2">
                {useCases.map((useCase) => (
                  <li key={useCase} className="flex items-center gap-2 text-sm text-muted">
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
