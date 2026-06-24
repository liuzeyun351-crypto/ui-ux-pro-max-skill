# Andritz Brand Guidelines

## Brand Identity

**Andritz** is a global technology group providing plants, equipment, and services for various industries. The digital design system reflects the brand's core values: **precision engineering**, **industrial authority**, and **reliable performance**.

### Creative North Star: "The Monolithic Engine"

> UI as a high-performance machine — solid, authoritative, deeply layered. Every surface is a machined plate. Every interaction is a precision mechanism.

## Brand Voice

| Attribute | Description |
|-----------|-------------|
| **Authoritative** | Speak with confidence and technical clarity |
| **Precise** | No ambiguity, no decoration for decoration's sake |
| **Professional** | Industrial-grade communication — clear, structured, direct |
| **Trustworthy** | Consistency breeds trust — uniform language across all touchpoints |

### Writing Style

- Use **active voice** and direct language
- Lead with **data and results**, not adjectives
- Technical terms are preferred over marketing jargon
- Labels and badges: **ALL CAPS** with wide tracking (+0.05em)
- Units always accompany values: "450 kg/h", "2,847 UNITS PROCESSED"

## Brand Colors

### Primary — Andritz Blue

The Andritz Blue is the signature brand color, used for primary actions, key indicators, and brand identification.

| Token | Hex | Usage |
|-------|-----|-------|
| andritz-blue-900 | `#001c38` | Deepest navy (replaces pure black) |
| andritz-blue-800 | `#003258` | Dark backgrounds, overlays |
| andritz-blue-700 | `#004a77` | Hover states on primary |
| andritz-blue-600 | `#005c97` | Text on light backgrounds |
| **andritz-blue-500** | **`#0075be`** | **Primary brand color — CTAs, containers** |
| andritz-blue-400 | `#4d9fd4` | Secondary highlights |
| andritz-blue-300 | `#9bcaff` | Primary text on dark backgrounds, glow effects |
| andritz-blue-200 | `#c6dfff` | Light tints, backgrounds |
| andritz-blue-100 | `#e0efff` | Subtle highlights |
| andritz-blue-50 | `#f0f7ff` | Lightest tint |

### Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| neutral-950 | `#001c38` | Deepest text (navy-black, not pure black) |
| neutral-900 | `#191c1d` | Primary text (light theme) |
| neutral-700 | `#404751` | Secondary text, labels |
| neutral-600 | `#49607f` | Tertiary text |
| neutral-300 | `#c0c7d2` | Outline variants (light) |
| neutral-200 | `#dfe2eb` | Primary text (dark theme) |
| neutral-100 | `#eef1f6` | Subtle backgrounds |
| neutral-50 | `#f5f7fa` | Near-white |

### Status Colors

| Status | Color | Hex | Usage |
|--------|-------|-----|-------|
| Error | Red | `#ba1a1a` | Critical alerts, destructive actions |
| Error container | Light red | `#ffdad6` | Error background |
| Warning | Amber | `#ffb781` | Caution tape — high contrast on dark |
| Success | Green | `#1a8a4a` | Positive confirmation |

### Surface Hierarchy

#### Light Theme

| Tier | Hex | Role |
|------|-----|------|
| lowest | `#ffffff` | Cards, popovers (highest elevation) |
| low | `#f8fafb` | Page background |
| base | `#f2f4f5` | Container-low |
| mid | `#eceeef` | Container default |
| high | `#e6e8e9` | Secondary button bg, container-high |
| highest | `#e1e3e4` | Input background, container-highest |

#### Dark Theme

| Tier | Hex | Role |
|------|-----|------|
| lowest | `#0a0e14` | Deepest dark background |
| low | `#10141a` | Page background |
| base | `#181c22` | Container-low |
| mid | `#1c2026` | Container default |
| high | `#262a31` | Container-high |
| highest | `#31353c` | Container-highest |

## Typography

### Font Stack

