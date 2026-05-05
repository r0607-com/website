import { getTranslations } from "next-intl/server";

export default async function ImprintPage() {
  const t = await getTranslations("imprint");

  return (
    <main className="pt-28">
      <article className="mx-auto w-full max-w-3xl px-4 pb-20 sm:px-6">
        <h1 className="font-display text-4xl font-bold">{t("title")}</h1>
        <div className="mt-8 space-y-6 rounded-lg border border-border bg-surface p-6 leading-7 text-muted">
          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              {t("operator.heading")}
            </h2>
            <p>{t("operator.name")}</p>
            <p>{t("operator.street")}</p>
            <p>{t("operator.city")}</p>
            <p>{t("operator.country")}</p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              {t("responsible.heading")}
            </h2>
            <p>{t("responsible.name")}</p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              {t("contact.heading")}
            </h2>
            <p className="font-mono text-sm">{t("contact.email")}</p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-foreground">
              {t("note.heading")}
            </h2>
            <p className="text-sm">{t("note.copy")}</p>
          </section>
        </div>
      </article>
    </main>
  );
}
