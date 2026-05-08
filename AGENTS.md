# R0607 Website Agent Guide

## Project overview

R0607 is a bilingual product and workshop site for a modular robotics learning platform. The core homepage experience is an interactive product explorer where visitors can inspect robot brain, energy, movement, sensor, and programming options through localized content and React Three Fiber scenes. Supporting routes cover Berlin workshop interest, school outreach, learning-hub messaging, privacy, and imprint content.

## Tech stack

- Next.js 16.2 App Router
- React 19 + TypeScript strict mode
- Tailwind CSS v4 (CSS-first, no `tailwind.config.js`)
- `next-intl` with `/en` and `/de` prefixes
- React Three Fiber + `@react-three/drei`
- Motion v12 for animated UI where needed
- Lucide React icons
- Vitest + React Testing Library + Playwright
- Optional Supabase persistence for workshop signups

## Run, build, test

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check
```

Open `http://localhost:3000/en` or `http://localhost:3000/de` in development.

## High-level architecture

### Routing

- `/` redirects through middleware to a locale-prefixed route
- `/[locale]` is the main product explorer
- `/[locale]/events` hosts the workshop interest form
- `/[locale]/education` hosts the school contact form
- `/[locale]/learn`, `/privacy`, `/imprint` provide supporting content

`src/app/[locale]/layout.tsx` is the locale shell. It must await `params`, validate the locale, load `next-intl` messages, and wrap all pages in `ThemeProvider`, `Navbar`, and `Footer`.

### Home page composition

`src/app/[locale]/page.tsx` is intentionally server-first and composes:

1. `HeroSection` (server)
2. `RobotSections` (client, interactive state)
3. `LanguagesSection` (server)

Keep the page itself server-side. Put browser-only state and WebGL access in child client components.

### Robot configuration model

`src/lib/robot-config.ts` now contains only product-explorer data:

- `brainOptions`
- `energyOptions`
- `movementOptions`
- `sensorOptions`
- `languageOptions`
- `defaultSelections`

Validation-specific age groups live in `src/lib/validation.ts`, not in `robot-config.ts`.

## 3D model patterns

- All WebGL components live in `src/components/robot3d`
- Mark them with `"use client"`
- Suppress the specific `THREE.Clock:` warning exactly as in the existing codebase pattern
- Use primitive geometry only; do **not** introduce PNG renders or exported image assets
- Import heavy 3D components dynamically with `ssr: false`
- Wrap canvases with `SectionViewer` to provide consistent sizing and error handling
- Use OrbitControls for drag interaction and pause auto-rotation while the user is interacting

## i18n rules

- All public copy belongs in `messages/en.json` and `messages/de.json`
- Use `getTranslations` / `getLocale` in server components
- Use `useTranslations` / `useLocale` only in client components that truly need them
- Keep English and German keys structurally identical
- For array data in translations (for example language `useCases`), use `t.raw(...)`

## Next.js 16 gotchas

- Dynamic route `params` are `Promise` values and must be awaited in pages, layouts, route handlers, and metadata functions
- Prefer Server Components by default
- Only add `"use client"` for browser APIs, hooks, interactivity, `next-themes`, or WebGL
- Read relevant Next.js docs under `node_modules/next/dist` before changing framework-sensitive behavior

## Forms and validation

- Workshop and school forms use server actions in route-local `actions.ts` files
- Validate all `FormData` with Zod in `src/lib/validation.ts`
- Workshop interest supports local success when Supabase env vars are absent
- The honeypot field name is `website`

## Styling system

- Global theme tokens are defined in `src/app/globals.css`
- Prefer token-backed utilities like `bg-background`, `bg-surface`, `text-muted`, `border-border`
- Preserve existing brand utilities such as `tron-grid`, `focus-ring`, `scanline`, and `crosshair-cursor`
- Avoid ad hoc colors unless they are intrinsic to 3D emissive materials

## Refactor summary

This refactor replaces the older builder-and-stats experience with:

- a dedicated hero section
- reusable configuration sections
- section-specific 3D scenes
- a cleaner robot config data model
- expanded localized copy for EN/DE
- targeted component tests for the new option button

Legacy files from the previous builder (`RobotBuilder`, `StationCard`, `RobotPanel`, `RobotCanvas`) were removed so stale types and imports do not linger in the TypeScript program.

## Common gotchas

- Do not reintroduce old `power`, `motion`, `perception`, or `ai` config APIs from the removed builder
- Do not add image-based robot renders; use React Three Fiber primitives instead
- If you add new user-facing strings, update both locale files together
- If tests fail on typechecking first, remember that `pnpm check` runs `typecheck` before lint and test
- Keep imports using the `@/*` alias for `src/*`
