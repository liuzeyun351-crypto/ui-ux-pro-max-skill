# Token Architecture — Andritz Precision

Three-layer token system for the Andritz industrial design system with dark/light theme support.

## Layer Overview

```
┌─────────────────────────────────────────┐
│  Component Tokens                       │  Andritz component overrides
│  --button-bg, --card-bg, --input-bg     │
├─────────────────────────────────────────┤
│  Semantic Tokens                        │  Surface hierarchy + purpose aliases
│  --color-surface, --color-primary       │
├─────────────────────────────────────────┤
│  Primitive Tokens                       │  Andritz raw values
│  --andritz-blue-500, --surface-low      │
└─────────────────────────────────────────┘
```

## Why Three Layers?

| Layer | Purpose | When to Change |
|-------|---------|----------------|
| Primitive | Andritz brand values (blues, surfaces, neutrals) | Rarely — foundational |
| Semantic | Surface hierarchy + purpose aliases | Theme switching (light/dark) |
| Component | Industrial component customization | Per-component needs |

## Layer 1: Primitive Tokens

Raw Andritz design values without semantic meaning.

```css
:root {
  /* Andritz Blue Scale */
  --andritz-blue-900: #001c38;
  --andritz-blue-700: #004a77;
  --andritz-blue-600: #005c97;
  --andritz-blue-500: #0075be;
  --andritz-blue-300: #9bcaff;
  --andritz-blue-200: #c6dfff;

  /* Surface Scale (Light) */
  --surface-lowest:  #ffffff;
  --surface-low:     #f8fafb;
  --surface-base:    #f2f4f5;
  --surface-mid:     #eceeef;
  --surface-high:    #e6e8e9;
  --surface-highest: #e1e3e4;

  /* Neutral Scale */
  --neutral-950: #001c38;  /* deepest black — never use pure #000000 */
  --neutral-900: #191c1d;
  --neutral-700: #404751;
  --neutral-300: #c0c7d2;
  --neutral-200: #dfe2eb;

  /* Spacing (8px grid, extreme whitespace) */
  --space-2: 0.5rem;    /* 8px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px — zone separation */

  /* Typography */
  --font-family-primary: 'Inter', system-ui, sans-serif;
  --font-size-display-lg: 3.5rem;
  --font-size-label-md: 0.75rem;

  /* Radius — Industrial Precision: 0px */
  --radius-none: 0;
  --radius-full: 9999px;

  /* Shadow — Ambient only */
  --shadow-ambient-light: 0px 12px 32px 0px rgba(0, 28, 56, 0.06);
  --shadow-ambient-dark:  0px 12px 32px 0px rgba(0, 28, 56, 0.4);
}
```

## Layer 2: Semantic Tokens

Purpose-based aliases that reference primitives. The surface hierarchy creates depth through tonal stacking.

```css
:root {
  /* Surface Hierarchy — "Machined Plates" */
  --color-surface:                   var(--surface-low);      /* #f8fafb */
  --color-surface-container:         var(--surface-mid);      /* #eceeef */
  --color-surface-container-low:     var(--surface-base);     /* #f2f4f5 */
  --color-surface-container-high:    var(--surface-high);     /* #e6e8e9 */
  --color-surface-container-highest: var(--surface-highest);  /* #e1e3e4 */
  --color-surface-container-lowest:  var(--surface-lowest);   /* #ffffff */

  /* Primary (Andritz Blue) */
  --color-primary:      var(--andritz-blue-500);  /* #0075be — action containers */
  --color-primary-text: var(--andritz-blue-600);  /* #005c97 — text/iconography */
  --color-on-primary:   #ffffff;

  /* Text */
  --color-on-surface:         var(--neutral-900);  /* #191c1d */
  --color-on-surface-variant: var(--neutral-700);  /* #404751 */

  /* Outline (Ghost Border) */
  --color-outline-variant: var(--neutral-300);  /* at 15% opacity */

  /* Border */
  --color-border: transparent;  /* No-Line Rule */

  /* Spacing */
  --spacing-component: var(--space-4);    /* 16px */
  --spacing-zone:      var(--space-8);    /* 32px zone separation */
  --spacing-section:   var(--space-12);   /* 48px */
}
```

## Layer 3: Component Tokens

Component-specific tokens referencing semantic layer.

```css
:root {
  /* Button — Gradient CTA, 0px radius */
  --button-bg: linear-gradient(135deg, var(--color-primary-text), var(--color-primary));
  --button-fg: var(--color-on-primary);
  --button-radius: 0px;
  --button-padding-x: var(--space-6);  /* 24px — heavy horizontal */
  --button-active-scale: 0.98;

  /* Input — Bottom-border focus, ledger style */
  --input-bg: var(--color-surface-container-highest);
  --input-focus-border: 2px solid var(--color-primary);  /* bottom only */
  --input-radius: 0px;

  /* Card — Elevated surface, no borders */
  --card-bg: var(--color-surface-container-lowest);
  --card-border: none;  /* No-Line Rule */
  --card-radius: 0px;
  --card-shadow: none;  /* tonal stacking, not shadows */
}
```

## Dark Mode

Override semantic tokens for Andritz dark theme:

```css
.dark {
  /* Surface Hierarchy — "The Void" */
  --color-surface:                   #10141a;
  --color-surface-container:         #1c2026;
  --color-surface-container-low:     #181c22;
  --color-surface-container-high:    #262a31;
  --color-surface-container-highest: #31353c;
  --color-surface-container-lowest:  #0a0e14;

  /* Primary (inverted for dark) */
  --color-primary:      #0075be;  /* action containers */
  --color-primary-text: #9bcaff;  /* text/iconography */

  /* Text */
  --color-on-surface:         #dfe2eb;
  --color-on-surface-variant: #c0c7d2;

  /* Tertiary (Warning — "caution tape") */
  --color-tertiary: #ffb781;

  /* Ghost Border — 20% in dark */
  --color-outline-variant: #404751;
}
```

## Naming Convention

```
--{scope}-{token}-{variant}-{state}

Examples:
--andritz-blue-600          # primitive color
--color-surface-container   # semantic surface
--button-bg                 # component property
--input-focus-border        # component-state
```

## Categories

| Category | Examples |
|----------|----------|
| andritz-blue | 900, 700, 600, 500, 300, 200 |
| surface | lowest, low, base, mid, high, highest |
| neutral | 950, 900, 700, 300, 200 |
| space | 2, 4, 6, 8, 12, 16, 20, 32 (8px grid) |
| radius | none (0px), full (9999px) — no others |
| shadow | ambient-light, ambient-dark, glow-primary |
| duration | fast (150ms), normal (200ms), slow (300ms) |

## File Organization

```
tokens/
├── primitives.css     # Andritz blue, surface, neutral scales
├── semantic.css       # Surface hierarchy, purpose aliases
├── components.css     # Industrial component tokens
└── index.css          # Imports all layers
```

Or single file with layer comments:

```css
/* === ANDRITZ PRIMITIVES === */
:root { ... }

/* === SEMANTIC (Light) === */
:root { ... }

/* === COMPONENTS === */
:root { ... }

/* === DARK MODE === */
.dark { ... }
```

## W3C DTCG Alignment

Token JSON format (W3C Design Tokens Community Group):

```json
{
  "color": {
    "andritz-blue": {
      "500": {
        "$value": "#0075be",
        "$type": "color"
      }
    }
  }
}
```
