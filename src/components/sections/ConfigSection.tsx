"use client";

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
  sectionIndex: number;
  title: string;
  copy: string;
  options: SelectedOption[];
  selectedIds: string | string[];
  multiSelect?: boolean;
  onSelect: (id: string) => void;
}

export function ConfigSection({
  id,
  sectionIndex,
  title,
  copy,
  options,
  selectedIds,
  multiSelect = false,
  onSelect,
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
      className="py-14 first:pt-0 last:pb-0 lg:py-20"
      aria-labelledby={`${id}-heading`}
    >
      <div className="relative mb-10 overflow-hidden lg:mb-12">
        <div className={`mb-6 h-px w-24 bg-gradient-to-r ${palette.accent}`} aria-hidden="true" />
        <h2 id={`${id}-heading`} className="section-title">
          {title}
        </h2>
        <p className="body-copy mt-4 max-w-3xl">{copy}</p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

        {/* Info box shows desc + specs for selected option */}
        {currentOption ? (
          <div className="rounded-xl border border-border bg-surface/80 p-5 lg:p-6">
            <p className="font-display text-lg font-bold text-foreground lg:text-xl">{currentOption.name}</p>
            <p className="body-copy mt-2">{currentOption.desc}</p>
            {currentOption.specs && currentOption.specs.length > 0 ? (
              <>
                <div className="my-4 h-px bg-border/50" />
                <ul className="space-y-2">
                  {currentOption.specs.map((spec) => (
                    <li key={spec} className="flex items-center gap-2 text-sm text-foreground lg:text-base">
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
          <p className="text-sm text-muted">{selectedIds.length} sensors active - all work together</p>
        ) : null}
      </div>
    </section>
  );
}
