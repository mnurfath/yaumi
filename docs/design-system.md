# Yaumi Design System

**Style direction**: Sharp minimal SaaS (Linear / Vercel / Stripe).
High-contrast neutrals, one flat accent, tight radius, 1px borders, no gradients, no blur, no decorative serif.

**Source of truth**: `src/app/globals.css` — all design tokens live here via `@theme inline` + `:root` / `.dark` CSS custom-property blocks. No `tailwind.config` file exists (Tailwind v4). shadcn/ui "base-nova" style, `components.json` config.

**Quick rules for agents**:
1. Use semantic Tailwind classes (`bg-card`, `text-foreground`, `border-border`), never raw hex / `emerald-*` / `white` / `gray-*`.
2. No gradients. `bg-gradient-brand` / `bg-gradient-warm` / `text-gradient-brand` utilities still exist in `globals.css` as opt-in escape hatches — do not use them in default UI.
3. No `backdrop-blur`, no ambient glow, no `shadow-primary/*` tinted shadows. Body is flat `bg-background`.
4. Headings use `font-sans` (Manrope). `font-heading` (Newsreader) is opt-in, not the default.
5. Card padding is driven by the primitive's `--card-spacing` token — do not override with `py-6` / `p-4` / `p-6`. Use `<Card>` / `<CardHeader>` / `<CardContent>` bare.
6. Radius is `--radius: 0.625rem` (10px) — prefer `rounded-lg` / `rounded-md`, avoid `rounded-2xl` / `rounded-3xl` / arbitrary `rounded-[Npx]`.
7. For RTL Arabic content (adhkar text), use `dir="rtl"` + `font-arabic`. The Arabic font is Noto Naskh Arabic (`--font-noto-naskh-arabic`).
8. Don't add new npm dependencies for things the stack already does.

---

## Color tokens

All values are OKLCH. Light in `:root`, dark in `.dark`. Dark mode tokens are ready but no toggle is wired yet — style as if it will be activated (use token classes, never hardcoded dark colors).

### Light (`:root`)
| Token | OKLCH | Hex (approx) | Purpose |
|---|---|---|---|
| `--background` | `oklch(0.995 0 0)` | `#fcfcfc` | Near-white flat page surface |
| `--foreground` | `oklch(0.145 0 0)` | `#0a0a0a` | Near-black ink |
| `--card` / `--popover` | `oklch(1 0 0)` | `#ffffff` | Pure white elevated surfaces |
| `--card-foreground` / `--popover-foreground` | `oklch(0.145 0 0)` | `#0a0a0a` | Ink on elevated surfaces |
| `--primary` | `oklch(0.45 0.1 162)` | `#006644` | **Single brand accent** — desaturated emerald, reads "engineered" not "pastel" |
| `--primary-foreground` | `oklch(0.99 0 0)` | `#fcfcfc` | Text/fill on primary |
| `--secondary` | `oklch(0.96 0 0)` | `#f4f4f4` | Plain neutral gray — secondary fills |
| `--secondary-foreground` | `oklch(0.145 0 0)` | `#0a0a0a` | Ink on secondary |
| `--muted` | `oklch(0.97 0 0)` | `#f7f7f7` | Subtle gray — muted backgrounds, hover wash |
| `--muted-foreground` | `oklch(0.556 0 0)` | `#858585` | Secondary text, captions |
| `--accent` | `oklch(0.96 0 0)` | `#f4f4f4` | Same as secondary — neutral gray |
| `--accent-foreground` | `oklch(0.145 0 0)` | `#0a0a0a` | Ink on accent |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `#e23636` | Error / danger |
| `--border` / `--input` | `oklch(0.9 0 0)` | `#e3e3e3` | Crisp 1px borders / input borders |
| `--ring` | `oklch(0.45 0.1 162)` | `#006644` | Focus ring (= primary) |

