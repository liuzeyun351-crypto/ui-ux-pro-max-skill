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

const leftPoints = [
  { title: "0% INCOME TAX", desc: "Tax-efficient ownership with no personal income tax on property investments anywhere in Dubai." },
  { title: "200+ NATIONALITIES", desc: "A truly global city with world-class infrastructure, a diverse community, and unmatched connectivity." },
  { title: "HIGH RENTAL DEMAND", desc: "Strong rental yields supported by long-term capital appreciation and consistent population growth." },
];

const rightPoints = [
  { title: "GOLDEN VISA", desc: "Long-term UAE residency available through qualifying property investment, offering stability and freedom." },
  { title: "POLITICAL STABILITY", desc: "Government-backed economic growth within one of the world's most secure, business-friendly environments." },
  { title: "GLOBAL CONNECTIVITY", desc: "A gateway linking East and West, served by one of the world's busiest international airports." },
];

export default function WhyDubai() {
  return (
    <section className="bg-bg section-padding">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <p className="eyebrow text-accent mb-4">WHY DUBAI WHY NOW</p>
        </FadeIn>
        <FadeIn>
          <h2 className="text-h3 font-[var(--font-playfair)] text-cream mb-3">
            The world&apos;s most ambitious investment destination
          </h2>
        </FadeIn>
        <FadeIn>
          <p className="text-text-secondary text-lg mb-16">
            Discover why investors choose Dubai
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left */}
          <div className="space-y-10">
            {leftPoints.map((p, i) => (
              <FadeIn key={p.title} delay={i * 120}>
                <div className="border-t border-border-subtle pt-6">
                  <p className="text-accent text-xs tracking-[0.25em] uppercase mb-3">{p.title}</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Right */}
          <div className="space-y-10">
            {rightPoints.map((p, i) => (
              <FadeIn key={p.title} delay={i * 120 + 60}>
                <div className="border-t border-border-subtle pt-6">
                  <p className="text-accent text-xs tracking-[0.25em] uppercase mb-3">{p.title}</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
