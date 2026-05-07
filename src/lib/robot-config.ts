import type { LucideIcon } from "lucide-react";
import {
  BatteryCharging,
  Brain,
  Camera,
  Cpu,
  Gauge,
  Radar,
  RotateCcw,
  Satellite,
  Sparkles,
  Waves,
  Zap,
} from "lucide-react";

export type StationId = "brain" | "power" | "perception" | "motion" | "ai";

export type ComponentOption = {
  id: string;
  station: StationId;
  icon: LucideIcon;
};

export type RobotConfig = {
  power: string | null;
  perception: string[];
  motion: string | null;
  ai: string | null;
};

export const defaultRobotConfig: RobotConfig = {
  power: null,
  perception: [],
  motion: null,
  ai: null,
};

export const powerOptions: ComponentOption[] = [
  { id: "battery_standard", station: "power", icon: BatteryCharging },
  { id: "battery_extended", station: "power", icon: Zap },
  { id: "battery_outdoor", station: "power", icon: Sparkles },
];

export const perceptionOptions: ComponentOption[] = [
  { id: "rgb_camera", station: "perception", icon: Camera },
  { id: "stereo_camera", station: "perception", icon: Satellite },
  { id: "ultrasound", station: "perception", icon: Waves },
  { id: "infrared", station: "perception", icon: Gauge },
  { id: "lidar", station: "perception", icon: Radar },
];

export const motionOptions: ComponentOption[] = [
  { id: "drive_2wd", station: "motion", icon: RotateCcw },
  { id: "drive_4wd", station: "motion", icon: RotateCcw },
  { id: "tank_tracks", station: "motion", icon: Cpu },
  { id: "omni_wheels", station: "motion", icon: Sparkles },
];

export const aiOptions: ComponentOption[] = [
  { id: "aiva_coach", station: "ai", icon: Brain },
  { id: "local_voice", station: "ai", icon: Waves },
];

export const robotStorageKey = "r0607.robot-config.v1";

export const ageGroups = ["12-13", "14-15", "16-17", "18-19", "20+"] as const;

/** Counts the total number of selected components across all stations. */
export function selectedCount(config: RobotConfig): number {
  return [config.power, config.motion, config.ai, ...config.perception].filter(Boolean).length;
}
