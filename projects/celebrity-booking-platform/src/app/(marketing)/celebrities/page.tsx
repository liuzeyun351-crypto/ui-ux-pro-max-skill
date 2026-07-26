import type { Metadata } from "next";
import { DirectoryFilters } from "@/components/celebrity/directory-filters";
import { DirectoryGrid } from "@/components/celebrity/directory-grid";
import { getCategoriesWithCounts, getCountries, queryCelebrities } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Browse Talent",
  description:
    "Search 500+ verified celebrities, artists, athletes and speakers. Filter by category, country, budget and availability — with transparent starting fees.",
};

type SP = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function CelebritiesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const filters = {
    q: first(sp.q),
    category: first(sp.category),
    country: first(sp.country),
    gender: first(sp.gender),
    availability: first(sp.availability),
    verified: first(sp.verified) === "true" || undefined,
    minFee: first(sp.minFee) ? Number(first(sp.minFee)) : undefined,
    maxFee: first(sp.maxFee) ? Number(first(sp.maxFee)) : undefined,
    sort: (first(sp.sort) as "popularity" | undefined) ?? undefined,
  };

  const [{ items, total, nextCursor }, categories, countries] = await Promise.all([
    queryCelebrities(filters),
    getCategoriesWithCounts(),
    getCountries(),
  ]);

  const activeCategory = categories.find((c) => c.slug === filters.category);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8">
      <header className="mb-10 max-w-3xl">
        <p className="kicker mb-4 flex items-center gap-3">
          <span aria-hidden className="h-px w-8 bg-gold/60" />
          The roster
        </p>
        <h1 className="font-display text-[length:var(--text-display)] font-medium leading-[1.05] tracking-[-0.02em] text-foreground">
          {activeCategory ? (
            <>
              {activeCategory.name}
              <span className="gold-text">.</span>
            </>
          ) : (
            <>
              Every stage. <em className="gold-text not-italic">Every name.</em>
            </>
          )}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          {activeCategory?.tagline ??
            "Verified profiles, transparent starting fees and live availability — filtered to your brief in seconds."}
        </p>
      </header>

      <div className="mb-10">
        <DirectoryFilters
          options={{
            categories: categories.map((c) => ({ slug: c.slug, name: c.name })),
            countries,
          }}
          total={total}
        />
      </div>

      <DirectoryGrid initialItems={items} total={total} initialCursor={nextCursor} />
    </div>
  );
}
