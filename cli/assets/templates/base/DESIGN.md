# DESIGN.md

> Project-level design memory. Loaded on every command. Edit this file before shipping anything design-related.
>
> Adapted from impeccable's DESIGN.md / Google Stitch spec.

---

## Mode

<!-- Pick ONE. Affects every design decision downstream. -->

- [ ] **Brand mode** — design IS the product (marketing site, portfolio, editorial, campaign, launch page)
- [ ] **Product mode** — design SERVES the product (app UI, dashboard, internal tool, settings, forms)

---

## Direction (locked from advisor mode)

- **Philosophy:** <e.g. Refined Minimalism, Bold Maximalism, Swiss Editorial — see design-philosophies.csv>
- **One-line pitch:** <what this should feel like, in one sentence>
- **Reference (admire):** <2-3 sites/apps to look at>
- **Reference (avoid):** <2-3 sites/apps NOT to look like>
- **The unforgettable differentiator:** <the one thing a user should remember>

---

## Tokens

### Color

```
--bg:           <#hex>
--fg:           <#hex>
--muted:        <#hex>
--muted-fg:     <#hex>
--border:       <#hex>
--accent:       <#hex>
--accent-fg:    <#hex>
--destructive:  <#hex>
--ring:         <#hex>
```

### Typography

```
--font-display: <name>, <fallback>
--font-body:    <name>, <fallback>
--font-mono:    <name>, <fallback>

--scale-base:   16px
--scale-ratio:  <e.g. 1.250 major third>

--weight-body:    400
--weight-emph:    600
--weight-display: 700
```

### Space

```
--space-1: 4px    (hairline)
--space-2: 8px
--space-3: 12px
--space-4: 16px   (base)
--space-6: 24px
--space-8: 32px
--space-12: 48px
--space-16: 64px
--space-24: 96px  (section padding desktop)
--space-32: 128px
```

### Radius

```
--radius-sm: <px>
--radius:    <px>   (default)
--radius-lg: <px>
```

### Motion

```
--ease-entry: cubic-bezier(0.16, 1, 0.3, 1)
--ease-exit:  cubic-bezier(0.7, 0, 0.84, 0)
--dur-fast:   120ms
--dur-base:   200ms
--dur-slow:   450ms
```

---

## Hard rules

<!-- Things Claude must respect every time. Override the defaults. -->

- Always: <e.g. left-align body copy>
- Always: <e.g. one accent color, never two>
- Never: <e.g. purple-to-blue gradients>
- Never: <e.g. nested cards>
- Never: <e.g. Inter as the only font>

---

## Anti-patterns to enforce

Run `python3 src/ui-ux-pro-max/scripts/search.py "<concern>" --domain antipattern` to surface relevant rules. Common ones to add here:

- [ ] Purple-to-blue gradients
- [ ] Default Tailwind grays
- [ ] Inter without a pairing
- [ ] Stock photos
- [ ] Nested cards
- [ ] Animation everywhere
- [ ] Center-everything alignment

---

## Asset inventory

See `assets/` directory and `brand-spec.md` if it exists.

- Logos: <paths>
- Product shots: <paths>
- Reference (admire): <paths>
- Reference (avoid): <paths>
