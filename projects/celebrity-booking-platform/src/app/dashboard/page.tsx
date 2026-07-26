import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shell";
import { StatTile } from "@/components/dashboard/charts";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { PortraitArt } from "@/components/art/PortraitArt";
import { ButtonLink, ArrowGlyph } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDateLong, formatMoney, relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

function greeting(hour = new Date().getHours()) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardOverview() {
  const session = await auth();
  const userId = session!.user.id;

  const [bookings, escrow, saved, notifications] = await Promise.all([
    db.booking.findMany({
      where: { clientId: userId },
      include: { celebrity: true },
      orderBy: { updatedAt: "desc" },
    }),
    db.payment.aggregate({
      where: { booking: { clientId: userId }, status: "held_in_escrow" },
      _sum: { amountCents: true },
    }),
    db.savedCelebrity.count({ where: { userId } }),
    db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const active = bookings.filter((b) =>
    ["SUBMITTED", "UNDER_REVIEW", "CONTRACT_SENT", "DEPOSIT_PAID", "CONFIRMED"].includes(b.status)
  );
  const next = active
    .filter((b) => b.eventDate && b.eventDate > new Date())
    .sort((a, b) => a.eventDate!.getTime() - b.eventDate!.getTime())[0];

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${session!.user.name?.split(" ")[0] ?? "there"}`}
        lead="Here's where your productions stand."
        action={
          <ButtonLink href="/celebrities" size="sm">
            New booking <ArrowGlyph />
          </ButtonLink>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Active bookings" value={String(active.length)} hint="in the pipeline" />
        <StatTile
          label="Held in escrow"
          value={formatMoney(escrow._sum.amountCents ?? 0)}
          hint="released on milestones"
        />
        <StatTile
          label="Completed events"
          value={String(bookings.filter((b) => b.status === "COMPLETED").length)}
          hint="all time"
        />
        <StatTile label="Saved talent" value={String(saved)} hint="on your shortlist" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* next event */}
        <section
          aria-labelledby="next-event"
          className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface"
        >
          <h2 id="next-event" className="sr-only">
            Next event
          </h2>
          {next ? (
            <div className="flex h-full flex-col sm:flex-row">
              <div className="relative h-44 w-full shrink-0 sm:h-auto sm:min-h-56 sm:w-52">
                <PortraitArt
                  name={next.celebrity.name}
                  hue={next.celebrity.accentHue}
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center p-7">
                <p className="kicker mb-2">Next on stage</p>
                <p className="font-display text-2xl font-medium text-foreground">
                  {next.celebrity.name}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {formatDateLong(next.eventDate!)} · {next.venue || next.city}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <StatusBadge status={next.status} />
                  <span className="text-xs text-faint">Ref {next.reference}</span>
                </div>
                <Link
                  href="/dashboard/bookings"
                  className="mt-5 text-sm font-medium text-gold underline-offset-4 hover:underline"
                >
                  View booking →
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center">
              <p className="font-display text-xl text-foreground">No upcoming events yet</p>
              <p className="mx-auto mt-2 max-w-xs text-sm text-muted">
                When a booking confirms, your next production appears here with its countdown.
              </p>
              <ButtonLink href="/celebrities" size="sm" className="mt-5">
                Browse talent
              </ButtonLink>
            </div>
          )}
        </section>

        {/* recent notifications */}
        <section aria-labelledby="recent-activity" className="rounded-[var(--radius-xl)] border border-border bg-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="recent-activity" className="text-sm font-medium text-foreground">
              Recent activity
            </h2>
            <Link href="/dashboard/notifications" className="text-xs text-faint hover:text-gold">
              View all
            </Link>
          </div>
          <ul className="space-y-4">
            {notifications.map((n) => (
              <li key={n.id} className="flex gap-3">
                <span
                  aria-hidden
                  className={`mt-1.5 size-1.5 shrink-0 rounded-full ${n.readAt ? "bg-border-strong" : "bg-gold"}`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug text-foreground">{n.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted">{n.body}</p>
                  <p className="mt-1 text-[11px] text-faint">{relativeTime(n.createdAt)}</p>
                </div>
              </li>
            ))}
            {notifications.length === 0 && (
              <li className="text-sm text-faint">All quiet backstage.</li>
            )}
          </ul>
        </section>
      </div>

      {/* pipeline strip */}
      <section aria-labelledby="pipeline-heading" className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="pipeline-heading" className="text-sm font-medium text-foreground">
            Booking pipeline
          </h2>
          <Link href="/dashboard/bookings" className="text-xs text-faint hover:text-gold">
            All bookings
          </Link>
        </div>
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-[0.14em] text-faint">
                <th className="px-5 py-3 font-medium">Reference</th>
                <th className="px-5 py-3 font-medium">Talent</th>
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface">
                  <td className="px-5 py-3.5 font-medium text-gold">{b.reference}</td>
                  <td className="px-5 py-3.5 text-foreground">{b.celebrity.name}</td>
                  <td className="px-5 py-3.5 capitalize text-muted">
                    {b.eventType.replace("-", " ")}
                  </td>
                  <td className="px-5 py-3.5 text-muted">
                    {b.eventDate ? formatDateLong(b.eventDate).split(",").slice(0, 2).join(",") : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
