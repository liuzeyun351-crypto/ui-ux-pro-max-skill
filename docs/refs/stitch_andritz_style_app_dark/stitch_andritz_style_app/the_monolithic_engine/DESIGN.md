# Design System: The Monolithic Engine

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Monolithic Engine."** 

This is not a standard "dark mode" update; it is an exercise in structural weight and industrial precision. We are moving away from the "floating card" aesthetic of modern SaaS and toward a digital architecture that feels carved from solid carbon and steel. The experience must feel like a high-end industrial command center—authoritative, dense, and technically superior.

To break the "template" look, we utilize **intentional asymmetry**. Align heavy data blocks to a rigid left-axis while allowing secondary metadata to "float" with generous whitespace. We use the contrast between the technical precision of **Inter** and the geometric authority of **Gilroy** to create an editorial layout that feels like a premium technical journal.

---

## 2. Colors: Tonal Power
Our palette is rooted in the deep shadows of heavy machinery. We do not use "black"; we use varying densities of charcoal and midnight navy to create a sense of infinite depth.

### The Palette (Material Design Tokens)
*   **Surface / Background:** `#10141a` (The base "void")
*   **Primary (Andritz Blue):** `#9bcaff` (Text/Iconography) / `#0075be` (Action Containers)
*   **Surface Tiers:**
    *   `surface_container_lowest`: `#0a0e14` (Deepest recesses, used for background negative space)
    *   `surface_container_low`: `#181c22` (Secondary sections)
    *   `surface_container_high`: `#262a31` (Interactive surfaces)
    *   `surface_container_highest`: `#31353c` (Prominent highlights)

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. A `surface_container_low` section sitting on a `surface` background is the only "border" you need. This creates a seamless, monolithic feel rather than a "boxed-in" interface.

### The "Glass & Gradient" Rule
To inject "visual soul" into the industrial framework, main CTAs and Hero sections must utilize a linear gradient: `primary_container` (#0075be) transitioning to a slightly darker shift. For floating overlays, use **Glassmorphism**: semi-transparent surface colors with a `20px` backdrop-blur to maintain the "The Monolithic Engine" depth.

---

## 3. Typography: Technical Authority
We use typography to convey industrial precision. **Gilroy** (where available for headers) provides the geometric "Monolithic" weight, while **Inter** handles the high-density data.

*   **Display (L/M/S):** Inter | 3.5rem to 2.25rem. Use for high-impact KPIs and section headers. Bold weights only.
*   **Headline (L/M/S):** Inter | 2rem to 1.5rem. Tight letter-spacing (-0.02em) to evoke a "technical manual" aesthetic.
*   **Title (L/M/S):** Inter | 1.375rem to 1rem. Medium weight. This is your primary navigation and card header tier.
*   **Body (L/M/S):** Inter | 1rem to 0.75rem. Regular weight. Ensure `on_surface_variant` (#c0c7d2) is used for secondary body text to maintain hierarchy.
*   **Label (M/S):** Inter | 0.75rem. All-caps with +0.05em tracking for a "machined" look on buttons and tags.

---

## 4. Elevation & Depth: Tonal Layering
In this system, depth is not "up"; it is "in." We move away from traditional shadows toward **Tonal Layering**.

*   **The Layering Principle:** Stack surfaces to create focus. Place a `surface_container_highest` card on a `surface_container_low` background. This creates a natural "lift" through luminance rather than artificial shadow.
*   **Ambient Shadows:** If an element must float (e.g., a Modal), use a tinted shadow: `rgba(0, 28, 56, 0.4)` with a 32px blur. It should feel like a soft glow emitted from the engine, not a grey drop shadow.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke, use `outline_variant` (#404751) at **20% opacity**. It should be felt, not seen.

---

## 5. Components
Each component should feel like a precision-milled part of a larger machine.

*   **Buttons:**
    *   **Primary:** Solid `primary_container` (#0075be) with `on_primary_container` text. No border. Radius: `md` (0.375rem).
    *   **Secondary:** `surface_container_highest` background with a `Ghost Border`.
*   **Cards:** Forbid divider lines. Use vertical whitespace (1.5rem+) or a shift to `surface_container_low` to separate content.
*   **Input Fields:** Use `surface_container_lowest` for the field background to create an "inset" look. Focus state is a 2px `primary` bottom-border only—no full box focus.
*   **Chips:** Minimalist. Use `secondary_container` with `label-md` typography. No icons unless strictly functional.
*   **Data Visualization (Industrial Specific):**
    *   **The Pulse Line:** Graphs should use `primary` (#9bcaff) with a subtle outer glow (0px 0px 8px).
    *   **Status Indicators:** Use `tertiary` (#ffb781) for warnings—it provides a "caution tape" high-contrast feel against the navy base.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use extreme vertical spacing. Let the "Monolith" breathe.
*   **Do** use `on_surface_variant` for metadata. Contrast is our primary tool for hierarchy.
*   **Do** align all technical data to a strict 8px grid, but allow "Hero" elements to break the grid slightly for visual interest.

### Don't:
*   **Don't** use pure black (#000000). It kills the depth of the "Engine."
*   **Don't** use 100% opaque white borders. They feel cheap and "out-of-the-box."
*   **Don't** use rounded corners larger than `xl` (0.75rem). We want "Sharp & Technical," not "Soft & Consumer."
*   **Don't** use standard dividers. If you think you need a line, use 24px of empty space instead.