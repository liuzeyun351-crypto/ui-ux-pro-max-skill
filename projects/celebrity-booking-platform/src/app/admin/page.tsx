import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shell";
import { AreaChart, BarList, StatTile } from "@/components/dashboard/charts";
import { db } from "@/lib/db";
import { formatMoney, formatMoneyCompact } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminOverview() {
  const [users, celebrities, bookings, gmv, escrow, subscribers] = await Promise.all([
    db.user.count(),
    db.celebrity.count(),
    db.booking.findMany({ include: { celebrity: true } }),
    db.payment.aggregate({ where: { status: "released" }, _sum: { amountCents: true } }),
    db.payment.aggregate({ where: { status: "held_in_escrow" }, _sum: { amountCents: true } }),
    db.newsletterSubscriber.count(),
  ]);

  const byStatus = Object.entries(
    bookings.reduce<Record<string, number>>((acc, b) => {
      acc[b.status] = (acc[b.status] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([label, value]) => ({ label: label.replace(/_/g, " ").toLowerCase(), value }));

  const topTalent = Object.entries(
    bookings.reduce<Record<string, number>>((acc, b) => {
      acc[b.celebrity.name] = (acc[b.celebrity.name] ?? 0) + (b.quoteCents ?? b.budgetCents ?? 0);
      return acc;
    }, {})
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Demo platform GMV series
  const gmvSeries = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return {
      label: d.toLocaleDateString("en-US", { month: "short" }),
      value: Math.round((Math.sin(i / 1.8) * 0.3 + 0.8) * 2_400_000) * 100 + i * 9_000_000,
    };
  });

  return (
    <>
      <PageHeader title="Platform overview" lead="The whole stage, from the control room." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Gross bookings value"
          value={formatMoneyCompact(
            bookings.reduce((s, b) => s + (b.quoteCents ?? b.budgetCents ?? 0), 0)
          )}
          hint="all time"
        />
        <StatTile
          label="Released revenue"
          value={formatMoney(gmv._sum.amountCents ?? 0)}
          delta={{ value: "8.2%", positive: true }}
          hint="vs last quarter"
        />
        <StatTile label="Held in escrow" value={formatMoney(escrow._sum.amountCents ?? 0)} hint="active protections" />
        <StatTile
          label="Community"
          value={`${users}`}
          hint={`${celebrities} talent · ${subscribers} subscribers`}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <AreaChart data={gmvSeries} title="Platform GMV · last 12 months" />
        <BarList data={byStatus} money={false} title="Bookings by status" />
      </div>

      <div className="mt-6">
        <BarList data={topTalent} title="Top talent by pipeline value" />
      </div>
    </>
  );
}
