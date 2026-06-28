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

const stats = [
  { label: "Sales Facilitated", value: "AED 1B+", accent: true },
  { label: "Properties Sold", value: "500+" },
  { label: "Happy Investors", value: "1000+" },
  { label: "Experience in Years", value: "13+" },
  { label: "Clients Satisfied", value: "95%+" },
  { label: "Repeated Referral", value: "80%" },
];

export default function Milestones() {
  return (
    <section className="bg-bg section-padding">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-accent text-lg">&#9679;</span>
            <h3 className="font-[var(--font-playfair)] italic text-cream text-xl">Our Milestones</h3>
            <span className="text-text-muted text-sm ml-2">our track record</span>
          </div>
          <div className="h-px bg-border-subtle mb-12" />
        </FadeIn>

        <FadeIn>
          <h2 className="text-h3 font-[var(--font-playfair)] text-cream max-w-3xl mb-4">
            Numbers that reflect the trust our clients place in Bloomingbird.
          </h2>
        </FadeIn>

        <FadeIn>
          <blockquote className="my-12 py-8 border-t border-b border-border-subtle">
            <p className="font-[var(--font-playfair)] italic text-accent text-[clamp(16px,2vw,22px)] text-center">
              &ldquo;The greatest compliment we receive is not another transaction.<br />
              It is when a client introduces us to their family.&rdquo;
            </p>
          </blockquote>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-12">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 80}>
              <div className="border-t border-border-subtle pt-6">
                <p className="text-text-muted text-xs tracking-[0.2em] uppercase mb-3">{stat.label}</p>
                <p className={`text-[clamp(36px,5vw,56px)] font-light tracking-tight ${stat.accent ? "text-accent" : "text-cream"}`}>
                  {stat.value}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <p className="text-center text-text-secondary italic font-[var(--font-playfair)] text-lg mt-16">
            &ldquo;Connecting people with places they&apos;ll call home.&rdquo;
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
