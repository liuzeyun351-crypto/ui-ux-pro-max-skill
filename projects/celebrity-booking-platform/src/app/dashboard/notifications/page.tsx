import Link from "next/link";
import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { PageHeader } from "@/components/dashboard/shell";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cn, relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Notifications" };

const KIND_GLYPH: Record<string, string> = {
  booking: "✦",
  payment: "◈",
  message: "◗",
  contract: "▤",
  system: "◔",
};

export default async function NotificationsPage() {
  const session = await auth();
  const notifications = await db.notification.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  async function markAllRead() {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;
    await db.notification.updateMany({
      where: { userId: s.user.id, readAt: null },
      data: { readAt: new Date() },
    });
    revalidatePath("/dashboard/notifications");
  }

  const unread = notifications.filter((n) => !n.readAt).length;

  return (
    <>
      <PageHeader
        title="Notifications"
        lead={unread ? `${unread} unread.` : "You're fully caught up."}
        action={
          unread > 0 ? (
            <form action={markAllRead}>
              <Button variant="outline" size="sm" type="submit">
                Mark all read
              </Button>
            </form>
          ) : undefined
        }
      />
      <ol className="space-y-3">
        {notifications.map((n) => (
          <li key={n.id}>
            <Link
              href={n.href ?? "#"}
              className={cn(
                "flex gap-4 rounded-[var(--radius-lg)] border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft",
                n.readAt ? "border-border bg-surface" : "border-gold/30 bg-gold/5"
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-full border text-sm",
                  n.readAt ? "border-border text-faint" : "border-gold/40 text-gold"
                )}
              >
                {KIND_GLYPH[n.kind] ?? "◔"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{n.body}</p>
                <p className="mt-1.5 text-[11px] text-faint">
                  {relativeTime(n.createdAt)} · {n.kind}
                </p>
              </div>
              {!n.readAt && (
                <span aria-label="Unread" className="mt-2 size-2 shrink-0 rounded-full bg-gold" />
              )}
            </Link>
          </li>
        ))}
        {notifications.length === 0 && (
          <li className="rounded-[var(--radius-xl)] border border-dashed border-border-strong p-16 text-center text-sm text-muted">
            Notifications about bookings, payments and messages arrive here.
          </li>
        )}
      </ol>
    </>
  );
}
