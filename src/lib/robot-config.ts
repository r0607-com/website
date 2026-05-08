import type { LucideIcon } from "lucide-react";
import {
  BatteryCharging,
  Brain,
  Cpu,
  Gauge,
  Globe,
  PackagePlus,
  Radar,
  RotateCcw,
  Satellite,
  Sparkles,
  Waves,
  Zap,
  Code2,
  GitBranch,
  Terminal,
  Cog,
} from "lucide-react";

export type StationId = "brain" | "energy" | "movement" | "sensors";

export type OptionSpec = {
  id: string;
  station: StationId;
  icon: LucideIcon;
  specs?: string[];
};

export type LanguageOption = {
  id: string;
  icon: LucideIcon;
  useCases: string[];
};

export const brainOptions: OptionSpec[] = [
  {
    id: "brain_basic",
    station: "brain",
    icon: Brain,
    specs: ["8 GB shared RAM", "CPU + GPU", "128 GB SSD"],
  },
  {
    id: "brain_mega",
    station: "brain",
    icon: Cpu,
    specs: ["16 GB shared RAM", "CPU + GPU", "256 GB SSD"],
  },
  {
    id: "brain_super",
    station: "brain",
    icon: Sparkles,
    specs: ["64 GB shared RAM", "Enhanced CPU + GPU", "512 GB SSD"],
  },
  {
    id: "brain_ultra",
    station: "brain",
    icon: Zap,
    specs: ["128 GB shared RAM", "Top-tier CPU + GPU", "1 TB SSD"],
  },
];

export const energyOptions: OptionSpec[] = [
  {
    id: "battery_small",
    station: "energy",
    icon: BatteryCharging,
    specs: ["20 V", "2 Ah", "40 Wh"],
  },
  {
    id: "battery_big",
    station: "energy",
    icon: Zap,
    specs: ["20 V", "4 Ah", "80 Wh"],
  },
];

export const movementOptions: OptionSpec[] = [
  {
    id: "wheels_4wd",
    station: "movement",
    icon: RotateCcw,
    specs: ["1 drive motor", "1 steering servo", "4 wheels"],
  },
  {
    id: "tracks",
    station: "movement",
    icon: Cpu,
    specs: ["2 independent motors", "Tank-style tracks", "High traction"],
  },
  {
    id: "omni_4",
    station: "movement",
    icon: Sparkles,
    specs: ["4 motors", "Omni/mecanum wheels", "360° lateral movement"],
  },
  {
    id: "walker",
    station: "movement",
    icon: GitBranch,
    specs: ["4 motors", "Articulated legs", "All-terrain"],
  },
  {
    id: "robotic_arm",
    station: "movement",
    icon: Cog,
    specs: ["4 servo motors", "Multi-axis arm", "Gripping & manipulation"],
  },
];

export const sensorOptions: OptionSpec[] = [
  {
    id: "stereo_camera",
    station: "sensors",
    icon: Satellite,
    specs: ["Dual-lens depth perception", "Spatial mapping", "Works without dedicated hardware"],
  },
  {
    id: "ultrasound",
    station: "sensors",
    icon: Waves,
    specs: ["Sound-pulse distance", "2 cm – 4 m range", "Low power, beginner-friendly"],
  },
  {
    id: "infrared",
    station: "sensors",
    icon: Gauge,
    specs: ["Short-range proximity", "Line following & edge detection", "Lightweight"],
  },
  {
    id: "lidar",
    station: "sensors",
    icon: Radar,
    specs: ["360° laser scan", "Precise 2D environment map", "Gold standard for navigation"],
  },
  {
    id: "imu",
    station: "sensors",
    icon: Globe,
    specs: ["Orientation + acceleration", "Angular velocity tracking", "Essential for balance control"],
  },
  {
    id: "sensor_more",
    station: "sensors",
    icon: PackagePlus,
  },
];

export const languageOptions: LanguageOption[] = [
  {
    id: "python",
    icon: Terminal,
    useCases: [
      "Scripting & automation",
      "Sensor data processing",
      "Machine learning with TensorFlow/PyTorch",
    ],
  },
  {
    id: "web",
    icon: Globe,
    useCases: [
      "Robot dashboard UI",
      "REST APIs",
      "Real-time data visualization",
    ],
  },
  {
    id: "cpp",
    icon: Code2,
    useCases: [
      "Real-time computer vision with OpenCV+CUDA",
      "Low-latency motor control",
      "High-performance algorithms",
    ],
  },
  {
    id: "rust",
    icon: Cog,
    useCases: [
      "Safe real-time autonomous control",
      "Embedded systems",
      "Memory-safe robotics firmware",
    ],
  },
];

export const defaultSelections = {
  brain: "brain_basic",
  energy: "battery_small",
  movement: "wheels_4wd",
  sensors: [] as string[],
} as const;
