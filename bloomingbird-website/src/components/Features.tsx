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
  { title: "Market Intelligence", desc: "Deep knowledge of Dubai’s real estate landscape, pricing trends, and emerging opportunities." },
  { title: "Curated Selection", desc: "Access to handpicked properties from Tier-1 developers and select boutique partners." },
  { title: "End-to-End Support", desc: "From discovery to acquisition to management — we handle every step with precision." },
];

const rightPoints = [
  { title: "Transparent Advisory", desc: "Honest guidance with no hidden agendas — your interests always come first." },
  { title: "Long-Term Relationships", desc: "We don’t close deals, we build partnerships that grow with your portfolio." },
  { title: "Proven Track Record", desc: "AED 1B+ in transactions, 500+ properties, and a 95%+ client satisfaction rate." },
];

export default function Features() {
  return (
    <section className="bg-bg section-padding">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-accent text-lg">&#9679;</span>
            <h3 className="font-[var(--font-playfair)] italic text-cream text-xl">Why Bloomingbird</h3>
          </div>
          <div className="h-px bg-border-subtle mb-12" />
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start">
          <FadeIn>
            <div className="space-y-8">
              {leftPoints.map((p) => (
                <div key={p.title} className="border-t border-border-subtle pt-5">
                  <p className="text-accent text-xs tracking-[0.25em] uppercase mb-2">{p.title}</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="aspect-[3/4] bg-surface rounded-2xl border border-border-subtle overflow-hidden flex items-center justify-center group hover:scale-[1.02] transition-transform duration-300">
              <p className="text-text-muted text-sm">Feature Photo</p>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="space-y-8">
              {rightPoints.map((p) => (
                <div key={p.title} className="border-t border-border-subtle pt-5">
                  <p className="text-accent text-xs tracking-[0.25em] uppercase mb-2">{p.title}</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
