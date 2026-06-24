# Andritz Design System - Implementation Plan

> Created: 2026-04-15
> Status: In Progress
> Scope: Replace generic design-system skill content with Andritz-specific tokens and specs

## Context

The `docs/refs/` directory contains comprehensive reference files for the "Andritz Precision" industrial design system — a complete Material Design token-based system with dark/light theme variants. The creative north star is "The Monolithic Engine": industrial precision, structural depth, monolithic presence.

The existing `.claude/skills/design-system/` skill contains generic design system references (standard blue/gray Tailwind tokens). This plan replaces ALL generic content with Andritz-specific tokens and specs, so the skill becomes exclusively the Andritz Design System.

## Key Andritz Design Principles

- **0px border-radius** — no rounded corners ("Industrial Precision")
- **No-Line Rule** — no 1px borders for sectioning; use tonal shifts only
- **Glass & Gradient Rule** — gradient CTAs (primary→primary-container at 135°), glassmorphic overlays (85% opacity + 20px backdrop-blur)
- **Tonal Layering** — depth via surface stacking, not shadows
- **Typography** — Inter (primary), Gilroy (premium), "Blueprint Scale" with tight tracking
- **Ambient Shadows** — `0px 12px 32px 0px` at 6% (light) / 40% (dark) opacity, tinted navy

## Color Palettes

### Light Theme
| Token | Value | Usage |
|-------|-------|-------|
| surface | #f8fafb | Application floor |
| surface-container | #eceeef | Primary content regions |
| surface-container-low | #f2f4f5 | Sidebar/secondary sections |
| surface-container-high | #e6e8e9 | Interactive surfaces |
| surface-container-highest | #e1e3e4 | Prominent highlights |
| surface-container-lowest | #ffffff | Cards/modules for "pop" |
| primary (action) | #0075be | CTA containers |
| primary (text) | #005c97 | Text/iconography |
| primary-fixed-dim | #9bcaff | Light blue text/icons |
| on-surface | #191c1d | Primary text |
| on-surface-variant | #404751 | Secondary data |
| secondary | #49607f | Secondary accent |
| tertiary | #4b5a69 | Tertiary accent |
| error | #ba1a1a | Error states |
| error-container | #ffdad6 | Error backgrounds |
| outline-variant | #c0c7d2 | Ghost border (15% opacity) |

### Dark Theme
| Token | Value | Usage |
|-------|-------|-------|
| surface | #10141a | Application void |
| surface-container | #1c2026 | Primary content |
| surface-container-low | #181c22 | Secondary sections |
| surface-container-high | #262a31 | Interactive surfaces |
| surface-container-highest | #31353c | Prominent highlights |
| surface-container-lowest | #0a0e14 | Deepest recesses |
| primary (text) | #9bcaff | Text/iconography |
| primary-container | #0075be | Action containers |
| on-surface | #dfe2eb | Primary text |
| on-surface-variant | #c0c7d2 | Secondary data |
| tertiary | #ffb781 | Warning/caution |
| error | #ffb4ab | Error states |
| outline-variant | #404751 | Ghost border (20% opacity) |
| on-secondary-fixed | #001c38 | Deepest black (replaces #000000) |

## Typography Scale (Blueprint Scale)
| Level | Size | Weight | Tracking | Usage |
|-------|------|--------|----------|-------|
| Display L | 3.5rem | Bold | normal | Massive KPIs |
| Display M | 2.75rem | Bold | normal | Section headers |
| Display S | 2.25rem | Bold | normal | Sub-headers |
| Headline L | 2rem | SemiBold | -0.02em | Structural beams |
| Headline M | 1.75rem | SemiBold | -0.02em | Card headers |
| Headline S | 1.5rem | SemiBold | -0.02em | Sub-sections |
| Title L | 1.375rem | Medium | normal | Navigation |
| Title M | 1.125rem | Medium | normal | Card headers |
| Title S | 1rem | Medium | normal | List items |
| Body L | 1rem | Regular | normal | Content |
| Body M | 0.875rem | Regular | normal | Data |
| Body S | 0.75rem | Regular | normal | Dense data |
| Label M/S | 0.75rem | Medium | +0.05em | ALL CAPS buttons/tags |

## Work Units (10 parallel tasks)

1. **SKILL.md** — Rebrand to Andritz Design System
2. **references/design-philosophy.md** — NEW: Creative North Star ("The Monolithic Engine")
3. **references/token-architecture.md** — Andritz Three-Layer Architecture
4. **references/primitive-tokens.md** — Andritz Raw Values
5. **references/semantic-tokens.md** — Andritz Purpose Aliases (light + dark)
6. **references/component-tokens.md** — Andritz Component Tokens
7. **references/component-specs.md** — Andritz Component Specifications
8. **references/states-and-variants.md** — Andritz States & Interactions
9. **references/tailwind-integration.md** — Andritz Tailwind Config
10. **templates/design-tokens-starter.json** — Andritz Token Starter JSON

## Do's and Don'ts

### Do
- Use extreme whitespace — industrial sites are massive
- Use ALL CAPS for labels and small UI elements
- Align text to strict baseline grid
- Allow "Hero" elements to break 8px grid slightly
- Use on-surface-variant for metadata

### Don't
- NEVER use border-radius (0px only)
- NEVER use pure black (#000000) — use on-secondary-fixed (#001c38)
- NEVER use decorative icons — must accompany functional action
- NEVER use 1px solid borders for sectioning
- NEVER use divider lines — use 24px+ empty space
- NEVER use 100% opaque white borders
- NEVER shrink text on data-heavy screens — expand the canvas
