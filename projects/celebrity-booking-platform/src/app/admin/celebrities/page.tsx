import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { PageHeader } from "@/components/dashboard/shell";
import { Badge, VerifiedSeal } from "@/components/ui/badge";
import { AvailabilityDot } from "@/components/ui/rating";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCount, formatMoneyCompact } from "@/lib/utils";

export const metadata: Metadata = { title: "Celebrities · Admin" };

export default async function AdminCelebrities() {
  const celebrities = await db.celebrity.findMany({
    include: { category: true, country: true, manager: true, _count: { select: { bookings: true } } },
    orderBy: { popularity: "desc" },
  });

  async function toggleFeatured(formData: FormData) {
    "use server";
    const s = await auth();
    if (s?.user?.role !== "ADMIN") return;
    const id = String(formData.get("id"));
    const c = await db.celebrity.findUnique({ where: { id } });
    if (!c) return;
    await db.celebrity.update({ where: { id }, data: { featured: !c.featured } });
    await db.auditLog.create({
      data: {
        actorId: s.user.id,
        action: c.featured ? "celebrity.unfeatured" : "celebrity.featured",
        entity: `Celebrity:${c.slug}`,
      },
    });
    revalidatePath("/admin/celebrities");
    revalidatePath("/");
  }

  return (
    <>
      <PageHeader
        title="Celebrities"
        lead={`${celebrities.length} verified names · toggle who leads the homepage.`}
      />
      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-[0.14em] text-faint">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Country</th>
              <th className="px-5 py-3 font-medium">Fee from</th>
              <th className="px-5 py-3 font-medium">Reach</th>
              <th className="px-5 py-3 font-medium">Bookings</th>
              <th className="px-5 py-3 font-medium">Availability</th>
              <th className="px-5 py-3 font-medium">Featured</th>
            </tr>
          </thead>
          <tbody>
            {celebrities.map((c) => (
              <tr key={c.id} className="border-b border-border/60 last:border-0 hover:bg-surface">
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    {c.name} {c.verified && <VerifiedSeal size={13} />}
                  </span>
                  <span className="block text-xs text-faint">{c.manager.agencyName}</span>
                </td>
                <td className="px-5 py-3.5 text-muted">{c.category.name}</td>
                <td className="px-5 py-3.5 text-muted">
                  <span aria-hidden>{c.country.flag}</span> {c.country.code}
                </td>
                <td className="px-5 py-3.5 tabular-nums text-gold">{formatMoneyCompact(c.feeFromCents)}</td>
                <td className="px-5 py-3.5 tabular-nums text-muted">{formatCount(c.followers)}</td>
                <td className="px-5 py-3.5 tabular-nums text-muted">{c._count.bookings}</td>
                <td className="px-5 py-3.5">
                  <AvailabilityDot state={c.availability} short />
                </td>
                <td className="px-5 py-3.5">
                  <form action={toggleFeatured}>
                    <input type="hidden" name="id" value={c.id} />
                    <button
                      type="submit"
                      className="transition-transform hover:scale-110"
                      aria-label={`${c.featured ? "Remove" : "Add"} ${c.name} ${c.featured ? "from" : "to"} homepage`}
                    >
                      {c.featured ? (
                        <Badge tone="gold">★ Featured</Badge>
                      ) : (
                        <Badge tone="outline">☆ Feature</Badge>
                      )}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
