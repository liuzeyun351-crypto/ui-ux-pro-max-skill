import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shell";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate, formatMoney } from "@/lib/utils";
import { parseJson, type InvoiceLineItem } from "@/lib/types";

export const metadata: Metadata = { title: "Invoices" };

const TONES: Record<string, "gold" | "success" | "neutral" | "warning" | "danger"> = {
  issued: "warning",
  paid: "success",
  draft: "neutral",
  void: "neutral",
  refunded: "danger",
};

export default async function InvoicesPage() {
  const session = await auth();
  const invoices = await db.invoice.findMany({
    where: { userId: session!.user.id },
    include: { booking: { include: { celebrity: true } } },
    orderBy: { createdAt: "desc" },
  });
  const outstanding = invoices
    .filter((i) => i.status === "issued")
    .reduce((s, i) => s + i.totalCents, 0);

  return (
    <>
      <PageHeader
        title="Invoices"
        lead={
          outstanding > 0
            ? `${formatMoney(outstanding)} outstanding — due per your contract's milestone schedule.`
            : "Everything is settled. Bravo."
        }
      />

      <div className="space-y-4">
        {invoices.map((inv) => {
          const items = parseJson<InvoiceLineItem[]>(inv.lineItems, []);
          return (
            <details
              key={inv.id}
              className="group overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface open:border-gold/30"
            >
              <summary className="flex cursor-pointer list-none items-center gap-4 p-5 hover:bg-surface-raised/50 [&::-webkit-details-marker]:hidden">
                <div className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm)] border border-gold/30 font-display text-sm font-semibold text-gold">
                  ▤
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{inv.number}</p>
                  <p className="truncate text-xs text-muted">
                    {inv.booking.celebrity.name} · {inv.booking.reference} · due{" "}
                    {formatDate(inv.dueDate)}
                  </p>
                </div>
                <Badge tone={TONES[inv.status] ?? "neutral"} className="capitalize">
                  {inv.status}
                </Badge>
                <p className="w-28 text-right font-display text-lg font-semibold text-foreground">
                  {formatMoney(inv.totalCents)}
                </p>
                <span aria-hidden className="text-muted transition-transform duration-300 group-open:rotate-90">
                  ›
                </span>
              </summary>
              <div className="border-t border-border px-6 py-5">
                <table className="w-full text-sm">
                  <tbody>
                    {items.map((li, i) => (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        <td className="py-2.5 text-muted">{li.label}</td>
                        <td className="py-2.5 text-right tabular-nums text-foreground">
                          {formatMoney(li.amountCents)}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="pt-3 font-medium text-foreground">Total</td>
                      <td className="pt-3 text-right font-display text-lg font-semibold text-gold">
                        {formatMoney(inv.totalCents)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-faint">
                  <span>
                    {inv.paidAt
                      ? `Paid ${formatDate(inv.paidAt)} · receipt available`
                      : `Payable by ${formatDate(inv.dueDate)} via Stripe, PayPal, Apple Pay or Google Pay`}
                  </span>
                  <button
                    type="button"
                    className="rounded-full border border-border px-4 py-1.5 text-xs text-muted transition-colors hover:border-gold hover:text-gold"
                  >
                    Download PDF (demo)
                  </button>
                </div>
              </div>
            </details>
          );
        })}
        {invoices.length === 0 && (
          <p className="rounded-[var(--radius-xl)] border border-dashed border-border-strong p-16 text-center text-sm text-muted">
            Invoices appear here once a quote is accepted.
          </p>
        )}
      </div>
    </>
  );
}
