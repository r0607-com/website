import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      thresholds: { lines: 80, functions: 80, branches: 75 },
      exclude: [
        "tests/**",
        "src/app/**",
        "src/components/robot3d/**",
        "src/i18n/**",
        "*.config.*",
        "middleware.ts",
      ],
    },
  },
});
