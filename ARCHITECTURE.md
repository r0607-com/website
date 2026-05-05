# R0607 Website Architecture

## Overview

The app is a Next.js App Router site with localized EN/DE routes, Tailwind CSS v4 theming, client-side robot builder state, and server actions for form-style submissions.

## Stack

- `next` App Router for routes, metadata, server components, and server actions
- `next-intl` for `/en` and `/de` routing and message files
- `next-themes` for light/dark mode
- Tailwind CSS v4 with CSS variable design tokens
- `motion` for scroll and interaction animation
- React Three Fiber and Drei for the primitive 3D robot preview
- Zod for form validation boundaries
- Supabase SSR helper for optional workshop persistence

## Routing

- `/` redirects to `/en`
- `/en` and `/de` host the interactive robot builder
- `/[locale]/events` contains the Berlin workshop interest page
- `/[locale]/education` contains school/institution information and a lightweight contact form
- `/[locale]/learn` explains Aiva, local AI, Learning Hub, and curriculum
- `/[locale]/privacy` and `/[locale]/imprint` provide launch legal pages

The middleware uses `next-intl` locale routing and preserves explicit locale paths.

## State Model

Robot configuration lives in `src/lib/robot-config.ts` and is managed in `RobotBuilder`.

- Power, motion, and AI are single-select groups.
- Perception is multi-select with a maximum of three sensors.
- The Brain Brick is always included.
- The “Save configuration” button writes to `localStorage`.
- “Start fresh” removes the localStorage entry and resets the builder.

No builder configuration is uploaded.

## 3D Model

`src/components/robot3d/RobotCanvas.tsx` renders the robot from primitive geometry only:

- brain brick: box
- battery: box
- cameras and sensors: cylinders/spheres
- LiDAR: cylinder
- wheels: torus
- tracks: boxes
- AI overlay: wireframe sphere

The canvas is dynamically imported so it only runs in the browser.

## Forms

Workshop interest uses a server action at `src/app/[locale]/events/actions.ts`.

The form collects:

- email
- age group: `12-13`, `14-15`, `16-17`, `18-19`, `20+`
- language
- contact consent
- honeypot field

If Supabase env vars are configured, submissions are inserted into `workshop_signups`. If not, the UI still returns a non-persistent success state for local development.

School contact uses a lightweight server action that validates name and email. It is currently non-persistent and intended to be swapped to email or CRM handling later.

## Styling

Global tokens are defined in `src/app/globals.css`.

- Dark mode is the default brand experience.
- Light mode uses parent/school-friendly contrast.
- Tron grid, cursor treatment, scanlines, and focus styles are global utilities.
- Components use semantic controls and visible focus rings.

## Content

All public UI copy is stored in:

- `messages/en.json`
- `messages/de.json`

The implementation avoids hardcoded route copy where practical so the localized pages can evolve from the message files.
