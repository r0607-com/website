"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import type { Locale } from "@/i18n/routing";

export function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations("footer");

  const linkGroups = [
    {
      title: "socialMedia",
      links: [
        { href: "https://github.com/r0607-com", key: "github", external: true },
        { href: "https://www.linkedin.com/company/r0607", key: "linkedin", external: true },
      ],
    },
    {
      title: "legalNotice",
      links: [
        { href: `/${locale}/privacy`, key: "privacy" },
        { href: `/${locale}/imprint`, key: "imprint" },
      ],
    },
  ] as const;

  return (
    <footer className="relative z-10 border-t border-border bg-surface/90">
      <div className="site-shell grid gap-8 py-10 md:grid-cols-[1fr_auto_1fr] md:items-start lg:py-12">
        <div className="md:justify-self-start">
          <Link
            href={`/${locale}`}
            className="focus-ring inline-flex items-center gap-3 rounded-md"
            aria-label={t("home")}
          >
            <Image
              src="/icon.svg"
              alt=""
              width={42}
              height={42}
              className="brand-mark size-10 lg:size-12"
              aria-hidden="true"
            />
            <span className="brand-wordmark logo-gradient">R0607</span>
          </Link>
          <p className="slogan-gradient mt-3 w-fit font-display text-lg font-bold lg:text-xl">
            {t("slogan")}
          </p>
        </div>
        <div className="grid gap-8 text-sm text-muted sm:grid-cols-2 md:justify-self-center lg:gap-12 lg:text-base">
          {linkGroups.map((group) => (
            <nav
              key={group.title}
              aria-labelledby={`footer-${group.title}`}
              className="min-w-36"
            >
              <h2
                id={`footer-${group.title}`}
                className="mb-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-foreground"
              >
                {t(group.title)}
              </h2>
              <ul className="flex flex-col items-start gap-2">
                {group.links.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="focus-ring rounded-sm underline-offset-4 transition hover:text-foreground hover:underline"
                      {...("external" in item
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="text-sm leading-6 text-muted md:justify-self-end md:text-right lg:text-base lg:leading-7">
          <p>{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
