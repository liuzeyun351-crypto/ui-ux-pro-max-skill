import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shell";
import { AreaChart, BarList, StatTile } from "@/components/dashboard/charts";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resolveTalentContext, revenueSeries } from "@/lib/talent";
import { formatCount } from "@/lib/utils";
import { parseJson, type Social } from "@/lib/types";

export const metadata: Metadata = { title: "Analytics" };

export default async function TalentAnalytics() {
  const session = await auth();
  const { celebrity } = await resolveTalentContext(session!.user.id, session!.user.role);
  if (!celebrity) return null;

  const [revenue, reviews] = await Promise.all([
    revenueSeries(celebrity.id),
    db.review.findMany({ where: { celebrityId: celebrity.id } }),
  ]);
  const socials = parseJson<Social[]>(celebrity.socials, []);

  // Deterministic demo profile-traffic series (production: real analytics events)
  let h = 0;
  for (const ch of celebrity.id) h = (h * 33 + ch.charCodeAt(0)) >>> 0;
  const traffic = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return {
      label: d.toLocaleDateString("en-US", { month: "short" }),
      value: Math.round((Math.sin((i + (h % 5)) / 1.7) * 0.35 + 0.8) * ((h % 60) + 40) * 1000),
    };
  });

  const ratingDist = [5, 4, 3, 2, 1].map((r) => ({
    label: `${r} star${r > 1 ? "s" : ""}`,
    value: reviews.filter((x) => x.rating === r).length,
  }));

  return (
    <>
      <PageHeader title="Analytics" lead="Reach, demand and reputation at a glance." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Combined social reach"
          value={formatCount(celebrity.followers)}
          delta={{ value: "3.1%", positive: true }}
          hint="30 days"
        />
        <StatTile
          label="Profile views"
          value={formatCount(traffic[traffic.length - 1].value)}
          hint="this month"
        />
        <StatTile label="Trending index" value={String(celebrity.trendingScore)} hint="of 100" />
        <StatTile
          label="Review score"
          value={celebrity.rating.toFixed(1)}
          hint={`${celebrity.reviewCount} verified reviews`}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AreaChart data={traffic} money={false} title="Profile views · last 12 months" />
        <AreaChart data={revenue} title="Booking revenue · last 12 months" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <BarList
          money={false}
          title="Audience by platform"
          data={socials.map((s) => ({ label: `${s.platform} ${s.handle}`, value: s.followers }))}
        />
        <BarList money={false} title="Rating distribution" data={ratingDist} />
      </div>
    </>
  );
}