| Role | Font | Fallback |
|------|------|----------|
| Primary | Inter | system-ui, -apple-system, sans-serif |
| Premium | Gilroy | Inter, system-ui, sans-serif |

### Type Scale

| Level | Size | Weight | Use |
|-------|------|--------|-----|
| display-lg | 3.5rem (56px) | Bold | Hero metrics, KPIs |
| display-md | 2.75rem (44px) | Bold | Section heroes |
| display-sm | 2.25rem (36px) | Bold | Card headlines |
| headline-lg | 2rem (32px) | Semibold | Page titles |
| headline-md | 1.75rem (28px) | Semibold | Section titles |
| headline-sm | 1.5rem (24px) | Semibold | Sub-sections |
| title-lg | 1.375rem (22px) | Medium | Card titles |
| title-md | 1.125rem (18px) | Medium | Sub-titles |
| title-sm | 1rem (16px) | Medium | Data values |
| body-lg | 1rem (16px) | Regular | Body text |
| body-md | 0.875rem (14px) | Regular | Default body |
| body-sm | 0.75rem (12px) | Regular | Captions |
| label-md | 0.75rem (12px) | Medium | Labels (ALL CAPS) |
| label-sm | 0.6875rem (11px) | Medium | Small labels (ALL CAPS) |

### Letter Spacing

| Name | Value | Usage |
|------|-------|-------|
| tight | -0.02em | Headlines — technical manual feel |
| normal | 0 | Body text |
| wide | +0.05em | Labels, buttons — machined look |
| wider | +0.1em | Display pairs — engineering drawing |

## Visual Rules

### 1. Industrial Precision — 0px Border Radius

All components use `border-radius: 0px`. No rounded corners. The only exception is `border-radius: 9999px` for avatars and status dot indicators.

### 2. The No-Line Rule

Never use `1px solid` borders for sectioning or containment. Create visual separation through:
- **Tonal shifts** (surface hierarchy stepping)
- **Whitespace** (32px zone gaps)
- **Ghost borders** (outline-variant at 15%/20% opacity — only when required)

### 3. Glass & Gradient Rule

- **Primary buttons**: `linear-gradient(135deg, #005c97, #0075be)` — gradient CTAs
- **Overlays**: Surface at 85% opacity + 20px backdrop-blur — "Industrial Frost"
- **Ambient shadows**: `0px 12px 32px 0px rgba(0, 28, 56, 0.06)` — navy-tinted, never pure black

### 4. Data Presentation

- Primary metric: `display-lg` (56px) — "stamped metal" effect
- Unit label below: `label-sm` (ALL CAPS, +0.05em tracking)
- Example: **2,847** / TOTAL UNITS PROCESSED
- Always right-align numbers, left-align text

### 5. Dark Theme Specifics

- Text accent: `#9bcaff` (andritz-blue-300) — not white-on-blue
- Warning: `#ffb781` (tertiary) — "caution tape" high contrast on navy
- Pulse line glow: `0px 0px 8px #9bcaff` — for active data highlights
- Ghost border opacity increases from 15% to 20%

## Logo Usage

- Maintain clear space equal to the height of the "A" in ANDRITZ
- Minimum size: 24px height for digital
- On dark backgrounds: use white or andritz-blue-300 (#9bcaff) logo variant
- On light backgrounds: use andritz-blue-900 (#001c38) logo variant
- Never rotate, stretch, or add effects to the logo

## Do's and Don'ts

### Do
- Use tonal layering for depth
- Apply 0px radius everywhere
- Use gradients for primary CTAs only
- Use ALL CAPS with wide tracking for labels
- Present data with generous whitespace (32px+ gaps)
- Use navy-tinted shadows, never pure black

### Don't
- Use rounded corners (not even "slightly rounded")
- Use 1px borders for sectioning
- Use pure black (#000000) — use neutral-950 (#001c38) instead
- Add decorative icons without functional purpose
- Use flat opacity for disabled states — use muted surface tiers
- Mix brand colors outside the defined palette
- Use shadows with pure-black opacity values
