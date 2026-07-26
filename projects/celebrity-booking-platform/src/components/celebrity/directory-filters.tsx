"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const SORTS = [
  ["popularity", "Most popular"],
  ["trending", "Trending"],
  ["price-asc", "Price · low to high"],
  ["price-desc", "Price · high to low"],
  ["recent", "Recently added"],
  ["az", "A – Z"],
] as const;

const BUDGETS = [
  ["", "Any budget"],
  ["0-100000", "Under $100K"],
  ["100000-350000", "$100K – $350K"],
  ["350000-1000000", "$350K – $1M"],
  ["1000000-", "$1M+"],
] as const;

const GENDERS = [
  ["", "All genders"],
  ["female", "Female"],
  ["male", "Male"],
  ["nonbinary", "Non-binary"],
] as const;

const AVAILABILITY = [
  ["", "Any availability"],
  ["available", "Available now"],
  ["limited", "Limited"],
  ["booked", "Fully booked"],
] as const;

export interface FilterOptions {
  categories: { slug: string; name: string }[];
  countries: { code: string; name: string; flag: string }[];
}

function selectCls(active: boolean) {
  return cn(
    "h-10 cursor-pointer appearance-none rounded-full border bg-surface pl-4 pr-9 text-sm transition-colors focus:border-gold focus:outline-none",
    active ? "border-gold/60 text-gold" : "border-border text-muted hover:border-border-strong"
  );
}

/** URL-synced directory controls: every change is shareable and back-button safe. */
export function DirectoryFilters({ options, total }: { options: FilterOptions; total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = React.useTransition();
  const [q, setQ] = React.useState(params.get("q") ?? "");

  // Keep the search box in sync when navigation happens elsewhere (e.g. hero search)
  React.useEffect(() => setQ(params.get("q") ?? ""), [params]);

  const set = React.useCallback(
    (patch: Record<string, string>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v) next.set(k, v);
        else next.delete(k);
      }
      startTransition(() => {
        router.replace(`${pathname}?${next.toString()}`, { scroll: false });
      });
    },
    [params, pathname, router]
  );

  // Debounced text search
  React.useEffect(() => {
    const current = params.get("q") ?? "";
    if (q === current) return;
    const t = setTimeout(() => set({ q }), 350);
    return () => clearTimeout(t);
  }, [q, params, set]);

  const category = params.get("category") ?? "";
  const budget = `${params.get("minFee") ?? ""}-${params.get("maxFee") ?? ""}`;
  const budgetValue = BUDGETS.some(([v]) => v === budget) ? budget : "";
  const activeCount = ["country", "gender", "availability", "verified", "minFee"].filter((k) =>
    params.get(k)
  ).length;
  const [advancedOpen, setAdvancedOpen] = React.useState(activeCount > 0);

  return (
    <div className="space-y-5">
      {/* row 1: search + sort */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 basis-64">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the roster…"
            aria-label="Search talent"
            className="h-11 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-sm text-foreground placeholder:text-faint focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25 [&::-webkit-search-cancel-button]:hidden"
          />
        </div>

        <div className="relative">
          <label htmlFor="sort" className="sr-only">
            Sort by
          </label>
          <select
            id="sort"
            value={params.get("sort") ?? "popularity"}
            onChange={(e) => set({ sort: e.target.value === "popularity" ? "" : e.target.value })}
            className={selectCls(false)}
          >
            {SORTS.map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
          <Chevron />
        </div>

        <button
          type="button"
          onClick={() => setAdvancedOpen((v) => !v)}
          aria-expanded={advancedOpen}
          className={cn(
            "flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors",
            advancedOpen || activeCount > 0
              ? "border-gold/60 text-gold"
              : "border-border text-muted hover:border-border-strong"
          )}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          Filters
          {activeCount > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-gold text-[11px] font-semibold text-on-gold">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* row 2: category rail */}
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <CategoryPill active={!category} onClick={() => set({ category: "" })}>
          All
        </CategoryPill>
        {options.categories.map((c) => (
          <CategoryPill
            key={c.slug}
            active={category === c.slug}
            onClick={() => set({ category: category === c.slug ? "" : c.slug })}
          >
            {c.name}
          </CategoryPill>
        ))}
      </div>

      {/* row 3: advanced filters */}
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-400 ease-[var(--ease-out-expo)]",
          advancedOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 pb-1">
            <div className="relative">
              <label htmlFor="f-country" className="sr-only">
                Country
              </label>
              <select
                id="f-country"
                value={params.get("country") ?? ""}
                onChange={(e) => set({ country: e.target.value })}
                className={selectCls(!!params.get("country"))}
              >
                <option value="">All countries</option>
                {options.countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>

            <div className="relative">
              <label htmlFor="f-budget" className="sr-only">
                Budget
              </label>
              <select
                id="f-budget"
                value={budgetValue}
                onChange={(e) => {
                  const [min, max] = e.target.value.split("-");
                  set({ minFee: min ?? "", maxFee: max ?? "" });
                }}
                className={selectCls(!!params.get("minFee") || !!params.get("maxFee"))}
              >
                {BUDGETS.map(([v, label]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>

            <div className="relative">
              <label htmlFor="f-gender" className="sr-only">
                Gender
              </label>
              <select
                id="f-gender"
                value={params.get("gender") ?? ""}
                onChange={(e) => set({ gender: e.target.value })}
                className={selectCls(!!params.get("gender"))}
              >
                {GENDERS.map(([v, label]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>

            <div className="relative">
              <label htmlFor="f-availability" className="sr-only">
                Availability
              </label>
              <select
                id="f-availability"
                value={params.get("availability") ?? ""}
                onChange={(e) => set({ availability: e.target.value })}
                className={selectCls(!!params.get("availability"))}
              >
                {AVAILABILITY.map(([v, label]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>

            <label className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border px-4 text-sm text-muted transition-colors hover:border-border-strong has-[:checked]:border-gold/60 has-[:checked]:text-gold">
              <input
                type="checkbox"
                checked={params.get("verified") === "true"}
                onChange={(e) => set({ verified: e.target.checked ? "true" : "" })}
                className="size-3.5 accent-[var(--gold)]"
              />
              Verified only
            </label>

            {activeCount > 0 && (
              <button
                type="button"
                onClick={() =>
                  set({ country: "", gender: "", availability: "", verified: "", minFee: "", maxFee: "" })
                }
                className="text-sm text-faint underline-offset-4 transition-colors hover:text-gold hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      <p aria-live="polite" className="text-sm text-faint">
        {pending ? "Updating…" : `${total} ${total === 1 ? "name" : "names"} on the roster`}
      </p>
    </div>
  );
}

function CategoryPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-sm transition-all duration-200",
        active
          ? "border-gold bg-gold/12 font-medium text-gold"
          : "border-border text-muted hover:border-border-strong hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function Chevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      aria-hidden
      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-faint"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
