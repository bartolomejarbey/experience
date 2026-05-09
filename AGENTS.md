<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: AURA Homes Experience

Standalone Next.js 16 app deployed to **experience.aurahomes.cz**. Interactive
360° configurator for wooden houses (Luma / Terra / Silva / Mare).

NOT a WordPress embed. Clients reach it via link from `aurahomes.cz`. The
homepage is a server-side redirect to the MVP model.

**MVP scope: Luma model only.** Six panoramas — 2 exteriors (dark/light
facade) + 4 interiors (living room, bedroom, bathroom, utility). Other 3
models exist in code as placeholder route stubs (status `"coming-soon"`),
they ship in later iterations.

## What the user does

1. Lands on `/luma`, sees a 360° viewer + config panel (75/25 on desktop,
   bottom-sheet drawer on mobile).
2. Drags / gyro-tilts to look around. Clicks floor-arrow hotspots to walk
   between rooms. Clicks (i) hotspots to read material details.
3. Toggles facade (tmavá/světlá), terrace (žádná/malá/velká), pergola
   (ano/ne). Price updates live; if facade toggles on an exterior scene,
   the panorama swaps to the matching variant.
4. Clicks "Nezávazná poptávka" → modal with name/email/phone/message →
   Server Action writes to Supabase + emails t.sirotek@aurahomes.cz.

# Next.js 16 — load-bearing differences from your training

| Old (in your training)        | Now (Next 16)                                |
| ----------------------------- | -------------------------------------------- |
| `middleware.ts`               | `proxy.ts` (file convention renamed)         |
| `tailwind.config.js` required | Tailwind 4: `@theme` block in CSS            |
| `vercel.json`                 | Vercel auto-detection (no config file)       |
| `unstable_cache`              | `"use cache"` directive + `cacheLife`        |
| `params: { slug }`            | `params: Promise<{ slug }>` — must `await`   |
| Edge runtime default for MW   | Fluid Compute (Node.js) default              |
| Webpack default               | Turbopack default (dev + build)              |

`searchParams` is also a Promise. `cookies()`, `headers()`, `draftMode()`
are async — they're "Request-time APIs" that opt the route into dynamic
rendering.

# Tech stack — decisions, not suggestions

- **Next.js 16 App Router + React 19 + TypeScript strict.**
- **Tailwind 4 with CSS-first config.** All design tokens in
  `app/globals.css` `@theme` block. **No `tailwind.config.ts`.**
- **Pannellum 2.5.6 vanilla via custom React wrapper.** Reason: every
  React wrapper on npm (`pannellum-react`, `react-pannellum`, etc.) is
  abandoned, alpha, or React-16-only. We own ~120 lines of glue.
- **Supabase** for storage (public bucket → panorama BLOBs) + Postgres
  (single `aura_leads` table). Smart CDN serves panoramas globally.
- **React Context for config state.** ~10 keys, never crosses route
  boundaries → no Redux/Zustand/Jotai/Recoil. If we ever need
  persistence, it's `localStorage` (already used), not a state library.
- **Resend** for email notifications, called from a Server Action.
  Picked over Supabase Edge Functions: smaller surface area, free tier
  (3000 emails/mo) covers projected lead volume by 50×.
- **Vercel** deploy on Fluid Compute (default). No `vercel.ts` /
  `vercel.json` — auto-detection handles a vanilla Next 16 app.

# Design tokens — canonical

| Token              | Hex / source  | Use                          |
| ------------------ | ------------- | ---------------------------- |
| `terracotta`       | `#B8845F`     | Primary accent, CTAs         |
| `terracotta-soft`  | OKLCH derived | Hover states, soft fills     |
| `cream`            | `#F5F0E6`     | Background                   |
| `ink`              | `#1A1612`     | Body text                    |
| `ink-muted`        | OKLCH derived | Secondary text, captions     |
| `brown`            | `#4A3526`     | Borders, deep accents        |

| Font          | CSS var               | Source            | Use                    |
| ------------- | --------------------- | ----------------- | ---------------------- |
| `font-display`| `--font-fraunces`     | next/font/google  | Headings, prices       |
| `font-body`   | `--font-inter-tight`  | next/font/google  | Body, UI, forms        |

| Radius            | Use                  |
| ----------------- | -------------------- |
| `rounded-control` | Inputs, buttons (4px)|
| `rounded-card`    | Cards, modals (12px) |

Use ONLY these via Tailwind utilities (`bg-terracotta`, `text-ink`,
`font-display`, `rounded-card`). Never `bg-blue-500`, `text-zinc-700`,
`bg-[#aabbcc]`, or any arbitrary value.

The `aura-design-tokens` skill in `.claude/skills/` enumerates the full
allow-list.

# UI language

- All visible copy in **Czech**. Identifiers, comments, commit messages
  in English.
- Formal "vy" form throughout (not "ty").
- Numbers via `formatPrice()` in `lib/format.ts` — never inline
  `Intl.NumberFormat`. Result: `4 850 000 Kč` (with NBSP).
- Tone: warm, calm, design-led. Avoid hype words.
- Standardized phrases live in the `czech-ui-copy` skill in
  `.claude/skills/`.

# Layout

- **Desktop (md+)**: 75/25 grid (`grid-cols-[1fr_22rem]`). Pannellum
  viewer left. ConfigPanel right. TopBar full-width above. MiniMap
  floats bottom-left over the viewer.
- **Mobile (<md)**: full-screen viewer + bottom-sheet drawer (slide up
  from bottom, 8rem peek when collapsed, 85vh when expanded).
- **Scene transitions**: fade 1000ms via Pannellum's `sceneFadeDuration`,
  drops to 0ms when the user prefers reduced motion.