### Dark (`.dark`)
| Token | OKLCH | Hex (approx) | Purpose |
|---|---|---|---|
| `--background` | `oklch(0.145 0 0)` | `#0a0a0a` | Near-black flat page surface |
| `--foreground` | `oklch(0.985 0 0)` | `#fcfcfc` | Near-white ink |
| `--card` / `--popover` | `oklch(0.205 0 0)` | `#262626` | Slightly-lifted dark gray |
| `--card-foreground` / `--popover-foreground` | `oklch(0.985 0 0)` | `#fcfcfc` | Ink on elevated surfaces |
| `--primary` | `oklch(0.65 0.12 162)` | `#39a678` | Brighter emerald for dark surface contrast |
| `--primary-foreground` | `oklch(0.145 0 0)` | `#0a0a0a` | Dark text on bright primary |
| `--secondary` / `--muted` / `--accent` | `oklch(0.269 0 0)` | `#3f3f3f` | Neutral dark gray fills |
| `--secondary-foreground` / `--accent-foreground` | `oklch(0.985 0 0)` | `#fcfcfc` | Ink on dark fills |
| `--muted-foreground` | `oklch(0.708 0 0)` | `#a1a1a1` | Secondary text on dark |
| `--destructive` | `oklch(0.704 0.191 22.216)` | `#ff6b5e` | Brighter red for dark |
| `--border` | `oklch(1 0 0 / 10%)` | — | 10% white overlay |
| `--input` | `oklch(1 0 0 / 15%)` | — | 15% white overlay |
| `--ring` | `oklch(0.65 0.12 162)` | `#39a678` | Focus ring (= primary) |

### Chart palette (multi-hue by design — data-viz legitimately uses several colors)
| Token | Light | Dark | Hue meaning |
|---|---|---|---|
| `--chart-1` | `oklch(0.55 0.14 163)` | `oklch(0.7 0.15 163)` | Emerald (primary) |
| `--chart-2` | `oklch(0.55 0.15 300)` | `oklch(0.72 0.16 300)` | Violet |
| `--chart-3` | `oklch(0.75 0.14 85)` | `oklch(0.8 0.14 85)` | Amber |
| `--chart-4` | `oklch(0.6 0.12 200)` | `oklch(0.72 0.13 200)` | Teal |
| `--chart-5` | `oklch(0.62 0.18 25)` | `oklch(0.7 0.19 25)` | Coral |

### Sidebar tokens
Same scheme as the main palette — single emerald accent on neutral bg.
| Token | Light | Dark |
|---|---|---|
| `--sidebar` | `oklch(0.995 0 0)` | `oklch(0.205 0 0)` |
| `--sidebar-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-primary` | `oklch(0.45 0.1 162)` | `oklch(0.65 0.12 162)` |
| `--sidebar-accent` | `oklch(0.96 0 0)` | `oklch(0.269 0 0)` |
| `--sidebar-border` | `oklch(0.9 0 0)` | `oklch(1 0 0 / 10%)` |
| `--sidebar-ring` | `oklch(0.45 0.1 162)` | `oklch(0.65 0.12 162)` |

### Opt-in gradient utilities (escape hatches — not default)
Still defined in `globals.css` but **no component uses them by default**. Only reach for these when you have a strong reason (hero accent, one-off celebratory state), and document why.
- `.bg-gradient-brand` — cool emerald→teal→violet sweep
- `.bg-gradient-warm` — emerald→amber, celebratory moments
- `.text-gradient-brand` — gradient clipped to text, hero headings only

---

## Typography

| Token | Font | CSS var | Usage |
|---|---|---|---|
| `--font-sans` | Manrope | `--font-manrope` | Body, headings, UI — **the default** |
| `--font-heading` | Newsreader (serif) | `--font-newsreader` | Opt-in decorative serif on a case-by-case basis |
| `--font-arabic` | Noto Naskh Arabic | `--font-noto-naskh-arabic` | Adhkar/Arabic text with `dir="rtl"` |
| `--font-mono` | Manrope (aliased) | `--font-manrope` | Code (no separate mono loaded) |

**Defaults**: `html { @apply font-sans }` and `h1, h2, h3 { @apply font-sans }` — all headings are sans by default, bold + tight tracking (`font-bold tracking-tight`).

**Heading hierarchy** (Linear / Vercel convention — bold + tight, not big serif):
- Page `h1`: `text-3xl font-semibold tracking-tight md:text-4xl`
- Section `h2`: `text-xl font-semibold`
- Card title (via `CardTitle`): `text-base font-medium` (sans, set in primitive)
- Stat number: `text-2xl font-semibold`
- Eyebrow / overline: `text-xs font-bold uppercase tracking-[0.18em] text-primary`
- Body: `text-base` or `text-sm`
- Caption / secondary: `text-xs text-muted-foreground` or `text-sm text-muted-foreground`

---

## Radius

