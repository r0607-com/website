# R0607 Website — Improvement Plan

## Status snapshot

The core site is functional: all six routes exist, EN/DE translations are complete, the robot builder and server-action forms work, and the Tron theming is in place. The gaps are a confirmed 3D bug, missing mobile nav, SEO/GDPR holes required before launch, and several planned interaction features that were never implemented.

---

## Issues and improvements (grouped by category)

---

### A. 3D Robot — Bugs (user-confirmed)

#### A1. Wheels on the wrong axis

**File:** `src/components/robot3d/RobotCanvas.tsx` — `Wheel` component  
**Bug:** `rotation={[Math.PI / 2, 0, 0]}` rotates the torus 90° around X, making it lie flat horizontally (like a horizontal halo). Wheels that are mounted on the sides of the robot should stand upright and have their axle along the X axis, which requires `rotation={[0, Math.PI / 2, 0]}`.  
**Fix:** Change every `<Wheel>` instance's rotation from `[Math.PI / 2, 0, 0]` to `[0, Math.PI / 2, 0]`.

#### A2. Robot is too small

**File:** `src/components/robot3d/RobotCanvas.tsx` — `<Canvas>` and `RobotModel`  
**Bug:** Camera at `[2.7, 1.4, 3.2]` with `fov: 42` renders the robot at roughly half the visual space it should occupy. The plan says the robot should be a prominent feature.  
**Fix (two-pronged):**
- Move camera closer: `position: [2.0, 1.0, 2.6]`
- Raise FOV: `fov: 52`
- Add `scale={1.35}` to the `<group>` in `RobotModel` to fill the canvas better across all configuration states.

---

### B. Missing features — launch-blocking

#### B1. Mobile navigation

**Files:** `src/components/layout/Navbar.tsx`  
**Problem:** Nav links are hidden at `md:flex`. On mobile there is no hamburger, no drawer, and no way to reach /events, /learn, or /education.  
**Fix:** Add a mobile hamburger button that opens a full-screen or slide-in drawer containing the nav links and the language/theme toggles. Use React `useState` (client component already) and a `motion.div` for the slide animation.

#### B2. GDPR unsubscribe route

**Files:** new file `src/app/api/unsubscribe/route.ts`  
**Problem:** The privacy policy (both EN and DE) already promises "A self-service unsubscribe flow is planned." German DSGVO law requires a practical deletion path.  
**Fix:** Implement `GET /api/unsubscribe?token=<hmac>` where the token is `HMAC-SHA256(secret, email)`. The route validates the token and deletes the row from `workshop_signups`. Add `UNSUBSCRIBE_SECRET` env var. Include the unsubscribe URL in the privacy policy copy.

#### B3. Imprint content

**Files:** `messages/en.json`, `messages/de.json`, `src/app/[locale]/imprint/page.tsx`  
**Problem:** The imprint page currently displays a placeholder. German law (Impressumspflicht) requires real operator details before the site goes live.  
**Fix:** Populate `imprint.placeholder` in both message files with actual operator name, address, email, and responsible person. Update the imprint page to render structured legal fields rather than a single `<p>`.

#### B4. Open Graph / social image + hreflang

**Files:** `src/app/[locale]/layout.tsx`, new `public/og-image.png`  
**Problem:** `metadataBase` is set in the root layout but there is no OG image file and no `alternates.languages` hreflang metadata on locale pages. Social shares will use a generic browser thumbnail.  
**Fix:**
- Create `public/og-image.png` (1200×630px) with the R0607 Tron branding.
- Add `openGraph.images` to the locale layout metadata.
- Add `alternates: { languages: { en: '/en', de: '/de' } }` to `generateMetadata` in `src/app/[locale]/layout.tsx`.

---

### C. Missing features — interaction / polish

#### C1. Auto-rotate pauses on user interaction

**File:** `src/components/robot3d/RobotCanvas.tsx`  
**Problem:** `useFrame` increments `rotation.y` every frame unconditionally. Even while the user is dragging the robot with `OrbitControls`, the rotation keeps jumping. The plan calls for "pauses on interaction."  
**Fix:** Add a `useRef<boolean>` for interaction state. Attach `onStart` / `onEnd` callbacks to `OrbitControls`. Inside `useFrame`, only increment if not interacting. Also consider resetting the auto-rotate after a 2 s idle delay.

#### C2. Part assembly animation (lerp from above)

