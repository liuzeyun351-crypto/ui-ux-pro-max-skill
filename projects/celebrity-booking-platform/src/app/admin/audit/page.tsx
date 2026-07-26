import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shell";
import { db } from "@/lib/db";
import { relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Audit log · Admin" };

export default async function AdminAudit() {
  const logs = await db.auditLog.findMany({
    include: { actor: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <>
      <PageHeader
        title="Audit log"
        lead="Immutable record of consequential actions — who, what, when."
      />
      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-[0.14em] text-faint">
              <th className="px-5 py-3 font-medium">Action</th>
              <th className="px-5 py-3 font-medium">Entity</th>
              <th className="px-5 py-3 font-medium">Actor</th>
              <th className="px-5 py-3 font-medium">Detail</th>
              <th className="px-5 py-3 font-medium">When</th>
            </tr>
          </thead>
          <tbody className="font-mono text-[13px]">
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-border/60 last:border-0 hover:bg-surface">
                <td className="px-5 py-3 text-gold">{l.action}</td>
                <td className="px-5 py-3 text-muted">{l.entity}</td>
                <td className="px-5 py-3 font-sans text-foreground">
                  {l.actor?.name ?? <span className="text-faint">system</span>}
                </td>
                <td className="max-w-56 truncate px-5 py-3 text-faint">{l.detail ?? l.ip ?? "—"}</td>
                <td className="whitespace-nowrap px-5 py-3 font-sans text-muted">
                  {relativeTime(l.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
