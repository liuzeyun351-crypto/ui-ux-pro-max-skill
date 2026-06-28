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

const team = [
  {
    name: "Ankith Goyal",
    role: "Founder & CEO",
    bio: "The visionary behind Bloomingbird Real Estate, Ankith leads the company with a strong focus on trust, transparency, and long-term client relationships. His market understanding and people-first approach continue to drive the company's growth and reputation in Dubai's real estate sector.",
  },
  {
    name: "Harssh Guptaa",
    role: "Associate Director",
    bio: "Harssh supports business development and client relations with a practical, results-driven approach, helping ensure smooth operations and strong client experiences across every stage.",
  },
  {
    name: "Soumya Suzzane",
    role: "Creative Head & Marketing Head",
    bio: "Soumya leads Bloomingbird's creative direction and marketing strategy, shaping the brand's identity, communication, and digital presence.",
  },
  {
    name: "Murti Purohit",
    role: "Co-Founder",
    bio: "Murti has contributed to the foundation and growth of Bloomingbird through strategic support, collaboration, and shared vision during the company's journey.",
  },
  {
    name: "Sudha Gupta",
    role: "Director",
    bio: "Sudha supports the company with her understanding of client relations and operational coordination, contributing to the overall growth and stability of the business.",
  },
];

export default function Team() {
  return (
    <section className="bg-bg section-padding">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-accent text-lg">&#9679;</span>
            <h3 className="font-[var(--font-playfair)] italic text-cream text-xl">The People</h3>
          </div>
          <div className="h-px bg-border-subtle mb-4" />
        </FadeIn>

        <FadeIn>
          <h2 className="text-h3 font-[var(--font-playfair)] text-cream mb-3">Our Team</h2>
          <p className="text-text-secondary mb-16">Behind every recommendation is a relationship.</p>
        </FadeIn>

        {/* Founder card - larger */}
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="aspect-[4/5] bg-surface rounded-2xl border border-border-subtle flex items-end p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent z-10" />
              <div className="relative z-20">
                <p className="text-accent text-xs tracking-[0.2em] uppercase mb-1">{team[0].role}</p>
                <p className="text-cream text-xl font-[var(--font-playfair)] mb-2">{team[0].name}</p>
                <p className="text-text-secondary text-xs leading-relaxed">{team[0].bio}</p>
              </div>
            </div>

            {/* Team member 2 */}
            <div className="aspect-[4/5] bg-surface rounded-2xl border border-border-subtle flex items-end p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent z-10" />
              <div className="relative z-20">
                <p className="text-accent text-xs tracking-[0.2em] uppercase mb-1">{team[1].role}</p>
                <p className="text-cream text-xl font-[var(--font-playfair)] mb-2">{team[1].name}</p>
                <p className="text-text-secondary text-xs leading-relaxed">{team[1].bio}</p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Remaining team - scrolling cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.slice(2).map((member, i) => (
            <FadeIn key={member.name} delay={i * 100}>
              <div className="aspect-[3/4] bg-surface rounded-2xl border border-border-subtle flex items-end p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent z-10" />
                <div className="relative z-20">
                  <p className="text-accent text-xs tracking-[0.2em] uppercase mb-1">{member.role}</p>
                  <p className="text-cream text-lg font-[var(--font-playfair)] mb-2">{member.name}</p>
                  <p className="text-text-secondary text-xs leading-relaxed">{member.bio}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