**File:** `src/components/robot3d/RobotCanvas.tsx` — per-part meshes  
**Problem:** Parts appear and disappear instantly when the config changes. The plan specifies parts should lerp in from `y + 2 → y 0` with a brief cyan glow burst.  
**Fix:** Track `prevConfig` in a ref. When a new part is added, animate its Y position using `useFrame` with a lerp (or expose a `MeshWithAnimation` wrapper that manages a local `t` value from 0→1). On part addition, boost `emissiveIntensity` to 1.0 for 400ms then tween back down.

#### C3. Hero section enhancements

**File:** `src/components/sections/RobotBuilder.tsx` (hero block)  
**Problem:** The plan describes an animated typing text and floating geometric shapes in the hero. Currently the heading and copy are static, and there are no floating decorative shapes.  
**Fix:**
- Add a `TypingText` client component that cycles through `["Learning.", "Programming.", "Thinking."]` by appending characters with a small interval.
- Add 3–5 floating Tron-styled shapes (small rotated `<div>`s or inline SVGs) in the hero background area using Motion `animate` with `y` oscillation and `opacity` variants.

#### C4. Component selection microanimations

**File:** `src/components/sections/RobotBuilder.tsx` — `StationCard`  
**Problem:** Selecting a component card has no feedback beyond the border color change. The plan specifies hover card lift, spring layout animations, and per-station special effects (power flow lines, sensor scan ping, neural pulse).  
**Fix (in order of impact):**
- Add `whileHover={{ y: -4 }}` to each option `<button>` via a Motion `motion.button`.
- Add `layout` prop to the selected-state badge so it animates in/out.
- For the power station, add a small CSS `@keyframes` "energy-flow" animation on the battery card's border when selected.
- For perception, add a pulsing dot animation on selected sensor cards.

#### C5. WebGL unavailability fallback

**Files:** `src/components/robot3d/RobotCanvas.tsx`, `src/components/sections/RobotBuilder.tsx`  
**Problem:** No fallback is implemented. If WebGL is unsupported or disabled, the canvas silently fails.  
**Fix:** Wrap the `RobotCanvas` import in an error boundary. On error, render a static SVG schematic that shows the selected parts as labeled boxes/circles matching the neon theming.

#### C6. Rate limiting on form actions

**Files:** `src/app/[locale]/events/actions.ts`, `src/app/[locale]/education/actions.ts`  
**Problem:** Both server actions have no rate limiting. The workshop form is publicly accessible and could be spammed.  
**Fix:** Add lightweight IP-based rate limiting using a module-level `Map<ip, {count, ts}>` in-memory store (suitable for single-instance Vercel serverless). Allow max 3 submissions per IP per hour. Return `{ status: "error", message: "rate_limited" }` when exceeded. Add the message key to both JSON files.

---

### D. Code quality / maintainability

#### D1. Split RobotBuilder.tsx

**File:** `src/components/sections/RobotBuilder.tsx` (389 lines)  
**Problem:** The plan's file structure calls for separate `HeroSection`, `StationCard`, `RobotPanel`, and `ResultSection` components. The current monolithic file is hard to navigate.  
**Fix:** Extract `RobotPanel` and `StationCard` into `src/components/sections/RobotPanel.tsx` and `src/components/sections/StationCard.tsx`. Keep state in `RobotBuilder.tsx` and pass props down. No logic change.

#### D2. Canvas min-height mobile

**File:** `src/components/robot3d/RobotCanvas.tsx`  
**Problem:** `min-h-[220px]` is the canvas floor. On tall mobile screens the robot preview could be taller.  
**Fix:** Change to `min-h-[240px] sm:min-h-[300px]` so the canvas grows on wider phones and tablets.

#### D3. Missing `typecheck` script

**File:** `package.json`  
**Problem:** No dedicated `typecheck` script for fast type checks without a full build.  
**Fix:** Add `"typecheck": "tsc --noEmit"` to `scripts`.

---

## Execution order

```
Priority 1 — Bugs (do first, they're visible immediately)
  A1  Wheel rotation fix
  A2  Robot size fix

Priority 2 — Launch blockers
  B1  Mobile nav
  B3  Imprint content
  B4  Open Graph image + hreflang
  B2  GDPR unsubscribe route

Priority 3 — Interaction polish
  C1  Auto-rotate pause
  C2  Part assembly animation
  C4  Microanimations on card selection
  C3  Hero typing + floating shapes
  C5  WebGL fallback
  C6  Rate limiting

Priority 4 — Code quality
  D1  Split RobotBuilder
  D2  Canvas min-height
  D3  typecheck script
```
