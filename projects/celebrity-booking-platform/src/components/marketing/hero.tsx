"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { TalentImage } from "@/components/art/TalentImage";
import { TextReveal } from "@/components/motion/reveal";
import { SearchBar } from "./search-bar";
import { formatMoneyCompact } from "@/lib/utils";

export interface HeroCeleb {
  slug: string;
  name: string;
  hue: number;
  category: string;
  feeFromCents: number;
  /** JSON photo record from Celebrity.photo, when imagery has been fetched */
  photo?: string | null;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Cinematic opening: a dark stage with sweeping spotlight beams (generative,
 * no video assets), a serif headline revealed line by line, instant search,
 * and a floating collage of talent portraits stage right.
 */
export function Hero({ collage }: { collage: HeroCeleb[] }) {
  const reduced = useReducedMotion();
  const [a, b, c] = collage;

  return (
    <section className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-background-deep">
      {/* stage wash */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, oklch(0.28 0.045 75 / 0.9), transparent 60%), radial-gradient(80% 60% at 85% 110%, oklch(0.22 0.06 300 / 0.5), transparent 60%)",
        }}
      />
      {/* spotlight beams */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-1/4 left-[8%] h-[150%] w-40 animate-spotlight bg-gradient-to-b from-gold/25 via-gold/6 to-transparent blur-2xl"
          style={{ transformOrigin: "top center" }}
        />
        <div
          className="absolute -top-1/4 left-[38%] h-[150%] w-64 animate-spotlight bg-gradient-to-b from-white/12 via-white/4 to-transparent blur-3xl"
          style={{ transformOrigin: "top center", animationDelay: "-7s", animationDuration: "18s" }}
        />
        <div
          className="absolute -top-1/4 right-[12%] h-[150%] w-48 animate-spotlight bg-gradient-to-b from-gold/18 via-gold/5 to-transparent blur-2xl"
          style={{ transformOrigin: "top center", animationDelay: "-3.5s", animationDuration: "12s" }}
        />
      </div>

      {/* grid-cols-1 is explicit: an implicit auto column sizes to the widest
          headline word and pushes the hero past the viewport on small screens */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 px-5 pb-24 pt-36 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-8">
        <div className="min-w-0">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="kicker mb-6 flex items-center gap-3"
          >
            <span aria-hidden className="h-px w-10 bg-gold/60" />
            Private booking · Escrow secured · 500+ verified names
          </motion.p>

          <h1 className="font-display text-[length:var(--text-display-xl)] font-medium leading-[1.02] tracking-[-0.02em] text-foreground">
            <TextReveal
              delay={0.15}
              lines={[
                <span key="1">The world&apos;s stage,</span>,
                <em key="2" className="gold-text not-italic">
                  on request.
                </em>,
              ]}
            />
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            Book icons of music, film, sport and thought for concerts, keynotes, campaigns and
            private moments — with concierge production and funds held in escrow until the
            curtain falls.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: EASE }}
            className="mt-10"
          >
            <SearchBar />
          </motion.div>
        </div>

        {/* Floating collage: two columns offset against each other. Flow layout
            rather than absolute positioning, so cards drift with the float
            animation without ever covering one another's caption. */}
        <div className="mx-auto hidden w-full max-w-md gap-5 lg:flex" aria-hidden>
          <div className="flex flex-1 flex-col gap-5 pt-10">
            {a && <CollageCard celeb={a} variant={0} delay={0.35} tilt={-2.5} floatDelay="-2s" reduced={reduced} />}
            {c && <CollageCard celeb={c} variant={2} delay={0.65} tilt={-1.5} floatDelay="-7s" reduced={reduced} />}
          </div>
          <div className="flex flex-1 flex-col justify-center">
            {b && <CollageCard celeb={b} variant={1} delay={0.5} tilt={3} floatDelay="-4.5s" reduced={reduced} tall />}
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        aria-hidden
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-faint sm:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="block h-9 w-px overflow-hidden bg-border">
          <span className="block h-3 w-px animate-[scroll-cue_1.8s_ease-in-out_infinite] bg-gold" />
        </span>
      </motion.div>
    </section>
  );
}

function CollageCard({
  celeb,
  variant,
  delay,
  tilt,
  floatDelay,
  reduced,
  tall,
}: {
  celeb: HeroCeleb;
  variant: number;
  delay: number;
  tilt: number;
  floatDelay: string;
  reduced: boolean | null;
  tall?: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 44, rotate: tilt * 1.6 }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      className="animate-float overflow-hidden rounded-[var(--radius-lg)] border border-border shadow-lift"
      style={{ animationDelay: floatDelay }}
    >
      <Link href={`/celebrities/${celeb.slug}`} tabIndex={-1}>
        <span className={`relative block w-full overflow-hidden ${tall ? "h-72" : "h-48"}`}>
          <TalentImage
            celebrity={{ name: celeb.name, accentHue: celeb.hue, photo: celeb.photo }}
            variant={variant}
            className="absolute inset-0 h-full w-full object-cover"
            sizes="(max-width: 1024px) 0px, 220px"
          />
        </span>
        <CollageCaption {...celeb} />
      </Link>
    </motion.div>
  );
}

function CollageCaption({ name, category, feeFromCents }: HeroCeleb) {
  return (
    <div className="glass flex items-center justify-between gap-2 px-4 py-2.5">
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-foreground">{name}</span>
        <span className="block text-[11px] text-faint">{category}</span>
      </span>
      <span className="shrink-0 text-xs font-semibold text-gold">
        {formatMoneyCompact(feeFromCents)}+
      </span>
    </div>
  );
}
