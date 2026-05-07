import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock Supabase before importing the action so the real module (which uses
// next/headers) is never loaded in the test environment.
vi.mock("@/lib/supabase", () => ({
  createSupabaseServerClient: vi.fn(),
}));

// Mock the rate-limiter so we can control its behaviour per-test.
vi.mock("@/lib/rate-limit", () => ({
  isRateLimited: vi.fn().mockReturnValue(false),
}));

import { createSupabaseServerClient } from "@/lib/supabase";
import { isRateLimited } from "@/lib/rate-limit";
import { registerWorkshopInterest } from "@/app/[locale]/events/actions";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeFormData(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  fd.set("email", "tester@example.com");
  fd.set("age_group", "14-15");
  fd.set("language", "en");
  fd.set("consent_contact", "on");
  fd.set("website", ""); // honeypot — must be empty
  for (const [k, v] of Object.entries(overrides)) fd.set(k, v);
  return fd;
}

const idle = { status: "idle" as const, message: "" };

function mockSupabase(insertResult: { error: { code?: string; message?: string } | null }) {
  const insert = vi.fn().mockResolvedValue(insertResult);
  const from = vi.fn().mockReturnValue({ insert });
  vi.mocked(createSupabaseServerClient).mockResolvedValue({ from } as never);
  return { from, insert };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("registerWorkshopInterest", () => {
  beforeEach(() => {
    vi.mocked(isRateLimited).mockReturnValue(false);
    vi.mocked(createSupabaseServerClient).mockReset();
  });

  it("returns success when the record is saved", async () => {
    mockSupabase({ error: null });
    const result = await registerWorkshopInterest(idle, makeFormData());
    expect(result).toEqual({ status: "success", message: "registered" });
  });

  it("lowercases the email before saving", async () => {
    const { insert } = mockSupabase({ error: null });
    await registerWorkshopInterest(idle, makeFormData({ email: "UPPER@EXAMPLE.COM" }));
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ email: "upper@example.com" }),
    );
  });

  it("returns error:invalid for a malformed email", async () => {
    const result = await registerWorkshopInterest(idle, makeFormData({ email: "bad-email" }));
    expect(result).toEqual({ status: "error", message: "invalid" });
  });

  it("returns error:invalid for an unknown age group", async () => {
    const result = await registerWorkshopInterest(idle, makeFormData({ age_group: "5-6" }));
    expect(result).toEqual({ status: "error", message: "invalid" });
  });

  it("returns error:invalid when consent is not checked", async () => {
    const fd = makeFormData();
    fd.delete("consent_contact"); // unchecked checkbox sends no value
    const result = await registerWorkshopInterest(idle, fd);
    expect(result).toEqual({ status: "error", message: "invalid" });
  });

  it("returns error:invalid when the honeypot is filled", async () => {
    const result = await registerWorkshopInterest(
      idle,
      makeFormData({ website: "http://spam.example" }),
    );
    expect(result).toEqual({ status: "error", message: "invalid" });
  });

  it("returns error:rate_limited when the rate limiter fires", async () => {
    vi.mocked(isRateLimited).mockReturnValue(true);
    const result = await registerWorkshopInterest(idle, makeFormData());
    expect(result).toEqual({ status: "error", message: "rate_limited" });
  });

  it("returns success:queued when Supabase is not configured", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(null);
    const result = await registerWorkshopInterest(idle, makeFormData());
    expect(result).toEqual({ status: "success", message: "queued" });
  });

  it("returns error:duplicate for a 23505 constraint violation", async () => {
    mockSupabase({ error: { code: "23505" } });
    const result = await registerWorkshopInterest(idle, makeFormData());
    expect(result).toEqual({ status: "error", message: "duplicate" });
  });

  it("returns error:unknown for any other database error", async () => {
    mockSupabase({ error: { message: "connection refused" } });
    const result = await registerWorkshopInterest(idle, makeFormData());
    expect(result).toEqual({ status: "error", message: "unknown" });
  });
});
