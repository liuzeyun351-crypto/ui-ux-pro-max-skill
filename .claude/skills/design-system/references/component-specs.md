# Component Specifications — Andritz Precision

Detailed specs for industrial components. All components enforce 0px radius, the No-Line Rule, and tonal layering.

## Button — "Machined Control"

### Variants

| Variant | Background | Text | Border | Use Case |
|---------|------------|------|--------|----------|
| primary | gradient(135deg, #005c97, #0075be) | white | none | Primary CTA |
| secondary | surface-container-high (#e6e8e9) | primary-text (#005c97) | none | Secondary actions |
| tertiary | transparent | primary-text, ALL CAPS | 2px bottom underline on hover | Subtle/text actions |
| destructive | error (#ba1a1a) | white | none | Dangerous actions |
| ghost | transparent | on-surface | none | Minimal actions |

### Sizes

| Size | Height | Padding X | Padding Y | Font Size | Letter Spacing |
|------|--------|-----------|-----------|-----------|----------------|
| sm | 32px | 16px | 6px | 12px (label) | +0.05em |
| default | 40px | 24px | 8px | 12px (label) | +0.05em |
| lg | 48px | 32px | 12px | 14px | +0.05em |

### States

| State | Background | Transform | Cursor |
|-------|------------|-----------|--------|
| default | token | none | pointer |
| hover | slightly darker gradient | none | pointer |
| active | gradient | scale(0.98) | pointer |
| focus | token + ghost-border | none | pointer |
| disabled | surface-container | none | not-allowed |

### Anatomy

```
┌─────────────────────────────────────┐
│  [icon]  LABEL TEXT  [icon]         │  ← ALL CAPS, +0.05em tracking
└─────────────────────────────────────┘
     ↑     0px radius    ↑
  leading              trailing
  (functional only)    (functional only)
```

---

## Input — "Technical Ledger"

### Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| sm | 32px | 8px 12px | 14px |
| default | 40px | 8px 16px | 14px |
| lg | 48px | 12px 16px | 16px |

### States

| State | Background | Bottom Border | Ring |
|-------|------------|---------------|------|
| default | surface-container-highest (#e1e3e4) | none | none |
| hover | surface-container-highest | 1px on-surface-variant | none |
| focus | surface-container-highest | 2px solid primary (#005c97) | none |
| error | error-container (#ffdad6) | 2px solid error (#ba1a1a) | none |
| disabled | surface-container (#eceeef) | none | none |

### Anatomy

```
LABEL (label-sm, ALL CAPS, +0.05em)
┌─────────────────────────────────────┐
│ [icon] Placeholder/Value            │  ← 0px radius
│▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄│  ← bottom-border only on focus
Helper text (body-sm, on-surface-variant)
```

---

## Card — "Machined Plate"

### Variants

| Variant | Background | Shadow | Border | Use Case |
|---------|------------|--------|--------|----------|
| default | surface-container-lowest (#fff) | none | none | Standard content |
| elevated | surface-container-lowest | ambient (0px 12px 32px) | none | Floating content |
| zone | surface-container | none | none | Data zone grouping |
| inset | surface-container-high | none | none | Nested detail |

### Anatomy

```
┌─────────────────────────────────────┐
│ Title (title-sm)                    │
│                                     │
│ Content area                        │
│                                     │  ← NO divider lines
│                                     │  ← 32px whitespace between zones
│ Footer actions                      │
└─────────────────────────────────────┘
  0px radius, no border
```

### Spacing

| Area | Value |
|------|-------|
| padding | 24px |
| internal gap | 16px |
| zone separation | 32px (whitespace, NOT a line) |
| between cards | 16–24px |

### Data Density Rules

- Primary values: `title-sm` (1rem, medium weight)
- Units/labels: `label-sm` (ALL CAPS, lighter weight)
- Example: "450 **kg/h**" — value in title-sm, unit in label-sm

---

## Badge/Chip — "Status Indicator"

### Variants

| Variant | Background | Text | Use Case |
|---------|------------|------|----------|
| default | primary (#0075be) | white | Standard |
| secondary | secondary-container | on-surface | Subtle |
| warning | tertiary (#ffb781) | neutral-950 | Caution |
| error | error (#ba1a1a) | white | Critical |
| success | success-600 | white | Positive |

### Rules

- 0px radius (sharp corners)
- ALL CAPS text with +0.05em tracking
- No decorative icons — functional only
- Minimalist: secondary-container bg with label-md typography

---

## Alert — "System Notification"

### Variants

| Variant | Background | Icon | Use Case |
|---------|------------|------|----------|
| default | surface-container | info | Informational |
| warning | tertiary at 15% opacity | warning | Caution |
| error | error-container (#ffdad6) | alert | Critical |
| success | success at 15% opacity | check | Positive |

### Anatomy

```
┌─────────────────────────────────────┐
│ [icon]  ALERT TITLE              [×]│  ← label typography, ALL CAPS
│         Description text body       │
└─────────────────────────────────────┘
  0px radius, no visible border
```

---

## Dialog — "Industrial Frost Overlay"

### Sizes

| Size | Max Width | Use Case |
|------|-----------|----------|
| sm | 384px | Confirmations |
| default | 512px | Standard |
| lg | 640px | Complex forms |
| xl | 768px | Data views |

### Glassmorphic Overlay

- Overlay: navy-tinted `rgba(0, 28, 56, 0.5)`
- Dialog surface: surface-container-lowest at 85% opacity
- Backdrop blur: 20px
- Shadow: ambient (0px 12px 32px)
- Radius: 0px

### Anatomy

```
┌───────────────────────────────────────┐
│ DIALOG TITLE                       [×]│  ← label style, ALL CAPS
│                                       │
│ Content area (scrollable)             │
│                                       │
│                    [CANCEL] [CONFIRM] │  ← primary + secondary buttons
└───────────────────────────────────────┘
  0px radius, glassmorphic backdrop
```

---

## Table — "Data Register"

### Row States

| State | Background |
|-------|------------|
| default | surface |
| hover | surface-container-low (tonal shift) |
| selected | primary at 10% opacity |
| header | surface-container |

### Rules

- NO divider lines between rows
- Separate rows via tonal shift to surface-container-low
- Header: ALL CAPS, label-md, on-surface-variant color
- Numbers right-aligned, text left-aligned
- Status badges: sharp 0px corners, color-coded

### Cell Alignment

| Content Type | Alignment |
|--------------|-----------|
| Text | Left |
| Numbers | Right |
| Status/Badge | Center |
| Actions | Right |

### Spacing

| Element | Value |
|---------|-------|
| cell padding | 12px 16px |
| header padding | 12px 16px |
| row height (compact) | 40px |
| row height (default) | 48px |
| row height (comfortable) | 56px |

---

## Data Visualization — "Industrial Instruments"

### Gauges

- Sharp, non-rounded arcs
- Primary color for normal values
- Tertiary (#ffb781) for warnings — "caution tape" effect
- Error for critical thresholds

### Charts

- Fill areas under lines with vertical gradient: primary to transparent (gives data "weight")
- Dark theme: primary (#9bcaff) line with outer glow (0px 0px 8px) — "Pulse Line"
- Sharp axis lines, no rounded corners on bars

### Status Indicators

- Color-coded with Andritz palette
- Tertiary (#ffb781) for warnings — high contrast against navy dark theme
- Error for critical
- Primary for normal operation
- Always accompanied by text label (no icon-only indicators)

### KPI Cards

- Display-lg for primary metric ("stamped metal" feel)
- Label-sm underneath (ALL CAPS, +10% tracking) for unit/label
- Example: "2,847" in display-lg + "TOTAL UNITS PROCESSED" in label-sm
