/**
 * Populate public/media/talent/ with real, freely-licensed photographs.
 *
 * Assets deliberately live under /media/talent rather than /talent: the latter
 * is the authenticated talent-console route namespace, and middleware would
 * redirect every image to /signin.
 *
 *   npm run fetch:images                  # everyone
 *   npm run fetch:images -- --only=adele  # one slug
 *   npm run fetch:images -- --force       # re-fetch files that already exist
 *   npm run fetch:images -- --gallery=0   # portraits only, skip gallery images
 *
 * Sources, in resolution order per celebrity:
 *   1. TMDB          — screen talent only, and only when TMDB_API_KEY is set.
 *   2. Wikipedia     — the article's lead image, which is the best-curated shot.
 *   3. Commons search — additional gallery images.
 *
 * Every Wikimedia file passes through scripts/licence.ts: non-free, unrecognised
 * or undersized files are rejected and the celebrity simply keeps the generated
 * artwork. The script never throws — a failed name is a logged skip, not a
 * broken build.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { CELEBRITIES, type SeedCelebrity } from "../prisma/seed-data";
import {
  cleanAuthor,
  evaluateLicence,
  hasUsableDimensions,
  isSupportedMime,
} from "./licence";

// Wikimedia's User-Agent policy requires a descriptive agent with contact info.
const USER_AGENT =
  "AurumTalentDemo/1.0 (celebrity booking platform demo; https://github.com/ojeikporeigns/ui-ux-pro-max-skill)";

const OUT_DIR = path.join(process.cwd(), "public", "media", "talent");
const GALLERY_DIR = path.join(OUT_DIR, "gallery");
const MANIFEST = path.join(OUT_DIR, "manifest.json");

const PORTRAIT = { width: 900, height: 1200 };
const WIDE = { width: 1600, height: 900 };
const GALLERY = { width: 800, height: 1000 };

const CONCURRENCY = 3;
const TMDB_CATEGORIES = new Set(["film", "tv-hosts", "comedy"]);

// ─────────────────────────── manifest types ───────────────────────────

interface Credit {
  credit?: string;
  licence?: string;
  licenceUrl?: string;
  sourceUrl?: string;
  source: "wikimedia" | "tmdb" | "local";
}

interface ManifestEntry extends Credit {
  portrait: string;
  wide?: string;
  blur?: string;
  width: number;
  height: number;
  gallery?: { url: string; credit?: string; licence?: string; sourceUrl?: string }[];
  fetchedAt: string;
}

type Manifest = Record<string, ManifestEntry>;

// ─────────────────────────── http helpers ───────────────────────────

const args = process.argv.slice(2);
const flag = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const has = (name: string) => args.includes(`--${name}`);

const ONLY = flag("only");
const FORCE = has("force");
const GALLERY_COUNT = Number(flag("gallery") ?? 3);

async function request(url: string, attempt = 1): Promise<Response> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json,image/*,*/*" },
      signal: AbortSignal.timeout(30_000),
    });
    if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
    return res;
  } catch (err) {
    if (attempt >= 3) throw err;
    await new Promise((r) => setTimeout(r, 2 ** attempt * 700));
    return request(url, attempt + 1);
  }
}