- **Hotspot styles**:
  - Scene hotspots = downward-facing arrows on cream circular buttons.
  - Info hotspots = circular terracotta buttons with serif "i".

# Configurator logic

- Facade change on **exterior** scene → auto-switches panorama variant
  via `findExteriorVariant()` in `ConfigContext`.
- Facade change on **interior** scene → no panorama switch, just stores
  the choice.
- Terrace / pergola change → price update only, scene unchanged.
- **Price formula**:
  ```
  price = model.basePrice + Σ(option.priceModifier for selected options)
  ```
  Pure client compute (`lib/config/price.ts`).
- Persists last config in `localStorage` under `aura:config:<modelId>`
  (`lib/config/persistence.ts`).

# Scene data

Lives in `lib/scenes/<model>.ts` as TypeScript. **Not in Supabase.**
Only the panorama BLOBs are in Supabase Storage.

```ts
// lib/types/scene.ts
export type Scene = {
  id: string;
  title: string;
  panorama: string;     // resolved URL
  preview: string;      // resolved URL for thumbnail
  hfov: number; pitch: number; yaw: number;
  hotSpots: HotSpot[];
  exteriorView?: string;       // "front" — pairs scenes that share view
  facadeVariant?: "dark" | "light";
};
```

URL pattern (constructed by `lib/supabase/public-url.ts`):

```
${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/aura-experience/<model>/<sceneId>/<variant>.webp
```

Variants: `full-8k.webp`, `medium-4k.webp`, `preview.webp`,
`full-8k.jpg` (Safari/no-WebP fallback). Cache-Control on the bucket
should be `max-age=31536000, immutable` once configured. Versioning
via filename (e.g. `scene-01-v2.webp`).

A dev-only validator in `lib/scenes/index.ts` throws at module load if
any scene hotspot points to an unknown target.

# Performance budget

- FCP < 1.5s, TTI < 3.5s.
- First panorama painted < 3s on 10 Mbps.
- Mobile rotation 60 FPS sustained.
- Connection-aware (planned, not yet enforced):
  `navigator.connection.effectiveType` of `2g`/`3g` or `saveData` →
  load `medium-4k`, not `full-8k`.
- **No-WebGL fallback** (planned): 2D `<picture>` gallery from preview
  images. `lib/webgl.ts` provides `hasWebGL()` detection.

# File organization conventions

- Route segments live in `app/`. Anything under `_components/` or `_lib/`
  inside a route segment is colocated and non-routable (Next 16 private
  folder convention).
- Reusable UI in `components/` at root. Domain logic in `lib/`.
- `lib/types/` is the single source of truth for shared types.
- Server-side modules import `"server-only"` at the top to fail loudly
  if they get bundled into a client chunk.
- Server Actions live in `app/actions/`, marked `"use server"` at file
  top.

# Workflow conventions

- Default branch is `main`.
- Branch per feature off `main`.
- Commits use Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).
- Never `git push` from inside Claude Code — denied in
  `.claude/settings.json`. User pushes manually after review.
- Type-check (`tsc --noEmit`) runs automatically on Stop hook via
  `.claude/hooks/end-of-turn.mjs`.
- Prettier auto-format runs on Stop hook for files touched in the
  current branch.
- Full `next build` only before deploy or on demand — too slow for
  per-turn check.
- Custom subagents:
  - **pannellum-expert** — dispatch when touching `components/pannellum/*`
  - **design-reviewer** — dispatch after multi-file UI changes
- Custom skills: `czech-ui-copy`, `pannellum-rules`, `aura-design-tokens`.

# NEVER

- **Add `middleware.ts`** — Next 16 uses `proxy.ts`. Different lifecycle.
- **Add `tailwind.config.js` or `.ts`** — Tailwind 4 config is in CSS.
- **SSR the Pannellum viewer** — needs `window` + WebGL. Always
  `"use client"` AND dynamic-imported with `{ ssr: false }`.
- **Mock Pannellum in tests** — accept a `testMode` prop that skips
  render. Don't mock the library.
- **Reach for a state library** — Context is sufficient.
- **Hardcode panorama URLs** — always derive from
  `NEXT_PUBLIC_SUPABASE_URL` + scene id + variant via
  `buildPanoramaUrl()`.
- **Commit `.env.local`** or any file containing service role keys.
  `.claude/settings.json` denies writes to it.
- **Use raw Tailwind palette** (`bg-blue-500`, `text-zinc-700`,
  `border-gray-200`) or arbitrary hex outside `@theme`.
- **`git push`** from inside agentic loops — manual review only.
- **Accept untrusted data into Pannellum hotspot fields** — Pannellum
  2.5.6 has a known XSS in hotspot attributes (GHSA-8423-w5wx-h2r6).
  We mitigate by hardcoding hotspot data in `lib/scenes/`.
- **Skip the Czech copy review** for new visible strings — invoke the
  `czech-ui-copy` skill, always.

# Useful commands

```bash
npm run dev        # Turbopack dev server, port 3000
npm run build      # production build (Turbopack)
npm run typecheck  # tsc --noEmit
npm run lint       # eslint . (next/core-web-vitals + next/typescript)
npm run format     # prettier --write .
```

# When the real Supabase project lands

Add a SQL migration directory (`supabase/migrations/`) and define
`aura_leads`:

```sql
create table public.aura_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  message text default '',
  model_id text not null,
  configuration jsonb not null,
  computed_price integer not null
);

-- RLS: deny anon SELECT, allow service role full access.
alter table public.aura_leads enable row level security;
-- (no policies for anon → no access; service role bypasses RLS by design)
```

Then `npx supabase gen types typescript --project-id <id> > lib/supabase/db-types.ts`
to wire DB types into the server client.
