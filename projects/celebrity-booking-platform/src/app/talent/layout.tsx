import { redirect } from "next/navigation";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";
import { auth } from "@/lib/auth";

const NAV: NavItem[] = [
  { href: "/talent", label: "Overview", icon: "◈" },
  { href: "/talent/bookings", label: "Requests", icon: "✦" },
  { href: "/talent/availability", label: "Availability", icon: "▦" },
  { href: "/talent/analytics", label: "Analytics", icon: "◭" },
  { href: "/dashboard/messages", label: "Messages", icon: "◗" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "◔" },
];

export default async function TalentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=/talent");
  if (!["TALENT", "MANAGER", "ADMIN"].includes(session.user.role)) redirect("/dashboard");
  return (
    <DashboardShell title="Talent console" items={NAV} user={session.user}>
      {children}
    </DashboardShell>
  );
}
