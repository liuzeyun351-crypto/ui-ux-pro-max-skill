import type { Metadata } from "next";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { StatsBand } from "@/components/marketing/stats-band";
import { FaqSection } from "@/components/marketing/faq-section";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { ButtonLink, ArrowGlyph } from "@/components/ui/button";
import { PLATFORM_FAQ } from "@/lib/content/faq";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "From brief to curtain call: how Aurum's concierge booking, contracts and escrow protect both sides of every engagement.",
};

const ESCROW_STEPS = [
  { t: "Quote accepted", d: "Your itemized quote becomes a contract with an encoded milestone schedule." },
  { t: "Deposit → escrow", d: "25% moves into a segregated escrow account at signature. Not to the agency. Not to us." },
  { t: "Milestones release", d: "Funds release as milestones complete — countersignature, event delivery, wrap." },
  { t: "Curtain falls", d: "The balance releases after your event completes. Disputes freeze funds until resolved." },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="grain relative overflow-hidden bg-background-deep pb-10 pt-40">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 50% 0%, oklch(0.28 0.05 80 / 0.6), transparent 65%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
          <Reveal>
            <p className="kicker mb-5 justify-center">The Aurum method</p>
            <h1 className="font-display text-[length:var(--text-display)] font-medium leading-[1.05] tracking-[-0.02em] text-foreground">
              Booking the unbookable, <em className="gold-text not-italic">by design</em>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Two thousand engagements taught us where talent bookings break: opaque fees, chained
              middlemen, and money moving on trust. We rebuilt each of those joints.
            </p>
          </Reveal>
        </div>
      </section>

      <HowItWorks />

      {/* escrow explainer */}
      <section className="border-y border-border bg-surface/40 py-28" aria-labelledby="escrow-heading">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            kicker="Escrow, explained"
            title={<span id="escrow-heading">Your money waits in the wings</span>}
            lead="The escrow structure is why boards approve Aurum bookings: funds are protected until the moment is delivered."
            className="mb-14"
          />
          <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {ESCROW_STEPS.map((s, i) => (
              <StaggerItem key={s.t}>
                <div className="relative h-full rounded-[var(--radius-lg)] border border-border bg-background p-6">
                  <span className="font-display text-4xl font-semibold text-gold/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-medium text-foreground">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
                  {i < ESCROW_STEPS.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-gold/50 lg:block"
                    >
                      →
                    </span>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <StatsBand />
      <FaqSection items={PLATFORM_FAQ} />

      <section className="pb-10 pt-4 text-center">
        <Reveal>
          <ButtonLink href="/celebrities" size="xl">
            Start your booking <ArrowGlyph />
          </ButtonLink>
        </Reveal>
      </section>
    </>
  );
}
