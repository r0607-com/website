import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createRateLimiter } from "@/lib/rate-limit";

const HOUR_MS = 60 * 60 * 1000;

describe("createRateLimiter", () => {
  let isRateLimited: ReturnType<typeof createRateLimiter>;

  beforeEach(() => {
    vi.useFakeTimers();
    isRateLimited = createRateLimiter();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows the first request for a new key", () => {
    expect(isRateLimited("user@example.com")).toBe(false);
  });

  it("allows up to 3 requests within the window", () => {
    expect(isRateLimited("a@b.com")).toBe(false); // 1
    expect(isRateLimited("a@b.com")).toBe(false); // 2
    expect(isRateLimited("a@b.com")).toBe(false); // 3
  });

  it("blocks the 4th request within the same window", () => {
    isRateLimited("a@b.com"); // 1
    isRateLimited("a@b.com"); // 2
    isRateLimited("a@b.com"); // 3
    expect(isRateLimited("a@b.com")).toBe(true); // 4
  });

  it("tracks different keys independently", () => {
    isRateLimited("alice@x.com");
    isRateLimited("alice@x.com");
    isRateLimited("alice@x.com");
    // Alice is at limit; Bob is untouched
    expect(isRateLimited("bob@x.com")).toBe(false);
    expect(isRateLimited("alice@x.com")).toBe(true);
  });

  it("resets the counter after the 1-hour window expires", () => {
    isRateLimited("a@b.com"); // 1
    isRateLimited("a@b.com"); // 2
    isRateLimited("a@b.com"); // 3
    expect(isRateLimited("a@b.com")).toBe(true); // 4 — blocked

    // Advance past the 1-hour window
    vi.advanceTimersByTime(HOUR_MS + 1);

    expect(isRateLimited("a@b.com")).toBe(false); // fresh window
  });

  it("does not reset before the window has fully elapsed", () => {
    isRateLimited("a@b.com"); // 1
    isRateLimited("a@b.com"); // 2
    isRateLimited("a@b.com"); // 3

    vi.advanceTimersByTime(HOUR_MS - 1); // 1 ms short
    expect(isRateLimited("a@b.com")).toBe(true); // still blocked
  });
});
