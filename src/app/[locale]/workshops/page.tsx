import { getTranslations, setRequestLocale } from "next-intl/server";

const detailCards = ["learn", "bring", "cost", "registration"] as const;

export default async function WorkshopsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "workshops" });

  return (
    <main className="tron-grid pt-28">
      <section className="site-shell pb-20 lg:pb-28">
        <p className="section-kicker">
          {t("kicker")}
        </p>
        <h1 className="page-title mt-4">
          {t("title")}
        </h1>
        <p className="lead-copy mt-6">
          {t("copy")}
        </p>

        <div className="mt-10 grid gap-5 lg:gap-6">
          <article className="rounded-lg border border-border bg-surface/85 p-6 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-bold lg:text-3xl">
                {t("featured.title")}
              </h2>
              <span className="rounded-md border border-amber-soft/60 px-3 py-2 font-mono text-xs uppercase text-amber-soft">
                {t("featured.status")}
              </span>
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              {["format", "age", "location"].map((item) => (
                <div key={item} className="rounded-md border border-border bg-background/70 p-4 lg:p-5">
                  <dt className="font-mono text-xs uppercase text-muted">
                    {t(`featured.${item}.label`)}
                  </dt>
                  <dd className="mt-2 text-base font-medium lg:text-lg">{t(`featured.${item}.value`)}</dd>
                </div>
              ))}
            </dl>
          </article>

          <article className="rounded-lg border border-cyan-soft/40 bg-surface/85 p-6 lg:p-8">
            <h2 className="font-display text-2xl font-bold lg:text-3xl">
              {t("comingSoon.title")}
            </h2>
            <p className="body-copy mt-4">{t("comingSoon.copy")}</p>
          </article>
        </div>

        <div className="mt-10 grid gap-5 lg:gap-6">
          {detailCards.map((item) => (
            <article
              key={item}
              className="rounded-lg border border-border bg-surface/85 p-5 lg:p-6"
            >
              <h2 className="font-display text-xl font-bold lg:text-2xl">
                {t(`details.${item}.title`)}
              </h2>
              <p className="body-copy mt-3">{t(`details.${item}.copy`)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
