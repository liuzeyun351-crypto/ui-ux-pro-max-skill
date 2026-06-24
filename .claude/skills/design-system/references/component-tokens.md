# Component Tokens — Andritz Precision

Component-specific tokens referencing semantic layer. All components enforce 0px radius and the No-Line Rule.

## Button Tokens

```css
:root {
  /* Primary — Gradient fill, industrial weight */
  --button-bg: linear-gradient(135deg, var(--color-primary-text), var(--color-primary));
  --button-fg: var(--color-on-primary);
  --button-hover-bg: linear-gradient(135deg, var(--andritz-blue-700), var(--andritz-blue-600));
  --button-active-scale: 0.98;

  /* Secondary — Surface tier, no border */
  --button-secondary-bg: var(--color-surface-container-high);
  --button-secondary-fg: var(--color-primary-text);
  --button-secondary-hover-bg: var(--color-surface-container-highest);

  /* Tertiary — Text only, capitalized, underline hover */
  --button-tertiary-bg: transparent;
  --button-tertiary-fg: var(--color-primary-text);
  --button-tertiary-hover-decoration: 2px solid var(--color-primary);

  /* Destructive */
  --button-destructive-bg: var(--color-error);
  --button-destructive-fg: var(--color-on-error);

  /* Sizing — heavy horizontal padding */
  --button-padding-x: var(--space-6);       /* 24px */
  --button-padding-y: var(--space-2);       /* 8px */
  --button-padding-x-sm: var(--space-4);    /* 16px */
  --button-padding-y-sm: var(--space-1-5);  /* 6px */
  --button-padding-x-lg: var(--space-8);    /* 32px */
  --button-padding-y-lg: var(--space-3);    /* 12px */

  /* Shape — Industrial Precision */
  --button-radius: 0px;
  --button-font-size: var(--font-size-label-md);
  --button-font-weight: var(--font-weight-medium);
  --button-text-transform: uppercase;
  --button-letter-spacing: var(--tracking-wide);  /* +0.05em */
}
```

## Input Tokens

```css
:root {
  /* Background — inset surface tier */
  --input-bg: var(--color-surface-container-highest);
  --input-border: none;  /* No-Line Rule */
  --input-fg: var(--color-on-surface);

  /* Placeholder */
  --input-placeholder: var(--color-on-surface-variant);

  /* Focus — bottom-border only (ledger/technical form style) */
  --input-focus-border: none;
  --input-focus-border-bottom: 2px solid var(--color-primary);
  --input-focus-ring: none;  /* No ring — bottom border only */

  /* Error */
  --input-error-bg: var(--color-error-container);
  --input-error-fg: var(--color-on-error-container);
  --input-error-border-bottom: 2px solid var(--color-error);

  /* Disabled */
  --input-disabled-bg: var(--color-surface-container);
  --input-disabled-fg: var(--color-on-surface-variant);

  /* Sizing */
  --input-padding-x: var(--space-4);
  --input-padding-y: var(--space-2);
  --input-radius: 0px;
  --input-font-size: var(--font-size-body-md);
}
```

## Card Tokens

```css
:root {
  /* Background — elevated surface for "pop" */
  --card-bg: var(--color-surface-container-lowest);
  --card-fg: var(--color-on-surface);
  --card-border: none;  /* No-Line Rule — no borders */

  /* Shadow — ambient only, when card must float */
  --card-shadow: none;  /* default: no shadow, use tonal stacking */
  --card-shadow-elevated: var(--shadow-ambient-light);

  /* Spacing — generous internal whitespace */
  --card-padding: var(--space-6);       /* 24px */
  --card-padding-sm: var(--space-4);    /* 16px */
  --card-gap: var(--space-4);           /* 16px */
  --card-zone-gap: var(--space-8);      /* 32px — between data zones */

  /* Shape */
  --card-radius: 0px;
}

.dark {
  --card-bg: var(--color-surface-container);
  --card-shadow-elevated: var(--shadow-ambient-dark);
}
```

## Badge/Chip Tokens

