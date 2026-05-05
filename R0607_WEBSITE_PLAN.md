# R0607.com — Website Plan
### "The Learning Robot" — Interactive Browser-Game Experience

---

## 1. Project Overview

**Brand:** R0607 (read: "Robot")
**Primary Slogan:** *Build the robot. Learn the future.*
**Secondary Tagline:** *Assemble. Program. Think.*
**Target:** Kids (8–14) and their parents
**Public positioning:** R0607 is a hands-on robotics learning experience starting with Berlin workshops and school pilot conversations.
**Core promise:** Your personal robot with a local AI learning coach. Aiva, the LLM, voice features, courses, and Learning Hub run directly on the robot; AI chat and voice learning data is not sent to cloud AI providers.
**Vibe:** Retro-futuristic Tron/synthwave browser game — calm pastel neons, not blinding rave lights
**Core mechanic:** You *build* your robot by clicking through sections — each section is a "station" where you select a component to add to your robot. A 3D interactive robot model rotates as you configure it.

### 1.1 Internal Context — Not Website Copy

These points guide planning and outreach, but should not appear directly on the public website in this wording:
- R0607 is currently a concept with running prototypes.
- The next prototype targets NVIDIA Jetson Orin Nano and local AI/voice capabilities.
- The first public goal is to validate Berlin workshop demand, improve learning material, and gather evidence for future school partnerships / LOIs.
- R0607 should not be presented as a purchasable consumer product until there is a real buying path.

---

## 2. Tech Stack Recommendation

### ✅ Recommended: Latest stable Next.js + Motion for React + Tailwind CSS v4

| Concern | Choice | Why |
|---|---|---|
| Framework | **Latest stable Next.js (App Router)** | Continuity with existing LearningMachina stack; Vercel-native; SSG for performance. As of 2026-04-29, `next` latest is 16.2.4; pin the exact version at project setup. |
| Styling | **Tailwind CSS v4** | Consistent with existing brand; CSS variable theming; dark mode trivial |
| Animation | **Motion for React** | Current naming/package direction for the Motion ecosystem; essential for game-feel, scroll-sync, spring physics, layout animations |
| UI Components | **shadcn/ui** | Accessible primitives; no opinionated styles — full design control |
| i18n | **next-intl** | Best Next.js App Router integration; type-safe messages; locale routing |
| **3D Robot Viewer** | **React Three Fiber + @react-three/drei** | Interactive 3D robot from simple geometries (BoxGeometry, CylinderGeometry). Y-axis rotation drag. Lightweight — no external 3D assets needed. Static schematic fallback when WebGL is unavailable. |
| Background graphics | **SVG + CSS animations** | Tron grid, floating shapes, neon effects — no WebGL for these |
| Icons | **Lucide React** | Consistent with existing brand kit |
| Theme | **next-themes** | One-line dark/light mode toggle; no flash |
| Deployment | **Vercel** | Zero config; preview deploys; edge CDN |
| **Workshop signups** | **Supabase** | See section 17 |

### Why React Three Fiber for the robot (not raw Three.js)?
R3F is idiomatic React — the robot is a component tree, not imperative Three.js code. `@react-three/drei` adds `useGLTF`, `OrbitControls` (configured to Y-axis only), and `Environment` presets with near-zero boilerplate. The robot is built from **primitive geometries only** (Box, Cylinder, Sphere, Torus) — no .gltf files to manage, no loading spinners, instant on mobile.

```tsx
// Y-axis only rotation — clean and simple
<OrbitControls
  enableZoom={false}
  enablePan={false}
  minPolarAngle={Math.PI / 2}
  maxPolarAngle={Math.PI / 2}
/>
```

Mobile touch drag works out of the box with OrbitControls.

---

## 3. Branding Guide — "Neon Pastel / Tron Calm"

### 3.1 Philosophy
The aesthetic is **synthwave-at-dusk** — the neon grid winding down for the evening. Not a rave, not a library. Think: cool dark space with soft glowing outlines. Colors are pastel-shifted neons (desaturated ~20%, lightened ~10%) so they're readable and calming while still feeling sci-fi and playful.

### 3.2 Color Palette

#### Dark Mode (Default — the "space" experience)

