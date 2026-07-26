"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: string; // small glyph keeps the nav dependency-free
}

export function SidebarNav({ items, horizontal }: { items: NavItem[]; horizontal?: boolean }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Dashboard">
      <ul
        className={cn(
          horizontal
            ? "flex gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "space-y-1"
        )}
      >
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href.split("/").length > 2 && pathname.startsWith(item.href + "/"));
          return (
            <li key={item.href} className={horizontal ? "shrink-0" : undefined}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-all duration-200",
                  active
                    ? "bg-gold/10 font-medium text-gold"
                    : "text-muted hover:bg-surface-raised hover:text-foreground"
                )}
              >
                <span aria-hidden className="w-4 text-center text-[13px]">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
