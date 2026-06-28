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

const steps = [
  { label: "DISCOVER", desc: "Understand your goals and timeline" },
  { label: "ANALYSE", desc: "Deep market intelligence and research" },
  { label: "CURATE", desc: "Handpicked opportunities aligned to you" },
  { label: "ACQUIRE", desc: "Confident negotiations and execution" },
  { label: "MANAGE", desc: "Long-term asset support and oversight" },
  { label: "GROW", desc: "Building lasting, generational wealth" },
];

export default function Approach() {
  return (
    <section className="bg-bg">
      {/* Our Approach header */}
      <div className="relative min-h-[60vh] flex flex-col justify-end" style={{ background: "linear-gradient(135deg, #0f1f2e, #070707)" }}>
        <div className="container-x pb-12">
          <div className="flex justify-between items-end">
            <FadeIn>
              <h3 className="text-h2 font-[var(--font-playfair)] text-cream font-normal">
                The Bloomingbird Method
              </h3>
            </FadeIn>
            <FadeIn>
              <p className="eyebrow text-right">OUR APPROACH</p>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="container-x py-section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <FadeIn key={step.label} delay={i * 100}>
              <div className="border-t border-border-subtle pt-6">
                <p className="text-accent text-xs tracking-[0.3em] uppercase font-medium mb-3">{step.label}</p>
                <p className="text-cream text-base">{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <blockquote className="max-w-3xl mx-auto text-center mt-section">
            <p className="font-[var(--font-playfair)] italic text-cream/90 text-[clamp(18px,2.5vw,28px)] leading-[1.4]">
              Every client enters the market with different ambitions.<br />
              Some are searching for a family home. Others are building international portfolios.<br />
              Many are investing for future generations.<br /><br />
              Our role is to transform those ambitions into carefully considered property strategies.
            </p>
          </blockquote>
        </FadeIn>
      </div>
    </section>
  );
}
