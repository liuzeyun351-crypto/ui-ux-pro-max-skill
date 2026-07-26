"use client";

import * as React from "react";
import { AvailabilityCalendar, type DaySlot } from "@/components/celebrity/availability-calendar";
import { cycleAvailability } from "@/lib/actions/availability";

/**
 * Wraps the read-only calendar with an edit loop: clicking any open date
 * selects it, and the action bar cycles its status server-side.
 */
export function AvailabilityEditor({
  celebrityId,
  slots: initial,
}: {
  celebrityId: string;
  slots: DaySlot[];
}) {
  const [slots, setSlots] = React.useState(initial);
  const [busy, setBusy] = React.useState<string | null>(null);

  async function onCycle(iso: string) {
    setBusy(iso);
    const res = await cycleAvailability({ celebrityId, date: iso });
    if (res.ok && res.status) {
      setSlots((prev) => {
        const next = [...prev];
        const idx = next.findIndex((s) => s.date.slice(0, 10) === iso);
        if (idx >= 0) next[idx] = { ...next[idx], status: res.status as DaySlot["status"] };
        else next.push({ date: `${iso}T00:00:00.000Z`, status: res.status as DaySlot["status"] });
        return next;
      });
    }
    setBusy(null);
  }

  return (
    <div>
      <AvailabilityCalendar slots={slots} onSelect={onCycle} editable />
      <p className="mt-4 text-xs leading-relaxed text-faint" role="status">
        {busy
          ? `Updating ${busy}…`
          : "Click an open date to place a hold; click again through the cycle. Booked dates are driven by confirmed engagements and can't be edited here."}
      </p>
    </div>
  );
}
