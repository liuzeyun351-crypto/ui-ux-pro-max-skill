import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TalentImage } from "@/components/art/TalentImage";
import { AvailabilityCalendar } from "@/components/celebrity/availability-calendar";
import { CelebrityCard } from "@/components/celebrity/celebrity-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Badge, VerifiedSeal } from "@/components/ui/badge";
import { ButtonLink, ArrowGlyph } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Rating, AvailabilityDot } from "@/components/ui/rating";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCelebrityBySlug, getRelatedCelebrities } from "@/lib/queries";
import { getPhoto, formatCredit } from "@/lib/photo";
import { formatCount, formatDate, formatMoney, formatMoneyCompact } from "@/lib/utils";
import { parseJson, type Award, type FaqItem, type Social, type Work } from "@/lib/types";
import { db } from "@/lib/db";

export async function generateStaticParams() {
  const celebs = await db.celebrity.findMany({ select: { slug: true } });
  return celebs.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await db.celebrity.findUnique({ where: { slug }, include: { category: true } });
  if (!c) return {};
  return {
    title: `${c.name} — Book for Events`,
    description: `${c.tagline}. Book ${c.name} for ${c.category.name.toLowerCase()} engagements from ${formatMoneyCompact(c.feeFromCents)}. Verified availability, escrow-secured.`,
  };
}

const WORK_LABELS: Record<Work["kind"], string> = {
  film: "Filmography",
  album: "Discography",
  book: "Bibliography",
  show: "Television & Series",
  event: "Landmark Moments",
};

