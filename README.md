# R0607 Website

Product and workshop website for **R0607** — a personal robotics learning platform with a local AI coach (Aiva), modular robot hardware, and Berlin workshop plans.

Built with Next.js 16 App Router, React Three Fiber, Tailwind CSS v4, and next-intl for EN/DE routing.

## Requirements

- Node.js 24.x
- pnpm 10.x

## Setup

```bash
pnpm install
```

Optional — Supabase for workshop form persistence:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Without Supabase, the workshop form shows a success state locally.

## Development

```bash
pnpm dev
```

Open `http://localhost:3000/en` or `http://localhost:3000/de`.

## Validation

```bash
pnpm lint          # ESLint
pnpm typecheck     # TypeScript
pnpm test          # Vitest unit + integration tests
pnpm build         # Production build
pnpm check         # All of the above
```

## Architecture

### Routes

| Route | Description |
|---|---|
| `/[locale]` | Home — robot section explorer |
| `/[locale]/events` | Berlin workshop interest form |
| `/[locale]/education` | School contact form |
| `/[locale]/learn` | Learning Hub overview |
| `/[locale]/privacy` | Privacy policy |
| `/[locale]/imprint` | Legal imprint |

Middleware applies locale routing for `/`, `/en/**`, `/de/**`.

### Home page sections

The home page (`/[locale]`) is a product-style explorer with interactive 3D viewers per section:

1. **Hero** — R0607 branding, CTAs
2. **Brain** — 4 SBC tiers: Basic (8 GB), Mega (16 GB), Super (64 GB), Ultra (128 GB)
3. **Energy** — 2 battery options: Small (20V 2Ah), Big (20V 4Ah)
4. **Movement** — 5 types: 4-wheel car, tracks, 4 omni wheels, walker, robotic arm
5. **Sensors** — 10 sensors, multi-select, all usable together
6. **Programming** — Python, Web, C++, Rust (informational)

Each section (Brain–Sensors) has an interactive React Three Fiber 3D viewer (auto-spins, drag to control) + option buttons + selected specs.

### Component map

```text
src/
  app/
    [locale]/
      page.tsx             — server: composes HeroSection + RobotSections + LanguagesSection
      layout.tsx           — locale layout with next-intl + ThemeProvider + Navbar + Footer
      events/              — workshop interest form
      education/           — school contact form
      learn/, privacy/, imprint/
  components/
    sections/
      HeroSection.tsx      — server: hero with badge, R0607 title, CTAs, stat cards
      RobotSections.tsx    — client: interactive brain/energy/movement/sensors state
      ConfigSection.tsx    — client: generic section (3D viewer + option buttons + specs)
      LanguagesSection.tsx — server: programming language cards
    robot3d/
      SectionViewer.tsx    — client: wrapper div + error boundary for 3D canvas
      BrainModel.tsx       — client: R3F SBC board per tier
      EnergyModel.tsx      — client: R3F battery pack
      MovementModel.tsx    — client: R3F robot chassis per movement type
      SensorsModel.tsx     — client: R3F robot body with sensors attached
    ui/
      OptionButton.tsx     — client: accessible option toggle button
    forms/
      WorkshopInterestForm.tsx
      SchoolContactForm.tsx
    layout/
      Navbar.tsx
      Footer.tsx
    providers/
      ThemeProvider.tsx
  lib/
    robot-config.ts        — option data (brainOptions, energyOptions, etc.)
    utils.ts               — cn()
    validation.ts          — Zod schemas + workshop age groups
    supabase.ts            — optional Supabase client
  i18n/
    request.ts
    routing.ts
messages/
  en.json                  — English copy
  de.json                  — German copy
tests/
  unit/lib/robot-config.test.ts
  integration/components/option-button.test.tsx
```

### Styling

Tailwind CSS v4 with CSS-first config in `src/app/globals.css`. Brand tokens: `--background`, `--surface`, `--cyan-soft`, `--foreground`, `--muted`, `--border` etc. Dark mode via `.dark` class.

Fonts loaded via `next/font/google` in `src/app/layout.tsx`:
- Display: Orbitron
- Body: DM Sans
- Mono: JetBrains Mono

### 3D Models

React Three Fiber with primitive geometries (no external `.glb` files). Each model auto-rotates on the Y axis and supports drag interaction via OrbitControls.

### i18n

`next-intl` with `always` prefix strategy. Locale from URL prefix (`/en`, `/de`). Messages in `messages/en.json` and `messages/de.json`.
