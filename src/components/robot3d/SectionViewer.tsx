"use client";

import { Component, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionViewerProps {
  children: ReactNode;
  className?: string;
  label?: string;
}

class ViewerErrorBoundary extends Component<
  { children: ReactNode; label?: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="grid h-full place-items-center text-sm text-muted"
          role="img"
          aria-label={this.props.label ?? "3D model unavailable"}
        >
          <span>3D unavailable</span>
        </div>
      );
    }

    return this.props.children;
  }
}

export function SectionViewer({ children, className, label }: SectionViewerProps) {
  return (
    <div
      className={cn(
        "relative h-72 overflow-hidden rounded-xl border border-cyan-soft/30 bg-surface/60 shadow-[0_0_40px_var(--glow-cyan)] sm:h-96 lg:h-full lg:min-h-[520px]",
        className,
      )}
      role="img"
      aria-label={label ?? "Interactive 3D model"}
    >
      <ViewerErrorBoundary label={label}>{children}</ViewerErrorBoundary>
    </div>
  );
}
