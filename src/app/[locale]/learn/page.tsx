import { getTranslations, setRequestLocale } from "next-intl/server";

const sections = ["personal", "aiva", "privacy", "hub", "path", "parents"] as const;

export default async function LearnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "learn" });

  return (
    <main className="tron-grid pt-28">
      <section className="site-shell pb-20 lg:pb-28">
        <p className="section-kicker">{t("kicker")}</p>
        <h1 className="page-title mt-4 max-w-5xl">
          {t("title")}
        </h1>
        <p className="lead-copy mt-6">{t("copy")}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:gap-6">
          {sections.map((section) => (
            <article
              key={section}
              id={section}
              className="rounded-lg border border-border bg-surface/85 p-6 lg:p-8"
            >
              <h2 className="font-display text-2xl font-bold lg:text-3xl">
                {t(`sections.${section}.title`)}
              </h2>
              <p className="body-copy mt-4">
                {t(`sections.${section}.copy`)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
