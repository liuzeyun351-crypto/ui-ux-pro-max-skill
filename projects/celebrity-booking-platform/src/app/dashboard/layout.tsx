import { redirect } from "next/navigation";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";
import { auth } from "@/lib/auth";

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "◈" },
  { href: "/dashboard/bookings", label: "Bookings", icon: "✦" },
  { href: "/dashboard/invoices", label: "Invoices", icon: "▤" },
  { href: "/dashboard/messages", label: "Messages", icon: "◗" },
  { href: "/dashboard/saved", label: "Saved talent", icon: "♡" },
  { href: "/dashboard/calendar", label: "Calendar", icon: "▦" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "◔" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=/dashboard");
  return (
    <DashboardShell title="Client console" items={NAV} user={session.user}>
      {children}
    </DashboardShell>
  );
}
