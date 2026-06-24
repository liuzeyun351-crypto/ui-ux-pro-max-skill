---
name: andritz-design-system
description: Andritz Precision industrial design system with dark/light theme variants. Three-layer token architecture (primitive→semantic→component), Material Design surface hierarchy, sharp 0px corners, tonal layering, industrial component specifications, and slide generation.
argument-hint: "[component or token]"
license: MIT
metadata:
  author: claudekit
  version: "2.0.0"
---

# Andritz Design System

Industrial precision design system based on the **"Monolithic Engine"** creative north star — solid, authoritative, deeply layered. Supports dark/light theme variants via Material Design surface hierarchy.

## When to Use

- Andritz-branded UI development
- Industrial dashboard and command center design
- Dark/light theme implementation via surface hierarchy
- Material Design token systems with tonal layering
- Sharp-corner (0px radius) component systems
- Data-heavy layouts with zone-based organization
- **Slide/presentation generation**

## Andritz Key Colors

### Light Theme
- Surface: `#f8fafb` | Primary: `#0075be` / `#005c97` | On-surface: `#191c1d`

### Dark Theme
- Surface: `#10141a` | Primary: `#9bcaff` / `#0075be` | On-surface: `#dfe2eb`

## Token Architecture

Load: `references/token-architecture.md`

### Three-Layer Structure

```
Primitive (Andritz raw values)
       ↓
Semantic (surface hierarchy + purpose aliases)
       ↓
Component (industrial component tokens)
```

**Example:**
```css
/* Primitive */
--andritz-blue-500: #0075be;

/* Semantic */
--color-primary: var(--andritz-blue-500);

/* Component */
--button-bg: linear-gradient(135deg, var(--color-primary-text), var(--color-primary));
```

## Quick Start

**Generate tokens:**
```bash
node scripts/generate-tokens.cjs --config templates/design-tokens-starter.json -o assets/design-tokens.css
```

**Validate usage:**
```bash
node scripts/validate-tokens.cjs --dir src/
```

**Use in slides/HTML:**
```html
<link rel="stylesheet" href="assets/design-tokens.css">
<link rel="stylesheet" href="assets/css/slide-animations.css">
```

## References

| Topic | File |
|-------|------|
| Design Philosophy | `references/design-philosophy.md` |
| Token Architecture | `references/token-architecture.md` |
| Primitive Tokens | `references/primitive-tokens.md` |
| Semantic Tokens | `references/semantic-tokens.md` |
| Component Tokens | `references/component-tokens.md` |
| Component Specs | `references/component-specs.md` |
| States & Variants | `references/states-and-variants.md` |
| Tailwind Integration | `references/tailwind-integration.md` |

## Component Spec Pattern

| Property | Default | Hover | Active | Disabled |
|----------|---------|-------|--------|----------|
| Background | gradient(primary) | tonal-shift | scale-98% | surface-muted |
| Text | on-primary | on-primary | on-primary | on-surface-variant |
| Border | none | none | none | ghost-border |
| Shadow | none | none | none | none |
| Radius | 0px | 0px | 0px | 0px |

## Scripts

| Script | Purpose |
|--------|---------|
| `generate-tokens.cjs` | Generate CSS from JSON token config |
| `validate-tokens.cjs` | Check for hardcoded values in code |
| `search-slides.py` | BM25 search + contextual recommendations |
| `slide-token-validator.py` | Validate slide HTML for token compliance |
| `fetch-background.py` | Fetch images from Pexels/Unsplash |

## Templates

| Template | Purpose |
|----------|---------|
| `design-tokens-starter.json` | Andritz three-layer token starter |

## Integration

**With brand:** Extract primitives from Andritz brand colors/typography
**With ui-styling:** Component tokens → Tailwind config with 0px radius

**Skill Dependencies:** brand, ui-styling
**Primary Agents:** ui-ux-designer, frontend-developer

## Slide System

Brand-compliant presentations using design tokens + Chart.js + contextual decision system.

### Source of Truth

| File | Purpose |
|------|---------|
| `docs/brand-guidelines.md` | Brand identity, voice, colors |
| `assets/design-tokens.json` | Token definitions (primitive→semantic→component) |
| `assets/design-tokens.css` | CSS variables (import in slides) |
| `assets/css/slide-animations.css` | CSS animation library |

### Slide Search (BM25)

```bash
# Basic search (auto-detect domain)
python scripts/search-slides.py "investor pitch"

# Domain-specific search
python scripts/search-slides.py "problem agitation" -d copy
python scripts/search-slides.py "revenue growth" -d chart

# Contextual search (Premium System)
python scripts/search-slides.py "problem slide" --context --position 2 --total 9
python scripts/search-slides.py "cta" --context --position 9 --prev-emotion frustration
```

### Decision System CSVs

| File | Purpose |
|------|---------|
| `data/slide-strategies.csv` | 15 deck structures + emotion arcs + sparkline beats |
| `data/slide-layouts.csv` | 25 layouts + component variants + animations |
| `data/slide-layout-logic.csv` | Goal → Layout + break_pattern flag |
| `data/slide-typography.csv` | Content type → Typography scale |
| `data/slide-color-logic.csv` | Emotion → Color treatment |
| `data/slide-backgrounds.csv` | Slide type → Image category (Pexels/Unsplash) |
| `data/slide-copy.csv` | 25 copywriting formulas (PAS, AIDA, FAB) |
| `data/slide-charts.csv` | 25 chart types with Chart.js config |

### Slide Requirements

**ALL slides MUST:**
1. Import `assets/design-tokens.css` - single source of truth
2. Use CSS variables: `var(--color-primary)`, `var(--slide-bg)`, etc.
3. Use Chart.js for charts (NOT CSS-only bars)
4. Include navigation (keyboard arrows, click, progress bar)
5. Center align content
6. Focus on persuasion/conversion

### Chart.js Integration

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>

<canvas id="revenueChart"></canvas>
<script>
new Chart(document.getElementById('revenueChart'), {
    type: 'line',
    data: {
        labels: ['Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            data: [5, 12, 28, 45],
            borderColor: 'var(--color-primary)',
            backgroundColor: 'rgba(0, 117, 190, 0.1)',
            fill: true,
            tension: 0.4
        }]
    }
});
</script>
```

### Token Compliance

```css
/* CORRECT - uses Andritz token */
background: var(--color-surface);
color: var(--color-primary);
font-family: var(--font-family-primary);
border-radius: 0px;

/* WRONG - hardcoded */
background: #f8fafb;
color: #0075be;
font-family: 'Inter';
border-radius: 0.5rem;
```

## Best Practices

1. Never use border-radius — 0px is the Andritz rule, no exceptions
2. Use tonal layering (surface hierarchy) instead of borders — No-Line Rule
3. Semantic layer enables light/dark theme switching via surface hierarchy
4. Component tokens enable per-component customization
5. Document every token's purpose
6. **Slides must import design-tokens.css and use var() exclusively**