| Token | Hex | HSL | Role |
|---|---|---|---|
| `background` | `#0a0e1a` | `224 28% 7%` | Deep space — main bg |
| `surface` | `#111827` | `222 24% 11%` | Card / panel bg |
| `surface-alt` | `#1a2235` | `220 30% 16%` | Elevated surfaces, hover |
| `grid-line` | `#1e2d47` | `218 38% 20%` | Tron grid lines |
| `cyan-soft` | `#7ee8fa` | `189 93% 72%` | Primary accent — crosshair, active borders (pastel-shifted) |
| `pink-soft` | `#f9a8d4` | `328 89% 82%` | Secondary accent — highlights, tags |
| `violet-soft` | `#c4b5fd` | `258 92% 85%` | Tertiary — decorative, icons |
| `green-soft` | `#86efac` | `142 76% 73%` | Success, "selected" state |
| `amber-soft` | `#fcd34d` | `45 97% 65%` | Warning, energy/battery |
| `foreground` | `#e2e8f5` | `218 50% 92%` | Primary text |
| `muted` | `#7a8ba0` | `214 18% 55%` | Secondary text |
| `border` | `#2a3a52` | `216 33% 24%` | Subtle borders |
| `glow-cyan` | `rgba(126,232,250,0.15)` | — | Hover glow halos |
| `glow-pink` | `rgba(249,168,212,0.12)` | — | Decorative glows |

#### Light Mode (Parent/school-friendly)

| Token | Hex | HSL | Role |
|---|---|---|---|
| `background` | `#f0f4ff` | `224 100% 97%` | Soft blue-white |
| `surface` | `#ffffff` | `0 0% 100%` | Cards |
| `surface-alt` | `#e8edf8` | `224 40% 94%` | Secondary panels |
| `grid-line` | `#c8d4e8` | `216 38% 85%` | Tron grid (faint) |
| `cyan-soft` | `#0891b2` | `189 93% 37%` | Primary accent (shifted darker for contrast) |
| `pink-soft` | `#db2777` | `328 68% 50%` | Secondary accent |
| `violet-soft` | `#7c3aed` | `262 72% 57%` | Tertiary |
| `green-soft` | `#16a34a` | `142 64% 36%` | Success |
| `foreground` | `#0d1117` | `215 28% 7%` | Primary text |
| `muted` | `#4b5a6e` | `214 18% 37%` | Secondary text |
| `border` | `#c8d4e8` | `216 38% 85%` | Borders |

### 3.3 Typography

| Role | Family | Weight | Notes |
|---|---|---|---|
| **Display / Hero** | **Orbitron** (Google Fonts) | 400, 700 | Sci-fi geometric — perfect for robot names, section headers. This replaces Roboto for R0607 |
| **Body** | **DM Sans** | 300, 400, 500 | Friendly, round, readable for kids. Not cold like Noto |
| **Code / UI chrome** | **JetBrains Mono** | 400, 700 | Modern coding font; fits the hardware/code vibe |

**Rationale for diverging from old LearningMachina fonts:**
Orbitron is the signature sci-fi brand font that immediately signals "robot world" to kids. DM Sans is warmer and rounder than Noto Sans, better for a child audience. JetBrains Mono is modern and developer-beloved.

### 3.4 Logo

```
R0607
```

- **R0607** — Orbitron Bold 700, displayed large
- The `0` characters glow in `cyan-soft`
- Subtle scanline texture on the letters
- Tagline below: *"Assemble. Program. Think."* in DM Sans 300

### 3.5 Slogan Options

Primary recommendation:
- **Build the robot. Learn the future.** — Clear for parents/schools, still exciting for kids, avoids overpromising.

Alternatives:
- **Build it. Code it. Teach it.** — Strong action rhythm, very workshop-friendly.
- **Your robot. Your code. Your ideas.** — More kid-centered and creative.
- **Assemble intelligence.** — Short and premium, but less immediately clear for younger kids.
- **From bricks to brains.** — Memorable and playful, especially if the physical kit visibly uses technic-style construction.

### 3.6 Custom Cursor

The crosshair cursor is a desktop enhancement that reinforces the game feel:
- SVG crosshair: cyan circle + pink crosshairs (like the reference image)
- Replaces default cursor on non-text interactive areas on desktop
- On hover over interactive elements: expands + glows
- Mobile: standard touch (no cursor)
- Keep native cursor behavior for form fields, text selection, and accessibility-sensitive controls

---

## 4. Site Architecture

### 4.1 Page Structure

```
/                       → Detect browser language; redirect to /en or /de, fallback /en
/en, /de                → Main interactive experience (single scroll journey)
/en/events, /de/events  → Workshops & Events page
/en/education, /de/education → Schools / education institutions page
/en/learn, /de/learn    → Detailed parent/school information: Aiva, local AI, learning hub, curriculum
/en/privacy, /de/privacy     → Privacy policy
/en/imprint, /de/imprint     → German legal imprint
```

The main page is a single-page scroll. Events, Education, and Learn are separate routes — linked from the nav and footer.

**Launch languages:** EN and DE only. FR can be added later when there is a clear audience need.

**Locale behavior:**
- Detect browser language from `Accept-Language`.
- Redirect supported languages to `/de` or `/en`.
- Redirect unsupported or missing language preferences to `/en`.
- Persist explicit language choice in a cookie so the user's manual selection wins over browser detection.

### 4.2 Sections (Scroll Journey = Robot Assembly)

