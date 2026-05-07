import { describe, expect, it } from "vitest";

import { schoolContactSchema, workshopSignupSchema } from "@/lib/validation";

// ─── workshopSignupSchema ────────────────────────────────────────────────────

describe("workshopSignupSchema", () => {
  const validInput = {
    email: "tester@example.com",
    ageGroup: "14-15" as const,
    language: "en" as const,
    consentContact: true as const,
    website: "",
  };

  it("accepts a fully valid payload", () => {
    expect(workshopSignupSchema.safeParse(validInput).success).toBe(true);
  });

  it("trims whitespace from email", () => {
    const result = workshopSignupSchema.safeParse({ ...validInput, email: "  hi@test.com  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("hi@test.com");
  });

  it("rejects an invalid email", () => {
    const result = workshopSignupSchema.safeParse({ ...validInput, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing email", () => {
    const result = workshopSignupSchema.safeParse({
      ageGroup: validInput.ageGroup,
      language: validInput.language,
      consentContact: validInput.consentContact,
      website: validInput.website,
    });
    expect(result.success).toBe(false);
  });

  it.each(["12-13", "14-15", "16-17", "18-19", "20+"] as const)(
    "accepts age group %s",
    (ageGroup) => {
      expect(workshopSignupSchema.safeParse({ ...validInput, ageGroup }).success).toBe(true);
    },
  );

  it("rejects an invalid age group", () => {
    expect(workshopSignupSchema.safeParse({ ...validInput, ageGroup: "10-11" }).success).toBe(
      false,
    );
  });

  it.each(["en", "de"] as const)("accepts language %s", (language) => {
    expect(workshopSignupSchema.safeParse({ ...validInput, language }).success).toBe(true);
  });

  it("rejects an invalid language", () => {
    expect(workshopSignupSchema.safeParse({ ...validInput, language: "fr" }).success).toBe(false);
  });

  it("rejects consent = false", () => {
    // @ts-expect-error — testing invalid runtime value
    expect(workshopSignupSchema.safeParse({ ...validInput, consentContact: false }).success).toBe(
      false,
    );
  });

  it("rejects a filled honeypot field", () => {
    expect(
      workshopSignupSchema.safeParse({ ...validInput, website: "http://spam.com" }).success,
    ).toBe(false);
  });

  it("accepts an absent honeypot field", () => {
    const result = workshopSignupSchema.safeParse({
      email: validInput.email,
      ageGroup: validInput.ageGroup,
      language: validInput.language,
      consentContact: validInput.consentContact,
    });
    expect(result.success).toBe(true);
  });
});

// ─── schoolContactSchema ─────────────────────────────────────────────────────

describe("schoolContactSchema", () => {
  const validInput = {
    name: "Ada Lovelace",
    email: "ada@school.example",
    website: "",
  };

  it("accepts a fully valid payload", () => {
    expect(schoolContactSchema.safeParse(validInput).success).toBe(true);
  });

  it("trims whitespace from name", () => {
    const result = schoolContactSchema.safeParse({ ...validInput, name: "  Jo  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Jo");
  });

  it("rejects a name shorter than 2 characters", () => {
    expect(schoolContactSchema.safeParse({ ...validInput, name: "X" }).success).toBe(false);
  });

  it("rejects a name longer than 120 characters", () => {
    expect(schoolContactSchema.safeParse({ ...validInput, name: "A".repeat(121) }).success).toBe(
      false,
    );
  });

  it("accepts a name at the maximum boundary (120 chars)", () => {
    expect(schoolContactSchema.safeParse({ ...validInput, name: "A".repeat(120) }).success).toBe(
      true,
    );
  });

  it("rejects an invalid email", () => {
    expect(schoolContactSchema.safeParse({ ...validInput, email: "not-email" }).success).toBe(
      false,
    );
  });

  it("rejects a filled honeypot field", () => {
    expect(
      schoolContactSchema.safeParse({ ...validInput, website: "http://bot.example" }).success,
    ).toBe(false);
  });

  it("accepts an absent honeypot field", () => {
    const result = schoolContactSchema.safeParse({
      name: validInput.name,
      email: validInput.email,
    });
    expect(result.success).toBe(true);
  });
});
