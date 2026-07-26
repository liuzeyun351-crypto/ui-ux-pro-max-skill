# Aurum — Celebrity Booking & Talent Management Platform

**The world's stage, on request.**

A production-shaped, full-stack luxury booking platform: a cinematic marketing site, a
filterable talent directory, editorial celebrity profiles, an eight-step booking wizard,
and three role-scoped consoles (client, talent/manager, admin) — with escrow-modelled
payments, contracts, invoices, messaging, a CMS and a complete design system.

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion,
Prisma and Auth.js.

---

## Run it locally

```bash
npm install
npm run setup     # creates + seeds the database
npm run dev       # http://localhost:3000
```

That's it. No external services — it boots on SQLite with zero configuration.
(`npm run build` also self-provisions the database, so a host needs no extra steps.)

## Put it online

**→ [`docs/HOSTING.md`](docs/HOSTING.md) has click-by-click steps for Vercel,
Netlify, Render, Docker and cPanel.**

Two things trip up every first deploy, so they're worth stating here:

1. **This is a full-stack app, not a static site.** Uploading files to a plain
   web host serves nothing. It needs Node.js and a database.
2. **Push this folder as its own repository.** If you point a host at the parent
   monorepo it looks in the wrong directory, builds nothing, and you get a 404.

On Vercel you need exactly four environment variables — `DATABASE_URL` (a free
Neon Postgres), `AUTH_SECRET`, `AUTH_TRUST_HOST=true` and `NEXT_PUBLIC_APP_URL`.
The build creates the schema and seeds the roster by itself.

### Demo accounts

Every account uses the password **`aurum-demo`**, and the sign-in page has one-click
buttons for each persona.

| Role | Email | What it shows |
|---|---|---|
| Client | `client@aurum.demo` | Bookings, invoices, escrow, messages, saved talent, calendar |
| Talent | `talent@aurum.demo` | Burna Boy's console: revenue, requests, availability editor, analytics |
| Manager | `manager@aurum.demo` | Agency roster view of the same console |
| Admin | `admin@aurum.demo` | Platform GMV, all bookings, users, review moderation, CMS, audit log |

---

## What's in here

### Public surfaces
- **Homepage** — generative spotlight hero (no video assets), animated talent collage,
  instant search, partner marquee, featured roster, category mosaic, scroll-driven
  "how booking works", animated statistics, testimonials, upcoming shows, featured
  managers, latest stories, newsletter and FAQ.
- **Directory** (`/celebrities`) — URL-synced filters (category, country, gender, budget
  band, availability, verified-only), five sort modes, debounced search, infinite scroll.
- **Profile** (`/celebrities/[slug]`) — full-bleed hero, sticky booking rail, biography,
  career highlights, honours, discography/filmography/bibliography, gallery, live
  availability calendar, reviews, FAQ, related talent, `Person` JSON-LD.
- **Booking wizard** (`/book/[slug]`) — eight validated steps with animated progress,
  draft autosave, availability-aware date picking and a cinematic success state.
- **Stories** (`/news`), **How it works**, **FAQ**, **Legal**, custom 404.

### Consoles
- **Client** — overview, booking pipeline with status timelines, invoices with line items,
  polling chat with read receipts, saved talent, calendar, notifications, settings.
- **Talent / Manager** — revenue and traffic charts, request pipeline with state
  transitions, click-to-cycle availability editor, audience analytics.
- **Admin** — platform GMV, bookings table, celebrity feature toggles, users, review
  moderation, CMS, immutable audit log.

### Platform
- **Auth & RBAC** — Auth.js v5 credentials provider, bcrypt hashes, JWT sessions,
  middleware route guards for `USER` / `TALENT` / `MANAGER` / `ADMIN`.
- **Payments** — a typed `PaymentProvider` interface with Stripe/PayPal/Apple Pay/Google
  Pay slots, an escrow milestone schedule, a booking state machine and refund
  entitlement rules (all unit-tested). Runs on a mock rail until real keys are set.
- **Emails** — seven inline-styled transactional templates (welcome, booking
  confirmation, payment confirmation, invoice, reminder, contract ready, cancellation).
- **SEO** — per-route metadata, JSON-LD (`Person`, `NewsArticle`, `FAQPage`), generated
  OG image, dynamic sitemap and robots.
- **Security** — Zod validation on every boundary, server actions (CSRF-safe by design),
  per-IP rate limiting, security headers, audit logging.

---

## Real talent photography

Profiles ship with generated artwork. To replace it with **real photographs of
the real people**, run one command:

```bash
npm run fetch:images     # pulls freely-licensed photos into public/media/talent/
npx prisma db seed       # loads them (and their credits) into the database
```

That is the whole step. Everything else — cropping, blur placeholders, responsive
`next/image` sizes, attribution UI — is already wired.

| Flag | Effect |
|---|---|
| `--only=<slug>` | Fetch a single celebrity |
| `--force` | Re-fetch names that already have images |
| `--gallery=0` | Portraits only, skip gallery tiles |

**Sources.** Wikipedia's article lead image and Wikimedia Commons for everyone;
optionally The Movie Database for screen talent when `TMDB_API_KEY` is set in
`.env` (better, more consistent headshots for actors — note TMDB's terms are
non-commercial and need review before a real launch).

**Only free licences are accepted** — public domain, CC0, CC BY and CC BY-SA.
`scripts/licence.ts` rejects non-commercial, no-derivatives, fair-use and
anything it cannot positively identify; rejected names simply keep their
generated portrait. Photographer and licence are captured for every file and
displayed on the profile and at `/credits`, which is what CC BY-SA requires.

**Supplying your own press assets** works too — drop files into
`public/media/talent/` and add manifest entries. See that folder's README.

If you never run the fetch, nothing breaks: every surface falls back to the
generated artwork it ships with.

## Demo data — important

Talent profiles use **real public figures** with factual, publicly known career
information (awards, works, achievements). Everything commercial is **fictional**:
booking fees, availability, ratings, reviews, bookings, invoices and messages.

**Imagery** is either a freely-licensed photograph (after `npm run fetch:images`, with
the photographer and licence credited on the profile and at `/credits`) or, when no
free photograph is available, a deterministic generated composition from
`src/components/art/PortraitArt.tsx` — a lit stage, spotlight beams and a serif
monogram, labelled `AURUM · DEMO ARTWORK` along its edge.

**No endorsement or affiliation by any individual is implied.**

---

## Scripts

```bash
npm run dev          # dev server
npm run build        # production build
npm start            # serve the production build
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm test             # vitest unit tests
npm run test:e2e     # playwright smoke suite
npm run db:reset     # drop, push and reseed the demo database
npm run fetch:images # download freely-licensed talent photography
```

## Documentation

| Document | Contents |
|---|---|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Folder map, data model, booking state machine, payments, real-time, security |
| [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) | Tokens, type scale, colour, motion, component inventory |
| [`docs/HOSTING.md`](docs/HOSTING.md) | **Step-by-step deploy guide + troubleshooting table** |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Environment variables, Postgres/Redis migration, go-live checklist |

## Licence

Demonstration project. See the repository licence for terms.
