import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "gold" | "outline" | "ghost" | "dark" | "danger";
type Size = "sm" | "md" | "lg" | "xl";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 font-medium tracking-tight whitespace-nowrap rounded-full transition-all duration-300 ease-[var(--ease-out-expo)] disabled:opacity-45 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-on-gold hover:bg-gold-bright hover:shadow-glow active:scale-[0.98]",
  outline:
    "border border-border-strong text-foreground hover:border-gold hover:text-gold active:scale-[0.98]",
  ghost: "text-muted hover:text-foreground hover:bg-surface-raised active:scale-[0.98]",
  dark: "bg-foreground text-background hover:opacity-90 active:scale-[0.98]",
  danger: "bg-danger text-white hover:opacity-90 active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-base",
  xl: "h-14 px-9 text-base",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "gold", size = "md", ...props }, ref) => (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  )
);
Button.displayName = "Button";

export interface ButtonLinkProps extends React.ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
  className?: string;
}

export function ButtonLink({ className, variant = "gold", size = "md", ...props }: ButtonLinkProps) {
  return <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

/** Arrow that nudges on hover — used inside Button/ButtonLink children. */
export function ArrowGlyph({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-1",
        className
      )}
    >
      →
    </span>
  );
}