export default async function CelebrityProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = await getCelebrityBySlug(slug);
  if (!c) notFound();

  const related = await getRelatedCelebrities(c.categoryId, c.id);
  const photo = getPhoto(c);

  // Gallery: the lead portrait plus every distinct gallery photograph we hold.
  // The grid is sized to what exists rather than padded out to a fixed count —
  // padding meant repeating the portrait and filling the rest with generated
  // artwork, which read as missing images next to the real ones.
  const galleryTiles: {
    url: string;
    alt: string;
    credit?: string | null;
    licence?: string | null;
  }[] = [
    ...(photo
      ? [{ url: photo.portrait, alt: `Photograph of ${c.name}`, credit: photo.credit, licence: photo.licence }]
      : []),
    ...c.media.map((m) => ({ url: m.url, alt: m.alt, credit: m.credit, licence: m.licence })),
  ];
  const achievements = parseJson<string[]>(c.achievements, []);
  const awards = parseJson<Award[]>(c.awards, []);
  const works = parseJson<Work[]>(c.works, []);
  const socials = parseJson<Social[]>(c.socials, []);
  const faq = parseJson<FaqItem[]>(c.faq, []);
  const worksByKind = works.reduce<Record<string, Work[]>>((acc, w) => {
    (acc[w.kind] ??= []).push(w);
    return acc;
  }, {});

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: c.name,
    description: c.tagline,
    nationality: c.country.name,
    jobTitle: c.category.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: c.rating,
      reviewCount: c.reviewCount,
      bestRating: 5,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: c.feeFromCents / 100,
      description: "Starting booking fee (demo)",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Cinematic hero ── */}
      <section className="grain relative isolate overflow-hidden bg-background-deep">
        <div aria-hidden className="absolute inset-0">
          <TalentImage
            celebrity={c}
            variant={9}
            wide
            priority
            sizes="100vw"
            className="h-full w-full object-cover opacity-80"
          />
          {/* legibility scrims: vertical fade to page, then a left wash under the copy */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[color-mix(in_oklch,var(--bg)_55%,transparent)] to-[color-mix(in_oklch,var(--bg)_20%,transparent)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[color-mix(in_oklch,var(--bg)_35%,transparent)] to-transparent" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 pb-14 pt-36 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:gap-12 lg:pb-20 lg:pt-40">
          <div>
            <Reveal>
              <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-faint">
                <Link href="/celebrities" className="transition-colors hover:text-gold">
                  Talent
                </Link>
                <span aria-hidden>/</span>
                <Link
                  href={`/celebrities?category=${c.category.slug}`}
                  className="transition-colors hover:text-gold"
                >
                  {c.category.name}
                </Link>
              </nav>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="flex flex-wrap items-center gap-x-4 gap-y-2 font-display text-[length:var(--text-display)] font-medium leading-[1.02] tracking-[-0.02em] text-foreground">
                {c.name}
                {c.verified && <VerifiedSeal size={30} className="mt-2" />}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{c.tagline}</p>
            </Reveal>

            <Reveal delay={0.16} className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Rating value={c.rating} count={c.reviewCount} />
              <span className="text-sm text-muted">
                <span aria-hidden>{c.country.flag}</span> {c.country.name}
              </span>
              <span className="text-sm text-muted">{formatCount(c.followers)} combined reach</span>
              <span className="text-sm text-muted">{c.yearsActive} years active</span>
            </Reveal>

            <Reveal delay={0.22} className="mt-6 flex flex-wrap gap-2">
              {socials.map((s) => (
                <Badge key={s.platform + s.handle} tone="neutral">
                  {s.platform} · {formatCount(s.followers)}
                </Badge>
              ))}
            </Reveal>

            {/* Attribution for the hero photograph — a CC BY / CC BY-SA obligation */}
            {photo?.credit && (
              <p className="mt-8 text-[11px] leading-relaxed text-faint">
                Photo: {formatCredit(photo)}
                {photo.sourceUrl && (
                  <>
                    {" · "}
                    <a
                      href={photo.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-gold"
                    >
                      source
                    </a>
                  </>
                )}
                {photo.licenceUrl && (
                  <>
                    {" · "}
                    <a
                      href={photo.licenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-gold"
                    >
                      licence
                    </a>
                  </>
                )}
              </p>
            )}
          </div>

          {/* Sticky booking rail */}
          <Reveal delay={0.2} className="lg:sticky lg:top-24 lg:self-start">
            <aside
              aria-label="Booking summary"
              className="glass rounded-[var(--radius-xl)] p-7 shadow-lift"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-faint">Engagements from</p>
              <p className="mt-1 font-display text-4xl font-semibold text-gold">
                {formatMoney(c.feeFromCents)}
              </p>
              <p className="mt-1 text-xs text-faint">
                Up to {formatMoneyCompact(c.feeToCents)} · final quote by format &amp; routing
              </p>
              <div className="mt-4">
                <AvailabilityDot state={c.availability} />
              </div>
              <div className="mt-6 space-y-3">
                <ButtonLink href={`/book/${c.slug}`} size="lg" className="w-full">
                  Book {c.name.split(" ")[0]} <ArrowGlyph />
                </ButtonLink>
                <ButtonLink variant="outline" href={`/book/${c.slug}?intent=inquiry`} size="lg" className="w-full">
                  Contact manager
                </ButtonLink>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <Avatar name={c.manager.user.name} size="sm" />
                <p className="min-w-0 text-xs leading-relaxed text-muted">
                  Represented by{" "}
                  <span className="font-medium text-foreground">{c.manager.user.name}</span>
                  <br />
                  {c.manager.title}, {c.manager.agencyName}
                </p>
              </div>
              <p className="mt-5 flex items-center gap-2 text-[11px] leading-snug text-faint">
                <span aria-hidden className="text-gold">
                  ✦
                </span>
                Deposits held in escrow · released on milestones
              </p>
            </aside>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* ── Biography + achievements ── */}
        <section className="grid grid-cols-1 gap-14 py-20 lg:grid-cols-[1fr_360px]" aria-labelledby="bio-heading">
          <div>
            <Reveal>
              <h2 id="bio-heading" className="kicker mb-5">
                Biography
              </h2>
              <p className="max-w-2xl font-display text-2xl font-normal leading-[1.5] text-foreground/90">
                {c.bio}
              </p>
            </Reveal>

            <Stagger className="mt-14">
              <h3 className="kicker mb-6">Career highlights</h3>
              <ol className="space-y-0">
                {achievements.map((a, i) => (
                  <StaggerItem key={i}>
                    <li className="group flex gap-5 border-l border-border py-4 pl-6 transition-colors hover:border-gold">
                      <span className="font-display text-lg font-semibold text-gold/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[15px] leading-relaxed text-muted group-hover:text-foreground">
                        {a}
                      </p>
                    </li>
                  </StaggerItem>
                ))}
              </ol>
            </Stagger>
          </div>

          {/* Awards rail */}
          <Reveal delay={0.1}>
            <div className="rounded-[var(--radius-xl)] border border-gold/25 bg-surface p-7">
              <h3 className="kicker mb-6">Honours</h3>
              <ul className="space-y-5">
                {awards.map((a, i) => (
                  <li key={i} className="flex gap-4">
                    <span aria-hidden className="mt-1 text-gold">
                      ❋
                    </span>
                    <div>
                      <p className="text-sm font-medium leading-snug text-foreground">{a.name}</p>
                      <p className="mt-0.5 text-xs text-faint">
                        {a.year}
                        {a.work ? ` · ${a.work}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* ── Works ── */}
        <section className="border-t border-border py-20" aria-labelledby="works-heading">
          <Reveal>
            <h2 id="works-heading" className="kicker mb-10">
              Selected works
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(worksByKind).map(([kind, list]) => (
              <Reveal key={kind}>
                <h3 className="mb-4 font-display text-xl font-medium text-foreground">
                  {WORK_LABELS[kind as Work["kind"]]}
                </h3>
                <ul className="space-y-3">
                  {list.map((w, i) => (
                    <li
                      key={i}
                      className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-3"
                    >
                      <span className="text-sm text-foreground">
                        {w.title}
                        {w.meta && <span className="block text-xs text-faint">{w.meta}</span>}
                      </span>
                      <span className="shrink-0 text-xs tabular-nums text-gold">{w.year}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Gallery ── */}
        <section className="border-t border-border py-20" aria-labelledby="gallery-heading">
          <Reveal>
            <h2 id="gallery-heading" className="kicker mb-10">
              Gallery
            </h2>
          </Reveal>
          {/* Equal 3:4 tiles. An earlier layout gave the lead photograph a
              double-width box, but every source here is a portrait, so a
              landscape box cropped hard into the middle of a face. */}
          <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {galleryTiles.map((tile) => (
              <StaggerItem key={tile.url}>
                <figure className="group relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] border border-border">
                  <Image
                    src={tile.url}
                    alt={tile.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 30vw"
                    className="object-cover object-top transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                  />
                  {tile.credit && (
                    <figcaption className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-[10px] text-white/70">
                      {tile.credit}
                      {tile.licence ? ` · ${tile.licence}` : ""}
                    </figcaption>
                  )}
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-4 text-xs text-faint">
            {photo ? (
              <>
                Freely-licensed photography — see{" "}
                <Link href="/credits" className="underline underline-offset-4 hover:text-gold">
                  image credits
                </Link>
                . Every photograph here is used under a free licence, with the
                photographer credited.
              </>
            ) : (
              <>
                Generated artwork — run <code className="text-gold">npm run fetch:images</code> to
                populate licensed photography.
              </>
            )}
          </p>
        </section>

        {/* ── Availability + upcoming ── */}
        <section className="grid grid-cols-1 gap-10 border-t border-border py-20 lg:grid-cols-2" aria-labelledby="availability-heading">
          <div>
            <Reveal>
              <h2 id="availability-heading" className="kicker mb-8">
                Availability
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <AvailabilityCalendar
                slots={c.availability_.map((s) => ({
                  date: s.date.toISOString(),
                  status: s.status as "open" | "held" | "booked" | "blocked",
                }))}
              />
            </Reveal>
          </div>
          <div>
            <Reveal>
              <h2 className="kicker mb-8">On stage soon</h2>
            </Reveal>
            <Stagger className="space-y-4">
              {c.events.length === 0 && (
                <p className="text-sm text-muted">
                  No public dates announced — private windows may still be open above.
                </p>
              )}
              {c.events.map((e) => (
                <StaggerItem key={e.id}>
                  <div className="flex items-center gap-5 rounded-[var(--radius-lg)] border border-border bg-surface p-5">
                    <div className="grid size-14 shrink-0 place-items-center rounded-[var(--radius-sm)] border border-gold/30 text-center">
                      <span>
                        <span className="block font-display text-xl font-semibold leading-none text-gold">
                          {new Date(e.date).getDate()}
                        </span>
                        <span className="block text-[10px] uppercase text-faint">
                          {new Date(e.date).toLocaleDateString("en-US", { month: "short" })}
                        </span>
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{e.title}</p>
                      <p className="truncate text-sm text-muted">
                        {e.venue}, {e.city} · {formatDate(e.date)}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ── Reviews ── */}
        {c.reviews.length > 0 && (
          <section className="border-t border-border py-20" aria-labelledby="reviews-heading">
            <Reveal>
              <h2 id="reviews-heading" className="kicker mb-10">
                Client reviews
              </h2>
            </Reveal>
            <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {c.reviews.map((r) => (
                <StaggerItem key={r.id}>
                  <figure className="flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-6">
                    <Rating value={r.rating} />
                    <blockquote className="mt-4 flex-1">
                      <p className="font-medium text-foreground">{r.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{r.body}</p>
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                      <Avatar name={r.author.name} size="sm" />
                      <span className="text-xs text-faint">
                        <span className="block font-medium text-muted">{r.author.name}</span>
                        {r.eventType.replace("-", " ")} · {formatDate(r.createdAt)}
                      </span>
                    </figcaption>
                  </figure>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        )}

        {/* ── FAQ ── */}
        {faq.length > 0 && (
          <section className="border-t border-border py-20" aria-labelledby="profile-faq-heading">
            <Reveal>
              <h2 id="profile-faq-heading" className="kicker mb-8">
                Booking questions
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <Accordion
                type="single"
                collapsible
                className="max-w-3xl rounded-[var(--radius-xl)] border border-border bg-surface px-7"
              >
                {faq.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </section>
        )}

        {/* ── Related ── */}
        {related.length > 0 && (
          <section className="border-t border-border py-20" aria-labelledby="related-heading">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <Reveal>
                <h2
                  id="related-heading"
                  className="font-display text-[length:var(--text-title)] font-medium text-foreground"
                >
                  More {c.category.name.toLowerCase()} names
                </h2>
              </Reveal>
              <ButtonLink variant="ghost" href={`/celebrities?category=${c.category.slug}`}>
                View category <ArrowGlyph />
              </ButtonLink>
            </div>
            <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <StaggerItem key={r.id}>
                  <CelebrityCard celebrity={r} />
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        )}
      </div>

      {/* mobile sticky book bar */}
      <div className="glass fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 px-5 py-3 lg:hidden">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-faint">From</p>
          <p className="font-display text-lg font-semibold text-gold">
            {formatMoneyCompact(c.feeFromCents)}
          </p>
        </div>
        <ButtonLink href={`/book/${c.slug}`} className="flex-1 max-w-56">
          Book now <ArrowGlyph />
        </ButtonLink>
      </div>
    </>
  );
}
