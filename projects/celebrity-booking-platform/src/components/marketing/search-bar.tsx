"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatMoneyCompact } from "@/lib/utils";
import { VerifiedSeal } from "@/components/ui/badge";

interface Result {
  slug: string;
  name: string;
  category: string;
  country: string;
  hue: number;
  feeFromCents: number;
  verified: boolean;
}

const POPULAR = ["Taylor Swift", "Keynote", "Comedy", "Afrobeats", "Formula 1"];

/** Hero search with debounced instant results and keyboard navigation. */
export function SearchBar({ compact }: { compact?: boolean }) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [results, setResults] = React.useState<Result[]>([]);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const [loading, setLoading] = React.useState(false);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`, {
          signal: ctrl.signal,
        });
        const data = (await res.json()) as { results: Result[] };
        setResults(data.results);
        setOpen(true);
        setActive(-1);
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => clearTimeout(t);
  }, [q]);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function submit() {
    setOpen(false);
    if (active >= 0 && results[active]) {
      router.push(`/celebrities/${results[active].slug}`);
    } else if (q.trim()) {
      router.push(`/celebrities?q=${encodeURIComponent(q.trim())}`);
    }
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-2xl">
      <div
        className={`glass flex items-center gap-3 rounded-full pl-6 pr-2 shadow-soft transition-shadow focus-within:shadow-glow ${
          compact ? "h-12" : "h-14 sm:h-16"
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="shrink-0 text-gold"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
        <input
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls="hero-search-results"
          aria-label="Search talent, categories or events"
          placeholder="Search artists, athletes, speakers…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, -1));
            } else if (e.key === "Enter") {
              e.preventDefault();
              submit();
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          className={`min-w-0 flex-1 bg-transparent text-foreground placeholder:text-faint focus:outline-none ${
            compact ? "text-sm" : "text-base"
          } [&::-webkit-search-cancel-button]:hidden`}
        />
        <button
          type="button"
          onClick={submit}
          className={`shrink-0 rounded-full bg-gold font-medium text-on-gold transition-all hover:bg-gold-bright ${
            compact ? "h-9 px-5 text-sm" : "h-10 px-6 text-sm sm:h-12 sm:px-8"
          }`}
        >
          Search
        </button>
      </div>

      {!compact && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-faint">Popular:</span>
          {POPULAR.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setQ(p)}
              className="rounded-full border border-border px-3.5 py-1 text-xs text-muted transition-colors hover:border-gold hover:text-gold"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {open && (
        <ul
          id="hero-search-results"
          role="listbox"
          aria-label="Search results"
          className="glass absolute inset-x-0 top-full z-30 mt-3 overflow-hidden rounded-[var(--radius-lg)] py-2 shadow-lift"
        >
          {loading && results.length === 0 && (
            <li className="px-5 py-3 text-sm text-faint">Searching…</li>
          )}
          {!loading && results.length === 0 && (
            <li className="px-5 py-3 text-sm text-faint">No matches — try a category like “Music”.</li>
          )}
          {results.map((r, i) => (
            <li key={r.slug} role="option" aria-selected={i === active}>
              <Link
                href={`/celebrities/${r.slug}`}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                  i === active ? "bg-surface-raised" : "hover:bg-surface-raised"
                }`}
              >
                <span
                  aria-hidden
                  className="grid size-9 shrink-0 place-items-center rounded-full font-display text-sm font-semibold"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.4 0.09 ${r.hue}), oklch(0.24 0.06 ${r.hue}))`,
                    color: `oklch(0.9 0.07 ${r.hue})`,
                  }}
                >
                  {r.name[0]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    {r.name} {r.verified && <VerifiedSeal size={13} />}
                  </span>
                  <span className="text-xs text-faint">
                    {r.category} · {r.country}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-medium text-gold">
                  {formatMoneyCompact(r.feeFromCents)}+
                </span>
              </Link>
            </li>
          ))}
          {q.trim().length >= 2 && (
            <li className="border-t border-border">
              <button
                type="button"
                onClick={submit}
                className="w-full px-5 py-3 text-left text-sm text-gold transition-colors hover:bg-surface-raised"
              >
                See all results for “{q.trim()}” →
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
