import { cn } from "@/lib/utils";

function Star({ fill }: { fill: number }) {
  const id = `star-${Math.round(fill * 100)}`;
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="var(--gold)" />
          <stop offset={`${fill * 100}%`} stopColor="var(--border-strong)" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M12 2l2.9 6.26 6.85.66-5.17 4.56 1.52 6.7L12 16.7l-6.1 3.48 1.52-6.7L2.25 8.92l6.85-.66z"
      />
    </svg>
  );
}

export function Rating({
  value,
  count,
  className,
}: {
  value: number;
  count?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      aria-label={`Rated ${value.toFixed(1)} out of 5${count ? ` from ${count} reviews` : ""}`}
    >
      <span className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} fill={Math.max(0, Math.min(1, value - i))} />
        ))}
      </span>
      <span className="text-sm font-medium text-foreground">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-xs text-faint">({count})</span>}
    </span>
  );
}

const availabilityStyles = {
  available: { label: "Available", dot: "bg-success animate-pulse-dot" },
  limited: { label: "Limited availability", dot: "bg-warning" },
  booked: { label: "Fully booked", dot: "bg-danger" },
} as const;

export function AvailabilityDot({
  state,
  className,
  short,
}: {
  state: string;
  className?: string;
  short?: boolean;
}) {
  const s = availabilityStyles[state as keyof typeof availabilityStyles] ?? availabilityStyles.available;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted", className)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} aria-hidden />
      {short ? s.label.split(" ")[0] : s.label}
    </span>
  );
}
