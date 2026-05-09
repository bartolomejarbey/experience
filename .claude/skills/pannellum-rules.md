---
name: pannellum-rules
description: Use whenever writing or modifying Pannellum-related code — anything in components/pannellum/, scene definitions in lib/scenes/, panorama URL helpers in lib/supabase/public-url.ts, or any code mentioning "panorama", "viewer", "hotspot", "scene", "pannellum". Auto-invoke on edits to those paths.
---

# Pannellum Rules — non-negotiable

The AURA viewer wraps vanilla Pannellum 2.5.6. The wrapper's correctness
matters more than its prettiness — the viewer **is** the product.

## Always

1. **`"use client"` at file top** for any component that imports
   pannellum or its CSS.
2. **`typeof window !== "undefined"` guard** before any Pannellum call.
3. **Lazy load via `dynamic(() => import("./PannellumViewer"), { ssr: false })`**
   at the consumer. The wrapper itself static-imports `pannellum` and
   the CSS — Next bundler chunks them together at the dynamic boundary.
4. **`viewer.destroy()` in `useEffect` cleanup** — every single mount.
   Without it WebGL contexts leak and Safari kills the tab after ~5
   navigations.
5. **Multi-scene config**: register all scenes once in viewer init,
   transition with `viewer.loadScene(id)`. Don't re-instantiate the
   viewer for scene swaps.
6. **Latest-callback refs**: any callback passed into Pannellum's
   `createTooltipFunc` / `createTooltipArgs` should be wrapped in a
   `useRef` updated by `useEffect`, so stale closures from older
   renders don't fire.
7. **Honor `prefers-reduced-motion`**: pass `sceneFadeDuration: 0` to
   Pannellum when the user opts out.

## Never

1. **Never SSR**. No Server Component import path.
2. **Never mock Pannellum in tests**. Accept a `testMode?: boolean`
   prop on `<PannellumViewer>` that returns a placeholder div instead.
3. **Never bind React event handlers to hotspot DOM via JSX**. The
   hotspot DOM lives outside React's tree. Use Pannellum's
   `createTooltipFunc` and attach DOM listeners imperatively.
4. **Never request gyro permission on mount**. iOS 13+ requires the
   call to be inside a user-gesture handler.
5. **Never re-init on every prop change**. Diff: only re-init if the
   container element or scenes-object identity changed.
6. **Never load `full-8k` blindly on mobile**. The 8k WebP is ~3-5 MB.
7. **Never autoplay audio or video tied to scene load** — the user
   doesn't expect it.
8. **Never accept untrusted data into hotspot fields**. Pannellum
   2.5.6 has a known XSS in hotspot attribute handling
   (GHSA-8423-w5wx-h2r6). All hotspot data must originate from
   `lib/scenes/<model>.ts` (hardcoded), never from user input or an
   external API.

## Hotspot data shape

```ts
type HotSpotBase = { id: string; pitch: number; yaw: number };

type SceneHotSpot = HotSpotBase & {
  type: "scene";
  targetSceneId: string;       // must reference a real scene id
  targetYaw?: number;
  labelCs: string;             // e.g. "Vstoupit do obývacího pokoje"
};

type InfoHotSpot = HotSpotBase & {
  type: "info";
  titleCs: string;
  bodyCs: string;
  imageUrl?: string;
};
```

`targetSceneId` MUST reference a real scene in the same model. The
dev-mode validator in `lib/scenes/index.ts` throws at module load if
this invariant is broken.

## Scene transitions

```ts
// Single source of truth: parent (ConfigContext) owns currentSceneId.
// PannellumViewer reflects prop changes via loadScene.
viewer.loadScene(targetSceneId, /* pitch */ undefined, targetYaw);
// sceneFadeDuration was set globally at init — Pannellum handles fade.
```

Throttle scene changes to one per 250ms if you observe leaks under
rapid clicking.

## When debugging

- **Source of truth**: `node_modules/pannellum/src/js/pannellum.js`.
  npm types are nonexistent; we maintain ours in
  `components/pannellum/pannellum.d.ts`.
- **WebGL context lost?** Listen for `webglcontextlost` on the inner
  canvas (`containerEl.querySelector("canvas")`) and re-init.
- **Mobile gyro silent?** `DeviceOrientationEvent.requestPermission`
  returns `"denied"` if user refused — show a toast, fall back to drag.
