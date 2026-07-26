"use client";

import * as React from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  startOfMonth,
} from "date-fns";
import { cn } from "@/lib/utils";

export interface DaySlot {
  date: string; // ISO
  status: "open" | "held" | "booked" | "blocked";
}

// Talent publish a rolling ~3-month window; don't page past it.
const MAX_OFFSET = 3;

const LEGEND = [
  ["open", "Open", "bg-success/70"],
  ["held", "On hold", "bg-warning/70"],
  ["booked", "Booked", "bg-danger/60"],
] as const;

/**
 * Read-only availability calendar. Days render as stage lights: open dates
 * glow, held dates dim, booked dates go dark.
 */
export function AvailabilityCalendar({
  slots,
  onSelect,
  selected,
  editable,
}: {
  slots: DaySlot[];
  onSelect?: (iso: string) => void;
  selected?: string | null;
  /** widen click targets beyond open dates (talent console edit mode) */
  editable?: boolean;
}) {
  // Open on the first month that actually has an open date — availability
  // typically starts a lead-time window out, so month 0 is often empty.
  const firstOpenOffset = React.useMemo(() => {
    const open = slots
      .filter((s) => s.status === "open")
      .map((s) => new Date(s.date))
      .sort((a, b) => a.getTime() - b.getTime())[0];
    if (!open) return 0;
    const now = new Date();
    const delta =
      (open.getFullYear() - now.getFullYear()) * 12 + (open.getMonth() - now.getMonth());
    return Math.max(0, Math.min(MAX_OFFSET, delta));
  }, [slots]);

  const [offset, setOffset] = React.useState(firstOpenOffset);
  React.useEffect(() => setOffset(firstOpenOffset), [firstOpenOffset]);

  const month = addMonths(new Date(), offset);
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const lead = (getDay(startOfMonth(month)) + 6) % 7; // Monday-first
  const byDate = React.useMemo(() => {
    const m = new Map<string, DaySlot["status"]>();
    for (const s of slots) m.set(s.date.slice(0, 10), s.status);
    return m;
  }, [slots]);

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-lg font-medium text-foreground">
          {format(month, "MMMM yyyy")}
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setOffset((o) => Math.max(0, o - 1))}
            disabled={offset === 0}
            aria-label="Previous month"
            className="grid size-8 place-items-center rounded-full border border-border text-muted transition-colors hover:border-gold hover:text-gold disabled:opacity-35"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setOffset((o) => Math.min(MAX_OFFSET, o + 1))}
            disabled={offset >= MAX_OFFSET}
            aria-label="Next month"
            className="grid size-8 place-items-center rounded-full border border-border text-muted transition-colors hover:border-gold hover:text-gold disabled:opacity-35"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="pb-1 text-[11px] font-medium uppercase text-faint">
            {d}
          </span>
        ))}
        {Array.from({ length: lead }, (_, i) => (
          <span key={`lead-${i}`} aria-hidden />
        ))}
        {days.map((day) => {
          const iso = format(day, "yyyy-MM-dd");
          const status = byDate.get(iso);
          const past = day < new Date() && !isSameDay(day, new Date());
          const selectable =
            !!onSelect && !past && (editable ? status !== "booked" : status === "open");
          const isSelected = selected === iso;
          return (
            <button
              key={iso}
              type="button"
              disabled={!selectable}
              onClick={() => selectable && onSelect?.(iso)}
              aria-label={`${format(day, "MMM d")}: ${past || !status ? "unavailable" : status}`}
              className={cn(
                "relative aspect-square rounded-md text-xs tabular-nums transition-all duration-200",
                past || !status
                  ? "text-faint/50"
                  : status === "open"
                    ? "bg-success/12 font-medium text-success"
                    : status === "held"
                      ? "bg-warning/10 text-warning"
                      : "bg-danger/8 text-danger/70 line-through",
                selectable && "cursor-pointer hover:ring-2 hover:ring-gold/60",
                isSelected && "bg-gold font-semibold !text-on-gold shadow-glow ring-2 ring-gold"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-4 border-t border-border pt-4">
        {LEGEND.map(([key, label, dot]) => (
          <span key={key} className="flex items-center gap-1.5 text-xs text-muted">
            <span aria-hidden className={cn("size-2 rounded-full", dot)} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
