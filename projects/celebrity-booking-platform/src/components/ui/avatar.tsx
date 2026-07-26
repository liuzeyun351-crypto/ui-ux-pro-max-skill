import { cn, initials } from "@/lib/utils";

/**
 * Monogram avatar for people without portrait art (clients, managers).
 * Hue is derived from the name so the same person always gets the same tone.
 */
export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  const sizes = {
    sm: "size-8 text-[11px]",
    md: "size-10 text-xs",
    lg: "size-14 text-base",
    xl: "size-20 text-xl",
  } as const;
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 select-none place-items-center rounded-full font-display font-semibold",
        sizes[size],
        className
      )}
      style={{
        background: `linear-gradient(135deg, oklch(0.35 0.07 ${h}), oklch(0.22 0.05 ${(h + 40) % 360}))`,
        color: `oklch(0.9 0.06 ${h})`,
      }}
    >
      {initials(name)}
    </span>
  );
}
