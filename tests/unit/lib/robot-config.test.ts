import { describe, expect, it } from "vitest";

import {
  brainOptions,
  defaultSelections,
  energyOptions,
  movementOptions,
  sensorOptions,
} from "@/lib/robot-config";

describe("brainOptions", () => {
  it("has exactly 4 tiers", () => {
    expect(brainOptions).toHaveLength(4);
  });

  it("contains all expected ids", () => {
    const ids = brainOptions.map((option) => option.id);
    expect(ids).toContain("brain_basic");
    expect(ids).toContain("brain_mega");
    expect(ids).toContain("brain_super");
    expect(ids).toContain("brain_ultra");
  });

  it("each option has required specs", () => {
    brainOptions.forEach((option) => {
      expect(option.specs).toBeDefined();
      expect(option.specs?.length).toBeGreaterThanOrEqual(1);
    });
  });
});

describe("energyOptions", () => {
  it("has exactly 2 options", () => {
    expect(energyOptions).toHaveLength(2);
  });

  it("each has voltage spec", () => {
    energyOptions.forEach((option) => {
      const hasVoltage = option.specs?.some((spec) => spec.includes("V"));
      expect(hasVoltage).toBe(true);
    });
  });
});

describe("movementOptions", () => {
  it("has exactly 5 options", () => {
    expect(movementOptions).toHaveLength(5);
  });

  it("contains robotic_arm and walker", () => {
    const ids = movementOptions.map((option) => option.id);
    expect(ids).toContain("robotic_arm");
    expect(ids).toContain("walker");
  });
});

describe("sensorOptions", () => {
  it("has exactly 6 sensors", () => {
    expect(sensorOptions).toHaveLength(6);
  });

  it("all sensors belong to sensors station", () => {
    sensorOptions.forEach((sensor) => {
      expect(sensor.station).toBe("sensors");
    });
  });

  it("includes sensor_more as the last option", () => {
    expect(sensorOptions[sensorOptions.length - 1].id).toBe("sensor_more");
  });
});

describe("defaultSelections", () => {
  it("brain defaults to brain_basic", () => {
    expect(defaultSelections.brain).toBe("brain_basic");
  });
});
