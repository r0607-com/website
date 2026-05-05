# Copilot instructions for R0607 Website

## Build, run, and validate

- Use Node.js 24.x or a compatible modern Node runtime with pnpm 10.x.
- Install dependencies with `pnpm install`.
- Start local development with `pnpm dev`, then open `http://localhost:3000/en` or `http://localhost:3000/de`.
- Run linting with `pnpm lint`.
- Run the production build with `pnpm build`.
- There is no test script or test runner configured in `package.json`; do not invent a test command unless you add the missing test setup.

## Architecture

- This is a Next.js 16 App Router site under `src/app`, using `next-intl` for always-prefixed `/en` and `/de` routes. `/` redirects to `/en`, and `middleware.ts` applies locale routing for `/`, `/en/**`, and `/de/**`.
- Locale layout lives in `src/app/[locale]/layout.tsx`. It validates locales with `hasLocale`, awaits `params`, loads messages through `getMessages`, and wraps pages in `NextIntlClientProvider`, `ThemeProvider`, `Navbar`, and `Footer`.
- Public routes are `/[locale]` for the robot builder, `/[locale]/events` for Berlin workshop interest, `/[locale]/education` for school contact, `/[locale]/learn`, `/[locale]/privacy`, and `/[locale]/imprint`.
- Robot builder state is centralized in `src/lib/robot-config.ts` and managed by `src/components/sections/RobotBuilder.tsx`. Power, motion, and AI are single-select groups; perception is multi-select capped at three; the Brain Brick is always included. Saved configurations stay in `localStorage` under `r0607.robot-config.v1` and are not uploaded.
- The 3D preview is `src/components/robot3d/RobotCanvas.tsx`, dynamically imported with `ssr: false` from the builder. Keep React Three Fiber/Drei rendering browser-only and model changes primitive-geometry based unless the architecture changes.
- Form submissions use route-local server actions: workshop interest in `src/app/[locale]/events/actions.ts` and school contact in `src/app/[locale]/education/actions.ts`. Validation schemas live in `src/lib/validation.ts`.
- Workshop persistence is optional. `src/lib/supabase.ts` returns `null` when `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is absent, and the workshop action returns a non-persistent success state for local development.
- Styling is Tailwind CSS v4 with CSS-first theme tokens in `src/app/globals.css`. Brand utilities such as `tron-grid`, `crosshair-cursor`, `scanline`, and `focus-ring` are global.
- Public UI copy belongs in `messages/en.json` and `messages/de.json`; components should read copy through `next-intl` rather than hardcoding localized text.

## Repository conventions

- Before changing Next.js APIs, read the relevant guide in `node_modules/next/dist/docs/`. This repo uses Next.js 16; dynamic route `params` are typed as promises and must be awaited in pages, layouts, and route handlers.
- Keep Server Components as the default for pages/layouts. Add `"use client"` only for interactivity, browser APIs, `next-themes`, `useActionState`, `localStorage`, Motion, or Three.js.
- Keep server actions in files with a top-level `"use server"` directive and validate `FormData` with the Zod schemas in `src/lib/validation.ts` before persistence or state changes.
- Client forms use `useActionState`, `useFormStatus`, a hidden honeypot field named `website`, and translation keys for returned action messages.
- Preserve localized navigation by building internal links with the current locale, and update both message JSON files when changing user-facing copy.
- Use the `@/*` alias for imports from `src/*`.
- Use `cn` from `src/lib/utils.ts` for conditional class names.
- Prefer token-backed Tailwind classes such as `bg-background`, `bg-surface`, `text-muted`, `border-border`, and the soft brand colors over ad hoc CSS values in UI components.
- Root metadata and fonts are defined in `src/app/layout.tsx` with `next/font/google`; keep global font variables aligned with the Tailwind theme tokens in `globals.css`.
