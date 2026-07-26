import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shell";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDateLong } from "@/lib/utils";

export const metadata: Metadata = { title: "Calendar" };

export default async function CalendarPage() {
  const session = await auth();
  const bookings = await db.booking.findMany({
    where: { clientId: session!.user.id, eventDate: { not: null } },
    include: { celebrity: true },
    orderBy: { eventDate: "asc" },
  });

  const byMonth = new Map<string, typeof bookings>();
  for (const b of bookings) {
    const key = b.eventDate!.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    byMonth.set(key, [...(byMonth.get(key) ?? []), b]);
  }

  return (
    <>
      <PageHeader title="Calendar" lead="Every date you hold, in one program." />
      <div className="space-y-10">
        {[...byMonth.entries()].map(([month, list]) => (
          <section key={month} aria-label={month}>
            <h2 className="hairline-gold mb-5 pb-2 font-display text-xl font-medium text-foreground">
              {month}
            </h2>
            <ol className="space-y-3">
              {list.map((b) => {
                const past = b.eventDate! < new Date();
                return (
                  <li
                    key={b.id}
                    className={`flex items-center gap-5 rounded-[var(--radius-lg)] border border-border bg-surface p-4 ${past ? "opacity-60" : ""}`}
                  >
                    <div className="grid size-14 shrink-0 place-items-center rounded-[var(--radius-sm)] border border-gold/30 text-center">
                      <span>
                        <span className="block font-display text-xl font-semibold leading-none text-gold">
                          {b.eventDate!.getDate()}
                        </span>
                        <span className="block text-[10px] uppercase text-faint">
                          {b.eventDate!.toLocaleDateString("en-US", { weekday: "short" })}
                        </span>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">{b.celebrity.name}</p>
                      <p className="truncate text-sm text-muted">
                        <span className="capitalize">{b.eventType.replace("-", " ")}</span> ·{" "}
                        {b.venue || b.city} · {formatDateLong(b.eventDate!)}
                      </p>
                    </div>
                    <StatusBadge status={b.status} />
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
        {bookings.length === 0 && (
          <p className="rounded-[var(--radius-xl)] border border-dashed border-border-strong p-16 text-center text-sm text-muted">
            Confirmed dates appear here as your bookings progress.
          </p>
        )}
      </div>
    </>
  );
}
