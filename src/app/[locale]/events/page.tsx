import { getTranslations } from "next-intl/server";

import { WorkshopInterestForm } from "@/components/forms/WorkshopInterestForm";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("events");

  return (
    <main className="tron-grid pt-28">
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <p className="font-mono text-sm uppercase text-cyan-soft">
            {t("kicker")}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            {t("copy")}
          </p>
          <div className="mt-8 rounded-lg border border-border bg-surface/85 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-bold">
                {t("card.title")}
              </h2>
              <span className="rounded-md border border-amber-soft/60 px-3 py-2 font-mono text-xs uppercase text-amber-soft">
                {t("card.status")}
              </span>
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              {["format", "age", "location"].map((item) => (
                <div key={item} className="rounded-md border border-border bg-background/70 p-4">
                  <dt className="font-mono text-xs uppercase text-muted">
                    {t(`card.${item}.label`)}
                  </dt>
                  <dd className="mt-2 font-medium">{t(`card.${item}.value`)}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-8 grid gap-3">
            {["learn", "bring", "cost", "list"].map((item) => (
              <details
                key={item}
                className="rounded-lg border border-border bg-surface/85 p-4"
              >
                <summary className="cursor-pointer font-medium">
                  {t(`faq.${item}.q`)}
                </summary>
                <p className="mt-3 leading-7 text-muted">{t(`faq.${item}.a`)}</p>
              </details>
            ))}
          </div>
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-4 font-display text-2xl font-bold">
            {t("formTitle")}
          </h2>
          <WorkshopInterestForm locale={locale} />
        </div>
      </section>
    </main>
  );
}
