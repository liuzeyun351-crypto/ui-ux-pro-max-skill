import type { Metadata } from "next";
import { FaqSection } from "@/components/marketing/faq-section";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { PLATFORM_FAQ } from "@/lib/content/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Escrow, fees, lead times and logistics — the answers before you raise the curtain.",
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PLATFORM_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="pb-10 pt-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto mb-4 max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="kicker mb-5 justify-center">Questions, answered</p>
          <h1 className="font-display text-[length:var(--text-display)] font-medium leading-[1.05] tracking-[-0.02em] text-foreground">
            Before you raise <em className="gold-text not-italic">the curtain</em>
          </h1>
        </Reveal>
      </div>
      <FaqSection items={PLATFORM_FAQ} />
      <div className="mt-4 text-center">
        <p className="mb-5 text-sm text-muted">Something more specific?</p>
        <ButtonLink variant="outline" href="/celebrities">
          Ask through a booking request
        </ButtonLink>
      </div>
    </div>
  );
}
