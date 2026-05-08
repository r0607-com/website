"use client";

import { type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { OptionButton } from "@/components/ui/OptionButton";
import type { OptionSpec } from "@/lib/robot-config";

interface SelectedOption extends OptionSpec {
  name: string;
  desc: string;
  specs?: string[];
}

const SECTION_COLORS = [
  { accent: "from-cyan-soft/60 via-cyan-soft/20 to-transparent", ghost: "text-cyan-soft/[0.04]" },
  { accent: "from-amber-soft/60 via-amber-soft/20 to-transparent", ghost: "text-amber-soft/[0.04]" },
  { accent: "from-violet-soft/60 via-violet-soft/20 to-transparent", ghost: "text-violet-soft/[0.04]" },
  { accent: "from-pink-soft/60 via-pink-soft/20 to-transparent", ghost: "text-pink-soft/[0.04]" },
];

interface ConfigSectionProps {
  id: string;
  sectionNumber: string;
  sectionIndex: number;
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
  sectionNumber,
  sectionIndex,
  title,
  copy,
  options,
  selectedIds,
  multiSelect = false,
  onSelect,
  viewer,
}: ConfigSectionProps) {
  const t = useTranslations("ui");
  const palette = SECTION_COLORS[sectionIndex % SECTION_COLORS.length];

  const isSelected = (optionId: string) =>
    Array.isArray(selectedIds) ? selectedIds.includes(optionId) : selectedIds === optionId;

  const currentOption = Array.isArray(selectedIds)
    ? options.find((option) => selectedIds.includes(option.id)) ?? options[0]
    : options.find((option) => option.id === selectedIds);

  return (
    <section
      id={id}
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby={`${id}-heading`}
    >
      {/* Heading area with ghost number backdrop */}
      <div className="relative mb-10 overflow-hidden">
        {/* Ghost section number */}
        <span
          className={`pointer-events-none absolute -right-2 -top-6 select-none font-display text-[9rem] font-black leading-none sm:text-[14rem] ${palette.ghost}`}
          aria-hidden="true"
        >
          {sectionNumber}
        </span>
        {/* Gradient top accent bar */}
        <div className={`mb-6 h-px w-24 bg-gradient-to-r ${palette.accent}`} aria-hidden="true" />
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs text-muted/50">{sectionNumber}</span>
          <h2 id={`${id}-heading`} className="font-display text-3xl font-bold sm:text-4xl">
            {title}
          </h2>
        </div>
        <p className="mt-3 max-w-2xl text-lg leading-7 text-muted">{copy}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        {/* 3D viewer */}
        <div className="order-2 lg:order-1">{viewer}</div>

        {/* Options + info box */}
        <div className="order-1 space-y-4 lg:order-2">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {options.map((option) => (
              <OptionButton
                key={option.id}
                id={option.id}
                label={option.name}
                selected={isSelected(option.id)}
                onClick={() => onSelect(option.id)}
                icon={option.icon}
                selectedLabel={t("selected")}
              />
            ))}
          </div>

          {/* Info box — shows desc + specs for selected option */}
          {currentOption ? (
            <div className="rounded-xl border border-border bg-surface/80 p-5">
              <p className="font-display text-base font-bold text-foreground">{currentOption.name}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{currentOption.desc}</p>
              {currentOption.specs && currentOption.specs.length > 0 ? (
                <>
                  <div className="my-3 h-px bg-border/50" />
                  <ul className="space-y-1.5">
                    {currentOption.specs.map((spec) => (
                      <li key={spec} className="flex items-center gap-2 text-sm text-foreground">
                        <span className="size-1.5 flex-shrink-0 rounded-full bg-cyan-soft" aria-hidden="true" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          ) : null}

          {multiSelect && Array.isArray(selectedIds) && selectedIds.length > 1 ? (
            <p className="text-xs text-muted">{selectedIds.length} sensors active — all work together</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