Single source: `--radius: 0.625rem` (10px). The Tailwind `rounded-*` scale cascades from it automatically via `@theme inline`:

| Utility | Value | Use |
|---|---|---|
| `rounded-sm` | `calc(0.625rem * 0.6)` = 4px | Tight chips |
| `rounded-md` | `calc(0.625rem * 0.8)` = 8px | Buttons, inputs, selects, menu items, tabs |
| `rounded-lg` | `= 0.625rem` = 10px | **Cards, dialogs** (default radius) |
| `rounded-xl` | `calc(0.625rem * 1.4)` = 14px | Textareas, occasional panels |
| `rounded-2xl` | `calc(0.625rem * 1.8)` = 18px | Avoid by default |
| `rounded-3xl` | `calc(0.625rem * 2.2)` = 22px | Avoid — pastel/soft signal |
| `rounded-full` | — | Pills, avatars, icon badges |

**Rule**: prefer `rounded-md` and `rounded-lg`. Avoid `rounded-2xl` / `rounded-3xl` / arbitrary `rounded-[Npx]` — they signal the soft pastel look we deliberately left behind.

---

## Spacing

Tailwind's default spacing scale (`--spacing(1)` = 4px, etc.). The `Card` primitive introduces a dedicated card-padding token:

| Token | Value | Used by |
|---|---|---|
| `--card-spacing` | `--spacing(4)` = 16px (default) / `--spacing(3)` = 12px (`size="sm"`) | `Card` (py), `CardHeader` (px), `CardContent` (px), `CardFooter` (p) |

**Card spacing rule** (enforced — previous "card design" user complaint was rooted in this): never override `Card` / `CardContent` padding with `py-6` / `p-4` / `p-6`. Let the primitive's `--card-spacing` system drive consistent rhythm across every card surface.

**Page rhythm**:
- Page outer container: `container mx-auto max-w-4xl px-4 py-8 md:py-12`
- Section header block: `mb-8`
- Card grid: `grid gap-4 md:grid-cols-3` (stats) or `md:grid-cols-2` (cards)
- Within-card gaps: grid `gap-1` (default in `CardHeader`), bump to `gap-2` only for cards with larger icon chips + text-xl titles.

---

## Component specs

All primitives live in `src/components/ui/`. Built on `@base-ui/react` (not Radix — data-slot naming and some attribute patterns differ from standard shadcn). Components are copy-paste owned; props and variants are stable; only className values may be edited.

### Button (`button.tsx`)
Base: `rounded-lg border border-transparent bg-clip-padding text-sm font-medium transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50`.

| Variant | Fill | Text | Hover | Use |
|---|---|---|---|---|
| `default` | `bg-primary` | `text-primary-foreground` | `hover:opacity-90` | **Primary CTAs** — flat solid emerald, no gradient |
| `outline` | `bg-background` + `border-border` | `text-foreground` | `hover:bg-muted` | Secondary actions |
| `secondary` | `bg-secondary` | `text-secondary-foreground` | `hover:color-mix(+5% foreground)` | Tertiary fills (neutral gray) |
| `ghost` | transparent | `text-foreground` | `hover:bg-muted` | Subtle / inline actions |
| `destructive` | `bg-destructive/10` | `text-destructive` | `hover:bg-destructive/20` | Delete / irreversible |
| `link` | transparent | `text-primary underline-offset-4` | `hover:underline` | Inline link |

Sizes: `default`(h-8), `xs`(h-6), `sm`(h-7), `lg`(h-9), `icon`(size-8), `icon-xs/sm/lg`.
Radius: `rounded-lg` default; `rounded-md` on `xs` / `sm` / `icon-xs` / `icon-sm`.

### Card (`card.tsx`)
Base: `rounded-lg border border-border bg-card text-card-foreground shadow-sm [--card-spacing:--spacing(4)] py-(--card-spacing)`.
- `CardHeader`: grid `auto-rows-min gap-1 px-(--card-spacing) rounded-t-lg`. Switches to `grid-cols-[1fr_auto]` when `CardAction` is present.
- `CardAction`: `col-start-2 row-span-2 row-start-1 self-start justify-self-end` — the correct slot for stat-card icon chips.
- `CardTitle`: `font-sans text-base font-medium leading-snug` (sans, NOT serif — fixed in this pass).
- `CardDescription`: `text-sm text-muted-foreground`.
- `CardContent`: `px-(--card-spacing)` — **no `py`**, no `p-4` / `p-6` override.
- `CardFooter`: `rounded-b-lg border-t bg-muted/50 p-(--card-spacing)`.
- `size="sm"` prop switches `--card-spacing` to `--spacing(3)` (12px) for denser cards.

