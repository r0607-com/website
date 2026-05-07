import { describe, expect, it } from "vitest";

import {
  ageGroups,
  aiOptions,
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
    ["powerOptions", powerOptions, "power" as const, 3],
    ["perceptionOptions", perceptionOptions, "perception" as const, 5],
    ["motionOptions", motionOptions, "motion" as const, 4],
    ["aiOptions", aiOptions, "ai" as const, 2],
  ])("%s has %i items all assigned to station %s", (_name, options, station, count) => {
    expect(options).toHaveLength(count);
    options.forEach((opt) => {
      expect(opt.station).toBe(station);
      expect(typeof opt.id).toBe("string");
      expect(opt.id.length).toBeGreaterThan(0);
    });
  });

  it("all option IDs are unique across the same station", () => {
    const allOptions = [...powerOptions, ...perceptionOptions, ...motionOptions, ...aiOptions];
    const ids = allOptions.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("selectedCount", () => {
  it("returns 0 for the default (empty) config", () => {
    expect(selectedCount(defaultRobotConfig)).toBe(0);
  });

  it("counts a single-select station choice", () => {
    const config: RobotConfig = { ...defaultRobotConfig, power: "battery_standard" };
    expect(selectedCount(config)).toBe(1);
  });

  it("counts multiple single-select choices", () => {
    const config: RobotConfig = {
      power: "battery_standard",
      motion: "drive_4wd",
      ai: "aiva_coach",
      perception: [],
    };
    expect(selectedCount(config)).toBe(3);
  });

  it("counts multi-select perception choices", () => {
    const config: RobotConfig = {
      ...defaultRobotConfig,
      perception: ["rgb_camera", "lidar", "ultrasound"],
    };
    expect(selectedCount(config)).toBe(3);
  });

  it("counts a fully-configured robot", () => {
    const config: RobotConfig = {
      power: "battery_extended",
      motion: "omni_wheels",
      ai: "local_voice",
      perception: ["stereo_camera", "infrared"],
    };
    expect(selectedCount(config)).toBe(5);
  });
});
