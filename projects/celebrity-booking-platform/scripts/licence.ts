/**
 * Licence gate for fetched imagery.
 *
 * Celebrity photographs are copyrighted. A commercial booking platform may only
 * display images it has the right to use, so the fetcher accepts *only* files
 * under a free licence and rejects everything else — including anything whose
 * licence it cannot positively identify. When in doubt, reject: the app falls
 * back to generated artwork, which is always safe.
 */

/** Licence families that permit reuse (with attribution where noted). */
const FREE_PATTERNS: { test: RegExp; attribution: boolean; label: string }[] = [
  { test: /^cc0/i, attribution: false, label: "CC0" },
  { test: /public\s*domain|^pd([-\s]|$)|^pd-/i, attribution: false, label: "Public domain" },
  { test: /^cc[-\s]?by[-\s]?sa/i, attribution: true, label: "CC BY-SA" },
  { test: /^cc[-\s]?by(?![-\s]?(nc|nd))/i, attribution: true, label: "CC BY" },
  { test: /^attribution$/i, attribution: true, label: "Attribution" },
  // GFDL and the UK Open Government Licence are both free content licences
  // that permit commercial reuse with attribution. Commons carries images
  // under each (e.g. GFDL on older photographs, OGL on UK government work).
  { test: /^gfdl|gnu\s+free\s+documentation/i, attribution: true, label: "GFDL" },
  { test: /^ogl|open\s+government\s+licence/i, attribution: true, label: "OGL" },
];

/** Explicit blocks — checked first, so "CC BY-NC" can never match the CC BY rule. */
const NON_FREE_PATTERNS = [
  /\bnc\b|non[-\s]?commercial/i,
  /\bnd\b|no[-\s]?deriv/i,
  /fair\s*use/i,
  /non[-\s]?free/i,
  /all\s+rights\s+reserved/i,
  /copyrighted/i,
  /\bunknown\b/i,
];

export interface LicenceVerdict {
  allowed: boolean;
  /** normalised label for display, e.g. "CC BY-SA 4.0" */
  label: string;
  attributionRequired: boolean;
  reason?: string;
}

export function evaluateLicence(raw: string | null | undefined): LicenceVerdict {
  const value = (raw ?? "").trim();
  if (!value) {
    return {
      allowed: false,
      label: "",
      attributionRequired: false,
      reason: "no licence metadata",
    };
  }

  for (const pattern of NON_FREE_PATTERNS) {
    if (pattern.test(value)) {
      return {
        allowed: false,
        label: value,
        attributionRequired: false,
        reason: `non-free licence (${value})`,
      };
    }
  }

  for (const family of FREE_PATTERNS) {
    if (family.test.test(value)) {
      return { allowed: true, label: value, attributionRequired: family.attribution };
    }
  }

  return {
    allowed: false,
    label: value,
    attributionRequired: false,
    reason: `unrecognised licence (${value})`,
  };
}

/** Commons returns author as HTML (often an <a> tag); reduce it to plain text. */
export function cleanAuthor(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

/** Reject images too small to crop into a 900x1200 portrait without mush. */
export function hasUsableDimensions(width?: number, height?: number): boolean {
  if (!width || !height) return false;
  return Math.min(width, height) >= 400;
}

/** Only raster formats sharp can reliably decode; SVG/GIF portraits are noise. */
export function isSupportedMime(mime: string | null | undefined): boolean {
  return mime === "image/jpeg" || mime === "image/png" || mime === "image/webp";
}