```
Section 0 — HERO               "Meet R0607"
Section 1 — THE BRAIN BRICK    Core module / robot brain hardware
Section 2 — POWER UP           Battery
Section 3 — PERCEPTION         Cameras + Sensors
Section 4 — MOTION             Motors + Drive
Section 5 — INTELLIGENCE       AI / Autonomous control
Section 6 — YOUR ROBOT         Summary / configured robot display
Section 7 — FOOTER             About + lang + theme toggle
```

Each section = one "build station" = one animation trigger. Avoid mandatory scroll-snap for v1; use regular scrolling plus clear section anchors so mobile reading stays natural.

---

## 5. UX / Game Design

### 5.1 The Core Loop

```
Arrive → See playful desktop cursor / mobile touch UI → Scroll through stations →
At each station: see options → Click to select a component →
Robot model updates in a persistent sidebar/panel →
After last station: see your complete robot
```

### 5.2 Interactive 3D Robot Preview

A **React Three Fiber canvas** renders the robot as an assemblage of primitive 3D shapes — Tron-style wireframe/flat-shaded with neon edge glow. The canvas is always visible:
- **Desktop:** Sticky floating panel, right side of screen
- **Mobile:** Full-width panel at top of each section, 200px tall

**Rotation behavior:**
- Desktop: click + drag left/right (mouse)
- Mobile: single-finger swipe left/right (touch)
- Axis locked to Y only (`minPolarAngle = maxPolarAngle = π/2`) — no tilting
- Auto-rotates slowly when idle (0.005 rad/frame), pauses on interaction

**Assembly animation:** As the user selects each component, it `lerp`s into position from above (y + 2 → y 0) with a spring easing. New parts glow cyan briefly on arrival.

**Robot geometry plan (primitive shapes only):**
```
Brain Brick   → BoxGeometry(1, 0.6, 0.8)     — the core cube, always present
Battery       → BoxGeometry(0.4, 0.8, 0.4)   — snaps to side
Camera(s)     → CylinderGeometry(0.08, 0.1)  — small cylinders on front face
Ultrasound    → CylinderGeometry(0.06, 0.06) — pair of small cylinders
LiDAR         → CylinderGeometry(0.15, 0.15) — flat disk on top
Wheels (2WD)  → TorusGeometry(0.25, 0.08)    — 2 torus rings on sides
Wheels (4WD)  → TorusGeometry(0.2, 0.07)     — 4 torus rings
Tracks        → BoxGeometry(0.15, 0.5, 0.8)  — elongated side blocks
AI overlay    → Wireframe sphere around brain — MeshBasicMaterial wireframe
```

**Material:** `MeshStandardMaterial` with `emissive` set to the cyan-soft color at low intensity (0.3). Selected/active parts boost emissive to 1.0 briefly. Background of canvas is transparent — the Tron grid shows through.

**Fallback:** If WebGL is unavailable or disabled, render a static CSS/SVG robot schematic using the selected parts. The site should still explain the learning experience and allow workshop signup without 3D.

### 5.3 Selection Mechanic

Each station has **2–4 component options** (e.g., camera options: Mono / Stereo / Wide-angle). The user clicks one. It:
1. Gets a "selected" green border + checkmark
2. The component appears on the robot preview with an animation
3. A short description expands below
4. A "Next component →" button appears to scroll to the next station

### 5.4 Crosshair Cursor Detail

```css
/* Custom SVG cursor — desktop only */
cursor: url("data:image/svg+xml,...crosshair-svg...") 16 16, crosshair;
```

On hover over clickable component cards:
- Cursor ring expands from 24px to 32px
- Cyan glow pulses once
- Card border lights up

### 5.5 Tron Grid Background

Full-page animated perspective grid:
- CSS 3D transform: `perspective(800px) rotateX(70deg)`
- Animating `background-position` to create forward-motion feel
- Color: `grid-line` token — very subtle, never distracting
- Optional: disable in `prefers-reduced-motion`

---

## 6. Section-by-Section Design

### Section 0 — HERO: "Meet R0607"

**Layout:** Full viewport height, centered
**Content:**
- Large `R0607` logo (Orbitron) with crosshair icon
- Tagline: *"Your personal robot. Built by you."*
- Animated typing: *"Learning. Programming. Thinking."*
- Big glowing crosshair animation (reference image style) 
- Scroll indicator: "→ Start building" with bouncing arrow
- Key stats floating around: "Robot brain", "Python / C++ / Rust", "Aiva on-device", "Technic-brick compatible"
- Small trust signal: "Local AI. No cloud AI uploads."

**Background:** Tron grid + floating geometric shapes (like reference image cubes)

### Section 1 — THE BRAIN BRICK

