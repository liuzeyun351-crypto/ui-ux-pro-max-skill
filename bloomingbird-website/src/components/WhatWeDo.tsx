"use client";
import { useRef, useEffect, useState } from "react";

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}>
      {children}
    </div>
  );
}

export default function WhatWeDo() {
  return (
    <section className="bg-bg">
      {/* Header - white/cream transition */}
      <div className="section-padding text-center">
        <FadeIn>
          <p className="eyebrow text-accent mb-4">WHAT WE DO</p>
        </FadeIn>
        <FadeIn>
          <h2 className="text-h3 font-[var(--font-playfair)] text-cream max-w-3xl mx-auto mb-6">
            Creating long-term value
          </h2>
        </FadeIn>
        <FadeIn>
          <p className="font-[var(--font-playfair)] italic text-text-secondary text-[clamp(16px,2vw,22px)] max-w-2xl mx-auto">
            &ldquo;The greatest compliment we receive is not another transaction.<br />
            It is when a client introduces us to their family.&rdquo;
          </p>
        </FadeIn>
      </div>

      {/* Bento Grid */}
      <div className="container-x pb-section">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {/* Row 1 */}
          <FadeIn delay={0}>
            <div className="bg-surface rounded-2xl p-6 min-h-[220px] flex flex-col justify-end border border-border-subtle">
              <p className="text-accent text-xs tracking-[0.2em] uppercase mb-2">INVESTMENT ADVISORY</p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Helping investors identify opportunities aligned with their financial objectives, risk profile, and long-term vision.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="bg-surface rounded-2xl p-6 min-h-[220px] flex flex-col justify-end border border-border-subtle">
              <p className="text-accent text-xs tracking-[0.2em] uppercase mb-2">OFF-PLAN OPPORTUNITIES</p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Exclusive access to carefully selected developments positioned for future growth and capital appreciation.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="bg-surface rounded-2xl p-6 min-h-[220px] flex flex-col justify-end border border-border-subtle">
              <p className="text-accent text-xs tracking-[0.2em] uppercase mb-2">LUXURY RESIDENTIAL</p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Curated homes in Dubai&apos;s most sought-after communities for end-users and discerning investors.
              </p>
            </div>
          </FadeIn>

          {/* Row 2 */}
          <FadeIn delay={100}>
            <div className="bg-surface rounded-2xl p-6 min-h-[220px] flex flex-col justify-end border border-border-subtle">
              <p className="text-accent text-xs tracking-[0.2em] uppercase mb-2">PORTFOLIO DIVERSIFICATION</p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Building balanced property portfolios designed to generate sustainable long-term returns.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="bg-surface rounded-2xl p-6 min-h-[220px] flex flex-col justify-end border border-border-subtle">
              <p className="text-accent text-xs tracking-[0.2em] uppercase mb-2">PROPERTY MANAGEMENT</p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Protecting and enhancing the value of your assets through seamless end-to-end management.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="bg-surface rounded-2xl p-6 min-h-[220px] flex flex-col justify-end border border-border-subtle">
              <p className="text-accent text-xs tracking-[0.2em] uppercase mb-2">EXIT STRATEGY</p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Knowing when to invest is important. Knowing when to exit is equally valuable.
              </p>
            </div>
          </FadeIn>

          {/* Row 3 */}
          <FadeIn delay={200}>
            <div className="bg-surface rounded-2xl p-6 min-h-[220px] flex flex-col justify-end border border-border-subtle">
              <p className="text-accent text-xs tracking-[0.2em] uppercase mb-2">RENTAL YIELD OPTIMISATION</p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Maximising recurring income through market analysis, pricing strategy, and tenant placement.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="bg-surface rounded-2xl p-6 min-h-[220px] flex flex-col justify-end border border-border-subtle">
              <p className="text-accent text-xs tracking-[0.2em] uppercase mb-2">DEVELOPER ACCESS</p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Priority access to Dubai&apos;s leading developers and carefully curated investment opportunities.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={400}>
            <div className="bg-surface-elevated rounded-2xl p-6 min-h-[220px] flex flex-col justify-center items-center text-center border border-border-subtle">
              <p className="font-[var(--font-playfair)] italic text-cream/80 text-sm leading-relaxed">
                &ldquo;Every extraordinary property holds the potential to transform lives and becomes the backdrop to cherished moments. It builds the foundation for future aspirations, and a place where every new chapter begins with confidence, comfort, and a sense of belonging.&rdquo;
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
