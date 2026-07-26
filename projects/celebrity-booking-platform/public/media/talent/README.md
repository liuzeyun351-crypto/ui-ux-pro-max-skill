# Talent photography

`npm run fetch:images` writes freely-licensed photographs here:

```
public/media/talent/
├── manifest.json          # paths + photographer, licence and source per slug
├── <slug>.jpg             # 900x1200 portrait  (cards, hero, dashboards)
├── <slug>-wide.jpg        # 1600x900 banner    (profile hero, article heroes)
└── gallery/<slug>-N.jpg   # 800x1000 gallery tiles
```

Then run `npx prisma db seed` to load the manifest into the database.

## Why `/media/talent` and not `/talent`

`/talent` is the authenticated talent-console route namespace. Assets served
from there are matched by `src/middleware.ts` and redirected to `/signin`, which
breaks every image silently. Keep imagery under `/media/**`.

## Supplying your own photography

Drop files matching the names above and hand-write `manifest.json` entries. Any
file present here is used as-is; the fetch script only writes slugs it has not
already resolved unless you pass `--force`.

## Licensing

Only public domain, CC0, CC BY and CC BY-SA files are accepted — see
`scripts/licence.ts`. CC BY and CC BY-SA oblige you to name the photographer and
licence wherever the image appears; the app does this on each profile and on
`/credits`. Replacing these with press or agency photography is your call and
your licence to secure.
