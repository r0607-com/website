import { describe, expect, it } from "vitest";

import {
  ageGroups,
  aiOptions,
  brainOptions,
  computeRobotStats,
  defaultRobotConfig,
  motionOptions,
  perceptionOptions,
  powerOptions,
  robotStorageKey,
  selectedCount,
  type RobotConfig,
} from "@/lib/robot-config";

describe("ageGroups", () => {
  it("contains exactly the five expected age ranges", () => {
    expect(ageGroups).toEqual(["12-13", "14-15", "16-17", "18-19", "20+"]);
  });

  it("has 5 entries", () => {
    expect(ageGroups).toHaveLength(5);
  });
});

describe("robotStorageKey", () => {
  it("matches the expected localStorage key", () => {
    expect(robotStorageKey).toBe("r0607.robot-config.v1");
  });
});

describe("defaultRobotConfig", () => {
  it("initialises brain to brain_standard", () => {
    expect(defaultRobotConfig.brain).toBe("brain_standard");
  });

  it("initialises power, motion, and ai to null", () => {
    expect(defaultRobotConfig.power).toBeNull();
    expect(defaultRobotConfig.motion).toBeNull();
    expect(defaultRobotConfig.ai).toBeNull();
  });

  it("initialises perception to an empty array", () => {
    expect(defaultRobotConfig.perception).toEqual([]);
  });
});

describe("component option arrays", () => {
  it.each([
    ["brainOptions",     brainOptions,     "brain" as const,     3],
    ["powerOptions",     powerOptions,     "power" as const,     2],
    ["perceptionOptions", perceptionOptions, "perception" as const, 5],
    ["motionOptions",    motionOptions,    "motion" as const,    4],
    ["aiOptions",        aiOptions,        "ai" as const,        2],
  ])("%s has %i items all assigned to station %s", (_name, options, station, count) => {
    expect(options).toHaveLength(count);
    options.forEach((opt) => {
      expect(opt.station).toBe(station);
      expect(typeof opt.id).toBe("string");
      expect(opt.id.length).toBeGreaterThan(0);
    });
  });

  it("all option IDs are unique within their station", () => {
    const allOptions = [
      ...brainOptions,
      ...powerOptions,
      ...perceptionOptions,
      ...motionOptions,
      ...aiOptions,
    ];
    const ids = allOptions.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("selectedCount", () => {
  it("returns 1 for the default config (brain_standard pre-selected)", () => {
    expect(selectedCount(defaultRobotConfig)).toBe(1);
  });

  it("counts brain selection", () => {
    const config: RobotConfig = { ...defaultRobotConfig, brain: "brain_ultra" };
    expect(selectedCount(config)).toBe(1);
  });

  it("counts brain plus a single-select station choice", () => {
    const config: RobotConfig = { ...defaultRobotConfig, power: "battery_standard" };
    expect(selectedCount(config)).toBe(2);
  });

  it("counts multiple single-select choices", () => {
    const config: RobotConfig = {
      brain: "brain_plus",
      power: "battery_standard",
      motion: "drive_4wd",
      ai: "aiva_coach",
      perception: [],
    };
    expect(selectedCount(config)).toBe(4);
  });

  it("counts a single perception selection", () => {
    const config: RobotConfig = {
      ...defaultRobotConfig,
      perception: ["rgb_camera"],
    };
    expect(selectedCount(config)).toBe(2);
  });

  it("counts a fully-configured robot (max 5)", () => {
    const config: RobotConfig = {
      brain: "brain_ultra",
      power: "battery_extended",
      motion: "omni_wheels",
      ai: "local_voice",
      perception: ["stereo_camera"],
    };
    expect(selectedCount(config)).toBe(5);
  });
});

describe("computeRobotStats", () => {
  it("returns all five stat keys", () => {
    const stats = computeRobotStats(defaultRobotConfig);
    expect(stats).toHaveProperty("energy");
    expect(stats).toHaveProperty("weight");
    expect(stats).toHaveProperty("speed");
    expect(stats).toHaveProperty("intelligence");
    expect(stats).toHaveProperty("flexibility");
  });

  it("clamps stats between 0 and 100", () => {
    const fullConfig: RobotConfig = {
      brain: "brain_ultra",
      power: "battery_extended",
      motion: "omni_wheels",
      ai: "aiva_coach",
      perception: ["lidar"],
    };
    const stats = computeRobotStats(fullConfig);
    Object.values(stats).forEach((val) => {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(100);
    });
  });

  it("ultra brain gives higher intelligence than standard brain", () => {
    const standard = computeRobotStats({ ...defaultRobotConfig, brain: "brain_standard" });
    const ultra    = computeRobotStats({ ...defaultRobotConfig, brain: "brain_ultra" });
    expect(ultra.intelligence).toBeGreaterThan(standard.intelligence);
  });

  it("extended battery gives higher energy than standard battery", () => {
    const stdPower = computeRobotStats({ ...defaultRobotConfig, power: "battery_standard" });
    const extPower = computeRobotStats({ ...defaultRobotConfig, power: "battery_extended" });
    expect(extPower.energy).toBeGreaterThan(stdPower.energy);
  });
});
