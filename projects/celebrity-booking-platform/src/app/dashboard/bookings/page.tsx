import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shell";
import { StatusBadge, BOOKING_PIPELINE } from "@/components/dashboard/status-badge";
import { TalentImage } from "@/components/art/TalentImage";
import { ButtonLink, ArrowGlyph } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cn, formatDate, formatDateLong, formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Bookings" };

export default async function BookingsPage() {
  const session = await auth();
  const bookings = await db.booking.findMany({
    where: { clientId: session!.user.id },
    include: {
      celebrity: { include: { manager: { include: { user: true } } } },
      events: { orderBy: { createdAt: "asc" } },
      contract: true,
      payments: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <>
      <PageHeader
        title="Bookings"
        lead={`${bookings.length} engagements, newest first.`}
        action={
          <ButtonLink href="/celebrities" size="sm">
            New booking <ArrowGlyph />
          </ButtonLink>
        }
      />

      <div className="space-y-5">
        {bookings.map((b) => {
          const pipelineIdx = BOOKING_PIPELINE.indexOf(
            b.status as (typeof BOOKING_PIPELINE)[number]
          );
          const terminal = ["CANCELLED", "REFUNDED"].includes(b.status);
          return (
            <details
              key={b.id}
              className="group overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface open:border-gold/30 open:shadow-soft"
            >
              <summary className="flex cursor-pointer list-none items-center gap-5 p-5 transition-colors hover:bg-surface-raised/50 [&::-webkit-details-marker]:hidden">
                <div className="relative hidden size-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-border sm:block">
                  <TalentImage
                    celebrity={b.celebrity}
                    className="absolute inset-0 h-full w-full object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="font-display text-lg font-medium text-foreground">
                      {b.celebrity.name}
                    </p>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted">
                    <span className="capitalize">{b.eventType.replace("-", " ")}</span>
                    {b.eventDate && <> · {formatDate(b.eventDate)}</>}
                    {b.city && <> · {b.city}</>}
                    <span className="text-faint"> · {b.reference}</span>
                  </p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-faint">
                    {b.quoteCents ? "Quoted" : "Budget"}
                  </p>
                  <p className="font-display text-lg font-semibold text-gold">
                    {formatMoney(b.quoteCents ?? b.budgetCents ?? 0)}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-muted transition-transform duration-300 group-open:rotate-90"
                >
                  ›
                </span>
              </summary>

              <div className="border-t border-border px-5 py-6 sm:px-7">
                {/* status timeline */}
                {!terminal && (
                  <ol className="mb-8 flex flex-wrap items-center gap-y-3">
                    {BOOKING_PIPELINE.map((s, i) => {
                      const done = i <= pipelineIdx;
                      return (
                        <li key={s} className="flex items-center">
                          <span
                            className={cn(
                              "flex items-center gap-2 text-xs",
                              done ? "font-medium text-gold" : "text-faint"
                            )}
                          >
                            <span
                              aria-hidden
                              className={cn(
                                "grid size-5 place-items-center rounded-full border text-[9px]",
                                done ? "border-gold bg-gold text-on-gold" : "border-border"
                              )}
                            >
                              {done ? "✓" : i + 1}
                            </span>
                            <span className="capitalize">{s.replace(/_/g, " ").toLowerCase()}</span>
                          </span>
                          {i < BOOKING_PIPELINE.length - 1 && (
                            <span
                              aria-hidden
                              className={cn(
                                "mx-3 h-px w-6 sm:w-10",
                                i < pipelineIdx ? "bg-gold/60" : "bg-border"
                              )}
                            />
                          )}
                        </li>
                      );
                    })}
                  </ol>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  <div>
                    <h3 className="kicker mb-3 !text-[10px]">Event brief</h3>
                    <dl className="space-y-2 text-sm">
                      <Row k="Date" v={b.eventDate ? formatDateLong(b.eventDate) : "TBC"} />
                      <Row k="Venue" v={b.venue ?? "To be shortlisted"} />
                      <Row k="Location" v={[b.city, b.countryName].filter(Boolean).join(", ") || "—"} />
                      <Row k="Guests" v={b.guestCount ? b.guestCount.toLocaleString() : "—"} />
                    </dl>
                  </div>
                  <div>
                    <h3 className="kicker mb-3 !text-[10px]">Commercials</h3>
                    <dl className="space-y-2 text-sm">
                      <Row k="Budget" v={b.budgetCents ? formatMoney(b.budgetCents) : "—"} />
                      <Row k="Quote" v={b.quoteCents ? formatMoney(b.quoteCents) : "Pending"} />
                      <Row
                        k="Deposit"
                        v={b.depositCents ? `${formatMoney(b.depositCents)} (25%)` : "—"}
                      />
                      <Row
                        k="Escrow"
                        v={
                          b.payments.find((p) => p.status === "held_in_escrow")
                            ? "Funds held ✓"
                            : b.payments.some((p) => p.status === "released")
                              ? "Released"
                              : "Not funded"
                        }
                      />
                    </dl>
                  </div>
                  <div>
                    <h3 className="kicker mb-3 !text-[10px]">History</h3>
                    <ol className="space-y-2.5">
                      {b.events.map((e) => (
                        <li key={e.id} className="flex gap-3 text-xs">
                          <span aria-hidden className="mt-1 size-1.5 shrink-0 rounded-full bg-gold/70" />
                          <span>
                            <span className="capitalize text-foreground">
                              {e.status.replace(/_/g, " ").toLowerCase()}
                            </span>
                            <span className="block text-faint">{formatDate(e.createdAt)}</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {b.requests && (
                  <div className="mt-6 rounded-[var(--radius-md)] border border-border bg-background p-4">
                    <h3 className="kicker mb-2 !text-[10px]">Special requests</h3>
                    <p className="text-sm leading-relaxed text-muted">{b.requests}</p>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
                  <ButtonLink size="sm" variant="outline" href="/dashboard/messages">
                    Message {b.celebrity.manager.user.name.split(" ")[0]}
                  </ButtonLink>
                  {b.contract && (
                    <ButtonLink size="sm" variant="outline" href="/dashboard/invoices">
                      Contract · {b.contract.status}
                    </ButtonLink>
                  )}
                  <ButtonLink size="sm" variant="ghost" href={`/celebrities/${b.celebrity.slug}`}>
                    View profile
                  </ButtonLink>
                </div>
              </div>
            </details>
          );
        })}

        {bookings.length === 0 && (
          <div className="rounded-[var(--radius-xl)] border border-dashed border-border-strong p-16 text-center">
            <p className="font-display text-2xl text-foreground">No bookings yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              Your first request is eight elegant steps away.
            </p>
            <ButtonLink href="/celebrities" className="mt-6">
              Browse talent <ArrowGlyph />
            </ButtonLink>
          </div>
        )}
      </div>
    </>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-faint">{k}</dt>
      <dd className="text-right text-foreground">{v}</dd>
    </div>
  );
}
