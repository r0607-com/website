import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { routing, type Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  return {
    metadataBase: new URL("https://r0607.com"),
    title: {
      default: "R0607 — Imagine · Learn · Create",
      template: "%s | R0607",
    },
    description: t("copy"),
    openGraph: {
      siteName: "R0607",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "R0607 — Imagine · Learn · Create",
        },
      ],
    },
    alternates: {
      languages: {
        en: "/en",
        de: "/de",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ThemeProvider>
        <div className="flex min-h-screen flex-col overflow-x-clip bg-background text-foreground">
          <Navbar locale={locale as Locale} />
          <div className="flex-1">{children}</div>
          <Footer locale={locale as Locale} />
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
