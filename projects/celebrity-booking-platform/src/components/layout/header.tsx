"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/celebrities", label: "Talent" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/news", label: "Stories" },
  { href: "/faq", label: "FAQ" },
];

export function Header({ signedIn }: { signedIn?: boolean }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-[var(--ease-out-expo)]",
        scrolled || open ? "glass shadow-soft" : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm transition-colors duration-200",
                  active ? "text-gold" : "text-muted hover:text-foreground"
                )}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-gold to-transparent"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Link
            href={signedIn ? "/dashboard" : "/signin"}
            className="rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            {signedIn ? "Dashboard" : "Sign in"}
          </Link>
          <ButtonLink href="/celebrities" size="sm">
            Book talent
          </ButtonLink>
        </div>

        {/* mobile */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full text-foreground"
          >
            <span className="relative block h-3 w-5" aria-hidden>
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-full bg-current transition-all duration-300",
                  open && "top-1/2 rotate-45"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-px w-full bg-current transition-opacity duration-200",
                  open && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 bottom-0 h-px w-full bg-current transition-all duration-300",
                  open && "bottom-[calc(50%-1px)] -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-400 ease-[var(--ease-out-expo)] lg:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0">
          <nav aria-label="Mobile" className="flex flex-col gap-1 px-5 pb-6 pt-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 font-display text-2xl text-foreground transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-3">
              <ButtonLink href="/celebrities" className="flex-1">
                Book talent
              </ButtonLink>
              <ButtonLink variant="outline" href={signedIn ? "/dashboard" : "/signin"} className="flex-1">
                {signedIn ? "Dashboard" : "Sign in"}
              </ButtonLink>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
