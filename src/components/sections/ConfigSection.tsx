"use client";

import { type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { OptionButton } from "@/components/ui/OptionButton";
import type { OptionSpec } from "@/lib/robot-config";

interface SelectedOption extends OptionSpec {
  name: string;
  desc: string;
  specs?: string[];
}

interface ConfigSectionProps {
  id: string;
  kicker: string;
  title: string;
  copy: string;
  options: SelectedOption[];
  selectedIds: string | string[];
  multiSelect?: boolean;
  onSelect: (id: string) => void;
  viewer: ReactNode;
}

export function ConfigSection({
  id,
  kicker,
  title,
  copy,
  options,
  selectedIds,
  multiSelect = false,
  onSelect,
  viewer,
}: ConfigSectionProps) {
  const locale = useLocale();
  const t = useTranslations("ui");
  const isSelected = (optionId: string) =>
    Array.isArray(selectedIds) ? selectedIds.includes(optionId) : selectedIds === optionId;

  const currentOption = Array.isArray(selectedIds)
    ? options.filter((option) => selectedIds.includes(option.id))
    : options.find((option) => option.id === selectedIds);

  const specsLabel = locale === "de" ? "Spezifikationen" : "Specs";
  const sensorsNote = Array.isArray(selectedIds)
    ? selectedIds.length > 0
      ? locale === "de"
        ? `${selectedIds.length} ${selectedIds.length === 1 ? "Sensor" : "Sensoren"} ausgewählt — alle arbeiten zusammen`
        : `${selectedIds.length} sensor${selectedIds.length > 1 ? "s" : ""} selected — all work together`
      : locale === "de"
        ? "Wähle eine beliebige Kombination von Sensoren"
        : "Select any combination of sensors"
    : null;

  return (
    <section
      id={id}
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby={`${id}-heading`}
    >
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-soft">{kicker}</p>
        <h2 id={`${id}-heading`} className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-lg leading-7 text-muted">{copy}</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="order-2 lg:order-1">{viewer}</div>
        <div className="order-1 space-y-6 lg:order-2">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {options.map((option) => (
              <OptionButton
                key={option.id}
                id={option.id}
                label={option.name}
                description={option.desc}
                selected={isSelected(option.id)}
                onClick={() => onSelect(option.id)}
                icon={option.icon}
                selectedLabel={t("selected")}
              />
            ))}
          </div>
          {currentOption && !Array.isArray(currentOption) && currentOption.specs ? (
            <div className="rounded-xl border border-border bg-surface/80 p-5">
              <p className="font-mono text-xs uppercase tracking-wider text-cyan-soft">
                {specsLabel}
              </p>
              <ul className="mt-3 space-y-1.5">
                {currentOption.specs.map((spec) => (
                  <li key={spec} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="size-1.5 flex-shrink-0 rounded-full bg-cyan-soft" aria-hidden="true" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {multiSelect && sensorsNote ? <p className="text-xs text-muted">{sensorsNote}</p> : null}
        </div>
      </div>
    </section>
  );
}
