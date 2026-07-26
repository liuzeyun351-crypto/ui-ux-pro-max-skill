import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shell";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Users · Admin" };

const ROLE_TONE: Record<string, "gold" | "info" | "success" | "neutral"> = {
  ADMIN: "gold",
  MANAGER: "info",
  TALENT: "success",
  USER: "neutral",
};

export default async function AdminUsers() {
  const users = await db.user.findMany({
    include: { _count: { select: { bookings: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <PageHeader title="Users" lead={`${users.length} accounts across all roles.`} />
      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-[0.14em] text-faint">
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Bookings</th>
              <th className="px-5 py-3 font-medium">2FA</th>
              <th className="px-5 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/60 last:border-0 hover:bg-surface">
                <td className="px-5 py-3">
                  <span className="flex items-center gap-3">
                    <Avatar name={u.name} size="sm" />
                    <span>
                      <span className="block font-medium text-foreground">{u.name}</span>
                      <span className="block text-xs text-faint">{u.email}</span>
                    </span>
                  </span>
                </td>
                <td className="px-5 py-3 text-muted">{u.company ?? "—"}</td>
                <td className="px-5 py-3">
                  <Badge tone={ROLE_TONE[u.role] ?? "neutral"}>{u.role}</Badge>
                </td>
                <td className="px-5 py-3 tabular-nums text-muted">{u._count.bookings}</td>
                <td className="px-5 py-3 text-xs">
                  {u.twoFactorEnabled ? (
                    <span className="text-success">Enabled</span>
                  ) : (
                    <span className="text-faint">Off</span>
                  )}
                </td>
                <td className="px-5 py-3 text-muted">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
