"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const schema = z.object({
  celebrityId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

// Edit cycle used by the talent console (booked stays under booking control)
const CYCLE: Record<string, string> = { open: "held", held: "blocked", blocked: "open" };

export async function cycleAvailability(input: z.infer<typeof schema>) {
  const session = await auth();
  if (!session?.user || !["TALENT", "MANAGER", "ADMIN"].includes(session.user.role)) {
    return { ok: false as const, error: "Not permitted" };
  }
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid input" };

  // The session must actually control this celebrity
  const celebrity = await db.celebrity.findUnique({
    where: { id: parsed.data.celebrityId },
    include: { manager: true },
  });
  if (!celebrity) return { ok: false as const, error: "Not found" };
  const owns =
    session.user.role === "ADMIN" ||
    celebrity.userId === session.user.id ||
    celebrity.manager.userId === session.user.id;
  if (!owns) return { ok: false as const, error: "Not permitted" };

  const date = new Date(parsed.data.date + "T00:00:00Z");
  const existing = await db.availability.findUnique({
    where: { celebrityId_date: { celebrityId: celebrity.id, date } },
  });

  if (existing?.status === "booked") {
    return { ok: false as const, error: "Booked dates follow the engagement" };
  }

  const status = existing ? CYCLE[existing.status] ?? "open" : "held";
  if (existing) {
    await db.availability.update({ where: { id: existing.id }, data: { status } });
  } else {
    await db.availability.create({ data: { celebrityId: celebrity.id, date, status } });
  }
  revalidatePath(`/celebrities/${celebrity.slug}`);
  return { ok: true as const, status };
}
