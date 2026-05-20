import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function HeroSection() {
  const t = await getTranslations();

  return (
    <section className="site-shell relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-16 text-center sm:py-20 lg:py-24">
      <div className="w-full">
        <h1
          className="hero-brand-lockup inline-flex max-w-full flex-nowrap items-center justify-center whitespace-nowrap"
          style={{
            display: "inline-flex",
            flexWrap: "nowrap",
            alignItems: "center",
            justifyContent: "center",
            whiteSpace: "nowrap",
          }}
        >
          <Image
            src="/icon.svg"
            alt=""
            width={160}
            height={160}
            className="brand-mark hero-brand-mark"
            aria-hidden="true"
            style={{ width: "1em", height: "1em" }}
            priority
          />
          <span className="hero-brand-wordmark logo-gradient">R0607</span>
        </h1>
        <p className="hero-slogan slogan-gradient mx-auto mt-6">{t("hero.heading")}</p>
        <p className="lead-copy hero-copy mx-auto mt-8 lg:mt-12">{t("hero.copy")}</p>
      </div>
      <div className="absolute bottom-8 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-cyan-soft/40 bg-surface/80 px-4 py-2 font-mono text-xs uppercase tracking-widest text-cyan-soft sm:bottom-10 lg:px-5 lg:py-2.5 lg:text-sm">
        <span className="size-1.5 animate-pulse rounded-full bg-green-soft" aria-hidden="true" />
        {t("hero.badge")}
      </div>
    </section>
  );
}