```css
:root {
  /* Default */
  --badge-bg: var(--color-primary);
  --badge-fg: var(--color-on-primary);

  /* Secondary — minimalist */
  --badge-secondary-bg: var(--color-secondary-container);
  --badge-secondary-fg: var(--color-on-surface);

  /* Status */
  --badge-warning-bg: var(--color-tertiary-500);
  --badge-warning-fg: var(--neutral-950);
  --badge-error-bg: var(--color-error);
  --badge-error-fg: var(--color-on-error);
  --badge-success-bg: var(--color-success-600);
  --badge-success-fg: #ffffff;

  /* Sizing */
  --badge-padding-x: var(--space-2);
  --badge-padding-y: var(--space-0-5);
  --badge-radius: 0px;  /* Sharp corners */
  --badge-font-size: var(--font-size-label-sm);
  --badge-text-transform: uppercase;
  --badge-letter-spacing: var(--tracking-wide);
}
```

## Alert Tokens

```css
:root {
  --alert-bg: var(--color-surface-container);
  --alert-fg: var(--color-on-surface);
  --alert-border: none;  /* No-Line Rule */

  --alert-destructive-bg: var(--color-error-container);
  --alert-destructive-fg: var(--color-on-error-container);

  --alert-warning-bg: rgba(255, 183, 129, 0.15);  /* tertiary at 15% */
  --alert-warning-fg: var(--color-tertiary);

  --alert-padding: var(--space-4);
  --alert-radius: 0px;
}
```

## Dialog/Modal Tokens

```css
:root {
  /* Overlay — Industrial Frost (Glassmorphism) */
  --dialog-overlay-bg: rgba(0, 28, 56, 0.5);  /* navy-tinted, not pure black */

  /* Content — Glassmorphic surface */
  --dialog-bg: var(--color-surface-container-lowest);
  --dialog-fg: var(--color-on-surface);
  --dialog-border: none;  /* No-Line Rule */
  --dialog-shadow: var(--shadow-ambient-light);
  --dialog-backdrop-blur: 20px;  /* Industrial Frost */
  --dialog-surface-opacity: 0.85;  /* 85% opacity for frost effect */

  /* Spacing */
  --dialog-padding: var(--space-6);
  --dialog-radius: 0px;
  --dialog-max-width: 32rem;
}

.dark {
  --dialog-overlay-bg: rgba(0, 10, 20, 0.7);
  --dialog-shadow: var(--shadow-ambient-dark);
}
```

## Table Tokens

```css
:root {
  /* Header */
  --table-header-bg: var(--color-surface-container);
  --table-header-fg: var(--color-on-surface-variant);
  --table-header-font: var(--font-size-label-md);
  --table-header-transform: uppercase;
  --table-header-tracking: var(--tracking-wide);

  /* Body */
  --table-row-bg: var(--color-surface);
  --table-row-hover-bg: var(--color-surface-container-low);
  --table-row-fg: var(--color-on-surface);

  /* Border — NO divider lines */
  --table-border: none;
  --table-row-separator: var(--space-8);  /* 32px whitespace OR tonal shift */

  /* Spacing */
  --table-cell-padding-x: var(--space-4);
  --table-cell-padding-y: var(--space-3);
}
```

## Navigation Tokens

```css
:root {
  /* Floating Nav — Industrial Frost */
  --nav-bg: rgba(248, 250, 251, 0.85);  /* surface at 85% */
  --nav-backdrop-blur: 20px;
  --nav-fg: var(--color-on-surface);

  /* Active indicator */
  --nav-active-indicator: 2px solid var(--color-primary);
  --nav-active-fg: var(--color-primary-text);

  /* Sidebar */
  --nav-sidebar-bg: var(--color-surface-container-low);
  --nav-sidebar-active-bg: var(--color-surface-container-high);
}

.dark {
  --nav-bg: rgba(16, 20, 26, 0.85);  /* dark surface at 85% */
}
```

## Usage Example

```css
.button-primary {
  background: var(--button-bg);
  color: var(--button-fg);
  padding: var(--button-padding-y) var(--button-padding-x);
  border-radius: var(--button-radius);  /* 0px */
  border: none;  /* No-Line Rule */
  font-size: var(--button-font-size);
  font-weight: var(--button-font-weight);
  text-transform: var(--button-text-transform);
  letter-spacing: var(--button-letter-spacing);
  transition: background var(--duration-fast), transform var(--duration-fast);
}

.button-primary:active {
  transform: scale(var(--button-active-scale));  /* 0.98 press */
}

.button-tertiary:hover {
  border-bottom: var(--button-tertiary-hover-decoration);
}
```
