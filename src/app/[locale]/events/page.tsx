import { getTranslations, setRequestLocale } from "next-intl/server";

import { WorkshopInterestForm } from "@/components/forms/WorkshopInterestForm";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "events" });

  return (
    <main className="tron-grid pt-28">
      <section className="site-shell grid gap-8 pb-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(420px,0.8fr)] lg:gap-14 lg:pb-28">
        <div>
          <p className="section-kicker">
            {t("kicker")}
          </p>
          <h1 className="page-title mt-4 max-w-5xl">
            {t("title")}
          </h1>
          <p className="lead-copy mt-6">
            {t("copy")}
          </p>
          <div className="mt-10 rounded-lg border border-border bg-surface/85 p-6 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-bold lg:text-3xl">
                {t("card.title")}
              </h2>
              <span className="rounded-md border border-amber-soft/60 px-3 py-2 font-mono text-xs uppercase text-amber-soft">
                {t("card.status")}
              </span>
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              {["format", "age", "location"].map((item) => (
                <div key={item} className="rounded-md border border-border bg-background/70 p-4 lg:p-5">
                  <dt className="font-mono text-xs uppercase text-muted">
                    {t(`card.${item}.label`)}
                  </dt>
                  <dd className="mt-2 text-base font-medium lg:text-lg">{t(`card.${item}.value`)}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-8 grid gap-4">
            {["learn", "bring", "cost", "list"].map((item) => (
              <details
                key={item}
                className="rounded-lg border border-border bg-surface/85 p-5 lg:p-6"
              >
                <summary className="cursor-pointer text-base font-medium lg:text-lg">
                  {t(`faq.${item}.q`)}
                </summary>
                <p className="body-copy mt-3">{t(`faq.${item}.a`)}</p>
              </details>
            ))}
          </div>
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-4 font-display text-2xl font-bold lg:text-3xl">
            {t("formTitle")}
          </h2>
          <WorkshopInterestForm locale={locale} />
        </div>
      </section>
    </main>
  );
}
