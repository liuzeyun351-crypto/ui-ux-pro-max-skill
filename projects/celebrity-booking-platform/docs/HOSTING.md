# Deploying Aurum — step by step

This is a **full-stack Next.js app**, not a static site. It needs Node.js and a
database. Uploading the files to a plain web host serves nothing — that is the
"404 / nothing served" symptom.

Follow **one** of the paths below. Vercel is the fastest.

---

## Before anything: the two things that break deploys

**1. The app is in a subfolder.** If you connect the whole `ui-ux-pro-max-skill`
repository, the host looks in the repository root, finds no Next.js app, builds
nothing and serves a 404. Either set the **Root Directory** to
`projects/celebrity-booking-platform`, or push *just that folder's contents* as
its own repository (recommended — see step 1 below).

**2. SQLite does not work on Vercel or Netlify.** Their filesystems are
read-only and reset on every request. You need a Postgres URL. A free one takes
about a minute to create.

Everything else — creating the schema, seeding the 27 celebrities, switching
Prisma from SQLite to Postgres — now happens automatically during the build
(`scripts/ensure-db.mjs`). You do not run any database commands by hand.

---

## Path A — Vercel (recommended)

### 1. Put the app in its own repository

Unzip the archive, then from inside the `celebrity-booking-platform` folder:

```bash
git init
git add .
git commit -m "Aurum platform"
git branch -M main
git remote add origin https://github.com/<you>/aurum.git
git push -u origin main
```

The Next.js app is now at the repository root, which removes failure #1 entirely.

### 2. Create a free Postgres database

Go to **https://neon.tech** → sign up → **Create project**. Copy the connection
string. It looks like:

```
postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

(Supabase, Vercel Postgres and Railway Postgres all work the same way.)

### 3. Import into Vercel

1. **https://vercel.com/new** → import your `aurum` repository.
2. Framework should auto-detect as **Next.js**. Leave the build command alone.
3. Open **Environment Variables** and add these four:

| Name | Value |
|---|---|
| `DATABASE_URL` | the Neon string from step 2 |
| `AUTH_SECRET` | run `openssl rand -base64 32` and paste the result |
| `AUTH_TRUST_HOST` | `true` |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` |

4. Click **Deploy**.

The build runs `ensure-db`, which detects Postgres, switches the Prisma
provider, creates the tables and seeds the demo content. First deploy takes
about two minutes.

### 4. Check it

Visit `https://your-project.vercel.app/api/health` — you want
`{"status":"ok","db":"up"}`. Then open the site and sign in with
`client@aurum.demo` / `aurum-demo`.

> After the first deploy, update `NEXT_PUBLIC_APP_URL` to your real domain and
> redeploy, so SEO metadata and the sitemap use the right host.

---

## Path B — Netlify

Same as Vercel, with two differences:

1. Netlify needs the Next.js plugin. `netlify.toml` in this folder already
   declares it — do not delete that file.
2. If you connected the monorepo, set **Base directory** to
   `projects/celebrity-booking-platform` in *Site settings → Build & deploy*.

Add the same four environment variables under *Site settings → Environment
variables*, then **Trigger deploy → Clear cache and deploy site**.

---

## Path C — Render

`render.yaml` is included. Create a **New → Blueprint**, point it at your repo,
and paste `DATABASE_URL` and `NEXT_PUBLIC_APP_URL` when prompted (`AUTH_SECRET`
is generated for you). Render can also host the Postgres database.

---

## Path D — Your own server or VPS (Docker)

```bash
unzip aurum-platform.zip && cd celebrity-booking-platform
AUTH_SECRET=$(openssl rand -base64 32) docker compose up --build -d
```

This starts the app, Postgres and Redis together. It is live on port 3000; put
Nginx or Caddy in front for TLS. The schema and seed run automatically.

---

## Path E — cPanel / shared hosting with a Node option

Many shared hosts (Hostinger, Namecheap, A2) have **Setup Node.js App**:

1. Upload and extract the folder into your home directory (not `public_html`).
2. Create a Node app: **Application root** = the extracted folder,
   **Application startup file** = `node_modules/next/dist/bin/next`,
   **Node version** = 20 or 22.
3. Add the same environment variables as Path A.
4. Run **NPM Install**, then in the terminal: `npm run build`.
5. Set the start command to `npm start` and start the app.

If your host has **no** Node option, this app cannot run there. Use Path A —
Vercel's free tier is enough for this demo.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| 404, nothing served | Host built the repo root, not the app folder | Set Root/Base directory, or push the app folder as its own repo (Path A step 1) |
| `The table main.Celebrity does not exist` | Old build without the `prebuild` step | Pull the latest code — `scripts/ensure-db.mjs` now runs automatically |
| `DATABASE_URL is not set` | Env var missing on the host | Add it in the host dashboard, then redeploy |
| Site loads, sign-in fails | `AUTH_SECRET` missing, or `AUTH_TRUST_HOST` not `true` | Add both, redeploy |
| Booking submit fails on Vercel | Still on SQLite | Switch `DATABASE_URL` to Postgres (Path A step 2) |
| Images are generated art, not photos | `fetch:images` has not run | See below |
| `P1001 can't reach database` | Missing SSL mode | Append `?sslmode=require` to the Postgres URL |

---

## Adding the real celebrity photographs

Photographs are fetched, not bundled — run this **locally**, then commit the
result so it deploys with the site:

```bash
npm install
npm run fetch:images        # downloads freely-licensed photos
git add public/media/talent && git commit -m "Add talent photography"
git push                    # host rebuilds with the photos
```

The script prints a coverage line (`Coverage: 27/27 celebrities have a
photograph`) and names anything it could not resolve. Nothing is ever blank —
unresolved names keep their generated portrait.

To pin a specific photo for someone, copy
`scripts/image-overrides.example.json` to `scripts/image-overrides.json`, add
the slug and image URL, and re-run with `--force`.
