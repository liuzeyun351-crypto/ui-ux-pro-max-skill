import { SectionHeading } from "./section-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

const STEPS = [
  {
    n: "01",
    title: "Discover",
    body: "Search five hundred verified names by category, budget and date. Every profile carries real availability, transparent starting fees and a dedicated management team.",
  },
  {
    n: "02",
    title: "Request",
    body: "An eight-step guided brief captures your event, venue, date and budget. Your request lands directly with the talent's management — never a middleman chain.",
  },
  {
    n: "03",
    title: "Secure",
    body: "Contracts are generated in-platform and your deposit moves into escrow, not into anyone's pocket. Funds release only as milestones complete.",
  },
  {
    n: "04",
    title: "Experience",
    body: "Our producers advance every technical detail with your venue. You host the moment; we handle riders, routing and the thousand small things.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-28 sm:px-8" aria-labelledby="how-heading">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.4fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            kicker="How booking works"
            title={
              <span id="how-heading">
                Four steps between you and <em className="gold-text not-italic">the impossible</em>
              </span>
            }
            lead="A concierge process refined across two thousand engagements, from ballroom keynotes to stadium headliners."
          />
        </div>

        <Stagger className="relative">
          <span
            aria-hidden
            className="absolute bottom-8 left-[1.35rem] top-8 hidden w-px bg-gradient-to-b from-gold/50 via-border to-transparent sm:block"
          />
          <ol className="space-y-4">
            {STEPS.map((step) => (
              <StaggerItem key={step.n}>
                <li className="group relative flex gap-6 rounded-[var(--radius-lg)] border border-transparent p-5 transition-all duration-400 hover:border-border hover:bg-surface sm:p-7">
                  <span
                    aria-hidden
                    className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-gold/40 bg-background font-display text-sm font-semibold text-gold transition-all duration-400 group-hover:bg-gold group-hover:text-on-gold group-hover:shadow-glow"
                  >
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-medium text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">{step.body}</p>
                  </div>
                </li>
              </StaggerItem>
            ))}
          </ol>
        </Stagger>
      </div>
    </section>
  );
}
