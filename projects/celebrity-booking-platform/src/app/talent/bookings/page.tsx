import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { PageHeader } from "@/components/dashboard/shell";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resolveTalentContext } from "@/lib/talent";
import { formatDateLong, formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Requests" };

// The next action a manager can take from each state (demo pipeline driver)
const NEXT: Record<string, { to: string; label: string } | undefined> = {
  SUBMITTED: { to: "UNDER_REVIEW", label: "Start review" },
  UNDER_REVIEW: { to: "CONTRACT_SENT", label: "Send contract" },
  CONTRACT_SENT: { to: "DEPOSIT_PAID", label: "Mark deposit received" },
  DEPOSIT_PAID: { to: "CONFIRMED", label: "Confirm engagement" },
  CONFIRMED: { to: "COMPLETED", label: "Mark completed" },
};

export default async function TalentBookings() {
  const session = await auth();
  const { celebrity, roster } = await resolveTalentContext(session!.user.id, session!.user.role);
  if (!celebrity) return null;

  const rosterIds = roster.map((r) => r.id);
  const bookings = await db.booking.findMany({
    where: { celebrityId: { in: rosterIds } },
    include: { client: true, celebrity: true },
    orderBy: { updatedAt: "desc" },
  });

  async function advance(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user || !["TALENT", "MANAGER", "ADMIN"].includes(s.user.role)) return;
    const id = String(formData.get("id"));
    const to = String(formData.get("to"));
    const allowed = Object.values(NEXT).some((n) => n?.to === to);
    if (!allowed) return;
    const booking = await db.booking.findUnique({ where: { id }, include: { celebrity: true } });
    if (!booking) return;
    await Promise.all([
      db.booking.update({ where: { id }, data: { status: to } }),
      db.bookingEvent.create({
        data: { bookingId: id, status: to, note: `Advanced by ${s.user.name}` },
      }),
      db.notification.create({
        data: {
          userId: booking.clientId,
          kind: "booking",
          title: `${booking.reference} · ${to.replace(/_/g, " ").toLowerCase()}`,
          body: `Your booking with ${booking.celebrity.name} moved forward.`,
          href: "/dashboard/bookings",
        },
      }),
      db.auditLog.create({
        data: {
          actorId: s.user.id,
          action: "booking.status_changed",
          entity: `Booking:${id}`,
          detail: JSON.stringify({ from: booking.status, to }),
        },
      }),
    ]);
    revalidatePath("/talent/bookings");
  }

  return (
    <>
      <PageHeader
        title="Requests"
        lead="Drive each engagement down the pipeline — clients are notified at every step."
      />
      <div className="space-y-4">
        {bookings.map((b) => {
          const next = NEXT[b.status];
          return (
            <article
              key={b.id}
              className="flex flex-wrap items-center gap-5 rounded-[var(--radius-xl)] border border-border bg-surface p-5"
            >
              <Avatar name={b.client.name} />
              <div className="min-w-0 flex-1 basis-52">
                <p className="font-medium text-foreground">
                  {b.client.name}
                  <span className="text-faint"> · {b.client.company ?? "Private client"}</span>
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  <span className="capitalize">{b.eventType.replace("-", " ")}</span>
                  {roster.length > 1 && <> for {b.celebrity.name}</>}
                  {b.eventDate && <> · {formatDateLong(b.eventDate)}</>}
                  {b.city && <> · {b.city}</>}
                </p>
                {b.requests && (
                  <p className="mt-1 line-clamp-1 text-xs italic text-faint">“{b.requests}”</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-[0.14em] text-faint">Budget</p>
                <p className="font-display text-lg font-semibold text-gold">
                  {formatMoney(b.budgetCents ?? 0)}
                </p>
              </div>
              <StatusBadge status={b.status} />
              {next && (
                <form action={advance}>
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="to" value={next.to} />
                  <Button size="sm" variant="outline" type="submit">
                    {next.label} →
                  </Button>
                </form>
              )}
            </article>
          );
        })}
        {bookings.length === 0 && (
          <p className="rounded-[var(--radius-xl)] border border-dashed border-border-strong p-16 text-center text-sm text-muted">
            New requests land here the moment a client submits.
          </p>
        )}
      </div>
    </>
  );
}
