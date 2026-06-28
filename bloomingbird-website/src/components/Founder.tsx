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

function TypeWriter({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [started, text]);

  return <span ref={ref} className={className}>{displayed}<span className="animate-pulse">|</span></span>;
}

export default function Founder() {
  return (
    <section className="bg-bg section-padding">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-accent text-lg">&#9679;</span>
            <h3 className="font-[var(--font-playfair)] italic text-cream text-xl">A Word From Our Founder</h3>
          </div>
          <div className="h-px bg-border-subtle mb-12" />
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Photo placeholder */}
          <FadeIn>
            <div className="aspect-[3/4] bg-surface rounded-2xl border border-border-subtle flex items-center justify-center">
              <p className="text-text-muted text-sm">Founder Photo</p>
            </div>
          </FadeIn>

          {/* Quote and letter */}
          <FadeIn>
            <div className="space-y-6">
              <blockquote className="border-l-2 border-accent pl-6">
                <p className="font-[var(--font-playfair)] italic text-cream text-[clamp(18px,2.2vw,24px)] leading-relaxed">
                  <TypeWriter text="Our vision extends beyond transactions. We strive to build meaningful relationships, deliver exceptional experiences, and create lasting value for every client we serve." />
                </p>
              </blockquote>

              <div className="space-y-4 text-text-secondary text-sm leading-relaxed pt-4">
                <p>
                  When I started Bloomingbird, I wasn&apos;t focused on building the biggest real estate company in Dubai. I simply wanted to build one that people could genuinely trust.
                </p>
                <p>
                  Having spent years understanding the market and working closely with clients, I realised that what people needed wasn&apos;t another salesperson. They needed honest advice, thoughtful guidance, and someone who genuinely understood their goals before recommending a property. That belief became the foundation of Bloomingbird.
                </p>
                <p>
                  As the company grew, I knew I couldn&apos;t build this vision alone. My brother, Harssh Guptaa, joined me, bringing the same values, commitment, and client-first mindset that Bloomingbird was built upon. Together, we&apos;ve worked to create a company where every decision is driven by integrity, transparency, and long-term relationships rather than short-term transactions.
                </p>
                <p>
                  Today, I&apos;m incredibly proud of what we&apos;ve built. Not just a real estate company, but a team that shares a common purpose: helping people make confident property decisions that create lasting value.
                </p>
                <p>
                  To every client, partner, and team member who has been part of this journey, thank you for your trust. It is a responsibility we never take for granted.
                </p>
              </div>

              <div className="pt-6 border-t border-border-subtle">
                <p className="text-accent font-medium">Ankit Goyal</p>
                <p className="text-text-muted text-sm">Founder and CEO</p>
                <p className="text-text-muted text-sm">Bloomingbird Real Estate</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
