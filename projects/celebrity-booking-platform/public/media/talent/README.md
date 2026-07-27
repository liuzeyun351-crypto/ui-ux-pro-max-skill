# Talent photography

**This folder already contains real photographs of all 27 people on the demo
roster** — 27 portraits and 50 gallery images, every one under a free licence
with the photographer recorded. Nothing needs to be fetched for the demo to
show real faces.

```
public/media/talent/
├── manifest.json          # paths + photographer, licence and source per slug
├── <slug>.jpg             # portrait  (cards, hero, dashboards, wizard)
├── <slug>-wide.jpg        # banner    (profile hero, article and event heroes)
└── <slug>-g1.jpg, -g2.jpg # gallery tiles on the profile page
```

`npx prisma db seed` loads the manifest into the database (`Celebrity.photo`
plus one `Media` row per image, which is what `/credits` reads).

## Upgrading the resolution

These images were captured on a machine with no direct route to
`upload.wikimedia.org`, so they come from Wikimedia Commons' file-page preview
and top out around 450x600. They are sharp on cards and gallery tiles, and a
little soft behind the profile hero's gradient scrims.

On any machine with ordinary internet access, one command replaces them with
the full-resolution originals at 900x1200 and 1600x900:

```bash
npm run fetch:images
npx prisma db seed
```

It reads the same roster, writes the same manifest and keeps the same
attribution, so nothing else changes.

## Why `/media/talent` and not `/talent`

`/talent` is the authenticated talent-console route namespace. Assets served
from there are matched by `src/middleware.ts` and redirected to `/signin`, which
breaks every image silently. Keep imagery under `/media/**`.

## Supplying your own photography

Drop files matching the names above and hand-write `manifest.json` entries. Any
file present here is used as-is; the fetch script only writes slugs it has not
already resolved unless you pass `--force`.

## Licensing

Only public domain, CC0, CC BY, CC BY-SA, GFDL and OGL files are accepted — see
`scripts/licence.ts`. Most of those licences oblige you to name the photographer
and the licence wherever the image appears; the app does this on each profile,
on every gallery tile and on `/credits`. Replacing these with press or agency
photography is your call and your licence to secure.

**No endorsement or affiliation by any person depicted is implied.**
