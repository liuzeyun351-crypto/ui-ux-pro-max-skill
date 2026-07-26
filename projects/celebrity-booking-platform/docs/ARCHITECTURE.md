# Architecture

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 App Router, React 19 | Server Components keep data fetching on the server; server actions remove most API surface |
| Language | TypeScript (strict) | Every boundary typed, including the JSON-encoded columns |
| Styling | Tailwind CSS v4 + CSS custom properties | Theme switching is a pure token swap; no runtime CSS-in-JS |
| Motion | Framer Motion (`motion`) | Scroll reveals, page-level transitions, spring interactions, reduced-motion aware |
| Primitives | Radix UI | Accessible accordion/dialog/tabs behaviour, styled from scratch |
| Data | Prisma + SQLite (demo) / PostgreSQL (production) | Same schema both ways; no engine-specific features used |
| Auth | Auth.js v5 | Credentials for the demo; OAuth providers drop into the same config |
| Validation | Zod | One schema per boundary, shared between client and server |
| Tests | Vitest + Playwright | Pure logic in unit tests, user journeys in the browser |

## Folder map

```
src/
├── app/
│   ├── (marketing)/              # public site — shares header/footer layout
│   │   ├── page.tsx              # homepage
│   │   ├── celebrities/          # directory + [slug] profile
│   │   ├── news/                 # CMS index + article
│   │   ├── how-it-works/, faq/, legal/[doc]/
│   ├── (auth)/signin, signup     # split-stage auth shell
│   ├── book/[slug]/              # booking wizard (own focused chrome)
│   ├── dashboard/                # client console
│   ├── talent/                   # talent + manager console
│   ├── admin/                    # admin console
│   ├── api/                      # route handlers (search, celebrities, messages,
│   │                             #   newsletter, health, auth)
│   ├── sitemap.ts, robots.ts, opengraph-image.tsx, not-found.tsx
├── components/
│   ├── ui/                       # design-system primitives
│   ├── motion/                   # Reveal, Stagger, TextReveal, Magnetic, Tilt, Parallax, CountUp
│   ├── marketing/, celebrity/, booking/, dashboard/, layout/, auth/
│   └── art/PortraitArt.tsx       # generated placeholder artwork
├── lib/
│   ├── db.ts, auth.ts, queries.ts, talent.ts, types.ts, utils.ts
│   ├── actions/                  # server actions (booking, messages, availability, account)
│   ├── payments/                 # provider interface, registry, escrow rules
│   ├── security/rate-limit.ts
│   └── content/faq.ts
├── emails/templates.ts           # seven transactional templates
├── styles/globals.css            # tokens, utilities, keyframes
└── middleware.ts                 # RBAC guards + API rate limiting
```

## Data model

Twenty-two models. Highlights:

- **Identity** — `User` (role string), `Account`/`Session` (Auth.js), `Manager` (agency
  profile), `Celebrity` (optionally linked to a `User` for the talent console).
- **Catalogue** — `Category`, `Country`, `Media`, `Event`, `Article`, `Availability`
  (one row per date per talent, status `open | held | booked | blocked`).
- **Commerce** — `Booking`, `BookingEvent` (immutable status history that drives the
  timeline UI), `Payment`, `Invoice`, `Contract`.
- **Engagement** — `Conversation`, `ConversationParticipant` (carries `lastReadAt`, which
  is what read receipts are computed from), `Message`, `Notification`, `Review`,
  `SavedCelebrity`, `NewsletterSubscriber`, `AuditLog`.

### Portability decisions

The schema deliberately avoids anything SQLite cannot express, so the same file works on
Postgres by changing one line:

- **Enums are strings**, with the canonical unions in `src/lib/types.ts`.
- **Money is integer cents** — never a float.
- **Structured payloads are JSON strings** (`awards`, `works`, `socials`, `faq`,
  `lineItems`, `wizardDraft`), read through the typed `parseJson<T>()` helper.

