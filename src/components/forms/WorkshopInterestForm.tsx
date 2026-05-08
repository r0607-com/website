"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";

import { registerWorkshopInterest } from "@/app/[locale]/events/actions";
import { ageGroups } from "@/lib/validation";

const initialState = { status: "idle" as const, message: "" };

export function WorkshopInterestForm({ locale }: { locale: string }) {
  const t = useTranslations("events.form");
  const [state, action] = useActionState(registerWorkshopInterest, initialState);

  return (
    <form action={action} className="rounded-lg border border-border bg-surface p-6">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <input type="hidden" name="language" value={locale === "de" ? "de" : "en"} />
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-medium">
          {t("email")}
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            className="focus-ring rounded-md border border-border bg-background px-3 py-3 text-foreground"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {t("ageGroup")}
          <select
            required
            name="age_group"
            className="focus-ring rounded-md border border-border bg-background px-3 py-3 text-foreground"
            defaultValue=""
          >
            <option value="" disabled>
              {t("choose")}
            </option>
            {ageGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-start gap-3 text-sm leading-6 text-muted">
          <input
            required
            type="checkbox"
            name="consent_contact"
            className="mt-1 size-4 accent-cyan-soft"
          />
          {t("consent")}
        </label>
        <SubmitButton />
        {state.status !== "idle" ? (
          <p
            className={
              state.status === "success" ? "text-sm text-green-soft" : "text-sm text-pink-soft"
            }
          >
            {t(`messages.${state.message}`)}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("events.form");

  return (
    <button
      type="submit"
      disabled={pending}
      className="focus-ring rounded-md bg-cyan-soft px-4 py-3 font-medium text-background disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? t("submitting") : t("submit")}
    </button>
  );
}
