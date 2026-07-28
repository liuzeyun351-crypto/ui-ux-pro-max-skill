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

## Path A — Vercel, in full detail

Vercel is made by the people who make Next.js, so this app runs there with no
adaptation. The free "Hobby" plan is enough for this demo. Budget 20–30 minutes
the first time.

You will do four things: **put the code on GitHub**, **create a database**,
**connect Vercel**, **check it works**.

### What you need first

- A **GitHub** account — https://github.com/signup (free)
- A **Vercel** account — https://vercel.com/signup (choose *Continue with GitHub*)
- A **Neon** account for the database — https://neon.tech (free)
- The `aurum-platform.zip` file, unzipped somewhere you can find it

You do not need to install anything on your computer if you use the web-upload
method in step 1b.

---

### Step 1 — Put the app on GitHub

Vercel deploys from a Git repository. It cannot deploy from a zip file.

> **Important:** upload the *contents* of the `celebrity-booking-platform`
> folder, so that `package.json` sits at the top level of the repository. If
> `package.json` ends up one folder down, Vercel finds no app and you get a 404.

#### 1a. If you have Git installed

Open a terminal **inside** the `celebrity-booking-platform` folder and run:

```bash
git init
git add .
git commit -m "Aurum platform"
git branch -M main
```

Then create an empty repository at https://github.com/new — name it `aurum`,
leave "Add a README" **unticked** — and run the two lines GitHub shows you:

```bash
git remote add origin https://github.com/YOUR-USERNAME/aurum.git
git push -u origin main
```

#### 1b. If you have never used Git (web upload)

1. Go to https://github.com/new, name the repository `aurum`, choose
   **Private**, leave every checkbox unticked, click **Create repository**.
2. On the next screen click **uploading an existing file**.
3. Open the `celebrity-booking-platform` folder on your computer, select
   **everything inside it** (Ctrl+A / Cmd+A), and drag it into the browser.
   - Do not drag the folder itself. Drag what is *inside* it.
   - GitHub's uploader skips empty folders; that is fine here.
4. Scroll down, click **Commit changes**.

Check: the repository's file list should show `package.json`, `next.config.ts`
and a `src` folder at the top. If instead you see a single
`celebrity-booking-platform` folder, delete the repository and redo step 3.

---

### Step 2 — Create the database

The app ships configured for SQLite, which is a single file. That works on your
laptop but **not** on Vercel: Vercel's servers have a read-only disk that is
wiped between requests. You need a hosted Postgres database. Neon gives one away
free.

1. Go to https://neon.tech and sign up.
2. Click **Create project**. Any name, any region — pick the region closest to
   your audience.
3. When the project opens you will see a **Connection string** box. Copy it.

It looks like this:

```
postgresql://neondb_owner:AbCd1234@ep-cool-name-12345678.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

> **One thing to watch.** Neon offers a *pooled* connection string, which
> contains `-pooler` in the hostname. Use the one **without** `-pooler`. The
> build creates database tables, and that operation is unreliable through a
> connection pooler. If Neon shows you the pooled one by default, look for a
> **Connection pooling** toggle and switch it off before copying.

Keep this string somewhere for the next step. It contains a password — treat it
like one.

---

### Step 3 — Create your AUTH_SECRET

This is a random string the app uses to sign login sessions. It must be secret
and it must not be the demo value.

**If you have a Mac or Linux terminal:**

```bash
openssl rand -base64 32
```

**If you are on Windows, or would rather not use a terminal:** open any browser,
press **F12** to open developer tools, click the **Console** tab, paste this and
press Enter:

```js
btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
```

Either way you get a ~44-character string like
`k3Jd8fLp2QmXvR7tYs1WbN4hZc6Ae0Gu9Ij5Ko3Pl2M=`. Copy it.

That runs entirely inside your own browser — nothing is sent anywhere. Do not
use a random "password generator" website for this.

---

### Step 4 — Import the project into Vercel

1. Go to **https://vercel.com/new**.
2. Under *Import Git Repository*, find `aurum` and click **Import**.
   - If you don't see it, click **Adjust GitHub App Permissions** and grant
     Vercel access to that repository.
3. On the configure screen:
   - **Framework Preset** should already say **Next.js**. If it says "Other",
     stop — your `package.json` is probably not at the repository root
     (revisit step 1).
   - **Root Directory** should be `./`. Only change this if you uploaded the
     whole monorepo, in which case set it to
     `projects/celebrity-booking-platform`.
   - Leave **Build Command**, **Output Directory** and **Install Command**
     exactly as they are.
4. Expand **Environment Variables** and add these four. Add them one at a time:
   type the name in the left box, the value in the right box, click **Add**.

| Name | Value |
|---|---|
| `DATABASE_URL` | the Neon string from step 2 |
| `AUTH_SECRET` | the random string from step 3 |
| `AUTH_TRUST_HOST` | `true` |
| `NEXT_PUBLIC_APP_URL` | `https://aurum.vercel.app` — your best guess at the URL; you will correct it in step 6 |

