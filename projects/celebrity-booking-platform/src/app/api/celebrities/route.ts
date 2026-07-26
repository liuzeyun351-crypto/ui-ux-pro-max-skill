import { NextResponse } from "next/server";
import { z } from "zod";
import { queryCelebrities } from "@/lib/queries";

const schema = z.object({
  q: z.string().max(80).optional(),
  category: z.string().max(40).optional(),
  country: z.string().max(2).optional(),
  gender: z.enum(["female", "male", "nonbinary"]).optional(),
  availability: z.enum(["available", "limited", "booked"]).optional(),
  minFee: z.coerce.number().int().min(0).max(10_000_000).optional(),
  maxFee: z.coerce.number().int().min(0).max(10_000_000).optional(),
  verified: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  sort: z.enum(["popularity", "price-asc", "price-desc", "trending", "recent", "az"]).optional(),
  cursor: z.coerce.number().int().min(0).optional(),
});

/** Paginated directory feed backing the infinite scroll. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = Object.fromEntries(
    [...searchParams.entries()].filter(([, v]) => v !== "")
  );
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid filters" }, { status: 400 });
  }
  const { items, total, nextCursor } = await queryCelebrities(parsed.data);
  return NextResponse.json({ items, total, nextCursor });
}
