---
name: aura-design-tokens
description: Use whenever writing Tailwind utility classes in TSX/JSX, editing CSS, or styling any component. Enforces AURA design system tokens — colors, fonts, radii, spacing. Auto-invoke on any edit that adds className strings, style props, or CSS rules.
---

# AURA Design Tokens — only these are allowed

The AURA design system is small and intentional. Every styling decision
flows from the tokens defined in `app/globals.css` `@theme` block.

**Don't** import a design system. **Don't** customize a third-party UI
kit. **Don't** use raw Tailwind palette.

## Color tokens

| Token              | Hex / source | Tailwind utilities                                              |
| ------------------ | ------------ | --------------------------------------------------------------- |
| `terracotta`       | `#B8845F`    | `bg-terracotta`, `text-terracotta`, `border-terracotta`         |
| `terracotta-soft`  | derived OKLCH| `bg-terracotta-soft`, `hover:bg-terracotta-soft`                |
| `cream`            | `#F5F0E6`    | `bg-cream`, `text-cream` (on dark bg)                           |
| `ink`              | `#1A1612`    | `text-ink`, `bg-ink`, `border-ink`                              |
| `ink-muted`        | derived OKLCH| `text-ink-muted` (captions, secondary)                          |
| `brown`            | `#4A3526`    | `bg-brown`, `border-brown`, `text-brown`                        |

**Forbidden everywhere:**

- Any `bg-` / `text-` / `border-` / `fill-` / `stroke-` followed by
  Tailwind default palette: `red, orange, amber, yellow, lime, green,
  emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia,
  pink, rose, gray, zinc, neutral, stone, slate`.
- Arbitrary values: `bg-[#aabbcc]`, `text-[rgb(...)]`, `border-[hsl(...)]`.
- The literals `white` and `black` outside one specific case:
  `text-cream` on `bg-terracotta` for the primary button. If you find
  yourself reaching for `text-white`, you want `text-cream`.

## Typography tokens

| Utility       | Maps to               | Use for                                                      |
| ------------- | --------------------- | ------------------------------------------------------------ |
| `font-display`| Fraunces (serif)      | `<h1>`–`<h3>`, prices, model names, large numerical readouts |
| `font-body`   | Inter Tight (sans)    | Everything else: body text, labels, buttons, form inputs     |

**Forbidden:** `font-sans`, `font-serif`, `font-mono`, `font-geist*`,
any other.

## Sizes (typography scale)

Stick to Tailwind's default scale: `text-sm`, `text-base`, `text-lg`,
`text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`. Avoid
arbitrary `text-[17px]`.

For prices specifically:
- Desktop config panel: `text-3xl font-display`
- Mobile drawer header: `text-xl font-display`
- Confirm modal summary: `text-2xl font-display`

## Radii

| Utility           | Use                                       |
| ----------------- | ----------------------------------------- |
| `rounded-control` | Inputs, buttons, segmented controls (4px) |
| `rounded-card`    | Cards, modals, drawers (12px)             |
| `rounded-full`    | Avatars, circular hotspot dots            |

**Forbidden:** other `rounded-*` values (`rounded-md`, `rounded-lg`,
`rounded-xl`, arbitrary `rounded-[8px]`).

## Spacing scale

Default Tailwind 4px scale. **Allowed steps**:
`0, 0.5, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32`.

**Forbidden:** `5, 7, 9, 11, 13, 14, 15, 17, 18, 19` and any arbitrary
`p-[13px]`.

## Common patterns

### Primary button

```tsx
<button className="rounded-control bg-terracotta text-cream font-body
  hover:bg-terracotta-soft active:bg-brown
  focus-visible:ring-terracotta focus-visible:ring-offset-cream
  focus-visible:ring-2 focus-visible:ring-offset-2
  h-12 px-6 transition-colors">
  Nezávazná poptávka
</button>
```

### Card surface

```tsx
<div className="rounded-card bg-cream border-brown/10 ring-1 p-6 shadow-lg">
  ...
</div>
```

### Heading

```tsx
<h2 className="font-display text-ink text-3xl">Vyberte si fasádu</h2>
```

### Body copy

```tsx
<p className="font-body text-ink-muted text-base leading-relaxed">
  Tmavá fasáda v odstínu opáleného dřeva podtrhuje současný design.
</p>
```

## When you style something

1. Reach for a token utility first. If none fits, **stop** and ask:
   does the design genuinely need a new token? Add to `@theme`.
2. Never paste in code from external libraries that uses raw Tailwind
   palette — translate to tokens or rewrite.
3. After your edit, re-read the diff and grep for `bg-blue|bg-zinc|...`
   in your changes.
