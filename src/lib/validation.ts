import { z } from "zod";

export const ageGroups = ["12-13", "14-15", "16-17", "18-19", "20+"] as const;

export const workshopSignupSchema = z.object({
  email: z.string().trim().email(),
  ageGroup: z.enum(ageGroups),
  language: z.enum(["de", "en"]),
  consentContact: z.literal(true),
  website: z.string().max(0).optional(),
});

export const schoolContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  website: z.string().max(0).optional(),
});

export type WorkshopSignupInput = z.infer<typeof workshopSignupSchema>;
export type SchoolContactInput = z.infer<typeof schoolContactSchema>;
