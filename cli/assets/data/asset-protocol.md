# Core Asset Protocol

A 5-step hard flow for any branded design work. Adapted from jiji262/claude-design-skill.

The principle: **logos, product shots, and UI screenshots are first-class design inputs — not colors-and-fonts-only afterthoughts.** Skipping this step is the #1 reason "AI design" looks generic.

Run this protocol BEFORE picking a style, palette, or font. If you skip a step, write down why.

---

## Step 0 — Fact Verification (Priority #0)

Before assuming anything about a named product, brand, person, or company:

- Run a WebSearch for the exact name.
- Confirm: what they actually do, who their audience is, any visual identity already in market.
- 10 seconds of search beats 1–2 hours of redoing work on wrong premises.

**Skip only if:** the brief is for a fictional / unnamed / greenfield product.

---

## Step 1 — Logo Acquisition

Hunt for the canonical logo before anything else.

- Ask the user: "Do you have a logo file? SVG preferred, PNG with transparency acceptable."
- If no logo exists yet: flag it. The design direction will inform the logo, not the other way around. Don't fake it with text-only.
- If the logo exists but isn't shared: search the brand's site/press kit (`/press`, `/brand`, `/about`, footer links).
- Capture: primary mark, wordmark, monogram/favicon, any approved color variants (light bg, dark bg, monochrome).

**Save to:** `assets/logo/` with files named `logo-primary.svg`, `logo-mono-light.svg`, `logo-mono-dark.svg`, `favicon.svg`.

---

## Step 2 — Product Shots

Real product imagery beats stock photos and 3D blobs every time.

- Ask: "Can you share product photography, UI screenshots, or rendered mockups?"
- If the product is physical: request 3 angles minimum (front, 3/4, detail).
- If the product is software: capture the actual UI in 3 states (empty, populated, edge case).
- If neither exists: schedule a "shot list" task. Do not substitute with stock. Do not substitute with a 3D abstract blob gradient.

**Save to:** `assets/product/` with descriptive filenames (`product-hero-3q.jpg`, `dashboard-empty-state.png`).

---

## Step 3 — UI Screenshots & Reference

Reference is research, not theft.

- Ask the user: "Show me 3-5 sites/apps you admire — and 1-2 you specifically don't want to look like."
- For each reference, capture: full-page screenshot, hero crop, type detail, color sample.
- Don't copy. Identify the specific moves you want to borrow (a typographic decision, a motion idea, a layout ratio) — never a whole composition.

**Save to:** `assets/reference/admire/` and `assets/reference/avoid/`.

---

## Step 4 — Brand Tokens

Only after assets are gathered, formalize tokens.

- Pull dominant and accent colors directly from the logo and product shots — don't invent.
- Identify the type voice: serif/sans/mono? Geometric/humanist/grotesque?
- If the brand has guidelines, use them. If not, propose 2-3 token options and let the user pick.
- Output: `brand-spec.md` (see step 5).

---

## Step 5 — brand-spec.md

Write a single source of truth before touching code.

```markdown
# brand-spec.md

## Brand identity
- Name: <brand>
- Tagline: <one sentence>
- Audience: <who buys / uses>
- Tone: <3 adjectives>
- What they're NOT: <2-3 anti-positions>

## Logo
- Primary: <path>
- Variants: <paths>
- Clear space: <rule>
- Minimum size: <rule>

## Color
- Primary: #<hex> (named)
- Accent: #<hex>
- Neutral scale: bg / fg / muted / border
- Destructive: #<hex>
- Mode: light / dark / both

## Typography
- Display: <font + weight>
- Body: <font + weight>
- Mono: <font + weight>
- Scale: <ratio + base>

## Voice rules
- Always say: <list>
- Never say: <list>

## Asset inventory
- Logos: <list>
- Product shots: <list>
- Reference (admire): <list>
- Reference (avoid): <list>
```

---

## When to skip the protocol

Skip only if:
- The brief is purely structural (e.g., "extract this component to a hook")
- The user explicitly says "no brand work, just code"
- The artifact is throwaway (sketch, internal demo)

Otherwise: run the protocol. Skipping it is the gap between AI design and considered design.
