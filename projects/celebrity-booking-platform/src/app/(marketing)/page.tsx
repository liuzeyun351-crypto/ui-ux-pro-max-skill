import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { LogoMarquee } from "@/components/marketing/logo-marquee";
import { SectionHeading } from "@/components/marketing/section-heading";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { StatsBand } from "@/components/marketing/stats-band";
import { Testimonials } from "@/components/marketing/testimonials";
import { FaqSection } from "@/components/marketing/faq-section";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { CelebrityCard } from "@/components/celebrity/celebrity-card";
import { ArticleImage } from "@/components/art/TalentImage";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { ButtonLink, ArrowGlyph } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { PLATFORM_FAQ } from "@/lib/content/faq";
import { formatDate } from "@/lib/utils";
import {
  getArticles,
  getCategoriesWithCounts,
  getFeaturedCelebrities,
  getManagersWithRoster,
  getUpcomingEvents,
} from "@/lib/queries";

export const metadata: Metadata = {
  description:
    "Book icons of music, film, sport and thought for concerts, keynotes, campaigns and private events — verified talent, transparent fees, escrow-secured.",
};

export const revalidate = 300;

export default async function HomePage() {
  const [featured, categories, events, managers, articles] = await Promise.all([
    getFeaturedCelebrities(8),
    getCategoriesWithCounts(),
    getUpcomingEvents(4),
    getManagersWithRoster(),
    getArticles(3),
  ]);

  const collage = featured.slice(0, 3).map((c) => ({
    slug: c.slug,
    name: c.name,
    hue: c.accentHue,
    category: c.category.name,
    feeFromCents: c.feeFromCents,
    photo: c.photo,
  }));

  return (
    <>
      <Hero collage={collage} />
      <LogoMarquee />

      {/* Featured talent */}
      <section className="mx-auto max-w-7xl px-5 py-28 sm:px-8" aria-labelledby="featured-heading">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            kicker="The headline roster"
            title={
              <span id="featured-heading">
                Names that need <em className="gold-text not-italic">no introduction</em>
              </span>
            }
          />
          <Reveal delay={0.15}>
            <ButtonLink variant="outline" href="/celebrities">
              Browse all talent <ArrowGlyph />
            </ButtonLink>
          </Reveal>
        </div>
        <Stagger amount={0.1} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((c) => (
            <StaggerItem key={c.id}>
              <CelebrityCard celebrity={c} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Categories */}
      <section
        className="border-y border-border bg-surface/40 py-28"
        aria-labelledby="categories-heading"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            kicker="Popular categories"
            title={<span id="categories-heading">Every kind of extraordinary</span>}
            align="center"
            className="mb-14"
          />
          <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat, i) => (
              <StaggerItem key={cat.id} className={i === 0 ? "col-span-2 md:row-span-2" : ""}>
                <Link
                  href={`/celebrities?category=${cat.slug}`}
                  className={`group relative flex h-full flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background p-6 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift ${
                    i === 0 ? "min-h-64" : "min-h-36"
                  }`}
                >
                  <span
                    aria-hidden
                    className="absolute -right-8 -top-8 size-32 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-50"
                    style={{ background: `oklch(0.6 0.13 ${(i * 47 + 40) % 360})` }}
                  />
                  <span className="font-display text-xl font-medium text-foreground transition-colors group-hover:text-gold md:text-2xl">
                    {cat.name}
                  </span>
                  <span className="mt-1 text-xs text-faint">
                    {cat._count.celebrities} on the roster
                  </span>
                  {i === 0 && (
                    <span className="mt-3 max-w-56 text-sm leading-relaxed text-muted">
                      {cat.tagline}
                    </span>
                  )}
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <HowItWorks />
      <StatsBand />

      {/* Upcoming shows */}
      <section className="mx-auto max-w-7xl px-5 py-28 sm:px-8" aria-labelledby="events-heading">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            kicker="On stage soon"
            title={<span id="events-heading">Upcoming shows &amp; appearances</span>}
          />
        </div>
        <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {events.map((e) => (
            <StaggerItem key={e.id}>
              <Link
                href={`/celebrities/${e.celebrity.slug}`}
                className="group flex items-stretch gap-5 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface transition-all duration-400 hover:border-gold/40 hover:shadow-lift"
              >
                <div className="relative w-28 shrink-0 overflow-hidden sm:w-36">
                  <ArticleImage
                    title={e.title}
                    hue={e.celebrity.accentHue}
                    celebrity={e.celebrity}
                    sizes="(max-width: 640px) 112px, 144px"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center py-5 pr-5">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-gold">
                    {formatDate(e.date)}
                  </p>
                  <h3 className="mt-1 truncate font-display text-xl font-medium text-foreground">
                    {e.title}
                  </h3>
                  <p className="mt-1 truncate text-sm text-muted">
                    {e.celebrity.name} · {e.venue}, {e.city}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="mr-6 self-center text-xl text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold"
                >
                  →
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Testimonials />

      {/* Featured managers */}
      <section
        className="border-y border-border bg-surface/40 py-28"
        aria-labelledby="managers-heading"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            kicker="The people behind the names"
            title={<span id="managers-heading">Representation you can reach</span>}
            lead="Every booking request lands with a named, verified manager — the same people who run these careers."
            className="mb-14"
          />
          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {managers.slice(0, 6).map((m) => (
              <StaggerItem key={m.id}>
                <div className="flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-background p-6 transition-colors duration-300 hover:border-gold/30">
                  <div className="flex items-center gap-4">
                    <Avatar name={m.user.name} size="lg" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{m.user.name}</p>
                      <p className="truncate text-xs text-faint">
                        {m.title} · {m.agencyName}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted">
                    <span>{m._count.celebrities} artists represented</span>
                    <span>{m.yearsActive} yrs</span>
                  </div>
                  <p className="mt-3 truncate text-xs text-faint">
                    Roster includes {m.celebrities.map((c) => c.name).slice(0, 2).join(", ")}
                    {m._count.celebrities > 2 ? "…" : ""}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Latest stories */}
      <section className="mx-auto max-w-7xl px-5 py-28 sm:px-8" aria-labelledby="news-heading">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            kicker="From the wire"
            title={<span id="news-heading">Latest stories</span>}
          />
          <Reveal delay={0.15}>
            <ButtonLink variant="outline" href="/news">
              All stories <ArrowGlyph />
            </ButtonLink>
          </Reveal>
        </div>
        <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {articles.map((a) => (
            <StaggerItem key={a.id}>
              <Link
                href={`/news/${a.slug}`}
                className="group block overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <ArticleImage
                    title={a.title}
                    hue={a.heroHue}
                    celebrity={a.celebrity}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-gold">
                    {a.kind} · {a.readMinutes} min read
                  </p>
                  <h3 className="mt-2 font-display text-xl font-medium leading-snug text-foreground group-hover:text-gold">
                    {a.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{a.excerpt}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Newsletter */}
      <section className="grain relative overflow-hidden border-y border-border bg-background-deep py-24">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 100% at 50% 100%, oklch(0.35 0.08 85 / 0.3), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <SectionHeading
            kicker="The Aurum Letter"
            title="Availability drops before it's public"
            lead="A short letter every Friday: newly open dates, off-market appearances and what the world's stages are planning next."
            align="center"
            className="mb-8"
          />
          <Reveal delay={0.1} className="flex justify-center">
            <NewsletterForm large />
          </Reveal>
        </div>
      </section>

      <FaqSection items={PLATFORM_FAQ} />
    </>
  );
}
