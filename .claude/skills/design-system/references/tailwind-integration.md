# Tailwind Integration — Andritz Precision

Map Andritz design system tokens to Tailwind CSS configuration with dark/light theme support.

## CSS Variables Setup

### Base Layer

```css
/* globals.css — Andritz Precision */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Surface Hierarchy (Light) */
    --surface: 210 11% 98%;                /* #f8fafb */
    --surface-container: 200 5% 93%;        /* #eceeef */
    --surface-container-low: 200 7% 95%;    /* #f2f4f5 */
    --surface-container-high: 200 5% 91%;   /* #e6e8e9 */
    --surface-container-highest: 200 4% 89%; /* #e1e3e4 */
    --surface-container-lowest: 0 0% 100%;  /* #ffffff */

    /* Primary (Andritz Blue) */
    --primary: 202 100% 37%;             /* #0075be */
    --primary-text: 204 100% 29%;        /* #005c97 */
    --primary-foreground: 0 0% 100%;     /* white */
    --primary-fixed-dim: 212 100% 81%;   /* #9bcaff */

    /* Text */
    --on-surface: 195 6% 10%;           /* #191c1d */
    --on-surface-variant: 218 12% 28%;  /* #404751 */

    /* Secondary & Tertiary */
    --secondary: 215 26% 39%;           /* #49607f */
    --tertiary: 210 15% 35%;            /* #4b5a69 */

    /* Error */
    --destructive: 0 76% 41%;           /* #ba1a1a */
    --destructive-foreground: 0 0% 100%;
    --error-container: 0 100% 92%;       /* #ffdad6 */

    /* Outline */
    --outline-variant: 217 16% 80%;     /* #c0c7d2 */

    /* Semantic aliases */
    --background: var(--surface);
    --foreground: var(--on-surface);
    --card: var(--surface-container-lowest);
    --card-foreground: var(--on-surface);
    --muted: var(--surface-container);
    --muted-foreground: var(--on-surface-variant);
    --border: 0 0% 0% / 0;   /* transparent — No-Line Rule */
    --input: var(--surface-container-highest);
    --ring: var(--primary);
    --radius: 0rem;           /* Industrial Precision — 0px */
  }

  .dark {
    /* Surface Hierarchy (Dark) */
    --surface: 218 32% 8%;                /* #10141a */
    --surface-container: 218 13% 13%;      /* #1c2026 */
    --surface-container-low: 218 17% 11%;  /* #181c22 */
    --surface-container-high: 220 11% 17%; /* #262a31 */
    --surface-container-highest: 218 9% 21%; /* #31353c */
    --surface-container-lowest: 218 32% 5%; /* #0a0e14 */

    /* Primary (inverted for dark) */
    --primary: 202 100% 37%;             /* #0075be containers */
    --primary-text: 212 100% 81%;        /* #9bcaff text */
    --primary-foreground: 0 0% 100%;

    /* Text */
    --on-surface: 225 19% 90%;           /* #dfe2eb */
    --on-surface-variant: 217 16% 80%;   /* #c0c7d2 */

    /* Tertiary (Caution Tape) */
    --tertiary: 27 100% 75%;             /* #ffb781 */

    /* Error */
    --destructive: 10 100% 84%;          /* #ffb4ab */
    --error-container: 0 100% 29%;

    /* Outline */
    --outline-variant: 218 12% 28%;      /* #404751 */

    /* Semantic aliases */
    --background: var(--surface);
    --foreground: var(--on-surface);
    --card: var(--surface-container);
    --card-foreground: var(--on-surface);
    --muted: var(--surface-container-high);
    --muted-foreground: var(--on-surface-variant);
    --border: 0 0% 0% / 0;
    --input: var(--surface-container-lowest);
    --ring: var(--primary-text);
  }
}
```

## Tailwind Config

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
        premium: ['Gilroy', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          container: 'hsl(var(--surface-container))',
          'container-low': 'hsl(var(--surface-container-low))',
          'container-high': 'hsl(var(--surface-container-high))',
          'container-highest': 'hsl(var(--surface-container-highest))',
          'container-lowest': 'hsl(var(--surface-container-lowest))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          text: 'hsl(var(--primary-text))',
          foreground: 'hsl(var(--primary-foreground))',
          'fixed-dim': 'hsl(var(--primary-fixed-dim))',
        },
        'on-surface': {
          DEFAULT: 'hsl(var(--on-surface))',
          variant: 'hsl(var(--on-surface-variant))',
        },
        secondary: 'hsl(var(--secondary))',
        tertiary: 'hsl(var(--tertiary))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        'error-container': 'hsl(var(--error-container))',
        'outline-variant': 'hsl(var(--outline-variant))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '9999px',  /* Only for avatars/status indicators */
      },
      spacing: {
        'zone': '2rem',      /* 32px zone separation */
        'section': '3rem',   /* 48px section gap */
        'hero': '8rem',      /* 128px hero breathing */
      },
      boxShadow: {
        'ambient-light': '0px 12px 32px 0px rgba(0, 28, 56, 0.06)',
        'ambient-dark': '0px 12px 32px 0px rgba(0, 28, 56, 0.4)',
        'glow-primary': '0px 0px 8px hsl(var(--primary-text))',
        'none': 'none',
      },
      backdropBlur: {
        'industrial': '20px',
      },
      letterSpacing: {
        'technical': '-0.02em',   /* headlines */
        'machined': '0.05em',     /* labels */
        'blueprint': '0.1em',     /* display pairs */
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
      },
    },
  },
  plugins: [],
}

