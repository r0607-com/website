"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import type { Locale } from "@/i18n/routing";

const footerLinks = [
  { href: "events", key: "events" },
  { href: "learn", key: "learn" },
  { href: "education", key: "education" },
  { href: "privacy", key: "privacy" },
  { href: "imprint", key: "imprint" },
] as const;

export function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border bg-surface/70">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_2fr] lg:px-8">
        <div>
          <div className="font-display text-2xl font-bold">
            R<span className="text-cyan-soft">0</span>6
            <span className="text-cyan-soft">0</span>7
          </div>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
            {t("description")}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-wrap gap-2">
            {footerLinks.map((item) => (
              <Link
                key={item.key}
                href={`/${locale}/${item.href}`}
                className="focus-ring rounded-md border border-border bg-background px-3 py-2 text-sm text-muted transition hover:border-cyan-soft hover:text-foreground"
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
          <div className="text-sm leading-6 text-muted">
            <p>{t("copyright")}</p>
            <p>{t("opensource")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
