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

export default function Principles() {
  return (
    <section className="bg-bg">
      {/* Giant heading */}
      <div className="section-padding flex flex-col items-center text-center">
        <FadeIn>
          <h2 className="text-h1 font-bold text-cream/95 tracking-tight">our principles</h2>
        </FadeIn>
        <FadeIn>
          <p className="font-[var(--font-playfair)] italic text-text-secondary text-[clamp(18px,2.5vw,32px)] max-w-3xl mt-8 leading-relaxed">
            &ldquo;Real estate isn&apos;t about selling property.<br />
            It&apos;s about helping people make decisions they&apos;ll be proud of for years to come.&rdquo;
          </p>
        </FadeIn>
      </div>

      {/* Vision */}
      <div className="container-x pb-section">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="border-t border-border-subtle py-12">
              <div className="flex flex-col md:flex-row md:items-start gap-8">
                <h3 className="text-h3 font-[var(--font-playfair)] text-cream min-w-[200px]">Our Vision</h3>
                <p className="text-text-secondary leading-relaxed max-w-2xl">
                  To set the benchmark for trusted real estate advisory in Dubai by delivering intelligent investment strategies, exceptional client experiences, and lasting value for clients worldwide.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Mission */}
          <FadeIn>
            <div className="border-t border-border-subtle py-12">
              <div className="flex flex-col md:flex-row md:items-start gap-8">
                <h3 className="text-h3 font-[var(--font-playfair)] text-cream min-w-[200px]">Our Mission</h3>
                <p className="text-text-secondary leading-relaxed max-w-2xl">
                  To provide personalised real estate solutions driven by market expertise, integrity, and strategic guidance, empowering every client to make confident decisions with a long-term perspective.
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Values */}
          <FadeIn>
            <div className="border-t border-border-subtle py-12">
              <div className="flex flex-col md:flex-row md:items-start gap-8">
                <h3 className="text-h3 font-[var(--font-playfair)] text-cream min-w-[200px]">Our Values</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-2xl">
                  {[
                    { title: "TRUST", desc: "Honesty, consistency and accountability in every relationship we build." },
                    { title: "TRANSPARENCY", desc: "Clear communication and objective advice at every stage of the journey." },
                    { title: "EXPERTISE", desc: "Deep market knowledge and strategic insight delivering informed solutions." },
                    { title: "EXCELLENCE", desc: "Exceptional service through professionalism, precision and attention to detail." },
                  ].map((v, i) => (
                    <FadeIn key={v.title} delay={i * 100}>
                      <div>
                        <p className="text-accent text-xs tracking-[0.3em] mb-2">{v.title}</p>
                        <p className="text-text-secondary text-sm leading-relaxed">{v.desc}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
