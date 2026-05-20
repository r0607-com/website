import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(cleanup);

// Our custom useTheme reads window.matchMedia — provide a stub for jsdom.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Stub localStorage for tests that exercise theme/robot-config persistence.
const localStorageStore: Record<string, string> = {};
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: (key: string) => localStorageStore[key] ?? null,
    setItem: (key: string, value: string) => {
      localStorageStore[key] = value;
    },
    removeItem: (key: string) => {
      delete localStorageStore[key];
    },
    clear: () => {
      Object.keys(localStorageStore).forEach((k) => delete localStorageStore[k]);
    },
  },
  writable: true,
});
