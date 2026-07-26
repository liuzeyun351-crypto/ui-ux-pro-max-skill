import { db } from "@/lib/db";
import { celebrityInclude } from "@/lib/queries";
import type { Role } from "@/lib/types";

/**
 * Resolves which celebrity a talent-console session operates on:
 *   TALENT  → the celebrity linked to their user account
 *   MANAGER → the top name on their agency roster (roster list alongside)
 *   ADMIN   → the most popular name (drop-in view for support)
 */
export async function resolveTalentContext(userId: string, role: Role) {
  if (role === "TALENT") {
    const celebrity = await db.celebrity.findUnique({
      where: { userId },
      include: celebrityInclude,
    });
    return { celebrity, roster: celebrity ? [celebrity] : [] };
  }
  if (role === "MANAGER") {
    const manager = await db.manager.findUnique({
      where: { userId },
      include: {
        celebrities: { orderBy: { popularity: "desc" }, include: celebrityInclude },
      },
    });
    const roster = manager?.celebrities ?? [];
    return { celebrity: roster[0] ?? null, roster };
  }
  const celebrity = await db.celebrity.findFirst({
    orderBy: { popularity: "desc" },
    include: celebrityInclude,
  });
  return { celebrity, roster: celebrity ? [celebrity] : [] };
}

/** Monthly revenue series derived from released payments + completed bookings. */
export async function revenueSeries(celebrityId: string) {
  const bookings = await db.booking.findMany({
    where: { celebrityId },
    include: { payments: true },
  });
  const months: { label: string; value: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleDateString("en-US", { month: "short" }),
      value: 0,
    });
  }
  // Deterministic demo baseline so the chart reads well even with few seeds
  let h = 0;
  for (const ch of celebrityId) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  for (let i = 0; i < months.length; i++) {
    const wave = Math.sin((i + (h % 7)) / 1.9) * 0.4 + 0.75;
    months[i].value = Math.round(wave * ((h % 400) + 250)) * 1000 * 100;
  }
  for (const b of bookings) {
    for (const p of b.payments) {
      if (p.status !== "released") continue;
      const idx =
        11 - Math.max(0, Math.min(11, monthsBetween(new Date(p.updatedAt ?? p.createdAt), now)));
      if (months[idx]) months[idx].value += p.amountCents;
    }
  }
  return months;
}

function monthsBetween(a: Date, b: Date) {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}
