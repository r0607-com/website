"use server";

import { isRateLimited } from "@/lib/rate-limit";
import { schoolContactSchema } from "@/lib/validation";

export type SchoolContactState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitSchoolContact(
  _previousState: SchoolContactState,
  formData: FormData,
): Promise<SchoolContactState> {
  const parsed = schoolContactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return { status: "error", message: "invalid" };
  }

  const email = parsed.data.email.toLowerCase();
  if (isRateLimited(email)) {
    return { status: "error", message: "rate_limited" };
  }

  return { status: "success", message: "sent" };
}
