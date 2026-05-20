import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function ImprintPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "imprint" });

  return (
    <main className="pt-28">
      <article className="legal-shell pb-20 lg:pb-28">
        <h1 className="page-title">{t("title")}</h1>
        <div className="body-copy mt-10 space-y-8 rounded-lg border border-border bg-surface p-6 lg:p-8">
          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground lg:text-2xl">
              {t("operator.heading")}
            </h2>
            <p>{t("operator.name")}</p>
            <p>{t("operator.street")}</p>
            <p>{t("operator.city")}</p>
            <p>{t("operator.country")}</p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground lg:text-2xl">
              {t("responsible.heading")}
            </h2>
            <p>{t("responsible.name")}</p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground lg:text-2xl">
              {t("contact.heading")}
            </h2>
            <p className="font-mono text-sm lg:text-base">{t("contact.email")}</p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground lg:text-2xl">
              {t("note.heading")}
            </h2>
            <p>{t("note.copy")}</p>
          </section>
        </div>
      </article>
    </main>
  );
}
