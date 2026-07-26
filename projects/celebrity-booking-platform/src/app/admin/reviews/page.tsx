import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { PageHeader } from "@/components/dashboard/shell";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Reviews · Admin" };

export default async function AdminReviews() {
  const reviews = await db.review.findMany({
    include: { author: true, celebrity: true },
    orderBy: { createdAt: "desc" },
  });

  async function moderate(formData: FormData) {
    "use server";
    const s = await auth();
    if (s?.user?.role !== "ADMIN") return;
    const id = String(formData.get("id"));
    const status = String(formData.get("status"));
    if (!["published", "rejected", "pending"].includes(status)) return;
    await db.review.update({ where: { id }, data: { status } });
    await db.auditLog.create({
      data: { actorId: s.user.id, action: `review.${status}`, entity: `Review:${id}` },
    });
    revalidatePath("/admin/reviews");
  }

  return (
    <>
      <PageHeader title="Reviews" lead="Moderation queue — every public word is accountable." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {reviews.map((r) => (
          <article key={r.id} className="rounded-[var(--radius-xl)] border border-border bg-surface p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Rating value={r.rating} />
                <h2 className="mt-2 font-medium text-foreground">{r.title}</h2>
              </div>
              <Badge
                tone={r.status === "published" ? "success" : r.status === "pending" ? "warning" : "danger"}
                className="capitalize"
              >
                {r.status}
              </Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{r.body}</p>
            <p className="mt-3 text-xs text-faint">
              {r.author.name} on <span className="text-muted">{r.celebrity.name}</span> ·{" "}
              {r.eventType} · {formatDate(r.createdAt)}
            </p>
            <div className="mt-4 flex gap-2 border-t border-border pt-4">
              {r.status !== "published" && (
                <form action={moderate}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="published" />
                  <Button size="sm" variant="outline" type="submit">
                    Publish
                  </Button>
                </form>
              )}
              {r.status !== "rejected" && (
                <form action={moderate}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="rejected" />
                  <Button size="sm" variant="ghost" type="submit">
                    Reject
                  </Button>
                </form>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
