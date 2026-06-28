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

export default function Legacy() {
  return (
    <section className="bg-bg section-padding">
      <div className="max-w-5xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-h2 font-[var(--font-playfair)] text-cream mb-12">
            Let&apos;s build your legacy
          </h2>
        </FadeIn>

        <FadeIn>
          <div className="space-y-2 mb-16">
            <p className="text-[clamp(28px,4vw,52px)] font-[var(--font-playfair)] text-cream leading-tight">
              The right property
            </p>
            <p className="text-[clamp(18px,2.5vw,32px)] text-text-secondary font-[var(--font-playfair)] italic">
              can change your portfolio
            </p>
            <p className="text-[clamp(28px,4vw,52px)] font-[var(--font-playfair)] text-cream leading-tight mt-6">
              The right advisor
            </p>
            <p className="text-[clamp(18px,2.5vw,32px)] text-text-secondary font-[var(--font-playfair)] italic">
              can change your future.
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <p className="text-text-secondary text-base leading-relaxed max-w-2xl mx-auto mb-12">
            Whether you&apos;re making your first investment, expanding your portfolio, or searching for a place to call home, we are here to guide every decision with clarity, confidence and long-term perspective.
          </p>
        </FadeIn>

        <FadeIn>
          <p className="font-[var(--font-playfair)] italic text-accent text-lg">
            &ldquo;Let&apos;s build something that lasts.&rdquo;
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