export default config
```

## HSL Format Benefits

Using HSL without function allows opacity modifiers:

```tsx
// With HSL format (space-separated)
<div className="bg-primary/50">                    // 50% opacity
<div className="bg-surface-container-lowest/85">   // Industrial Frost

// CSS output
background-color: hsl(202 100% 37% / 0.5);
```

## Component Classes

### Andritz Button Styles

```css
@layer components {
  .btn {
    @apply inline-flex items-center justify-center
           rounded-none font-medium uppercase
           tracking-machined
           transition-all duration-fast
           focus-visible:outline-none
           disabled:pointer-events-none disabled:opacity-50;
  }

  .btn-primary {
    background: linear-gradient(135deg, hsl(var(--primary-text)), hsl(var(--primary)));
    @apply text-primary-foreground px-6 py-2;
  }

  .btn-primary:active {
    @apply scale-[0.98];
  }

  .btn-secondary {
    @apply bg-surface-container-high text-primary-text px-6 py-2;
  }

  .btn-secondary:hover {
    @apply bg-surface-container-highest;
  }

  .btn-tertiary {
    @apply bg-transparent text-primary-text uppercase px-2 py-2
           border-b-2 border-transparent;
  }

  .btn-tertiary:hover {
    @apply border-b-primary;
  }

  .btn-destructive {
    @apply bg-destructive text-destructive-foreground px-6 py-2;
  }

  /* Sizes */
  .btn-sm { @apply h-8 px-4 text-xs; }
  .btn-md { @apply h-10 px-6 text-xs; }
  .btn-lg { @apply h-12 px-8 text-sm; }
}
```

### Andritz Input Styles

```css
@layer components {
  .input-andritz {
    @apply bg-surface-container-highest text-on-surface
           rounded-none border-0 border-b-2 border-b-transparent
           px-4 py-2 text-sm
           focus:outline-none focus:border-b-primary
           transition-colors duration-fast;
  }

  .input-andritz.error {
    @apply bg-error-container border-b-destructive;
  }
}
```

### Andritz Card Styles

```css
@layer components {
  .card-andritz {
    @apply bg-surface-container-lowest rounded-none p-6;
    /* No border — No-Line Rule */
  }

  .card-andritz-elevated {
    @apply bg-surface-container-lowest rounded-none p-6 shadow-ambient-light;
  }

  .dark .card-andritz-elevated {
    @apply shadow-ambient-dark;
  }

  .card-zone {
    @apply bg-surface-container rounded-none p-6;
  }
}
```

### Ghost Border Utility

```css
@layer utilities {
  .ghost-border {
    border: 1px solid hsl(var(--outline-variant) / 0.15);
  }

  .dark .ghost-border {
    border: 1px solid hsl(var(--outline-variant) / 0.20);
  }
}
```

## Spacing Integration

```typescript
// tailwind.config.ts — additional spacing tokens
theme: {
  extend: {
    spacing: {
      'zone': '2rem',       // 32px — data zone separation
      'section': '3rem',    // 48px — section gap
      'section-lg': '4rem', // 64px
      'hero': '8rem',       // 128px — hero breathing room
    }
  }
}
```

## Dark Mode Toggle

```typescript
// Toggle dark mode
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark')
}

// System preference detection
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark')
}
```

## shadcn/ui Alignment

This configuration aligns with shadcn/ui conventions with Andritz overrides:

- Same CSS variable pattern (HSL format)
- All border-radius overridden to 0px
- Surface hierarchy replaces simple background/card
- No-Line Rule enforced (border: transparent)
- Compatible with `npx shadcn@latest add` commands

### Using with shadcn/ui

```bash
# Initialize (uses same token structure)
npx shadcn@latest init

# Add components (styled with Andritz tokens)
npx shadcn@latest add button card input dialog table
```

Components will automatically use Andritz tokens. The Tailwind config enforces 0px radius everywhere.
