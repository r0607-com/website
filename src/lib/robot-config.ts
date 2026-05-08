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
  /** Selected brain tier — always has a value; defaults to brain_standard. */
  brain: string | null;
  power: string | null;
  /** Single perception sensor (array kept for 3-D model compatibility). */
  perception: string[];
  motion: string | null;
  ai: string | null;
};

export type RobotStats = {
  energy: number;      // 0–100
  weight: number;      // 0–100 (higher = heavier)
  speed: number;       // 0–100
  intelligence: number;// 0–100
  flexibility: number; // 0–100
};

export const defaultRobotConfig: RobotConfig = {
  brain: "brain_standard",
  power: null,
  perception: [],
  motion: null,
  ai: null,
};

export const brainOptions: ComponentOption[] = [
  { id: "brain_standard", station: "brain", icon: Brain },
  { id: "brain_plus",     station: "brain", icon: Cpu },
  { id: "brain_ultra",    station: "brain", icon: Sparkles },
];

export const powerOptions: ComponentOption[] = [
  { id: "battery_standard", station: "power", icon: BatteryCharging },
  { id: "battery_extended", station: "power", icon: Zap },
];

export const perceptionOptions: ComponentOption[] = [
  { id: "rgb_camera",    station: "perception", icon: Camera },
  { id: "stereo_camera", station: "perception", icon: Satellite },
  { id: "ultrasound",    station: "perception", icon: Waves },
  { id: "infrared",      station: "perception", icon: Gauge },
  { id: "lidar",         station: "perception", icon: Radar },
];

export const motionOptions: ComponentOption[] = [
  { id: "drive_2wd",   station: "motion", icon: RotateCcw },
  { id: "drive_4wd",   station: "motion", icon: RotateCcw },
  { id: "tank_tracks", station: "motion", icon: Cpu },
  { id: "omni_wheels", station: "motion", icon: Sparkles },
];

export const aiOptions: ComponentOption[] = [
  { id: "aiva_coach",  station: "ai", icon: Brain },
  { id: "local_voice", station: "ai", icon: Waves },
];

export const robotStorageKey = "r0607.robot-config.v1";

export const ageGroups = ["12-13", "14-15", "16-17", "18-19", "20+"] as const;

/** Counts the total number of selected components (max 5). */
export function selectedCount(config: RobotConfig): number {
  return [
    config.brain,
    config.power,
    config.motion,
    config.ai,
    ...config.perception,
  ].filter(Boolean).length;
}

/** Computes display stats (0–100) for the current robot configuration. */
export function computeRobotStats(config: RobotConfig): RobotStats {
  let energy = 0;
  let weight = 8; // base chassis
  let speed = 0;
  let intelligence = 0;
  let flexibility = 0;

  // Brain
  if (config.brain === "brain_standard") { intelligence += 30; weight += 10; }
  else if (config.brain === "brain_plus")  { intelligence += 62; weight += 15; }
  else if (config.brain === "brain_ultra") { intelligence += 90; weight += 22; }

  // Power
  if (config.power === "battery_standard") { energy += 45; weight += 12; }
  else if (config.power === "battery_extended") { energy += 82; weight += 22; }

  // Perception (single sensor)
  const sensor = config.perception[0] ?? null;
  if (sensor === "rgb_camera")    { flexibility += 20; weight += 5;  intelligence += 5;  }
  else if (sensor === "stereo_camera") { flexibility += 30; weight += 10; intelligence += 10; }
  else if (sensor === "ultrasound")    { flexibility += 15; weight += 3; }
  else if (sensor === "infrared")      { flexibility += 10; weight += 2; }
  else if (sensor === "lidar")         { flexibility += 42; weight += 14; intelligence += 15; }

  // Motion
  if (config.motion === "drive_2wd")   { speed += 62; flexibility += 28; weight += 14; }
  else if (config.motion === "drive_4wd")   { speed += 50; flexibility += 38; weight += 24; }
  else if (config.motion === "tank_tracks") { speed += 30; flexibility += 18; weight += 38; }
  else if (config.motion === "omni_wheels") { speed += 58; flexibility += 68; weight += 20; }

  // AI
  if (config.ai === "aiva_coach")  { intelligence += 25; weight += 5; }
  else if (config.ai === "local_voice") { intelligence += 14; weight += 3; }

  return {
    energy:       Math.min(100, energy),
    weight:       Math.min(100, weight),
    speed:        Math.min(100, speed),
    intelligence: Math.min(100, intelligence),
    flexibility:  Math.min(100, flexibility),
  };
}
