import { getTranslations } from "next-intl/server";

const sections = ["personal", "aiva", "privacy", "hub", "path", "parents"] as const;

export default async function LearnPage() {
  const t = await getTranslations("learn");

  return (
    <main className="tron-grid pt-28">
      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <p className="font-mono text-sm uppercase text-cyan-soft">{t("kicker")}</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold sm:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{t("copy")}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {sections.map((section) => (
            <article
              key={section}
              id={section}
              className="rounded-lg border border-border bg-surface/85 p-6"
            >
              <h2 className="font-display text-2xl font-bold">
                {t(`sections.${section}.title`)}
              </h2>
              <p className="mt-4 leading-7 text-muted">
                {t(`sections.${section}.copy`)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
