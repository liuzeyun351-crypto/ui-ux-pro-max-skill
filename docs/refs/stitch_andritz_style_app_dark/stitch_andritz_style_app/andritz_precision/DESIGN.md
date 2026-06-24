# Design System Specification: Industrial Precision & Digital Depth

## 1. Overview & Creative North Star: "The Monolithic Engine"
This design system moves beyond the standard industrial "dashboard" aesthetic to embrace a Creative North Star we call **The Monolithic Engine**. 

In industrial engineering, beauty is found in precision, massive scale, and the interplay of heavy materials. This system avoids the "cheapness" of thin lines and flat boxes. Instead, it treats the UI as a high-performance machine: solid, authoritative, and deeply layered. We break the traditional grid by utilizing "Structural Asymmetry"—using heavy-weighted typography and massive tonal blocks to anchor the eye, while allowing data-heavy elements to float in a sophisticated, layered environment.

**Key Principles:**
*   **Precision over Decoration:** Every element serves a functional purpose.
*   **Structural Depth:** Hierarchy is defined by material stacking, not borders.
*   **Monolithic Presence:** Large, bold type pairings create an editorial "Blueprint" feel.

---

## 2. Colors: Tonal Architecture
The palette is rooted in deep oceanic navies and surgical greys. We are moving away from "flat UI" by using these tones to build a physical sense of depth.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders for sectioning are prohibited. Boundaries must be defined solely through background color shifts or tonal transitions. To separate a sidebar from a main content area, use a shift from `surface` (#f8fafb) to `surface-container-low` (#f2f4f5).

### Surface Hierarchy & Nesting
Treat the UI as a series of machined plates.
*   **Base:** `surface` (#f8fafb) – The floor of the application.
*   **Secondary Plates:** `surface-container` (#eceeef) – Used for primary content regions.
*   **Elevated Modules:** `surface-container-lowest` (#ffffff) – Used for data cards or interactive modules to provide "pop" against the grey background.

### The "Glass & Gradient" Rule
To inject "soul" into the industrial aesthetic:
*   **CTA Depth:** Use a subtle linear gradient on primary buttons transitioning from `primary` (#005c97) to `primary_container` (#0075be) at a 135-degree angle.
*   **Industrial Frost:** For floating navigation or modal overlays, use `surface_container_lowest` at 85% opacity with a `20px` backdrop-blur. This keeps the data-heavy background visible but creates a clear functional layer.

---

## 3. Typography: The Blueprint Scale
We utilize **Gilroy** (or a premium sans-serif alternative) to bridge the gap between engineering documentation and modern editorial design.

*   **Display (L/M/S):** Used for massive KPIs and section headers. These should feel like "stamped" metal—authoritative and immovable.
*   **Headlines & Titles:** Set in **Gilroy-SemiBold**. These act as the structural beams of the layout.
*   **Body & Labels:** Set in **Inter** or **Gilroy-Regular**. High-density data must remain legible; use `on_surface_variant` (#404751) for secondary data to maintain a clear hierarchy against primary values.

**Editorial Tip:** Pair a `display-lg` metric with a `label-sm` (all caps, tracked out +10%) directly underneath to mimic an engineering technical drawing.

---

## 4. Elevation & Depth: Tonal Layering
In this system, shadows are atmospheric, not structural. 

### The Layering Principle
Depth is achieved by "stacking." A `surface-container-lowest` card sitting on a `surface-container` background provides all the separation required. 

### Ambient Shadows
If a component must "float" (e.g., a critical alert or a primary dropdown):
*   **Shadow:** 0px 12px 32px 0px.
*   **Color:** Use `on_surface` at 6% opacity. This creates a natural "ambient occlusion" effect rather than a dated drop shadow.

### The "Ghost Border" Fallback
If accessibility requires a container definition (e.g., in high-glare environments), use a **Ghost Border**:
*   **Token:** `outline-variant` (#c0c7d2) at **15% opacity**. It should be felt, not seen.

---

## 5. Components: Machined Components
All components feature **Sharp Corners (0px)**. No exceptions. This reinforces the industrial, high-precision nature of the brand.

### Buttons
*   **Primary:** Gradient fill (Primary to Primary-Container), white text, 0px radius. Heavy horizontal padding (24px) for a "solid" feel.
*   **Secondary:** `surface-container-high` background with `on_primary_fixed_variant` text. No border.
*   **Tertiary:** Text-only, capitalized, with a 2px bottom-heavy underline (using `surface_tint`) on hover.

### Input Fields
*   **State:** Use `surface-container-highest` for the background fill.
*   **Focus:** A 2px solid `primary` (#005c97) **bottom-border only**. This mimics a ledger or a technical form.
*   **Error:** Background shifts to `error_container`, text to `on_error_container`.

### Cards & Lists
*   **Rule:** Forbid divider lines. Use 32px of vertical white space or a subtle shift to `surface-container-low` to distinguish between list items.
*   **Data Density:** In lists, use `title-sm` for primary values and `label-sm` for units (e.g., "450 **kg/h**"), keeping the units in a lighter weight.

### Data Visualization (Industrial Custom)
*   **Gauges:** Use sharp, non-rounded arcs.
*   **Charts:** Fill areas under lines with a vertical gradient of `primary` to transparent to give data "weight."

---

## 6. Do's and Don'ts

### Do:
*   **Do** use extreme whitespace. Industrial sites are massive; the UI should feel equally expansive.
*   **Do** use "All Caps" for labels and small UI elements to evoke a sense of professional labeling.
*   **Do** align text to a strict baseline grid to ensure the "Monolithic" feel remains organized.

### Don't:
*   **Don't** use any border-radius. A single rounded corner breaks the "Industrial Precision" logic.
*   **Don't** use pure black (#000000). Use `on_secondary_fixed` (#001c38) for the deepest blacks to maintain tonal richness.
*   **Don't** use icons as purely decorative elements. If an icon is used, it must accompany a functional action or a status.

---

## 7. Designer's Note on Data Heavy Layouts
When designing "Data-Heavy" screens, do not shrink the text. Instead, expand the canvas. Use the `surface-container` tiers to group related data points into "Zones." A "Zone" should feel like a solid block of information that can be scanned at a glance, separated from other zones by significant tonal shifts rather than lines. This is the hallmark of a high-end, bespoke engineering tool.