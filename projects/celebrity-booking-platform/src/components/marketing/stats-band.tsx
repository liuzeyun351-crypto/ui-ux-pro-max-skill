import { CountUp } from "@/components/motion/interactive";
import { Reveal } from "@/components/motion/reveal";

const STATS = [
  { to: 500, suffix: "+", label: "Verified names on the roster" },
  { to: 2100, suffix: "+", label: "Engagements produced" },
  { to: 48, suffix: "", label: "Countries served last year" },
  { to: 98.4, suffix: "%", decimals: 1, label: "Escrow releases without dispute" },
];

export function StatsBand() {
  return (
    <section
      aria-label="Platform statistics"
      className="grain relative overflow-hidden border-y border-border bg-background-deep"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 120% at 50% 0%, oklch(0.3 0.06 85 / 0.25), transparent 65%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-12 px-5 py-20 sm:px-8 lg:grid-cols-4 lg:py-24">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="text-center">
              <p className="font-display text-5xl font-medium tracking-tight text-foreground lg:text-6xl">
                <CountUp to={s.to} suffix={s.suffix} decimals={s.decimals ?? 0} className="tabular-nums" />
              </p>
              <p className="mx-auto mt-3 max-w-[12rem] text-sm leading-snug text-muted">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
