import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { SignOutButton } from "./sign-out-button";
import { SidebarNav, type NavItem } from "./sidebar-nav";
import { db } from "@/lib/db";

export type { NavItem };

/**
 * Shared chrome for the client / talent / admin consoles: fixed sidebar on
 * desktop, top bar with notifications and account, scrollable content well.
 */
export async function DashboardShell({
  title,
  items,
  user,
  children,
}: {
  title: string;
  items: NavItem[];
  user: { id: string; name?: string | null; email?: string | null; role: string };
  children: React.ReactNode;
}) {
  const unread = await db.notification.count({
    where: { userId: user.id, readAt: null },
  });

  return (
    <div className="flex min-h-svh bg-background">
      {/* sidebar */}
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-border bg-background-deep px-5 py-6 lg:flex">
        <Logo />
        <p className="mt-8 mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
          {title}
        </p>
        <SidebarNav items={items} />
        <div className="mt-auto space-y-4 border-t border-border pt-5">
          <Link
            href="/celebrities"
            className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
          >
            <span aria-hidden>↖</span> Back to the stage
          </Link>
          <div className="flex items-center gap-3">
            <Avatar name={user.name ?? "You"} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <p className="truncate text-[11px] text-faint">{user.email}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* top bar */}
        <header className="glass sticky top-0 z-30 flex h-16 items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <Logo />
          </div>
          <p className="hidden text-sm text-faint lg:block">
            {title} · <span className="capitalize text-muted">{user.role.toLowerCase()}</span>
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={items.find((i) => i.href.endsWith("/notifications"))?.href ?? "/dashboard/notifications"}
              className="relative grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-raised hover:text-gold"
              aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.7 21a2 2 0 0 1-3.4 0" />
              </svg>
              {unread > 0 && (
                <span
                  aria-hidden
                  className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-gold text-[9px] font-bold text-on-gold"
                >
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
            <ThemeToggle />
          </div>
        </header>

        {/* mobile nav rail */}
        <div className="border-b border-border px-3 py-2 lg:hidden">
          <SidebarNav items={items} horizontal />
        </div>

        <main className="px-5 py-8 sm:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  lead,
  action,
}: {
  title: string;
  lead?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-medium tracking-tight text-foreground">{title}</h1>
        {lead && <p className="mt-1.5 text-sm text-muted">{lead}</p>}
      </div>
      {action}
    </div>
  );
}
