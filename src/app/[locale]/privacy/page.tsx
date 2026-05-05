import { getTranslations } from "next-intl/server";

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");

  return (
    <main className="pt-28">
      <article className="mx-auto w-full max-w-3xl px-4 pb-20 sm:px-6">
        <h1 className="font-display text-4xl font-bold">{t("title")}</h1>
        <div className="mt-8 space-y-6 leading-7 text-muted">
          {["intro", "signup", "localAi", "rights", "hosting"].map((key) => (
            <section key={key}>
              <h2 className="font-display text-xl font-bold text-foreground">
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
