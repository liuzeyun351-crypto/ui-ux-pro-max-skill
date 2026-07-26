"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { EVENT_TYPES } from "@/lib/types";

const submitSchema = z.object({
  celebritySlug: z.string().min(1),
  eventType: z.enum(EVENT_TYPES.map((e) => e.value) as [string, ...string[]]),
  city: z.string().min(2).max(80),
  countryName: z.string().min(2).max(80),
  venue: z.string().max(120).optional().or(z.literal("")),
  guestCount: z.coerce.number().int().min(0).max(500_000).optional(),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((d) => new Date(d + "T00:00:00Z") > new Date(), "Date must be in the future"),
  budgetCents: z.coerce.number().int().min(1_000_00, "Minimum budget is $1,000"),
  requests: z.string().max(2000).optional().or(z.literal("")),
});

export type SubmitBookingInput = z.infer<typeof submitSchema>;

export interface SubmitBookingResult {
  ok: boolean;
  reference?: string;
  error?: string;
}

/** Generates the next AUR-YYYY-NNNN reference (demo-grade sequencing). */
async function nextReference(): Promise<string> {
  const year = new Date().getUTCFullYear();
  const count = await db.booking.count({
    where: { reference: { startsWith: `AUR-${year}-` } },
  });
  return `AUR-${year}-${String(count + 200).padStart(4, "0")}`;
}

export async function submitBooking(input: SubmitBookingInput): Promise<SubmitBookingResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "You must be signed in to submit a booking." };
  }

  const parsed = submitSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid booking details." };
  }
  const data = parsed.data;

  const celebrity = await db.celebrity.findUnique({
    where: { slug: data.celebritySlug },
    include: { manager: true },
  });
  if (!celebrity) return { ok: false, error: "Talent not found." };

  const eventDate = new Date(data.eventDate + "T00:00:00Z");

  // The chosen date must not be already booked/blocked in the calendar
  const slot = await db.availability.findUnique({
    where: { celebrityId_date: { celebrityId: celebrity.id, date: eventDate } },
  });
  if (slot && slot.status !== "open") {
    return { ok: false, error: "That date is no longer open — please choose another." };
  }

  const reference = await nextReference();

  const booking = await db.booking.create({
    data: {
      reference,
      clientId: session.user.id,
      celebrityId: celebrity.id,
      status: "SUBMITTED",
      eventType: data.eventType,
      eventDate,
      city: data.city,
      countryName: data.countryName,
      venue: data.venue || null,
      guestCount: data.guestCount ?? null,
      budgetCents: data.budgetCents,
      requests: data.requests || null,
    },
  });

  await Promise.all([
    db.bookingEvent.create({
      data: { bookingId: booking.id, status: "SUBMITTED", note: "Request submitted by client" },
    }),
    // Hold the requested date while management reviews
    slot
      ? db.availability.update({ where: { id: slot.id }, data: { status: "held" } })
      : db.availability.create({
          data: { celebrityId: celebrity.id, date: eventDate, status: "held" },
        }),
    db.notification.create({
      data: {
        userId: session.user.id,
        kind: "booking",
        title: `Request ${reference} submitted`,
        body: `Your ${data.eventType.replace("-", " ")} request for ${celebrity.name} is with ${celebrity.manager.agencyName}. Expect an itemized quote within 5 business days.`,
        href: "/dashboard/bookings",
      },
    }),
    db.notification.create({
      data: {
        userId: celebrity.manager.userId,
        kind: "booking",
        title: `New request for ${celebrity.name}`,
        body: `${session.user.name ?? "A client"} requested a ${data.eventType.replace("-", " ")} in ${data.city} · ${reference}`,
        href: "/talent",
      },
    }),
    db.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "booking.submitted",
        entity: `Booking:${booking.id}`,
        detail: JSON.stringify({ reference, celebrity: celebrity.slug }),
      },
    }),
  ]);

  revalidatePath("/dashboard/bookings");
  revalidatePath(`/celebrities/${celebrity.slug}`);
  return { ok: true, reference };
}
