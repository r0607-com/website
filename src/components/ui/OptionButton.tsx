"use client";

import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface OptionButtonProps {
  id: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  icon: LucideIcon;
  badge?: string;
  className?: string;
  selectedLabel?: string;
}

export function OptionButton({
  id,
  label,
  selected,
  onClick,
  icon: Icon,
  badge,
  className,
  selectedLabel = "Selected",
}: OptionButtonProps) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "focus-ring group relative flex w-full items-center gap-3 rounded-xl border bg-background/70 px-4 py-3 text-left transition-all lg:gap-4 lg:px-5 lg:py-4",
        "hover:border-cyan-soft hover:shadow-[0_0_20px_var(--glow-cyan)]",
        selected
          ? "border-cyan-soft bg-surface shadow-[0_0_18px_var(--glow-cyan)]"
          : "border-border",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-9 flex-shrink-0 place-items-center rounded-lg border transition-colors lg:size-11",
          selected
            ? "border-cyan-soft bg-cyan-soft/10 text-cyan-soft"
            : "border-border bg-surface text-muted",
        )}
      >
        <Icon size={20} aria-hidden="true" />
      </span>
      <span className="flex-1 font-display text-sm font-bold text-foreground lg:text-base">{label}</span>
      {selected ? (
        <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-md bg-cyan-soft px-2 py-0.5 text-xs font-medium text-background">
          <Check size={10} aria-hidden="true" />
          {selectedLabel}
        </span>
      ) : badge ? (
        <span className="flex-shrink-0 rounded-md border border-border px-2 py-0.5 text-xs text-muted">
          {badge}
        </span>
      ) : null}
    </button>
  );
}
