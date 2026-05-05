"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import type { Locale } from "@/i18n/routing";

const navItems = [
  { href: "", key: "home" },
  { href: "events", key: "events" },
  { href: "learn", key: "learn" },
  { href: "education", key: "education" },
] as const;

export function Navbar({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const nextLocale = locale === "en" ? "de" : "en";
  const languageHref = pathname.replace(/^\/(en|de)/, `/${nextLocale}`);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}`}
            className="focus-ring group flex items-center gap-3 rounded-md"
            aria-label={t("home")}
          >
            <span className="grid size-9 place-items-center rounded border border-cyan-soft/70 text-cyan-soft shadow-[0_0_24px_var(--glow-cyan)]">
              +
            </span>
            <span>
              <span className="font-display text-xl font-bold tracking-normal">
                R<span className="text-cyan-soft">0</span>6
                <span className="text-cyan-soft">0</span>7
              </span>
              <span className="hidden text-xs text-muted sm:block">
                {t("tagline")}
              </span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={`/${locale}/${item.href}`}
                className="focus-ring rounded-md px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-alt hover:text-foreground"
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={languageHref}
              className="focus-ring rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs text-muted transition hover:border-cyan-soft hover:text-foreground"
            >
              {nextLocale.toUpperCase()}
            </Link>
            <button
              type="button"
              aria-label={t("theme")}
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="focus-ring grid size-10 place-items-center rounded-md border border-border bg-surface text-muted transition hover:border-cyan-soft hover:text-foreground"
            >
              {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="focus-ring grid size-10 place-items-center rounded-md border border-border bg-surface text-muted transition hover:border-cyan-soft hover:text-foreground md:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile slide-in drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l border-border bg-background px-6 py-8 shadow-2xl md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-display text-lg font-bold">
                  R<span className="text-cyan-soft">0</span>6
                  <span className="text-cyan-soft">0</span>7
                </span>
                <button
                  type="button"
                  aria-label={t("closeMenu")}
                  onClick={() => setMobileOpen(false)}
                  className="focus-ring grid size-9 place-items-center rounded-md border border-border text-muted hover:border-cyan-soft hover:text-foreground"
                >
                  <X size={16} />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={`/${locale}/${item.href}`}
                    className="focus-ring rounded-md px-3 py-3 text-base font-medium text-muted transition hover:bg-surface-alt hover:text-foreground"
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex items-center gap-3 pt-8">
                <Link
                  href={languageHref}
                  className="focus-ring rounded-md border border-border bg-surface px-4 py-2 font-mono text-sm text-muted transition hover:border-cyan-soft hover:text-foreground"
                >
                  {nextLocale.toUpperCase()}
                </Link>
                <button
                  type="button"
                  aria-label={t("theme")}
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  className="focus-ring flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm text-muted transition hover:border-cyan-soft hover:text-foreground"
                >
                  {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  {t("theme")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
