import { getTranslations, setRequestLocale } from "next-intl/server";

const privacySections = [
  "controller",
  "hosting",
  "storage",
  "contact",
  "localAi",
  "legalBasis",
  "recipients",
  "retention",
  "rights",
  "supervisory",
  "automated",
  "children",
  "changes",
] as const;

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacy" });

  return (
    <main className="pt-28">
      <article className="legal-shell pb-20 lg:pb-28">
        <h1 className="page-title">{t("title")}</h1>
        <p className="mt-4 font-mono text-sm uppercase tracking-widest text-muted">
          {t("lastUpdated")}
        </p>
        <p className="lead-copy mt-6">{t("intro.copy")}</p>
        <div className="body-copy mt-10 space-y-6">
          {privacySections.map((key) => (
            <section key={key} className="rounded-lg border border-border bg-surface/85 p-6 lg:p-8">
              <h2 className="font-display text-2xl font-bold text-foreground lg:text-3xl">
                {t(`${key}.title`)}
              </h2>
              <p className="mt-2">{t(`${key}.copy`)}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
