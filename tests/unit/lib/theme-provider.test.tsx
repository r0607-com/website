import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The hook reads from localStorage; we need useSyncExternalStore to return the
// client snapshot (not the server snapshot) in a jsdom environment.
// Import after the localStorage stub in setup.ts is in place.
import { useTheme } from "@/components/providers/ThemeProvider";

describe("useTheme", () => {
  beforeEach(() => {
    // Reset localStorage state and the html class list between tests.
    window.localStorage.clear();
    document.documentElement.className = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 'dark' as the default resolved theme when nothing is stored", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.resolvedTheme).toBe("dark");
  });

  it("reads a stored 'light' theme from localStorage", () => {
    window.localStorage.setItem("theme", "light");
    const { result } = renderHook(() => useTheme());
    expect(result.current.resolvedTheme).toBe("light");
  });

  it("setTheme('light') updates localStorage", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("light"));
    expect(window.localStorage.getItem("theme")).toBe("light");
  });

  it("setTheme updates the <html> class list", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("light"));
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("setTheme('dark') removes 'light' from <html> and adds 'dark'", () => {
    document.documentElement.classList.add("light");
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("dark"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });

  it("re-renders after setTheme is called", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.resolvedTheme).toBe("dark");
    act(() => result.current.setTheme("light"));
    expect(result.current.resolvedTheme).toBe("light");
  });
});