### Badge (`badge.tsx`)
Base: `rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium` (pill-shape — only place `rounded-4xl` is allowed).
| Variant | Use |
|---|---|
| `default` | `bg-primary text-primary-foreground` — primary status |
| `secondary` | `bg-secondary text-secondary-foreground` — neutral pill |
| `outline` | `border-border text-foreground hover:bg-muted` — outlined pill |
| `destructive` | `bg-destructive/10 text-destructive` — error pill |
| `ghost` | transparent, `hover:bg-muted` |
| `link` | `text-primary underline-offset-4` |

The previous "featured" gradient variant has been removed — do not re-introduce.

### Input (`input.tsx`)
`h-8 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20`.

### Textarea (`textarea.tsx`)
`min-h-16 w-full rounded-xl border border-input bg-transparent px-2.5 py-2 field-sizing-content`. `rounded-xl` is intentional here — multi-line fields read better slightly looser than single-line inputs.

### Select (`select.tsx`)
Trigger: `rounded-md border border-input bg-transparent`. Content: `rounded-md border border-border bg-popover shadow-md`. Items: `rounded-md focus:bg-accent focus:text-accent-foreground`.

### Dialog (`dialog.tsx`)
Content: `rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-lg`. Overlay: `bg-black/10` with `supports-backdrop-filter:backdrop-blur-xs` (very subtle — not a glass effect, just slight motion blur on the backdrop).

### Sheet (`sheet.tsx`)
Side-anchored panels — no radius, edge to edge. `bg-popover text-popover-foreground shadow-lg`. Same `bg-black/10` overlay as Dialog.

### Tabs (`tabs.tsx`)
- `TabsList` variants: `default` (`bg-muted rounded-md p-[3px] text-muted-foreground`) or `line` (`bg-transparent gap-1`, underline-style).
- `TabsTrigger`: `rounded-md border border-transparent text-foreground/60 hover:text-foreground`. Active trigger via `border-ring` + `bg-background`. Don't override with `backdrop-blur` / translucent `bg-card/60` — we already dialed that back.

### Table (`table.tsx`)
Dense admin/Crud style. `border-b` rows, `hover:bg-muted/50` on `TableRow`, `bg-muted/50` on `TableFooter`. Head cells `h-10 px-2 text-left align-middle font-medium text-foreground`. Compact — do not add `py-4` overrides.

### DropdownMenu (`dropdown-menu.tsx`)
`rounded-md border border-border bg-popover p-1 shadow-md`. Items: `rounded-md px-1.5 py-1 focus:bg-accent focus:text-accent-foreground`. `destructive` variant item: `text-destructive focus:bg-destructive/10`.

### Avatar (`avatar.tsx`)
`rounded-full` — the one place full rounding is correct. Sizes: `default`(size-8), `sm`(size-6), `lg`(size-10). Fallback: `bg-muted text-muted-foreground`. Badge: `bg-primary text-primary-foreground ring-background`.

### Separator / Skeleton / Label
- `Separator`: `bg-border`, horizontal `h-px w-full` or vertical `w-px self-stretch`.
- `Skeleton`: `animate-pulse rounded-lg bg-muted`.
- `Label`: `flex items-center gap-2 text-sm font-medium`.

### Sonner (`sonner.tsx`)
Pure token-driven — reads `--popover` / `--popover-foreground` / `--border` / `--radius`. No hardcoded colors.

---

## Version & PWA colors

`next/font` loaded fonts (Manrope, Newsreader, Noto Naskh Arabic) in `src/app/layout.tsx` — do not modify the font loader. PWA `theme_color` and viewport `themeColor` are `#008151` (a legacy emerald value — broadly matches `--primary` oklch `oklch(0.45 0.1 162)` ≈ `#006644`; not pixel-perfect but close enough for the manifest, and not worth churn to re-sync).

---

## Anti-patterns (do not ship)

