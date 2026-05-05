"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";

import { submitSchoolContact } from "@/app/[locale]/education/actions";

const initialState = { status: "idle" as const, message: "" };

export function SchoolContactForm() {
  const t = useTranslations("education.form");
  const [state, action] = useActionState(submitSchoolContact, initialState);

  return (
    <form action={action} className="rounded-lg border border-border bg-surface p-6">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-medium">
          {t("name")}
          <input
            required
            name="name"
            autoComplete="name"
            className="focus-ring rounded-md border border-border bg-background px-3 py-3 text-foreground"
          />
        </label>
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
  const t = useTranslations("education.form");

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
