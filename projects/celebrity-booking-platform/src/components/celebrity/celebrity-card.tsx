import Link from "next/link";
import { TalentImage } from "@/components/art/TalentImage";
import { VerifiedSeal } from "@/components/ui/badge";
import { AvailabilityDot } from "@/components/ui/rating";
import { formatCount, formatMoneyCompact } from "@/lib/utils";
import type { CelebrityWithRefs } from "@/lib/queries";

/**
 * Editorial talent card: full-bleed portrait art, gradient scrim, and a
 * metadata band that lifts on hover. Deliberately not an icon-tile card.
 */
export function CelebrityCard({
  celebrity: c,
  eager,
}: {
  celebrity: CelebrityWithRefs;
  eager?: boolean;
}) {
  return (
    <Link
      href={`/celebrities/${c.slug}`}
      className="group relative block overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface outline-offset-4 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-lift"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <TalentImage
          celebrity={c}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={eager}
        />
        {/* scrim for legibility */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
        />

        {/* top row: category + rating */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span className="rounded-full bg-black/35 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm">
            {c.category.name}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-black/35 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <span aria-hidden className="text-gold-bright">
              ★
            </span>
            {c.rating.toFixed(1)}
          </span>
        </div>

        {/* name + meta pinned to the bottom of the art */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-2xl font-semibold leading-tight text-white">
              {c.name}
            </h3>
            {c.verified && <VerifiedSeal size={17} />}
          </div>
          <p className="mt-1 line-clamp-1 text-[13px] text-white/70">{c.tagline}</p>
        </div>
      </div>

      {/* metadata band */}
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-faint">From</p>
          <p className="font-display text-lg font-semibold text-gold">
            {formatMoneyCompact(c.feeFromCents)}
          </p>
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end gap-1.5 text-xs text-muted">
            <span aria-hidden>{c.country.flag}</span> {c.country.name}
            <span aria-hidden className="text-faint">
              ·
            </span>
            {formatCount(c.followers)} reach
          </p>
          <AvailabilityDot state={c.availability} className="mt-1 justify-end" short />
        </div>
      </div>

      {/* hover underline */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-gold-deep via-gold to-gold-bright transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
      />
    </Link>
  );
}