**Tagline:** *"Everything starts here."*
**Content:**
- What is the Brain Brick: the robot's computing core inside a technic-brick compatible case
- Hardware overview: CPU, GPU, RAM, ports — shown as a glowing panel/schematic
- Fun explainer for kids: *"Think of it as the robot's skull — all the thinking happens inside."*
- No options to select here (it's always included — the base)
- CTA: Animate the Brain Brick onto robot preview

### Section 2 — POWER UP

**Tagline:** *"Give it life."*
**Options to select:**
- Standard Battery
- Extended Battery
- Outdoor charging

**Visual:** Power flow animation — energy lines from battery to brain

### Section 3 — PERCEPTION

**Tagline:** *"Give it eyes and ears."*
**Options (multi-select up to 3):**
- RGB Camera
- Stereo Camera (depth)
- Ultrasound sensor
- Infrared sensor
- LiDAR

**Visual:** Sensor nodes appear on robot schematic as glowing dots with scanning animations

### Section 4 — MOTION

**Tagline:** *"Put it in motion."*
**Options:**
- 2-Wheel Drive (fast, agile)
- 4-Wheel Drive (stable, terrain)
- Tank Tracks (ultimate terrain)
- Omni-Wheels (360° movement)

**Visual:** Wheels/tracks animate onto the robot base

### Section 5 — INTELLIGENCE

**Tagline:** *"Meet Aiva."*
**Content:** Keep this simple on the main page; link to `/learn` for detail.
- Aiva is your robot's personality and learning coach
- Talk, ask questions, and get help while you build
- Local AI: no cloud AI uploads for chat or voice learning interactions
- Learning Hub runs directly on the robot

**Visual:** Neural network overlay lights up on robot schematic, brain nodes pulse

### Section 6 — YOUR ROBOT

**Tagline:** *Build the robot. Learn the future.*
**Content:**
- Summary of all selected components
- 3D robot rotates to a hero angle, glows fully lit
- Build "spec sheet" (like a retro computer printout)
- Save configuration button (future feature placeholder)
- "Learn more" section leading to Aiva / Learning Hub / curriculum overview
- CTA banner: "Ready to build the real thing? → Workshops"

### Education Page — SCHOOLS / INSTITUTIONS

**Purpose:** Help schools and education institutions understand the educational value of R0607 and invite conversations about future pilots.

**Audience:** School leadership, STEM teachers, after-school program coordinators, education foundations.

**Content:**
- What students build: a robot using technic-brick compatible mechanical construction, sensors, motors, and on-device AI activities
- Learning outcomes: programming fundamentals, robotics, debugging, AI literacy, teamwork, responsible technology use
- Pilot format: small Berlin workshop cohorts first, then school pilots once learning material and hardware are stable enough
- What schools can expect: guided curriculum, safety boundaries, age recommendations, required room/equipment, instructor support
- Evidence section: workshop photos/videos, student outcomes, testimonials once available
- CTA: "Interested in a school pilot?" with contact form / email link

### Learn Page — PARENTS / SCHOOLS DETAIL

**Purpose:** Hold the detailed explanation that would overwhelm the gamified homepage. This page is for parents, teachers, and school decision-makers who want to understand what R0607 actually contains and why local AI matters.

**Content:**
- **Your personal robot:** R0607 is framed as a learner's own robot, not just a generic kit. The build, choices, and Aiva interaction should feel personal.
- **Aiva:** The robot's personality, voice, and personal learning coach. Aiva helps explain lessons, debug code, and guide projects.
- **Local-first privacy:** The LLM and voice experience run directly on the robot. AI chat and voice learning interactions are not sent to cloud AI providers. Be precise that workshop interest forms are separate, consent-based website submissions.
- **Learning Hub:** A web app served directly from the robot. It contains AI chat, voice interaction, courses, project guides, and progress-oriented learning material.
- **Course-aware AI:** Aiva is trained/tuned on the course material so it can explain concepts in context instead of behaving like a generic chatbot.
- **Curriculum range:** Basic programming, robotics, game development, machine learning, AI development, and autonomous robots.
- **Learning path:** Present the curriculum as progressive stages so the scope feels exciting, not overwhelming.
- **Parent/school reassurance:** Clear boundaries, age recommendations, privacy explanation, workshop format, and what learners need before starting.

**Homepage relationship:** The main page should show only short feature signals:
- "Your personal robot"
- "Meet Aiva"
- "Local AI, no cloud AI uploads"
- "Learning Hub on the robot"
- "From coding basics to autonomous robots"

Each signal links to the Learn page for detail.

### Section 7 — FOOTER

- R0607 logo
- Language selector (EN / DE)
- Light / Dark mode toggle
- Links: Workshops, Learn, Education, Privacy, Imprint, GitHub/Docs placeholders if useful
- Copyright + open source notice

---

## 7. i18n Architecture

### Setup: next-intl

```
/messages
  en.json          ← primary
  de.json

/app
  [locale]/
    layout.tsx
    page.tsx
```

### Message Key Structure

```json
{
  "nav": { "logo": "R0607", "tagline": "Assemble. Program. Think." },
  "hero": { "heading": "Meet R0607", "subheading": "Build the robot. Learn the future.", ... },
  "sections": {
    "brain": { "title": "The Brain Brick", "tagline": "Everything starts here.", ... },
    "power": { "title": "Power Up", ... },
    "perception": { "title": "Perception", ... },
    "motion": { "title": "Motion", ... },
    "ai": { "title": "Intelligence", ... },
    "result": { "title": "Your Robot", ... }
  },
  "components": {
    "battery_standard": { "name": "Standard Battery", "desc": "A simple power option for the robot configuration" },
    ...
  },
  "ui": { "next": "Next component →", "select": "Select", "selected": "Selected ✓" }
}
```

**Rules:**
- All UI strings via `useTranslations()` hook — zero hardcoded English in components
- Date/number formatting via `Intl` APIs
- RTL not required for v1 (EN and DE are LTR)
- Language auto-detected from browser; explicit selection persisted in a cookie
- URL structure: `/en/`, `/de/` (no locale = redirect to detected supported language, fallback `/en`)
- Add FR later only if workshop or school demand justifies translation and maintenance

---

## 8. Light / Dark Mode

### Implementation: next-themes

```tsx
// app/[locale]/layout.tsx
<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
  {children}
</ThemeProvider>
```

**Default: Dark** — the Tron space aesthetic is the hero experience
**Light mode:** Soft blue-white background, darker accent versions — parent/classroom friendly

Toggle placement: Footer + optional floating button top-right corner

CSS variables switch via `.dark` class on `<html>`. All colors via CSS custom properties — no hardcoded values in components.

---

## 9. Animation Plan

| Animation | Technology | Trigger |
|---|---|---|
| Tron grid scroll | CSS `@keyframes` + `background-position` | Continuous |
| Crosshair cursor movement | JS `mousemove` listener | Continuous |
| Crosshair hover expand | CSS transition | `:hover` |
| Section entrance (text) | Motion for React `whileInView` | Scroll |
| Component card hover lift | Motion for React `whileHover` | Hover |
| Component selection | Motion for React `layout` + spring | Click |
| Robot schematic assembly | Motion for React `AnimatePresence` | Click |
| Power flow lines | SVG `stroke-dashoffset` animation | On battery select |
| Sensor scan ping | CSS `@keyframes` scale + opacity | On sensor select |
| Neural network pulse | CSS `@keyframes` | On AI section |
| Hero typing text | JS character-by-character append | Page load |
| Floating shapes (hero) | CSS `@keyframes` translateY + rotate | Continuous |

**Performance:** All animations respect `prefers-reduced-motion: reduce`

---

## 10. Mobile Strategy

| Feature | Desktop | Mobile |
|---|---|---|
| Custom crosshair cursor | ✅ SVG cursor | ❌ Hidden (touch) |
| 3D robot canvas | Sticky sidebar, ~320px wide | Full-width top panel, 200px tall |
| Robot rotation | Mouse drag (left/right) | Single-finger swipe |
| Tron grid | Full perspective | Simplified flat grid |
| Section layout | Side-by-side | Stacked |
| Component selection | Hover + click | Tap (large touch targets, min 44px) |
| Scroll behavior | Smooth scroll | Native scroll |
| R3F canvas | Full quality | `dpr={[1, 1.5]}` — capped for mobile GPU |

Breakpoints (Tailwind): `sm` (640), `md` (768), `lg` (1024), `xl` (1280)

---

## 11. Project File Structure

```
r0607.com/
├── app/
│   └── [locale]/
│       ├── layout.tsx              ← fonts, ThemeProvider, i18n
│       ├── page.tsx                ← main page (all sections)
│       └── events/
│           └── page.tsx            ← workshops & events page
│       └── education/
│           └── page.tsx            ← school / institution information page
│       └── learn/
│           └── page.tsx            ← detailed Aiva / local AI / curriculum information
│       └── privacy/
│           └── page.tsx            ← privacy policy
│       └── imprint/
│           └── page.tsx            ← German imprint
├── components/
│   ├── cursor/
│   │   └── CrosshairCursor.tsx
│   ├── robot3d/
│   │   ├── RobotCanvas.tsx         ← R3F <Canvas> wrapper
│   │   ├── RobotModel.tsx          ← assembled primitive geometries
│   │   ├── RobotParts.tsx          ← individual part components (Brain, Battery, etc.)
│   │   └── useRobotConfig.ts       ← state: which parts are selected
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── BrainBrickSection.tsx
│   │   ├── PowerSection.tsx
│   │   ├── PerceptionSection.tsx
│   │   ├── MotionSection.tsx
│   │   ├── AISection.tsx
│   │   └── ResultSection.tsx
│   ├── events/
│   │   ├── EventsHero.tsx
│   │   ├── WorkshopCard.tsx
│   │   └── SignupForm.tsx          ← email + kid age → Supabase
│   ├── education/
│   │   ├── EducationHero.tsx
│   │   ├── LearningOutcomes.tsx
│   │   ├── SchoolPilot.tsx
│   │   └── SchoolContactCta.tsx    ← school pilot contact CTA
│   ├── learn/
│   │   ├── AivaSection.tsx
│   │   ├── LocalAiPrivacy.tsx
│   │   ├── LearningHubSection.tsx
│   │   └── CurriculumPath.tsx
│   ├── ui/                         ← shadcn primitives
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── lib/
│   ├── robot-config.ts             ← component definitions + options
│   ├── supabase.ts                 ← Supabase client (server + client)
│   └── i18n.ts
├── messages/
│   ├── en.json
│   └── de.json
├── public/assets/
├── styles/globals.css              ← CSS variables, Tron grid, custom cursor
└── middleware.ts                   ← next-intl locale routing
```

---

## 12. Development Phases

### Phase 1 — Foundation (Week 1)
- Latest stable Next.js project setup + Vercel deploy
- Tailwind v4 + CSS variables (dark/light themes)
- next-intl setup (EN + DE structure, EN copy first if needed)
- next-themes dark/light toggle
- Custom crosshair cursor
- Tron grid background

### Phase 2 — First Vertical Slice (Week 1–2)
- Hero + one build station + one selectable robot component
- R3F canvas with Brain Brick base and one animated part
- Desktop and mobile layout proven before expanding content
- Vercel preview deploy with Lighthouse/performance check

### Phase 3 — 3D Robot (Week 2)
- React Three Fiber + drei setup
- Robot primitive geometry model (Brain Brick base)
- Y-axis-only OrbitControls (mouse + touch)
- Auto-rotate idle behavior
- Part assembly animation (lerp from above)
- Desktop sticky sidebar + mobile top panel layout
- Static fallback robot schematic for browsers/devices where WebGL is unavailable

### Phase 4 — Core Sections (Week 3)
- Hero section with typing animation + floating shapes
- Brain Brick section (always selected base)
- Power + Perception + Motion + AI sections with selection mechanic
- Each selection triggers part appearance in 3D canvas

### Phase 5 — Events Page + Supabase (Week 3–4)
- Supabase project setup (free tier)
- `workshop_signups` table + RLS policies
- Events page design: workshop info cards + signup form
- Server Action for form submission (email + kid age)
- Rate limiting / bot protection for public form
- Confirmation email via Supabase Edge Function or transactional email provider (optional)
- Admin view: Supabase dashboard for now (no custom admin UI needed yet)

### Phase 6 — Education Page + School Outreach (Week 4)
- Schools / education institutions page
- Learning outcomes and pilot expectations
- Contact CTA for school pilot conversations
- Initial downloadable one-pager can be added later if school conversations need it

### Phase 7 — Learn Page + Privacy Messaging (Week 4)
- Detailed Learn page for parents and schools
- Aiva explanation: personality, local LLM, voice, course-aware assistant
- Learning Hub explanation: web app running directly on the robot
- Curriculum path from basic programming to autonomous robots
- Privacy explanation: no AI chat/voice learning data sent to cloud AI providers

### Phase 8 — Polish + Mobile (Week 4–5)
- Full mobile responsive pass
- R3F performance tuning (dpr cap, suspense boundary)
- Accessibility audit (ARIA, keyboard nav)
- DE translation
- `prefers-reduced-motion` compliance
- SEO metadata, Open Graph image, canonical/hreflang setup

### Phase 9 — Launch
- Final Vercel production deploy
- Domain connect: r0607.com
- Supabase production project (separate from dev)
- Vercel Analytics (privacy-friendly)
- Privacy policy and imprint live before collecting workshop interest

---

## 13. Key Design Decisions Summary

| Decision | Choice | Reason |
|---|---|---|
| 3D engine | React Three Fiber + drei | Primitive geometries only — no assets, instant load, mobile touch works |
| 3D rotation | Y-axis only via OrbitControls | Simple, game-like, avoids disorientation |
| Default theme | Dark | Tron aesthetic is the primary brand experience |
| Custom cursor | Desktop enhancement | Signals "game" while preserving native behavior for forms and accessibility |
| Scroll behavior | Sections with in-view triggers | Cinematic without the mobile friction of mandatory scroll snap |
| State management | React Context | Robot config state is simple; no Zustand needed |
| Font choice | Orbitron + DM Sans + JetBrains Mono | Sci-fi + kid-friendly + code identity |
| i18n library | next-intl | Best App Router support, type-safe |
| Component lib | shadcn/ui | Zero-style primitives for full design control |
| Workshop DB | Supabase | See section 17 |
| AI/privacy positioning | Local-first AI | Aiva, the LLM, voice, and Learning Hub run on the robot; no AI chat/voice learning data goes to cloud AI providers |
| Primary slogan | "Build the robot. Learn the future." | Clear for kids, parents, and schools without overpromising |

---

## 14. Events / Workshops Page

### 14.1 Page Purpose
Announce upcoming local workshops for kids in Berlin. No dates yet — primary goal is **capturing interest** (parent email + child age) to understand demand and plan suitable group sizes before committing to dates.

### 14.2 Page Layout

```
Header
  → "R0607 Workshops" (Orbitron heading)
  → "Hands-on robot building for kids in Berlin."

Workshop Card (single card for now)
  → Title: "Basic Programming with R0607"
  → Format: 2 hours/week · 5 weeks
  → Age: 12+ (beginner)
  → Location: Berlin (TBD)
  → Status badge: "Coming soon — register your interest"

Interest Registration Form
  → Parent email (required)
  → Child's age (number input, 8–17)
  → Optional: preferred language (DE / EN)
  → Required consent checkbox for workshop contact
  → Submit → success state

FAQ section (accordion)
  → What will kids learn?
  → What do I need to bring?
  → How much does it cost? (TBD)
  → Is there a waiting list?
```

### 14.3 Future-proofing
When dates are confirmed, add a `workshops` table in Supabase with `scheduled_date`, `capacity`, and `location` fields. The page can then switch from "register interest" mode to "request a spot" mode. Payment/booking is explicitly out of scope for v1.

---

## 15. Education / Schools Page

### 15.1 Page Purpose
Make schools and education institutions want to learn more about R0607 by showing concrete educational value, realistic pilot expectations, and the path from Berlin workshops to future school-ready programs.

### 15.2 Page Layout

```
Header
  → "Robotics and AI learning, built for the classroom"
  → Short explanation that R0607 is an early hands-on robotics learning program exploring future school pilots

Learning Outcomes
  → Programming fundamentals
  → Robotics and sensors
  → Debugging and systems thinking
  → AI literacy and responsible technology use
  → Collaboration and project-based learning
  → Local-first AI and privacy-aware computing

Pilot Format
  → Berlin workshops first
  → Small school pilots after the workshop format is mature enough
  → Age bands and session length recommendations
  → What the school provides / what R0607 provides

Prototype Evidence
  → Photos/video when available
  → Workshop learnings once available
  → Student project examples once available

CTA
  → "Interested in a school pilot?"
  → Email link or lightweight contact form
  → Invitation to discuss future school pilots
```

### 15.3 Tone
Less game-like than the kids homepage. Keep the visual identity, but use clearer institutional language: outcomes, safety, logistics, curriculum, evidence, pilot readiness.

### 15.4 Avoiding Overwhelm
The main gamified page should not try to explain the full curriculum. It should create curiosity through five simple ideas: personal robot, Aiva, local AI/privacy, Learning Hub, and progression from simple coding to autonomous robots. The Learn page carries the detailed explanation for parents and schools.

---

## 16. Learn Page — Aiva, Local AI, Learning Hub

### 16.1 Page Purpose
Explain the full R0607 learning system for parents and schools without overloading the main gamified page. This page should make the depth feel structured and safe: personal robot, local AI, Aiva, Learning Hub, and a staged curriculum.

### 16.2 Page Layout

```
Header
  → "Your personal robot learning coach"
  → Short explanation: R0607 combines a physical robot, local AI, voice, and courses in one on-robot Learning Hub.

Aiva
  → The robot's personality
  → Personal learning coach / assistant
  → Helps explain lessons, debug code, and suggest next steps
  → Uses course context so answers stay relevant to what the learner is doing

Local AI & Privacy
  → LLM runs directly on the robot
  → Voice interaction runs directly on the robot
  → AI chat and voice learning data is not sent to cloud AI providers
  → Workshop signup forms are separate consent-based website submissions

Learning Hub
  → Web app served directly from the robot
  → Includes AI chat, voice, courses, project guides, and learning material
  → Accessible from a browser on the local network

Learning Path
  → Basic programming
  → Robotics and sensors
  → Game development
  → Machine learning
  → AI development
  → Autonomous robots

For Parents & Schools
  → Age guidance
  → Workshop format
  → Privacy explanation
  → What a learner needs before starting
  → Link to Workshops and Education pages
```

### 16.3 Main Page Relationship
The main page should show feature signals, not dense explanation. Use short cards or station highlights:
- "Your personal robot"
- "Meet Aiva"
- "Local AI, no cloud AI uploads"
- "Learning Hub on the robot"
- "From coding basics to autonomous robots"

Each item links to the matching section on the Learn page.

---

## 17. Supabase — Workshop Signups

### 17.1 Why Supabase over alternatives

| Option | Verdict |
|---|---|
| **Supabase** ✅ | Free tier: 500MB DB, 50k MAU auth, unlimited API calls. First-class Vercel integration. Postgres under the hood. Built-in Row Level Security. Edge Functions for emails. Active project — not going anywhere. |
| PlanetScale | MySQL, not Postgres. Less suitable. |
| Neon | Postgres, Vercel-native, excellent — but smaller ecosystem and no built-in auth/storage. Good alternative if Supabase free tier limits are hit. |
| Railway | Great DX but no meaningful free tier anymore. |
| Firebase | Not Postgres. NoSQL. Out of scope. |

**Verdict: Supabase.** It's the best combination of free tier generosity, Postgres, Vercel integration, and built-in features (auth if needed later, storage, edge functions).

### 17.2 Database Schema

```sql
-- Workshop interest registrations
CREATE TABLE workshop_signups (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at         timestamptz NOT NULL DEFAULT now(),
  email              text NOT NULL,
  kid_age            smallint NOT NULL CHECK (kid_age BETWEEN 8 AND 17),
  language           text CHECK (language IN ('de', 'en')) DEFAULT 'de',
  city               text DEFAULT 'Berlin',   -- hardcoded for now, useful later
  source             text,                    -- which page/campaign sent them
  consent_contact    boolean NOT NULL DEFAULT false,
  consented_at       timestamptz,
  email_confirmed_at timestamptz              -- optional future double opt-in
);

-- Prevent duplicate signups from same email
CREATE UNIQUE INDEX workshop_signups_email_idx ON workshop_signups (lower(email));

-- RLS: no public reads, only inserts from anon role
ALTER TABLE workshop_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_insert" ON workshop_signups
  FOR INSERT TO anon WITH CHECK (true);

-- No SELECT policy for anon = data is invisible publicly
```

Add server-side validation so `consent_contact = true` and `consented_at IS NOT NULL` are required for accepted submissions. Keep the public insert path behind a Server Action; do not expose direct client inserts as the main form path.

### 17.3 Implementation in Next.js

```ts
// lib/supabase.ts — server client (for Server Actions)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )
}
```

```ts
// app/[locale]/events/actions.ts — Server Action
'use server'
export async function registerWorkshopInterest(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const kidAge = Number.parseInt(String(formData.get('kid_age') ?? ''), 10)
  const language = formData.get('language') === 'en' ? 'en' : 'de'
  const consentContact = formData.get('consent_contact') === 'on'

  if (!consentContact) return { error: 'missing_consent' }
  if (!email || Number.isNaN(kidAge)) return { error: 'invalid_input' }
  if (kidAge < 8 || kidAge > 17) return { error: 'invalid_age' }

  const { error } = await supabase
    .from('workshop_signups')
    .insert({
      email,
      kid_age: kidAge,
      language,
      city: 'Berlin',
      source: 'events_page',
      consent_contact: true,
      consented_at: new Date().toISOString(),
    })

  if (error?.code === '23505') return { error: 'already_registered' } // duplicate
  if (error) return { error: 'unknown' }
  return { success: true }
}
```

### 17.4 Privacy & GDPR (important — Berlin audience)

- **Data minimization:** Only email + age collected. No name, no phone.
- **Purpose limitation:** Explicitly stated on form: "We'll only use your email to notify you when Berlin workshops are scheduled."
- **Local AI privacy promise:** For the robot experience, state clearly that Aiva's LLM and voice interaction run locally on the robot and AI chat/voice learning data is not sent to cloud AI providers. Clarify separately that workshop interest forms are consent-based website submissions stored in Supabase.
- **Privacy policy page:** Required before launch. Simple one-pager. Link in footer.
- **Imprint page:** Required for a Germany-facing public website. Link in footer.
- **Consent checkbox:** Required on form: "I agree to be contacted about R0607 workshops" — store `consent_contact` and `consented_at`.
- **Right to delete:** Add a `DELETE /api/unsubscribe?token=...` route (token = HMAC of email) so parents can remove themselves without logging in.
- **Data location:** Supabase EU region (`eu-central-1` Frankfurt) — keeps data in Germany for GDPR compliance. Set this when creating the Supabase project.
- **Abuse protection:** Add a honeypot field plus IP/email rate limiting at the Server Action or route-handler layer. Add Turnstile/hCaptcha only if spam appears.

### 17.5 Viewing Signups (Admin)

No custom admin UI needed for v1. View directly in **Supabase Dashboard → Table Editor** or export as CSV. When you have >50 signups, run a quick age-group query:

```sql
SELECT kid_age, count(*) as interest
FROM workshop_signups
GROUP BY kid_age
ORDER BY kid_age;
```

This tells you exactly how to size your groups.

---

*Plan version 2.2 — R0607.com*
*Changes from v2.1: added Aiva, local-first AI/privacy promise, on-robot Learning Hub, detailed Learn page for parents/schools, and clarified that AI chat/voice learning data stays local while workshop forms are separate consent-based submissions.*