async function getJson<T>(url: string): Promise<T> {
  const res = await request(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return (await res.json()) as T;
}

// ─────────────────────────── source: wikipedia / commons ───────────────────────────

interface CommonsImageInfo {
  url: string;
  descriptionurl: string;
  mime: string;
  width: number;
  height: number;
  extmetadata?: Record<string, { value: string }>;
}

/** The lead image of the person's English Wikipedia article. */
async function wikipediaLeadFile(name: string): Promise<string | null> {
  const url =
    "https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2" +
    `&prop=pageimages&piprop=name&redirects=1&titles=${encodeURIComponent(name)}`;
  const data = await getJson<{
    query?: { pages?: { pageimage?: string; missing?: boolean }[] };
  }>(url);
  const page = data.query?.pages?.[0];
  if (!page || page.missing || !page.pageimage) return null;
  return `File:${page.pageimage}`;
}

/**
 * Wikidata's P18 ("image") claim. For public figures this is the most reliable
 * structured pointer to a Commons portrait, and it catches names whose
 * Wikipedia article has no pageimage.
 */
async function wikidataImageFile(name: string): Promise<string | null> {
  const search =
    "https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json" +
    `&language=en&type=item&limit=1&search=${encodeURIComponent(name)}`;
  const found = await getJson<{ search?: { id: string }[] }>(search);
  const id = found.search?.[0]?.id;
  if (!id) return null;

  const entity =
    "https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json" +
    `&property=P18&entity=${id}`;
  const data = await getJson<{
    claims?: { P18?: { mainsnak?: { datavalue?: { value?: string } } }[] };
  }>(entity);
  const file = data.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
  return file ? `File:${file}` : null;
}

/** Files in the person's Commons category — a rich source for gallery shots. */
async function commonsCategoryFiles(name: string, limit: number): Promise<string[]> {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2" +
    `&list=categorymembers&cmtype=file&cmlimit=${limit * 3}` +
    `&cmtitle=${encodeURIComponent(`Category:${name}`)}`;
  try {
    const data = await getJson<{ query?: { categorymembers?: { title: string }[] } }>(url);
    return (data.query?.categorymembers ?? []).map((m) => m.title);
  } catch {
    return [];
  }
}

/** Free-licence image candidates from a Commons full-text search. */
async function commonsSearchFiles(name: string, limit: number): Promise<string[]> {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2" +
    `&generator=search&gsrnamespace=6&gsrlimit=${limit * 4}` +
    `&gsrsearch=${encodeURIComponent(`${name} filetype:bitmap`)}`;
  const data = await getJson<{ query?: { pages?: { title: string }[] } }>(url);
  return (data.query?.pages ?? []).map((p) => p.title);
}

/** Resolve a Commons/Wikipedia file title to a licence-checked download. */
async function resolveCommonsFile(
  fileTitle: string
): Promise<{ url: string; width: number; height: number; credit: Credit } | null> {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2" +
    "&prop=imageinfo&iiprop=url|extmetadata|size|mime" +
    `&titles=${encodeURIComponent(fileTitle)}`;
  const data = await getJson<{
    query?: { pages?: { imageinfo?: CommonsImageInfo[]; missing?: boolean }[] };
  }>(api);
  const info = data.query?.pages?.[0]?.imageinfo?.[0];
  if (!info) return null;

  if (!isSupportedMime(info.mime)) return null;
  if (!hasUsableDimensions(info.width, info.height)) return null;

  const meta = info.extmetadata ?? {};
  const licenceRaw =
    meta.LicenseShortName?.value ?? meta.License?.value ?? meta.UsageTerms?.value ?? "";
  const verdict = evaluateLicence(licenceRaw);
  if (!verdict.allowed) return null;

  return {
    url: info.url,
    width: info.width,
    height: info.height,
    credit: {
      credit: cleanAuthor(meta.Artist?.value) || "Unknown author",
      licence: verdict.label,
      licenceUrl: meta.LicenseUrl?.value,
      sourceUrl: info.descriptionurl,
      source: "wikimedia",
    },
  };
}

// ─────────────────────────── source: tmdb ───────────────────────────

async function tmdbProfile(
  name: string,
  apiKey: string
): Promise<{ url: string; credit: Credit } | null> {
  const search =
    "https://api.themoviedb.org/3/search/person" +
    `?api_key=${apiKey}&query=${encodeURIComponent(name)}`;
  const data = await getJson<{
    results?: { name: string; profile_path: string | null; popularity: number }[];
  }>(search);
  const hit = (data.results ?? [])
    .filter((r) => r.profile_path)
    .sort((a, b) => b.popularity - a.popularity)[0];
  if (!hit?.profile_path) return null;
  return {
    url: `https://image.tmdb.org/t/p/original${hit.profile_path}`,
    credit: {
      credit: "TMDB contributors",
      licence: "TMDB terms of use",
      licenceUrl: "https://www.themoviedb.org/terms-of-use",
      sourceUrl: `https://www.themoviedb.org/search?query=${encodeURIComponent(name)}`,
      source: "tmdb",
    },
  };
}

// ─────────────────────────── image processing ───────────────────────────

async function download(url: string): Promise<Buffer> {
  const res = await request(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * `position: attention` picks the region with the most entropy, which on a
 * portrait reliably lands on the face rather than centre-cropping the torso.
 */
async function writeCrop(
  input: Buffer,
  size: { width: number; height: number },
  dest: string
): Promise<{ width: number; height: number }> {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  const out = await sharp(input)
    .rotate()
    .resize({ ...size, fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  await fs.writeFile(dest, out);
  return size;
}

async function blurDataUrl(input: Buffer): Promise<string> {
  const tiny = await sharp(input)
    .resize({ width: 20, height: 27, fit: "cover" })
    .jpeg({ quality: 40 })
    .toBuffer();
  return `data:image/jpeg;base64,${tiny.toString("base64")}`;
}

// ─────────────────────────── per-celebrity pipeline ───────────────────────────

type Outcome =
  | { slug: string; status: "ok"; source: string }
  | { slug: string; status: "skipped"; reason: string }
  | { slug: string; status: "kept"; reason: string };

async function processCelebrity(
  c: SeedCelebrity,
  manifest: Manifest,
  tmdbKey: string | undefined,
  overrides: Record<string, Override>
): Promise<Outcome> {
  if (!FORCE && manifest[c.slug]) {
    return { slug: c.slug, status: "kept", reason: "already fetched (use --force)" };
  }

  let primary: { buffer: Buffer; credit: Credit } | null = null;

  // 0. An explicit override wins over every discovered source
  const override = overrides[c.slug];
  if (override?.url) {
    try {
      primary = {
        buffer: await download(override.url),
        credit: {
          credit: override.credit ?? "Supplied by site owner",
          licence: override.licence ?? "Supplied — rights asserted by site owner",
          licenceUrl: override.licenceUrl,
          sourceUrl: override.sourceUrl ?? override.url,
          source: "local",
        },
      };
    } catch {
      /* fall through to discovery */
    }
  }

  // 1. TMDB for screen talent
  if (!primary && tmdbKey && TMDB_CATEGORIES.has(c.category)) {
    try {
      const hit = await tmdbProfile(c.name, tmdbKey);
      if (hit) primary = { buffer: await download(hit.url), credit: hit.credit };
    } catch {
      /* fall through to Wikimedia */
    }
  }

  // 2. Wikipedia lead image
  if (!primary) {
    try {
      const fileTitle = await wikipediaLeadFile(c.name);
      if (fileTitle) {
        const resolved = await resolveCommonsFile(fileTitle);
        if (resolved) {
          primary = { buffer: await download(resolved.url), credit: resolved.credit };
        }
      }
    } catch {
      /* fall through to search */
    }
  }

  // 3. Wikidata P18 — structured, and catches articles without a pageimage
  if (!primary) {
    try {
      const fileTitle = await wikidataImageFile(c.name);
      if (fileTitle) {
        const resolved = await resolveCommonsFile(fileTitle);
        if (resolved) {
          primary = { buffer: await download(resolved.url), credit: resolved.credit };
        }
      }
    } catch {
      /* fall through */
    }
  }

  // 4. The person's Commons category, then a full-text search
  if (!primary) {
    const candidates = [
      ...(await commonsCategoryFiles(c.name, 4)),
      ...(await commonsSearchFiles(c.name, 4).catch(() => [])),
    ];
    for (const title of candidates) {
      try {
        const resolved = await resolveCommonsFile(title);
        if (!resolved) continue;
        primary = { buffer: await download(resolved.url), credit: resolved.credit };
        break;
      } catch {
        /* try the next candidate */
      }
    }
  }

  if (!primary) {
    return { slug: c.slug, status: "skipped", reason: "no freely-licensed image found" };
  }

  const portraitPath = path.join(OUT_DIR, `${c.slug}.jpg`);
  const widePath = path.join(OUT_DIR, `${c.slug}-wide.jpg`);
  await writeCrop(primary.buffer, PORTRAIT, portraitPath);
  await writeCrop(primary.buffer, WIDE, widePath);
  const blur = await blurDataUrl(primary.buffer);

  // Gallery images — best effort, never fatal
  const gallery: NonNullable<ManifestEntry["gallery"]> = [];
  if (GALLERY_COUNT > 0) {
    try {
      const titles = [
        ...(await commonsCategoryFiles(c.name, GALLERY_COUNT)),
        ...(await commonsSearchFiles(c.name, GALLERY_COUNT).catch(() => [])),
      ];
      for (const title of titles) {
        if (gallery.length >= GALLERY_COUNT) break;
        const resolved = await resolveCommonsFile(title);
        if (!resolved) continue;
        const idx = gallery.length + 1;
        const rel = `/media/talent/gallery/${c.slug}-${idx}.jpg`;
        await writeCrop(await download(resolved.url), GALLERY, path.join(GALLERY_DIR, `${c.slug}-${idx}.jpg`));
        gallery.push({
          url: rel,
          credit: resolved.credit.credit,
          licence: resolved.credit.licence,
          sourceUrl: resolved.credit.sourceUrl,
        });
      }
    } catch {
      /* gallery stays partial; profile pads with generated art */
    }
  }

  manifest[c.slug] = {
    portrait: `/media/talent/${c.slug}.jpg`,
    wide: `/media/talent/${c.slug}-wide.jpg`,
    blur,
    width: PORTRAIT.width,
    height: PORTRAIT.height,
    gallery: gallery.length ? gallery : undefined,
    fetchedAt: new Date().toISOString(),
    ...primary.credit,
  };

  return { slug: c.slug, status: "ok", source: primary.credit.source };
}

// ─────────────────────────── runner ───────────────────────────

/**
 * scripts/image-overrides.json lets you pin a specific image per slug:
 *
 *   { "adele": { "url": "https://…/photo.jpg", "credit": "…", "licence": "…" } }
 *
 * An override always wins and skips the licence gate — you are asserting you
 * hold the rights to that file, so sourcing and licensing it is your call.
 */
interface Override {
  url: string;
  credit?: string;
  licence?: string;
  licenceUrl?: string;
  sourceUrl?: string;
}

async function readOverrides(): Promise<Record<string, Override>> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "scripts", "image-overrides.json"), "utf8");
    return JSON.parse(raw) as Record<string, Override>;
  } catch {
    return {};
  }
}

async function readManifest(): Promise<Manifest> {
  try {
    return JSON.parse(await fs.readFile(MANIFEST, "utf8")) as Manifest;
  } catch {
    return {};
  }
}

async function main() {
  const tmdbKey = process.env.TMDB_API_KEY?.trim() || undefined;
  const overrides = await readOverrides();
  const roster = ONLY ? CELEBRITIES.filter((c) => c.slug === ONLY) : CELEBRITIES;

  if (roster.length === 0) {
    console.error(`No celebrity matches --only=${ONLY}`);
    process.exit(1);
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  const manifest = await readManifest();

  console.log(`Fetching imagery for ${roster.length} name(s)`);
  console.log(`  TMDB: ${tmdbKey ? "enabled (screen talent)" : "disabled — set TMDB_API_KEY to enable"}`);
  console.log(`  Licence gate: public domain, CC0, CC BY, CC BY-SA only\n`);

  const outcomes: Outcome[] = [];
  const queue = [...roster];

  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      for (;;) {
        const c = queue.shift();
        if (!c) return;
        try {
          const outcome = await processCelebrity(c, manifest, tmdbKey, overrides);
          outcomes.push(outcome);
          const mark =
            outcome.status === "ok" ? "✓" : outcome.status === "kept" ? "·" : "○";
          const detail =
            outcome.status === "ok" ? `via ${outcome.source}` : outcome.reason;
          console.log(`  ${mark} ${c.name.padEnd(28)} ${detail}`);
        } catch (err) {
          outcomes.push({
            slug: c.slug,
            status: "skipped",
            reason: err instanceof Error ? err.message : String(err),
          });
          console.log(`  ○ ${c.name.padEnd(28)} ${err instanceof Error ? err.message : err}`);
        }
      }
    })
  );

  await fs.writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

  const ok = outcomes.filter((o) => o.status === "ok").length;
  const kept = outcomes.filter((o) => o.status === "kept").length;
  const skipped = outcomes.filter((o) => o.status === "skipped").length;

  // Coverage report — the number that matters is "with a photograph"
  const covered = CELEBRITIES.filter((c) => manifest[c.slug]).length;
  const missing = CELEBRITIES.filter((c) => !manifest[c.slug]);
  console.log(`\n${ok} fetched · ${kept} already present · ${skipped} not resolved`);
  console.log(
    `Coverage: ${covered}/${CELEBRITIES.length} celebrities have a photograph` +
      (covered === CELEBRITIES.length ? " ✓" : "")
  );
  if (missing.length > 0) {
    console.log("\nNo freely-licensed image found for:");
    for (const m of missing) console.log(`  · ${m.name} (${m.slug})`);
    console.log(
      "\nThese keep their generated portrait, so no image is ever blank. To pin a\n" +
        "specific photo, add it to scripts/image-overrides.json:\n" +
        '  { "<slug>": { "url": "https://…/photo.jpg", "credit": "…", "licence": "…" } }\n' +
        "then re-run with --force. Rights for supplied files are yours to hold."
    );
  }
  console.log(`Manifest: ${path.relative(process.cwd(), MANIFEST)}`);
  console.log("Run `npx prisma db seed` to load the new imagery into the database.");
}

main().catch((err) => {
  console.error("\nImage fetch failed:", err instanceof Error ? err.message : err);
  console.error("The app still runs — every celebrity falls back to generated artwork.");
  process.exit(1);
});
