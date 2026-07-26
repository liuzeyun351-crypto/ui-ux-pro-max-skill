import Link from "next/link";
import { cn } from "@/lib/utils";

/** The Aurum mark: an eight-point light burst inside a gold ring. */
export function LogoMark({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      role="img"
      aria-label="Aurum"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="aurum-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--gold-bright)" />
          <stop offset="100%" stopColor="var(--gold-deep)" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18.5" fill="none" stroke="url(#aurum-mark)" strokeWidth="1.4" />
      <path
        fill="url(#aurum-mark)"
        d="M20 6l2.2 9.3a3.5 3.5 0 0 0 2.5 2.5L34 20l-9.3 2.2a3.5 3.5 0 0 0-2.5 2.5L20 34l-2.2-9.3a3.5 3.5 0 0 0-2.5-2.5L6 20l9.3-2.2a3.5 3.5 0 0 0 2.5-2.5z"
      />
    </svg>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Aurum — home"
    >
      <LogoMark className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45" />
      <span className="font-display text-xl font-semibold tracking-[0.28em] text-foreground">
        AURUM
      </span>
    </Link>
  );
}