## Booking state machine

```
DRAFT → SUBMITTED → UNDER_REVIEW → CONTRACT_SENT → DEPOSIT_PAID → CONFIRMED → COMPLETED
                                                                   ↘         ↘
                                                              CANCELLED → REFUNDED
```

`canTransition(from, to)` in `src/lib/payments/escrow.ts` is the single source of truth,
covered by unit tests. Every transition writes a `BookingEvent` row and notifies the
client, so the timeline in the console is a projection of real history rather than a
derived guess.

Submitting a request also places a **hold** on the requested `Availability` date, so two
clients cannot chase the same night.

## Payments & escrow

`PaymentProvider` (`src/lib/payments/provider.ts`) is the only interface booking code
sees:

```ts
createEscrowIntent() → { providerRef, checkoutUrl, status }
release(providerRef, amountCents)
refund(providerRef, amountCents)
parseWebhook(payload, signature)
```

The registry resolves Stripe, PayPal, Apple Pay and Google Pay slots; without configured
keys each resolves to a deterministic mock so the demo runs offline. Live wiring notes:

- **Stripe** — `PaymentIntent` with `capture_method: "manual"` plus Connect *separate
  charges and transfers*; that pairing is the escrow pattern.
- **PayPal** — Orders API with `intent=AUTHORIZE`, captured at milestone.
- **Apple / Google Pay** — wallet rails riding the Stripe PaymentRequest button.

Milestones default to a 25% deposit at signature and the balance on completion
(`milestoneSchedule`). Refund entitlement (`refundEntitlementCents`) implements the
contract's standard terms: full escrow refund more than 30 days out, deposit forfeited
inside 30 days, nothing after completion.

## Real-time

Messaging ships as a **5-second polling loop** against
`GET /api/messages/[conversationId]`, with optimistic sends and read receipts derived
from `ConversationParticipant.lastReadAt`.

The payload contract is deliberately transport-agnostic, so production swaps the
`setInterval` for a WebSocket or SSE subscription without touching the UI. Typing
indicators, voice notes and video calls are modelled in the schema (`Message.kind`
supports `text | file | voice | system`) and left as documented architecture rather than
half-built features.

## Security

- **RBAC** at three depths: `middleware.ts` guards route prefixes, each console layout
  re-checks the session server-side, and every mutating server action re-verifies both
  the session and ownership of the target record.
- **Validation** — Zod on every route handler, server action and form.
- **CSRF** — server actions are origin-checked by the framework; there are no
  cookie-authenticated mutating GET routes.
- **XSS** — React escapes by default; the only `dangerouslySetInnerHTML` uses are
  `JSON.stringify`-generated JSON-LD and the theme init script. Email templates escape
  interpolated values explicitly (unit-tested).
- **Rate limiting** — per-IP sliding window in `middleware.ts` (30/min on auth, 120/min
  elsewhere), with a self-sweeping in-memory store. Point it at Redis for multi-instance
  deployments; the call signature is unchanged.
- **Headers** — `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` and a
  restrictive `Permissions-Policy` from `next.config.ts`.
- **Audit** — consequential actions write `AuditLog` rows surfaced in the admin console.

## Performance

Server Components fetch data directly with no client waterfall; the directory renders
page one on the server and appends via `IntersectionObserver`. Portrait artwork is
inline SVG (no image requests, no layout shift, resolution-independent). Fonts are
self-hosted variable fonts. The homepage revalidates on a 300-second window; profile and
article routes are statically generated via `generateStaticParams`.

## Accessibility

Semantic landmarks and a skip link, visible focus rings on the `:focus-visible` ring
token, labelled form controls with `role="alert"` errors, `aria-live` regions for wizard
errors and async results, `aria-current` on active navigation, keyboard-navigable search
combobox with `aria-expanded`/`aria-selected`, and a global `prefers-reduced-motion`
rule backed by `useReducedMotion()` in every motion component.
