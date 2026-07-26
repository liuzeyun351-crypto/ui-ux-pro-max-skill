import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shell";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { db } from "@/lib/db";
import { formatDate, formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Bookings · Admin" };

export default async function AdminBookings() {
  const bookings = await db.booking.findMany({
    include: { client: true, celebrity: true, payments: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <>
      <PageHeader title="Bookings" lead={`${bookings.length} engagements across the platform.`} />
      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-[0.14em] text-faint">
              <th className="px-5 py-3 font-medium">Reference</th>
              <th className="px-5 py-3 font-medium">Client</th>
              <th className="px-5 py-3 font-medium">Talent</th>
              <th className="px-5 py-3 font-medium">Event</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Value</th>
              <th className="px-5 py-3 font-medium">Escrow</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-border/60 last:border-0 hover:bg-surface">
                <td className="px-5 py-3.5 font-medium text-gold">{b.reference}</td>
                <td className="px-5 py-3.5">
                  <span className="text-foreground">{b.client.name}</span>
                  <span className="block text-xs text-faint">{b.client.company}</span>
                </td>
                <td className="px-5 py-3.5 text-foreground">{b.celebrity.name}</td>
                <td className="px-5 py-3.5 capitalize text-muted">{b.eventType.replace("-", " ")}</td>
                <td className="px-5 py-3.5 text-muted">{b.eventDate ? formatDate(b.eventDate) : "—"}</td>
                <td className="px-5 py-3.5 tabular-nums text-foreground">
                  {formatMoney(b.quoteCents ?? b.budgetCents ?? 0)}
                </td>
                <td className="px-5 py-3.5 text-xs">
                  {b.payments.some((p) => p.status === "held_in_escrow") ? (
                    <span className="text-gold">● Held</span>
                  ) : b.payments.some((p) => p.status === "released") ? (
                    <span className="text-success">✓ Released</span>
                  ) : (
                    <span className="text-faint">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
