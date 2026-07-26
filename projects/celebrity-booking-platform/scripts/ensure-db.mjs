/**
 * Make `npm run build` self-sufficient on any host.
 *
 * Three things bite when deploying this app and none of them are the host's
 * fault:
 *
 *  1. The database file is not committed, so a fresh clone has no schema and
 *     the build dies in `generateStaticParams` with
 *     "The table main.Celebrity does not exist".
 *  2. Prisma's `provider` is hardcoded in schema.prisma, so a Postgres
 *     DATABASE_URL against a sqlite schema fails with a confusing error.
 *  3. Serverless hosts never run `prisma db push && prisma db seed` for you.
 *
 * This script runs as `prebuild` and handles all three: it matches the schema
 * provider to whatever DATABASE_URL points at, pushes the schema, and seeds
 * only when the roster is empty — so redeploying never overwrites live data.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import nextEnv from "@next/env";

// Next loads .env itself, but this runs before Next starts. Use Next's own
// loader so the precedence rules (.env.local > .env, host vars win) match
// exactly what the app will see at runtime. @next/env is CommonJS, so it has
// to come in as a default import rather than a named one.
nextEnv.loadEnvConfig(process.cwd());

const run = (cmd) => execSync(cmd, { stdio: "inherit", env: process.env });
const log = (msg) => console.log(`[ensure-db] ${msg}`);

const url = (process.env.DATABASE_URL ?? "").trim();
if (!url) {
  console.error(
    "\n[ensure-db] DATABASE_URL is not set.\n\n" +
      "  Local:      leave .env alone — it defaults to DATABASE_URL=\"file:./dev.db\"\n" +
      "  Vercel etc: add DATABASE_URL as an environment variable (Postgres).\n" +
      "              A free Neon database works: https://neon.tech\n"
  );
  process.exit(1);
}

// ── 1. match the schema provider to the connection string ──
const SCHEMA = path.join(process.cwd(), "prisma", "schema.prisma");
const provider =
  url.startsWith("postgres://") || url.startsWith("postgresql://")
    ? "postgresql"
    : url.startsWith("mysql://")
      ? "mysql"
      : "sqlite";

const schema = fs.readFileSync(SCHEMA, "utf8");
const current = schema.match(/provider\s*=\s*"(sqlite|postgresql|mysql)"/)?.[1];
if (current && current !== provider) {
  log(`switching datasource provider ${current} → ${provider}`);
  fs.writeFileSync(
    SCHEMA,
    schema.replace(
      /(datasource\s+db\s*\{[^}]*?provider\s*=\s*)"(?:sqlite|postgresql|mysql)"/s,
      `$1"${provider}"`
    )
  );
  run("npx prisma generate");
} else {
  log(`datasource provider: ${provider}`);
}

if (provider === "sqlite") {
  // Prisma resolves relative sqlite paths against prisma/, not the cwd.
  const file = path.resolve(process.cwd(), "prisma", url.slice("file:".length));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  log(`sqlite file: ${path.relative(process.cwd(), file)}`);
  if (process.env.VERCEL || process.env.NETLIFY) {
    console.warn(
      "[ensure-db] WARNING: SQLite on a serverless host is read-only and resets\n" +
        "            on every deploy. Browsing works; sign-up and booking\n" +
        "            submission will fail. Use Postgres — see docs/HOSTING.md."
    );
  }
}

// ── 2. push the schema (idempotent) ──
log("syncing schema…");
try {
  run("npx prisma db push --skip-generate --accept-data-loss");
} catch {
  console.error(
    "\n[ensure-db] Could not reach the database.\n" +
      "            Check DATABASE_URL is correct and the database accepts\n" +
      "            connections from your host (Neon/Supabase need ?sslmode=require).\n"
  );
  process.exit(1);
}

// ── 3. seed only when empty ──
const { PrismaClient } = await import("@prisma/client");
const db = new PrismaClient();
let count = 0;
try {
  count = await db.celebrity.count();
} catch {
  count = 0;
} finally {
  await db.$disconnect();
}

if (count > 0) {
  log(`roster already populated (${count} celebrities) — skipping seed`);
} else {
  log("empty database — seeding demo content…");
  run("npx tsx prisma/seed.ts");
}

log("ready");
