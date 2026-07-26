import { cn } from "@/lib/utils";

/** Shimmering placeholder used by route-level loading states. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-sm)] bg-surface-raised",
        "after:absolute after:inset-0 after:animate-shimmer",
        "after:bg-[linear-gradient(100deg,transparent_20%,var(--surface)_50%,transparent_80%)] after:bg-[length:200%_100%]",
        className
      )}
    />
  );
}
