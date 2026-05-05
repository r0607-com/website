import { getTranslations } from "next-intl/server";

import { SchoolContactForm } from "@/components/forms/SchoolContactForm";

const outcomeKeys = ["programming", "robotics", "debugging", "ai", "teamwork", "privacy"];

export default async function EducationPage() {
  const t = await getTranslations("education");

  return (
    <main className="tron-grid pt-28">
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div>
          <p className="font-mono text-sm uppercase text-cyan-soft">
            {t("kicker")}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
            {t("copy")}
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {outcomeKeys.map((key) => (
              <article
                key={key}
                className="rounded-lg border border-border bg-surface/85 p-5"
              >
                <h2 className="font-display text-xl font-bold">
                  {t(`outcomes.${key}.title`)}
                </h2>
                <p className="mt-3 leading-7 text-muted">
                  {t(`outcomes.${key}.copy`)}
                </p>
              </article>
            ))}
          </div>
          <section className="mt-10 rounded-lg border border-border bg-surface/85 p-6">
            <h2 className="font-display text-2xl font-bold">
              {t("pilot.title")}
            </h2>
            <p className="mt-4 leading-7 text-muted">{t("pilot.copy")}</p>
          </section>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-4 font-display text-2xl font-bold">
            {t("formTitle")}
          </h2>
          <SchoolContactForm />
          <p className="mt-4 text-sm leading-6 text-muted">{t("emailFallback")}</p>
        </aside>
      </section>
    </main>
  );
}
