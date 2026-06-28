"use client";
import { useRef, useEffect, useState } from "react";

function FadeIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}>
      {children}
    </div>
  );
}

export default function WhyBloomingbird() {
  return (
    <section className="bg-bg">
      {/* Advice Before Commission */}
      <div className="relative min-h-screen flex flex-col justify-end" style={{ background: "linear-gradient(to bottom, #1a3a4a, #0d2633)" }}>
        <div className="container-x pb-12">
          <div className="flex justify-between items-end">
            <div>
              <FadeIn>
                <h3 className="text-h2 font-[var(--font-playfair)] text-cream font-normal mb-3">
                  &ldquo;Advice Should Come<br />Before Commission&rdquo;
                </h3>
              </FadeIn>
              <FadeIn>
                <p className="text-text-secondary text-sm">
                  Bloomingbird was founded on a simple belief:
                </p>
                <p className="text-accent text-xs mt-1 tracking-wide">
                  Advice Before Commission.
                </p>
              </FadeIn>
            </div>
            <FadeIn>
              <p className="eyebrow text-right">WHY BLOOMINGBIRD</p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Body text */}
      <div className="container-x py-section">
        <FadeIn>
          <div className="max-w-4xl mx-auto space-y-6 text-text-secondary text-base leading-relaxed">
            <p>
              Every property decision deserves thoughtful advice, not a sales pitch. Every recommendation begins with understanding your ambitions, analysing the market, and identifying opportunities that create genuine long-term value rather than simply another transaction.
            </p>
            <p>
              Whether you are purchasing your first home, building an international portfolio, or investing for the next generation, our responsibility remains the same: to guide every decision with clarity, integrity, and conviction.
            </p>
            <p className="text-accent italic font-[var(--font-playfair)] text-lg">
              We work for your outcome, not our commission.
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Every Property Has A Price */}
      <div className="relative min-h-[70vh] flex flex-col justify-end" style={{ background: "linear-gradient(135deg, #0a1520, #141414)" }}>
        <div className="container-x pb-12">
          <div className="flex justify-between items-end">
            <div>
              <FadeIn>
                <h3 className="text-h2 font-[var(--font-playfair)] text-cream font-normal mb-3">
                  Every Property Has A Price.<br />Only A Few Create Legacy.
                </h3>
              </FadeIn>
            </div>
            <FadeIn>
              <p className="eyebrow text-right">OUR BELIEF</p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Body text for belief */}
      <div className="container-x py-section">
        <FadeIn>
          <div className="max-w-4xl mx-auto space-y-6 text-text-secondary text-base leading-relaxed">
            <p>
              The strongest portfolios are never built by following the market. They are built by understanding it.
            </p>
            <p>
              At Bloomingbird, we believe real estate is more than an asset on a balance sheet. It is a decision that shapes lifestyles, protects wealth, and creates opportunities that extend far beyond a single generation.
            </p>
            <p>
              Every recommendation begins with understanding your ambitions, not simply your budget. Successful investing is not about owning more property. It is about owning the right property at the right time, for the right reason.
            </p>
            <p className="text-accent italic font-[var(--font-playfair)] text-lg text-center py-4">
              &ldquo;Create lasting value... not momentary excitement.&rdquo;
            </p>
            <p>
              Rather than chasing trends, we focus on identifying opportunities backed by research, market intelligence, and a deep understanding of Dubai&apos;s evolving landscape. Every conversation, every recommendation, and every acquisition is guided by one principle.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
