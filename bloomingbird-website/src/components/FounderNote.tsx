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

export default function FounderNote() {
  return (
    <section className="bg-bg section-padding overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-accent text-lg">&#9679;</span>
            <h3 className="font-[var(--font-playfair)] italic text-cream text-xl">Founder&apos;s Note</h3>
          </div>
          <div className="h-px bg-border-subtle mb-12" />
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
          {/* Left: Founder's Note text */}
          <FadeIn>
            <div className="flex flex-col justify-center pr-0 lg:pr-16 py-8">
              <h2 className="text-h3 font-[var(--font-playfair)] text-cream mb-6">
                A Note From<br />The Founder
              </h2>
              <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
                <p>Founder&apos;s note text to come.</p>
              </div>
              <div className="pt-8">
                <p className="text-accent font-medium">Ankit Goyal</p>
                <p className="text-text-muted text-sm">Founder &amp; CEO</p>
              </div>
            </div>
          </FadeIn>

          {/* Right: Large founder photo blending into dark bg */}
          <FadeIn>
            <div className="relative min-h-[500px] lg:min-h-[600px] -mr-8 lg:-mr-16">
              <div className="absolute inset-0 bg-surface rounded-l-2xl overflow-hidden flex items-center justify-center">
                <p className="text-text-muted text-sm">Founder Photo</p>
              </div>
              {/* Gradient blend into dark background */}
              <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
