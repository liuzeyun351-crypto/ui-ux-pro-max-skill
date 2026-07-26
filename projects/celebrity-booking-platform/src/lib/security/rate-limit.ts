/**
 * Sliding-window rate limiter. The demo uses an in-memory store (per
 * server instance); in production, point this at Redis (REDIS_URL) so
 * limits hold across instances — the call signature stays identical.
 */
const windows = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  sweepIfDue();
  const now = Date.now();
  const entry = windows.get(key);
  if (!entry || entry.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count += 1;
  if (entry.count > limit) return false;
  return true;
}

// Periodically drop expired windows so the map cannot grow unbounded.
const SWEEP_MS = 5 * 60_000;
let lastSweep = Date.now();
function sweepIfDue() {
  const now = Date.now();
  if (now - lastSweep < SWEEP_MS) return;
  lastSweep = now;
  for (const [k, v] of windows) if (v.resetAt <= now) windows.delete(k);
}
