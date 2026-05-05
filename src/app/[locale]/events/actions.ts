"use server";

import { createSupabaseServerClient } from "@/lib/supabase";
import { isRateLimited } from "@/lib/rate-limit";
import { workshopSignupSchema } from "@/lib/validation";

export type WorkshopFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function registerWorkshopInterest(
  _previousState: WorkshopFormState,
  formData: FormData,
): Promise<WorkshopFormState> {
  const parsed = workshopSignupSchema.safeParse({
    email: formData.get("email"),
    ageGroup: formData.get("age_group"),
    language: formData.get("language"),
    consentContact: formData.get("consent_contact") === "on",
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return { status: "error", message: "invalid" };
  }

  const email = parsed.data.email.toLowerCase();
  if (isRateLimited(email)) {
    return { status: "error", message: "rate_limited" };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { status: "success", message: "queued" };
  }

  const { error } = await supabase.from("workshop_signups").insert({
    email,
    age_group: parsed.data.ageGroup,
    language: parsed.data.language,
    city: "Berlin",
    source: "events_page",
    consent_contact: true,
    consented_at: new Date().toISOString(),
  });

  if (error?.code === "23505") {
    return { status: "error", message: "duplicate" };
  }

  if (error) {
    return { status: "error", message: "unknown" };
  }

  return { status: "success", message: "registered" };
}
