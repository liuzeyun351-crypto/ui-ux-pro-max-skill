import { redirect } from "next/navigation";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";
import { auth } from "@/lib/auth";

const NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: "◈" },
  { href: "/admin/bookings", label: "Bookings", icon: "✦" },
  { href: "/admin/celebrities", label: "Celebrities", icon: "★" },
  { href: "/admin/users", label: "Users", icon: "◉" },
  { href: "/admin/reviews", label: "Reviews", icon: "❋" },
  { href: "/admin/articles", label: "CMS", icon: "▤" },
  { href: "/admin/audit", label: "Audit log", icon: "▣" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "◔" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=/admin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");
  return (
    <DashboardShell title="Admin console" items={NAV} user={session.user}>
      {children}
    </DashboardShell>
  );
}
