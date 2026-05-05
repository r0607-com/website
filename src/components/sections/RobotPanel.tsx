"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import type { RobotConfig } from "@/lib/robot-config";

const RobotCanvas = dynamic(
  () => import("@/components/robot3d/RobotCanvas").then((mod) => mod.RobotCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-[240px] sm:min-h-[300px] place-items-center rounded-lg border border-border bg-surface text-sm text-muted">
        3D
      </div>
    ),
  },
);

/** Catches WebGL errors from the R3F canvas and shows an SVG fallback. */
class RobotCanvasErrorBoundary extends Component<
  { config: RobotConfig; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <RobotSvgFallback config={this.props.config} />;
    }
    return this.props.children;
  }
}

function RobotSvgFallback({ config }: { config: RobotConfig }) {
  return (
    <div
      className="flex min-h-[240px] sm:min-h-[300px] w-full flex-col items-center justify-center rounded-lg border border-cyan-soft/40 bg-surface/70 p-4"
      aria-label="Robot schematic (WebGL unavailable)"
    >
      <svg
        viewBox="0 0 180 160"
        width="180"
        height="160"
        className="opacity-80"
        aria-hidden="true"
      >
        {/* Chassis */}
        <rect x="50" y="50" width="80" height="50" rx="4" fill="none" stroke="#7ee8fa" strokeWidth="1.5" />
        {/* Power pack */}
        {config.power && (
          <rect x="130" y="56" width="18" height="38" rx="2" fill="none" stroke="#fcd34d" strokeWidth="1.5" />
        )}
        {/* Wheels */}
        {(config.motion === "drive_2wd" || config.motion === "drive_4wd" || config.motion === "omni_wheels") && (
          <>
            <ellipse cx="58" cy="108" rx="10" ry="10" fill="none" stroke="#86efac" strokeWidth="1.5" />
            <ellipse cx="122" cy="108" rx="10" ry="10" fill="none" stroke="#86efac" strokeWidth="1.5" />
          </>
        )}
        {config.motion === "tank_tracks" && (
          <>
            <rect x="38" y="92" width="14" height="28" rx="7" fill="none" stroke="#86efac" strokeWidth="1.5" />
            <rect x="128" y="92" width="14" height="28" rx="7" fill="none" stroke="#86efac" strokeWidth="1.5" />
          </>
        )}
        {/* Camera */}
        {config.perception.includes("rgb_camera") || config.perception.includes("stereo_camera") ? (
          <circle cx="75" cy="46" r="5" fill="none" stroke="#f9a8d4" strokeWidth="1.5" />
        ) : null}
        {/* LiDAR */}
        {config.perception.includes("lidar") && (
          <ellipse cx="90" cy="44" rx="14" ry="5" fill="none" stroke="#7ee8fa" strokeWidth="1.5" />
        )}
        {/* AI sphere */}
        {config.ai && (
          <ellipse cx="90" cy="75" rx="36" ry="24" fill="none" stroke="#7ee8fa" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
        )}
        {/* Label */}
        <text x="90" y="145" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
          WebGL unavailable — schematic view
        </text>
      </svg>
    </div>
  );
}

interface RobotPanelProps {
  config: RobotConfig;
  selected: number;
}

export function RobotPanel({ config, selected }: RobotPanelProps) {
  const t = useTranslations("robot");

  return (
    <aside className="lg:first:block">
      <RobotCanvasErrorBoundary config={config}>
        <RobotCanvas config={config} />
      </RobotCanvasErrorBoundary>
      <div className="mt-4 rounded-lg border border-border bg-surface/80 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase text-muted">{t("label")}</p>
            <p className="font-display text-xl font-bold">{t("name")}</p>
          </div>
          <div className="rounded-md border border-green-soft/50 px-3 py-2 font-mono text-sm text-green-soft">
            {selected}/7
          </div>
        </div>
      </div>
    </aside>
  );
}
