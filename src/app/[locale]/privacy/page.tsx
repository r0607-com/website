import { getTranslations, setRequestLocale } from "next-intl/server";

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
        <div className="body-copy mt-10 space-y-8">
          {["intro", "signup", "localAi", "rights", "hosting"].map((key) => (
            <section key={key}>
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
