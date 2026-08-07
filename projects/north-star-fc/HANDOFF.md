# North Star Football Club — website handoff

A six-page static website. No build step, no npm, no server-side code. Upload the
folder to any host and it works.

---

## 1. What's in the box

| Page | File | Covers |
|---|---|---|
| Home & club history | `index.html` | Hero status board, six programs, field summary, 1974–2026 timeline, club numbers, partners strip |
| Live field status & weather | `fields.html` | Four grounds with open/caution/closed, live four-day forecast, 48-hour rain advisory, how closure calls are made |
| Registration | `register.html` | Three-step process, the three portals, fee table, where each $100 goes, key dates, FAQ |
| Training & game schedules | `schedules.html` | Weekly training grid Mon–Fri, Round 17 fixtures, match-day timeline, parking & accessibility |
| Document hub | `documents.html` | 16 documents, filterable by Governance / Safety / Conduct / Agreements / Registration |
| Commercial & sponsorship | `partners.html` | Reach numbers, six tiers with inclusions and pricing, where sponsor money goes, logo wall |

Supporting files: `styles.css`, `main.js`, `lib/` (GSAP + club data), `assets/`, `.htaccess`.

---

## 2. Design decisions

**Colours** — Navy `#2a458c` for structure and type, Yellow `#fff85a` for emphasis
blocks and highlights, White for the page. Yellow is never used as text on white
(it would fail contrast); it is only ever a background behind navy text, or a
highlight rule. Navy on white measures 9.1:1 and navy on yellow 8.2:1 — both pass
WCAG AAA for body text.

**Typography** — **Archivo** for display, **Inter** for body, both from Google Fonts.

Archivo is the current sports-brand grotesk: a variable font with a width axis, so
headlines can be set slightly expanded and heavy (the wide, blocky look you see on
modern club kits and broadcast graphics) without loading a second family. Unlike
Bebas Neue or Anton — the older go-to "sports" faces — it has a full weight range
and real lowercase, so it works for a card title as well as a hero. Inter carries
the body text: it was drawn for screen legibility at small sizes, which matters
when the audience runs from a parent reading a fee table on a phone to a
grandparent reading the constitution on a desktop.

**Layout** — A hairline grid: everything sits in bordered cells with 1px rules,
so the page holds a lot of information without feeling cluttered. That is the
"balanced information density" brief — the structure does the organising so the
copy does not have to shout.

---

## 3. Updating the site

### The one file to edit: `lib/manifest.js`

Field status, weather coordinates, schedules, documents, sponsor tiers and contact
details all live there, with comments explaining each block. Values marked `// TODO`
are placeholders you need to replace:

- Club email, phone, ground name and street address
- Founding year (currently 1974)
- Weather latitude/longitude (currently Brisbane CBD — set it to your ground)

**Important:** the same content is also written directly into the HTML so the site
still reads if JavaScript is blocked. When you change something in `manifest.js`,
change it in the matching HTML too. The exception is the "last updated" timestamp,
which is pulled live from `manifest.js` onto every page.

### Changing field status

1. Open `lib/manifest.js`, update `fieldsUpdated` and the `state` of each field.
2. Open `fields.html` and `index.html`, update the matching `data-state` attribute
   and the `status status-open` / `status-caution` / `status-closed` class.
3. Re-upload those three files.

### Adding the real documents

`assets/docs/` currently holds 16 one-page placeholder PDFs. Drop your real PDF
over the top of each, **keeping the same filename** — every link then works with no
HTML change. Filenames are listed in `lib/manifest.js` under `documents`.

### Partner logos

`partners.html` and `index.html` have an eight-cell logo wall with text
placeholders. Replace each `<div>Partner logo</div>` with
`<div><img src="assets/img/partner-name.webp" alt="Partner name"></img></div>`.

---

## 4. Live weather

The forecast on `fields.html` calls **Open-Meteo** — free, no API key, no account,
no tracking. It runs in the visitor's browser, so there is nothing to configure and
no key to leak.

If the request fails for any reason, the numbers already printed in the HTML stay
on screen and a line explains that live data is unavailable. The page never breaks.

**Not verified live.** The environment this site was built in blocks outbound calls
to Open-Meteo, so the fallback path is what was tested — it works correctly. Load
`fields.html` on a normal internet connection once after deploying and confirm the
temperatures update and the note reads "Live forecast for …". If it does not, check
the browser console for a `[weather]` warning.

The rain advisory adds up precipitation for the last 48 hours and today, and picks
one of three messages (dry / soft / expect closures). Thresholds are in `main.js`
in `renderWeather` — 12mm and 40mm — adjust them to match your ground's drainage.

---

## 5. Deploying

Drag the whole `north-star-fc` folder into Hostinger's File Manager (into
`public_html`), or connect by FTP and upload the contents. Netlify, Cloudflare
Pages and GitHub Pages all work the same way — drop the folder, no build command.

`.htaccess` is included and handles Apache/LiteSpeed hosts (Hostinger, cPanel):
it stops the server serving stale CSS and JS after an update, sets correct MIME
types and adds gzip. On Netlify or Cloudflare Pages it is ignored harmlessly.

**After every update**, bump the version stamp so visitors get the new files
instead of a cached copy. Find and replace `?v=20260807` with today's date in
`YYYYMMDD` form across all six HTML files.

Two optional blocks are commented out at the bottom of `.htaccess`: an HTTPS
redirect (turn on once your SSL certificate is active) and pretty URLs
(`/register` instead of `/register.html`).

---

## 6. Technical notes

- Classic `<script defer>` and an IIFE in `main.js` — no ES modules, so the site
  also works when opened straight off the disk by double-clicking `index.html`.
- GSAP and ScrollTrigger are bundled locally in `lib/`. Nothing loads from a CDN at
  runtime except the Google Fonts stylesheet; if that is blocked, the site falls
  back to system sans-serif and still looks right.
- Every content block is in the HTML. With JavaScript disabled you lose the
  animations, the document filter and the live forecast, and keep everything else.
- Reduced-motion only disables the ticker and the pulsing status dot. Hovers,
  fades and reveals stay on — Windows ships reduced-motion enabled for a lot of
  people and gating everything would leave them with a flat, dead-looking site.
- Accessibility: skip link, semantic landmarks, visible focus rings, `aria-current`
  on the active nav item, real `<table>` markup with scoped headers for the
  schedules, `aria-live` on the document count, and a screen-reader summary of the
  ticker (the ticker itself is `aria-hidden`, since a scrolling marquee is noise).
- Tested at 390px and 1440px: no horizontal overflow, no console errors. Wide
  tables scroll inside their own container rather than pushing the page sideways.

---

## 7. Placeholder content to replace before launch

Everything below is plausible filler written to show the design working. Replace it
with the club's real information before the site goes public.

- Contact details: email, phone, ground name, street address (`admin@northstarfc.com.au`,
  `07 0000 0000`, `Club Road, Brisbane QLD 4000`)
- The 1974–2026 history timeline
- Club numbers: 640 players, 46 teams, 120 volunteers, 1,900 weekly attendance, 6km median distance
- Season fees and the fee breakdown ($38/$24/$21/$17 per $100)
- Round 17 fixtures and opponent club names
- Training times and squad names
- Sponsorship tier pricing and inclusions, and the "where it goes" figures ($18k/$9k/$7k/$6k)
- The 16 placeholder PDFs in `assets/docs/`
- Partner logos
