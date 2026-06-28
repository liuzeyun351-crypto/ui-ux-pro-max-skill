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

function PhotoCell({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`bg-surface rounded-2xl border border-border-subtle overflow-hidden flex items-center justify-center group hover:scale-[1.02] transition-transform duration-300 ${className}`}>
      <p className="text-text-muted text-sm">{label}</p>
    </div>
  );
}

export default function Benefits() {
  return (
    <section className="bg-bg section-padding">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-accent text-lg">&#9679;</span>
            <h3 className="font-[var(--font-playfair)] italic text-cream text-xl">The Experience</h3>
          </div>
          <div className="h-px bg-border-subtle mb-12" />
        </FadeIn>

        {/* Top: 3 columns — tall photo | 2 stacked cards | tall photo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <FadeIn>
            <PhotoCell label="Photo 1" className="aspect-[3/4]" />
          </FadeIn>

          <div className="flex flex-col gap-4">
            <FadeIn delay={100}>
              <div className="aspect-[1.45/1] bg-surface rounded-2xl border border-border-subtle overflow-hidden flex items-end p-6 relative group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/30 to-transparent z-10" />
                <div className="relative z-20">
                  <p className="font-[var(--font-playfair)] italic text-cream text-xl leading-tight">
                    Your Vision
                  </p>
                  <p className="font-[var(--font-playfair)] italic text-accent text-lg">
                    Our Creativity
                  </p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <PhotoCell label="Design Dashboard" className="aspect-[1.45/1]" />
            </FadeIn>
          </div>

          <FadeIn delay={150}>
            <PhotoCell label="Photo 2" className="aspect-[3/4]" />
          </FadeIn>
        </div>

        {/* Bottom: 3×2 grid, 6 equal photo cells at 1.45:1 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[3, 4, 5, 6, 7, 8].map((i) => (
            <FadeIn key={i} delay={i * 50}>
              <PhotoCell label={`Photo ${i}`} className="aspect-[1.45/1]" />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
