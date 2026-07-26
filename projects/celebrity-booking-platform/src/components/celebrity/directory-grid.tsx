"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { CelebrityCard } from "./celebrity-card";
import type { CelebrityWithRefs } from "@/lib/queries";

/**
 * Infinite-scroll grid. The server renders the first page; this component
 * appends further pages from /api/celebrities as the sentinel enters view.
 */
export function DirectoryGrid({
  initialItems,
  total,
  initialCursor,
}: {
  initialItems: CelebrityWithRefs[];
  total: number;
  initialCursor: number | null;
}) {
  const params = useSearchParams();
  const reduced = useReducedMotion();
  const [items, setItems] = React.useState(initialItems);
  const [cursor, setCursor] = React.useState<number | null>(initialCursor);
  const [loading, setLoading] = React.useState(false);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  // New filters from the server → reset the accumulated list
  React.useEffect(() => {
    setItems(initialItems);
    setCursor(initialCursor);
  }, [initialItems, initialCursor]);

  const loadMore = React.useCallback(async () => {
    if (cursor === null || loading) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams(params.toString());
      qs.set("cursor", String(cursor));
      const res = await fetch(`/api/celebrities?${qs.toString()}`);
      if (!res.ok) throw new Error("load failed");
      const data = (await res.json()) as {
        items: CelebrityWithRefs[];
        nextCursor: number | null;
      };
      setItems((prev) => [...prev, ...data.items]);
      setCursor(data.nextCursor);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, params]);

  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el || cursor === null) return;
    const io = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadMore(),
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore, cursor]);

  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-dashed border-border-strong px-8 py-24 text-center">
        <p className="font-display text-2xl text-foreground">No names match that brief</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Try widening the budget, clearing a filter, or searching a category like
          &ldquo;Comedy&rdquo; or &ldquo;Keynote&rdquo;.
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((c, i) => (
          <motion.li
            key={c.id}
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: (i % 12) * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            <CelebrityCard celebrity={c} eager={i < 4} />
          </motion.li>
        ))}
      </ul>

      <div ref={sentinelRef} aria-hidden className="h-px" />

      {loading && (
        <p className="py-10 text-center text-sm text-faint" role="status">
          <span className="mr-2 inline-block size-3 animate-spin rounded-full border border-gold border-t-transparent align-middle" />
          Raising the next curtain…
        </p>
      )}
      {cursor === null && items.length >= total && total > 12 && (
        <p className="py-10 text-center text-xs uppercase tracking-[0.2em] text-faint">
          ✦ Full roster shown
        </p>
      )}
    </>
  );
}
