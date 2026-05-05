# R0607 Website

Interactive Next.js website for R0607, a gamified robotics learning experience with EN/DE routing, a 3D robot builder, workshop interest capture, and school contact pages.

## Requirements

- Node.js 24.x or compatible modern Node runtime
- pnpm 10.x

No root/system installs are required.

## Setup

```bash
pnpm install
```

Optional Supabase environment variables for storing workshop interest:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Without Supabase variables, the workshop form shows a success state but does not persist submissions.

## Development

```bash
pnpm dev
```

Open `http://localhost:3000/en` or `http://localhost:3000/de`.

## Validation

```bash
pnpm lint
pnpm build
```

## Supabase Table

The current workshop form stores an age group rather than exact age:

```sql
CREATE TABLE workshop_signups (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at         timestamptz NOT NULL DEFAULT now(),
  email              text NOT NULL,
  age_group          text NOT NULL CHECK (age_group IN ('12-13', '14-15', '16-17', '18-19', '20+')),
  language           text CHECK (language IN ('de', 'en')) DEFAULT 'de',
  city               text DEFAULT 'Berlin',
  source             text,
  consent_contact    boolean NOT NULL DEFAULT false,
  consented_at       timestamptz,
  email_confirmed_at timestamptz
);

CREATE UNIQUE INDEX workshop_signups_email_idx ON workshop_signups (lower(email));

ALTER TABLE workshop_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_insert" ON workshop_signups
  FOR INSERT TO anon WITH CHECK (true);
```

Use an EU Supabase region for the Germany-facing launch.