| Wrong | Why | Right |
|---|---|---|
| `bg-emerald-600` / `text-emerald-700` etc | Hardcodes a brand hue, fights tokens | `bg-primary` / `text-primary` |
| `bg-white` / `text-gray-900` / `dark:bg-gray-900` | Hardcodes neutrals | `bg-card` / `text-foreground` / dark inherits |
| `py-6` / `p-4` / `p-6` on Card / CardContent | Overrides the `--card-spacing` system | bare `<Card>` + `<CardContent>` (no padding className) |
| `space-y-0 pb-2` on stat-card `CardHeader` | Grid + `gap-1` already gives the right rhythm; the hack was a symptom of prior broken spacing | drop the hack; use `CardAction` for the icon chip |
| `font-heading` on default headings | Serif no longer the default for the app voice | `font-sans` / `font-bold tracking-tight` |
| `bg-gradient-brand` / `text-gradient-brand` in default UI | Gradients are not part of the sharp-minimal direction | flat `bg-primary` / `text-primary` / `text-foreground` |
| `backdrop-blur-xl` + `bg-background/80` glass header | We deleted all blur/glass — body is flat | `bg-background` solid |
| `rounded-2xl` / `rounded-3xl` / arbitrary `rounded-[Npx]` | Signals soft pastel — we deliberately tightened to `--radius: 0.625rem` | `rounded-lg` / `rounded-md` |
| `shadow-primary/20` glow tints | Tinted shadows read "candy" — sharp SaaS uses neutral shadows | `shadow-sm` / `shadow-md` / `hover:shadow-md` |
| Adding one-off CSS custom properties in component files | Breaks single source of truth | extend tokens in `globals.css` if genuinely missing |

---

## How to add a new component (agent checklist)

1. Read this doc end-to-end — especially "Quick rules" and "Anti-patterns".
2. Read `globals.css` `:root` + `.dark` blocks to confirm which tokens already exist.
3. Read at least 2 existing primitives in `src/components/ui/` for the className convention (recommend `button.tsx` + `card.tsx`).
4. Build with semantic tailwind classes (`bg-*`, `text-*`, `border-*`, `ring-*`, `rounded-*`) referencing our tokens — never raw hex or tailwind palette colors.
5. Verify with `tsc --noEmit` + `eslint src` — both must be clean before considering the task done.
6. If the component needs a new token, add it in `globals.css` `:root` AND `.dark`, and map it under `@theme inline` so Tailwind generates the `bg-*/text-*/border-*/ring-*` utilities for it.
7. Do not add new npm dependencies for things base-ui / lucide-react / sonner / framer-motion / next-themes already cover — check `package.json` first.

---

## File map

| Concern | File |
|---|---|
| Design tokens (light) | `src/app/globals.css` → `:root` block |
| Design tokens (dark) | `src/app/globals.css` → `.dark` block |
| Tailwind theme mapping | `src/app/globals.css` → `@theme inline` block |
| Base layer (body, headings, selection) | `src/app/globals.css` → `@layer base` block |
| Opt-in gradient utilities | `src/app/globals.css` → `@utility bg-gradient-brand` etc |
| shadcn/ui primitives | `src/components/ui/*.tsx` |
| Root layout + fonts + viewport themeColor | `src/app/layout.tsx` |
| PWA manifest + theme_color | `src/app/manifest.ts` |
| shadcn config (style/baseColor/aliases) | `components.json` |
| This document | `docs/design-system.md` |

---

## Recent design history (for context)

This app went through three passes in the current session — agents working on Yaumi UI should be aware of the trajectory so they don't regress:

1. **v1 (replaced)** soft pastel + emerald gradient + big serif headings + chunky radii (`--radius: 1.5rem`) + ambient radial body glows. User feedback: "I don't like it, it's not modern."
2. **v2 (current)** sharp minimal SaaS — neutral high-contrast palette, single desaturated emerald accent, `--radius: 0.625rem`, flat `bg-background`, sans headings, no gradients/blur. User feedback on cards: "card design I don't like it, change it to make it more modern, and fix the spacing."
3. **v2.1 (current, post-fix)** `CardTitle` serif→sans, removed `py-6`/`p-4`/`p-6` overrides across all card surfaces so the primitive's `--card-spacing` system actually controls padding. Stat-card `CardHeader` hacks (`space-y-0 pb-2`) replaced with the proper `CardAction` API for icon chips.

If a user complains the design "still isn't modern," **ask which specific element** (cards, spacing, type, buttons, colors) before doing another app-wide restyle — the last two iterations were expensive and the user's feedback has been element-specific each time.