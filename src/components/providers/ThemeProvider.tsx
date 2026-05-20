"use client";

import { useSyncExternalStore } from "react";

type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "theme";
const MEDIA = "(prefers-color-scheme: dark)";

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getClientSnapshot(): ResolvedTheme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light") return "light";
    if (stored === "system") return window.matchMedia(MEDIA).matches ? "dark" : "light";
  } catch {}
  return "dark";
}

function getServerSnapshot(): undefined {
  return undefined;
}

export function useTheme() {
  const resolvedTheme = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  function setTheme(theme: string) {
    const resolved: ResolvedTheme =
      theme === "system"
        ? window.matchMedia(MEDIA).matches
          ? "dark"
          : "light"
        : theme === "light"
          ? "light"
          : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolved);
    emit();
  }

  return { resolvedTheme, setTheme };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
