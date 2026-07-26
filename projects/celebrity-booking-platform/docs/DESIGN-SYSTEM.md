# Aurum Design System

## Brand

**Aurum** — a luxury talent agency. Latin for gold; the register is a darkened theatre
with one warm light on the subject.

- **Voice** — assured, spare, never breathless. "The world's stage, on request."
- **Mark** — an eight-point light burst inside a hairline ring (`components/layout/logo.tsx`),
  rotating 45° on hover. The wordmark is Playfair Display at `0.28em` tracking.
- **Motif** — the spotlight: gradient beams in the hero, gold hairlines under section
  headings, a single accent that never competes with itself.

## Colour

All tokens are OKLCH for perceptually even steps, declared in `src/styles/globals.css`
and consumed through Tailwind v4's `@theme inline`. Dark is the default register; light
is a full second theme, not an inversion.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` / `--bg-deep` | `oklch(0.145 0.008 75)` / `0.115` | `oklch(0.972 …)` / `0.945` | Page and cinematic sections |
| `--surface` / `--surface-raised` | `0.185` / `0.225` | `0.99` / `1.0` | Cards, wells, hover states |
| `--foreground` | `oklch(0.955 0.012 85)` | `oklch(0.21 0.012 70)` | Body copy |
| `--muted` / `--faint` | `0.74` / `0.56` | `0.45` / `0.6` | Secondary copy, captions |
| `--gold` | `oklch(0.8 0.115 88)` | `oklch(0.58 0.125 78)` | **The only accent** |
| `--success` / `--warning` / `--danger` | `155` / `75` / `25` hue | darkened equivalents | Status only, never decoration |

**Rules.** Never pure black or pure white — every neutral is warm-tinted. Gold carries
identity, never bulk: it appears in kickers, one CTA per view, active states and data
marks. Status colours are reserved for state and always ship with a label, never colour
alone.

## Typography

| Role | Family | Notes |
|---|---|---|
| Display | Playfair Display Variable | Headlines, talent names, numerals in stat tiles |
| Text / UI | Inter Variable | Body, labels, tables, controls |

Both are self-hosted through `@fontsource-variable` — no external font requests.

The scale is fluid, clamped so it never collapses on mobile or runs away on ultra-wide:

```css
--text-display-xl: clamp(2.75rem, 1.4rem + 6vw, 6.5rem);   /* hero */
--text-display:    clamp(2.25rem, 1.3rem + 4vw, 4.5rem);   /* page titles */
--text-headline:   clamp(1.75rem, 1.2rem + 2.2vw, 3rem);   /* sections */
--text-title:      clamp(1.35rem, 1.1rem + 1vw, 1.875rem); /* cards */
```

Display type sets at `-0.02em` tracking with `1.02–1.1` leading; body runs `1.75–1.85`
for long-form. The `kicker` utility (`0.22em` uppercase gold) opens every section.

## Space, radius, elevation

Spacing follows Tailwind's 4px base; sections breathe at `py-28` on desktop. Radii run
`--radius-xs` 6px through `--radius-xl` 28px, with pill (`rounded-full`) reserved for
buttons and chips. Three shadows only — `--shadow-soft` (resting), `--shadow-lift`
(hover), `--shadow-glow` (gold-tinted, for focused/primary affordances).

## Signature surfaces

| Utility | What it does |
|---|---|
| `glass` | 20px backdrop blur + saturation, translucent surface, hairline border |
| `gold-text` | Animated gradient clipped to text for emphasis words |
| `hairline-gold` | Centre-weighted gold rule under a heading |
| `grain` | SVG turbulence overlay at 3–5% for cinematic sections |
| `kicker` | Uppercase gold section label |

## Motion

Durations 200–900ms on `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-out-expo`) — fast start,
long settle. Nothing bounces.

| Primitive | Behaviour |
|---|---|
| `Reveal` | Fade + 28px rise on scroll into view |
| `Stagger` / `StaggerItem` | 90ms cascade across a group |
| `TextReveal` | Line-by-line rise from behind a clip mask |
| `Magnetic` | Spring-tracked cursor attraction |
| `TiltCard` | 3D tilt with a specular sheen following the pointer |
| `Parallax` | Scroll-linked vertical drift |
| `CountUp` | Eased numeric animation on first view |

CSS keyframes cover the ambient layer: `spotlight-sweep`, `marquee`, `float`, `shimmer`,
`pulse-dot`, `scroll-cue`.

**Reduced motion is non-negotiable.** A global media query neutralises animation and
transition durations, and every motion component calls `useReducedMotion()` to skip its
initial state rather than merely speeding it up.

## Components

- **Primitives** — `Button` (5 variants × 4 sizes) and `ButtonLink`, `Badge`,
  `VerifiedSeal`, `Input`/`Textarea`/`Label`/`FieldError`/`FieldHint`, `Skeleton`,
  `Rating`, `AvailabilityDot`, `Avatar`, `Accordion`, `Tabs`, `Dialog`.
- **Composites** — `CelebrityCard` (portrait art, scrim, metadata band, gold underline
  wipe), `SearchBar` (debounced combobox with keyboard navigation),
  `AvailabilityCalendar` (read-only and editable), `BookingWizard`, `ChatThread`,
  `DashboardShell`, `StatTile`, `AreaChart`, `BarList`.

### Charts

Single-hue gold, 2px lines, recessive dashed grid, direct label on the latest point,
crosshair with tooltip on hover, and an `aria-label` that reads the full series. One
y-axis, always. Bar tracks are 2px-rounded and baseline-anchored.

## Generated artwork

`PortraitArt` and `BannerArt` deterministically compose per-subject SVG: a hue-shifted
ground, 3–5 spotlight beams, contour flow lines, an orbiting dashed ring, an oversized
serif monogram and a grain pass. A hash of the name seeds the PRNG, so a given person's
art is stable across renders and variants stay coherent. Every canvas is stamped
`AURUM · DEMO ARTWORK` so it can never be mistaken for a photograph.

## Accessibility floor

WCAG AA contrast on every text/background pair in both themes; visible `:focus-visible`
rings; a skip link; 44px minimum interactive targets on touch; labelled controls with
`role="alert"` errors; live regions for async state; and identity never carried by colour
alone.
