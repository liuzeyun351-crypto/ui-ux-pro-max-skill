import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** Editorial section opener: gold kicker, serif headline, optional lead. */
export function SectionHeading({
  kicker,
  title,
  lead,
  align = "left",
  className,
}: {
  kicker: string;
  title: React.ReactNode;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={cn(align === "center" && "text-center", className)}>
      <p
        className={cn(
          "kicker mb-4 flex items-center gap-3",
          align === "center" && "justify-center"
        )}
      >
        {align === "left" && <span aria-hidden className="h-px w-8 bg-gold/60" />}
        {kicker}
      </p>
      <h2 className="font-display text-[length:var(--text-headline)] font-medium leading-[1.08] tracking-[-0.015em] text-foreground">
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed text-muted",
            align === "center" && "mx-auto"
          )}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