5. Click **Deploy**.

The first build takes roughly two to four minutes. You will see a live log.

---

### Step 5 — What the build is doing

You do not need to run any database commands by hand. Watch for these lines in
the log — they tell you it is working:

```
[ensure-db] switching datasource provider sqlite → postgresql
[ensure-db] syncing schema…
[ensure-db] empty database — seeding demo content…
Photography: 27 freely-licensed portraits found
Seed complete: { users: 13, celebrities: 27, ... }
[ensure-db] ready
```

That is `scripts/ensure-db.mjs`. On every deploy it looks at `DATABASE_URL`,
switches Prisma from SQLite to Postgres to match, creates the tables, and seeds
the demo content **only if the database is empty**. So redeploying later will
not wipe anything you have added.

When it finishes you get a **Congratulations** screen and a preview thumbnail.

---

### Step 6 — Check it, then fix the URL

1. Click **Continue to Dashboard**, then **Visit** to open your live site.
2. Add `/api/health` to the end of the URL. You want to see:

   ```json
   {"status":"ok","db":"up","time":"..."}
   ```

   If you see `"db":"down"`, the database is not reachable — see the
   troubleshooting table below.
3. Go back to the homepage and sign in with `client@aurum.demo` /
   `aurum-demo`. The sign-in page has one-click buttons for each demo persona.
4. Now copy your **real** URL from the address bar (Vercel assigns something
   like `https://aurum-git-main-yourname.vercel.app` plus a shorter
   `https://aurum.vercel.app`). Go to
   **Project → Settings → Environment Variables**, edit `NEXT_PUBLIC_APP_URL`
   to that value, and save.
5. Go to **Deployments**, click the **…** menu on the newest one, and choose
   **Redeploy**.

That last step matters: `NEXT_PUBLIC_APP_URL` is baked into the page metadata,
the sitemap and the social sharing card at build time, so it only takes effect
after a rebuild.

---

### Step 7 (optional) — Your own domain

1. **Project → Settings → Domains → Add**, type your domain, click **Add**.
2. Vercel shows you either an **A record** (`76.76.21.21`) or a **CNAME**
   (`cname.vercel-dns.com`). Add that record at your domain registrar — GoDaddy,
   Namecheap, Cloudflare, wherever you bought it.
3. DNS usually propagates in minutes; Vercel issues the HTTPS certificate
   automatically once it sees the record.
4. Update `NEXT_PUBLIC_APP_URL` to `https://yourdomain.com` and redeploy, as in
   step 6.

---

### After the first deploy

Every time you push to the `main` branch on GitHub, Vercel rebuilds and deploys
automatically. Pull requests get their own preview URL. There is nothing else to
wire up.

---

### Vercel troubleshooting

| What you see | What it means | What to do |
|---|---|---|
| Framework Preset says "Other" | `package.json` is not at the repository root | Re-upload the folder *contents*, or set Root Directory to the app folder |
| Build fails: `DATABASE_URL is not set` | The environment variable is missing or was added after the build started | Add it under Settings → Environment Variables, then **Redeploy** |
| Build fails: `P1001 Can't reach database server` | Wrong host, or SSL not requested | Check the string; make sure it ends with `?sslmode=require` |
| Build fails during `prisma db push`, mentions prepared statements | You used the **pooled** Neon string | Swap to the connection string without `-pooler`, redeploy |
| Build succeeds, site 404s | Root Directory points at the wrong folder | Settings → General → Root Directory |
| Site loads but sign-in bounces back to /signin | `AUTH_SECRET` missing, or `AUTH_TRUST_HOST` not set to `true` | Add both, redeploy |
| `/api/health` returns `"db":"down"` | Database unreachable at runtime | Confirm the Neon project is not suspended (free projects idle out but wake on connection), re-check `DATABASE_URL` |
| Everything works but URLs in metadata are wrong | `NEXT_PUBLIC_APP_URL` still has the placeholder | Fix it and redeploy — step 6 |

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
| `P1001 can't reach database` | Missing SSL mode | Append `?sslmode=require` to the Postgres URL |

---

## The celebrity photographs

**Nothing to do — they are already in the repository.** `public/media/talent/`
holds 104 freely-licensed images covering all 27 people on the roster, and they
deploy with the rest of the code.

If you later want higher-resolution versions, run this on your own machine and
push the result:

```bash
npm install
npm run fetch:images        # re-downloads at full resolution
git add public/media/talent && git commit -m "Higher-resolution photography"
git push                    # Vercel rebuilds with the new files
```

Photographer and licence are recorded for every image and shown on each profile,
under each gallery tile and story hero, and on the `/credits` page.
