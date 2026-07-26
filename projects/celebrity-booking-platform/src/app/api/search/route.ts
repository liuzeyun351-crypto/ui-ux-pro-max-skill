import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const querySchema = z.object({ q: z.string().min(1).max(80) });

/**
 * Instant search behind the hero and directory type-ahead.
 * Ranks name prefix > name substring > tagline/category, then popularity.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({ q: searchParams.get("q") ?? "" });
  if (!parsed.success) return NextResponse.json({ results: [] });
  const q = parsed.data.q.trim();

  const rows = await db.celebrity.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { tagline: { contains: q } },
        { category: { name: { contains: q } } },
        { country: { name: { contains: q } } },
      ],
    },
    include: { category: true, country: true },
    take: 24,
  });

  const ql = q.toLowerCase();
  const scored = rows
    .map((c) => {
      const name = c.name.toLowerCase();
      let score = c.popularity / 100;
      if (name.startsWith(ql)) score += 3;
      else if (name.includes(ql)) score += 2;
      else if (c.category.name.toLowerCase().includes(ql)) score += 1;
      return { c, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ c }) => ({
      slug: c.slug,
      name: c.name,
      category: c.category.name,
      country: c.country.flag,
      hue: c.accentHue,
      feeFromCents: c.feeFromCents,
      verified: c.verified,
    }));

  return NextResponse.json(
    { results: scored },
    { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" } }
  );
}
