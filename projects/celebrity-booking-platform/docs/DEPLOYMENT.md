# Deployment

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | `file:./dev.db` (demo) or a Postgres URL |
| `AUTH_SECRET` | yes | 32+ random bytes: `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | on non-Vercel hosts | `true` behind a proxy |
| `NEXT_PUBLIC_APP_URL` | yes | Canonical origin — feeds metadata, sitemap and OG tags |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | no | Unset ⇒ the mock payment rail |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | no | Same |
| `REDIS_URL` | no | Unset ⇒ in-memory rate limiting (single instance only) |

`.env` in the repo holds safe demo defaults. Never put production secrets there — use
`.env.production` (gitignored) or your platform's secret store.

---

## Option 1 — Vercel (fastest)

1. Import the repository and set **Root Directory** to
   `projects/celebrity-booking-platform`.
2. Add `DATABASE_URL` (a hosted Postgres — Neon, Supabase or Vercel Postgres),
   `AUTH_SECRET` and `NEXT_PUBLIC_APP_URL`.
3. Switch the datasource to Postgres (see *Moving to Postgres* below) and commit.
4. Deploy, then seed once:
   ```bash
   npx prisma db push && npx prisma db seed
   ```

Server Components, server actions, the OG image route and middleware all run natively;
no adapter is needed.

## Option 2 — Docker (portable)

The included `Dockerfile` produces a standalone image (`output: "standalone"` is already
set in `next.config.ts`), and `docker-compose.yml` brings up the app with Postgres and
Redis:

```bash
docker compose up --build
docker compose exec app npx prisma db push
docker compose exec app npx prisma db seed
```

The app listens on `:3000` with a `HEALTHCHECK` against `/api/health`, which verifies
both process liveness and database connectivity.

Set a real `AUTH_SECRET` before exposing the stack:

```bash
AUTH_SECRET=$(openssl rand -base64 32) docker compose up -d
```

## Option 3 — Any Node host

```bash
npm ci
npx prisma generate && npx prisma db push && npx prisma db seed
npm run build
npm start          # or: node .next/standalone/server.js
```

Put a TLS-terminating reverse proxy in front and set `AUTH_TRUST_HOST=true`.

---

## Moving to Postgres

The schema is written to be engine-portable (string enums, integer cents, JSON-encoded
payloads), so migration is a one-line change:

```prisma
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```

Then:

```bash
npx prisma migrate dev --name init     # generates a real migration history
npx prisma db seed
```

For production, use `prisma migrate deploy` in your release step rather than `db push`.

### Redis

Rate limiting falls back to an in-memory sliding window, which is correct only for a
single instance. With more than one, point `src/lib/security/rate-limit.ts` at Redis:
the `rateLimit(key, limit, windowMs)` signature stays identical, so only that file
changes. Redis is also the natural home for search caching and session storage at scale.

---

## Going live: the checklist

**Before launch**

- [ ] Replace generated `PortraitArt` with licensed photography via `next/image`, and
      remove the demo disclaimers in the footer and profile gallery.
- [ ] Replace demo booking fees, availability and reviews with real management data.
- [ ] Wire real payment providers (`src/lib/payments/index.ts`) and register webhooks.
- [ ] Connect an email provider to `src/emails/templates.ts` (Resend, SES or Postmark).
- [ ] Rotate `AUTH_SECRET`; add OAuth providers and enforce 2FA for `ADMIN` accounts.
- [ ] Move rate limiting to Redis and add a WAF/CDN in front.
- [ ] Swap the messaging poll for a WebSocket/SSE relay (see ARCHITECTURE → Real-time).
- [ ] Add error tracking (Sentry) and uptime monitoring against `/api/health`.
- [ ] Confirm the legal documents in `src/app/(marketing)/legal/[doc]/page.tsx` have been
      reviewed by counsel — the demo copy is illustrative only.

**Verify after deploy**

```bash
curl -s https://your-domain/api/health          # {"status":"ok","db":"up"}
curl -s https://your-domain/sitemap.xml | head
curl -sI https://your-domain | grep -i x-frame  # security headers present
```

Then run the smoke suite against the deployment:

```bash
E2E_BASE_URL=https://your-domain npx playwright test
```

---

## CI

`.github/workflows/ci.yml` runs on every push and pull request touching this directory:

1. **verify** — install, seed, `typecheck`, `lint`, unit tests, production build.
2. **e2e** — Playwright Chromium against a freshly seeded instance, uploading the HTML
   report as an artifact when a run fails.
