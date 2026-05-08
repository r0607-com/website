"use client";

import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface OptionButtonProps {
  id: string;
  label: string;
  description: string;
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
  description,
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
        "focus-ring group relative w-full rounded-xl border bg-background/70 p-4 text-left transition-all",
        "hover:border-cyan-soft hover:shadow-[0_0_28px_var(--glow-cyan)]",
        selected
          ? "border-cyan-soft bg-surface shadow-[0_0_24px_var(--glow-cyan)]"
          : "border-border",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "grid size-9 flex-shrink-0 place-items-center rounded-lg border transition-colors",
            selected
              ? "border-cyan-soft bg-cyan-soft/10 text-cyan-soft"
              : "border-border bg-surface text-muted",
          )}
        >
          <Icon size={18} aria-hidden="true" />
        </span>
        {selected ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-cyan-soft px-2 py-0.5 text-xs font-medium text-background">
            <Check size={11} aria-hidden="true" />
            {selectedLabel}
          </span>
        ) : badge ? (
          <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-display text-base font-bold text-foreground">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
    </button>
  );
}
