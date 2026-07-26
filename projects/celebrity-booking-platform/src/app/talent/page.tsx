import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shell";
import { AreaChart, BarList, StatTile } from "@/components/dashboard/charts";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { PortraitArt } from "@/components/art/PortraitArt";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resolveTalentContext, revenueSeries } from "@/lib/talent";
import { formatDate, formatMoney, formatMoneyCompact } from "@/lib/utils";

export const metadata: Metadata = { title: "Talent console" };

export default async function TalentOverview() {
  const session = await auth();
  const { celebrity, roster } = await resolveTalentContext(session!.user.id, session!.user.role);

  if (!celebrity) {
    return (
      <p className="rounded-[var(--radius-xl)] border border-dashed border-border-strong p-16 text-center text-sm text-muted">
        No talent profile is linked to this account yet.
      </p>
    );
  }

  const [bookings, revenue] = await Promise.all([
    db.booking.findMany({
      where: { celebrityId: celebrity.id },
      include: { client: true },
      orderBy: { updatedAt: "desc" },
    }),
    revenueSeries(celebrity.id),
  ]);

  const pipeline = bookings.filter((b) =>
    ["SUBMITTED", "UNDER_REVIEW", "CONTRACT_SENT", "DEPOSIT_PAID"].includes(b.status)
  );
  const ytd = revenue.slice(-6).reduce((s, m) => s + m.value, 0);
  const byType = Object.entries(
    bookings.reduce<Record<string, number>>((acc, b) => {
      acc[b.eventType] = (acc[b.eventType] ?? 0) + (b.quoteCents ?? b.budgetCents ?? 0);
      return acc;
    }, {})
  )
    .map(([label, value]) => ({ label: label.replace("-", " "), value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <>
      <PageHeader
        title={celebrity.name}
        lead={`${celebrity.category.name} · managed by ${celebrity.manager.agencyName}`}
        action={
          roster.length > 1 ? (
            <p className="text-xs text-faint">
              Roster: {roster.map((r) => r.name).join(" · ")}
            </p>
          ) : (
            <Link
              href={`/celebrities/${celebrity.slug}`}
              className="text-sm text-gold underline-offset-4 hover:underline"
            >
              View public profile →
            </Link>
          )
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Revenue · trailing 6 mo"
          value={formatMoneyCompact(ytd)}
          delta={{ value: "12.4%", positive: true }}
          hint="vs prior period"
        />
        <StatTile label="Requests in pipeline" value={String(pipeline.length)} hint="awaiting action" />
        <StatTile
          label="Average rating"
          value={celebrity.rating.toFixed(1)}
          hint={`${celebrity.reviewCount} reviews`}
        />
        <StatTile
          label="Profile popularity"
          value={`${celebrity.popularity}`}
          delta={{ value: `trend ${celebrity.trendingScore}`, positive: celebrity.trendingScore > 70 }}
          hint="platform index"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <AreaChart data={revenue} title="Booking revenue · last 12 months" />
        <BarList data={byType} title="Pipeline value by format" />
      </div>

      <section aria-labelledby="incoming" className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="incoming" className="text-sm font-medium text-foreground">
            Latest requests
          </h2>
          <Link href="/talent/bookings" className="text-xs text-faint hover:text-gold">
            Manage all
          </Link>
        </div>
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-[0.14em] text-faint">
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Format</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Budget</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 6).map((b) => (
                <tr key={b.id} className="border-b border-border/60 last:border-0 hover:bg-surface">
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-foreground">{b.client.name}</span>
                    <span className="block text-xs text-faint">{b.client.company}</span>
                  </td>
                  <td className="px-5 py-3.5 capitalize text-muted">{b.eventType.replace("-", " ")}</td>
                  <td className="px-5 py-3.5 text-muted">{b.eventDate ? formatDate(b.eventDate) : "—"}</td>
                  <td className="px-5 py-3.5 font-medium text-gold">
                    {formatMoney(b.quoteCents ?? b.budgetCents ?? 0)}
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

      {/* profile art strip */}
      <section aria-label="Profile artwork" className="mt-8 grid grid-cols-4 gap-3">
        {[0, 3, 4, 5].map((v) => (
          <div key={v} className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] border border-border">
            <PortraitArt
              name={celebrity.name}
              hue={(celebrity.accentHue + v * 20) % 360}
              variant={v}
              className="absolute inset-0 h-full w-full"
            />
          </div>
        ))}
      </section>
    </>
  );
}
