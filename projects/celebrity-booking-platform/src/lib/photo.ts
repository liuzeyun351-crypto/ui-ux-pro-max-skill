import { parseJson } from "@/lib/types";

/**
 * A talent photograph sourced by scripts/fetch-talent-images.ts.
 * Stored on Celebrity.photo as a JSON string (matching the schema's existing
 * convention for awards/socials/faq) so directory queries stay single-table.
 */
export interface TalentPhoto {
  /** 3:4 portrait, e.g. /media/talent/burna-boy.jpg */
  portrait: string;
  /** 16:9 banner, e.g. /media/talent/burna-boy-wide.jpg */
  wide?: string;
  /** base64 LQIP for next/image placeholder="blur" */
  blur?: string;
  /** photographer / uploader — required by CC BY and CC BY-SA */
  credit?: string;
  /** human-readable licence, e.g. "CC BY-SA 4.0" */
  licence?: string;
  licenceUrl?: string;
  /** canonical page for the file, for attribution links */
  sourceUrl?: string;
  /** wikimedia | tmdb | local */
  source?: string;
}

export function getPhoto(celebrity: { photo?: string | null }): TalentPhoto | null {
  const photo = parseJson<TalentPhoto | null>(celebrity.photo, null);
  // A portrait path is the minimum viable record; anything less falls back to art.
  if (!photo || typeof photo.portrait !== "string" || photo.portrait.length === 0) {
    return null;
  }
  return photo;
}

/** True when attribution must be rendered (CC BY / CC BY-SA and friends). */
export function needsAttribution(photo: TalentPhoto): boolean {
  if (!photo.credit) return false;
  const licence = (photo.licence ?? "").toLowerCase();
  // Public-domain and CC0 works carry no attribution obligation, but we still
  // credit them when an author is known — it costs nothing and is good manners.
  return licence.length > 0;
}

/** "Bob Smith · CC BY-SA 4.0 (Wikimedia Commons)" */
export function formatCredit(photo: TalentPhoto): string {
  const parts = [photo.credit, photo.licence].filter(Boolean);
  const label = parts.join(" · ");
  if (photo.source === "wikimedia") return `${label} (Wikimedia Commons)`;
  if (photo.source === "tmdb") return `${label} (TMDB)`;
  return label;
}
