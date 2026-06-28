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

export default function Network() {
  return (
    <section className="bg-bg section-padding">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-accent text-lg">&#9679;</span>
            <h3 className="font-[var(--font-playfair)] italic text-cream text-xl">Our Network</h3>
          </div>
          <div className="h-px bg-border-subtle mb-4" />
        </FadeIn>

        <FadeIn>
          <h2 className="text-h3 font-[var(--font-playfair)] text-cream mb-3">
            &ldquo;Access matters. Relationships matter more.&rdquo;
          </h2>
          <p className="text-text-secondary text-base leading-relaxed max-w-3xl mb-16">
            Despite Dubai having thousands of developers, we intentionally partner only with reputed Tier-1 developers. We also collaborate with a select few boutique developers based on strong personal trust and long-term relationships.
          </p>
        </FadeIn>

        {/* Developer grid placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <FadeIn key={i}>
              <div className="aspect-video bg-surface rounded-2xl border border-border-subtle flex items-center justify-center">
                <p className="text-text-muted text-sm">Developer Partner {i}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
