import { getTranslations, setRequestLocale } from "next-intl/server";

const outcomeKeys = ["programming", "robotics", "debugging", "ai", "teamwork", "privacy"];

export default async function EducationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "education" });

  return (
    <main className="tron-grid pt-28">
      <section className="site-shell pb-20 lg:pb-28">
        <div>
          <p className="section-kicker">
            {t("kicker")}
          </p>
          <h1 className="page-title mt-4">
            {t("title")}
          </h1>
          <p className="lead-copy mt-6">
            {t("copy")}
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:gap-6">
            {outcomeKeys.map((key) => (
              <article
                key={key}
                className="rounded-lg border border-border bg-surface/85 p-5 lg:p-6"
              >
                <h2 className="font-display text-xl font-bold lg:text-2xl">
                  {t(`outcomes.${key}.title`)}
                </h2>
                <p className="body-copy mt-3">
                  {t(`outcomes.${key}.copy`)}
                </p>
              </article>
            ))}
          </div>
          <section className="mt-10 rounded-lg border border-border bg-surface/85 p-6 lg:p-8">
            <h2 className="font-display text-2xl font-bold lg:text-3xl">
              {t("pilot.title")}
            </h2>
            <p className="body-copy mt-4">{t("pilot.copy")}</p>
          </section>
          <section className="mt-10 rounded-lg border border-cyan-soft/40 bg-surface/85 p-6 lg:p-8">
            <h2 className="font-display text-2xl font-bold lg:text-3xl">
              {t("comingSoon.title")}
            </h2>
            <p className="body-copy mt-4">{t("comingSoon.copy")}</p>
          </section>
        </div>
      </section>
    </main>
  );
}
