import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "gold" | "neutral" | "success" | "warning" | "danger" | "info" | "outline";

const tones: Record<Tone, string> = {
  gold: "bg-gold/12 text-gold border-gold/25",
  neutral: "bg-surface-raised text-muted border-border",
  success: "bg-success/12 text-success border-success/25",
  warning: "bg-warning/12 text-warning border-warning/25",
  danger: "bg-danger/12 text-danger border-danger/25",
  info: "bg-info/12 text-info border-info/25",
  outline: "bg-transparent text-muted border-border-strong",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

/** Gold check-seal shown next to verified talent names. */
export function VerifiedSeal({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-label="Verified talent"
      role="img"
      className={cn("inline-block shrink-0 text-gold", className)}
    >
      <path
        fill="currentColor"
        d="M10 0l2.36 2.04 3.1-.42 1.08 2.94 2.76 1.48-.86 3.01L20 11.5l-2.1 2.32.28 3.12-3.04.78L13.5 20 10 18.6 6.5 20l-1.64-2.28-3.04-.78.28-3.12L0 11.5l1.56-2.45-.86-3.01 2.76-1.48L4.54 1.62l3.1.42z"
      />
      <path
        fill="var(--on-gold)"
        d="M8.7 13.3L5.9 10.5l1.13-1.13 1.67 1.66 4.25-4.25 1.13 1.14z"
      />
    </svg>
  );
}
