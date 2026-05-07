import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/rate-limit", () => ({
  isRateLimited: vi.fn().mockReturnValue(false),
}));

import { isRateLimited } from "@/lib/rate-limit";
import { submitSchoolContact } from "@/app/[locale]/education/actions";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeFormData(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  fd.set("name", "Ada Lovelace");
  fd.set("email", "ada@school.example");
  fd.set("website", ""); // honeypot — must be empty
  for (const [k, v] of Object.entries(overrides)) fd.set(k, v);
  return fd;
}

const idle = { status: "idle" as const, message: "" };

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("submitSchoolContact", () => {
  beforeEach(() => {
    vi.mocked(isRateLimited).mockReturnValue(false);
  });

  it("returns success:sent for a valid submission", async () => {
    const result = await submitSchoolContact(idle, makeFormData());
    expect(result).toEqual({ status: "success", message: "sent" });
  });

  it("returns error:invalid for a name shorter than 2 characters", async () => {
    const result = await submitSchoolContact(idle, makeFormData({ name: "X" }));
    expect(result).toEqual({ status: "error", message: "invalid" });
  });

  it("returns error:invalid for a name longer than 120 characters", async () => {
    const result = await submitSchoolContact(idle, makeFormData({ name: "A".repeat(121) }));
    expect(result).toEqual({ status: "error", message: "invalid" });
  });

  it("returns error:invalid for a malformed email", async () => {
    const result = await submitSchoolContact(idle, makeFormData({ email: "not-an-email" }));
    expect(result).toEqual({ status: "error", message: "invalid" });
  });

  it("returns error:invalid when the honeypot is filled", async () => {
    const result = await submitSchoolContact(
      idle,
      makeFormData({ website: "http://bot.example" }),
    );
    expect(result).toEqual({ status: "error", message: "invalid" });
  });

  it("returns error:rate_limited when the rate limiter fires", async () => {
    vi.mocked(isRateLimited).mockReturnValue(true);
    const result = await submitSchoolContact(idle, makeFormData());
    expect(result).toEqual({ status: "error", message: "rate_limited" });
  });

  it("lowercases the email before checking the rate limit", async () => {
    await submitSchoolContact(idle, makeFormData({ email: "ADA@SCHOOL.EXAMPLE" }));
    expect(vi.mocked(isRateLimited)).toHaveBeenCalledWith("ada@school.example");
  });
});
