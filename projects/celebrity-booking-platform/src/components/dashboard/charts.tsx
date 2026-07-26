"use client";

import * as React from "react";
import { cn, formatMoneyCompact } from "@/lib/utils";

/** KPI stat tile: label, hero number, optional delta. */
export function StatTile({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string;
  delta?: { value: string; positive: boolean };
  hint?: string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1.5 flex items-center gap-2 text-xs">
        {delta && (
          <span
            className={cn(
              "flex items-center gap-1 font-medium",
              delta.positive ? "text-success" : "text-danger"
            )}
          >
            <span aria-hidden>{delta.positive ? "▲" : "▼"}</span>
            {delta.value}
          </span>
        )}
        {hint && <span className="text-faint">{hint}</span>}
      </p>
    </div>
  );
}

export interface SeriesPoint {
  label: string;
  value: number; // cents when money=true
}

/**
 * Single-series area chart with crosshair + tooltip.
 * One hue (gold), 2px line, recessive grid, direct label on the last point.
 */
export function AreaChart({
  data,
  money = true,
  height = 240,
  title,
}: {
  data: SeriesPoint[];
  money?: boolean;
  height?: number;
  title: string;
}) {
  const [hover, setHover] = React.useState<number | null>(null);
  const W = 720;
  const H = height;
  const PAD = { top: 18, right: 16, bottom: 28, left: 46 };
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;

  const max = Math.max(...data.map((d) => d.value), 1);
  const niceMax = niceCeil(max);
  const x = (i: number) => PAD.left + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v: number) => PAD.top + ih - (v / niceMax) * ih;

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.value).toFixed(1)}`).join(" ");
  const area = `${line} L ${x(data.length - 1).toFixed(1)} ${PAD.top + ih} L ${x(0).toFixed(1)} ${PAD.top + ih} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * niceMax);
  const fmt = (v: number) => (money ? formatMoneyCompact(v) : v.toLocaleString());

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.left) / iw) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  }

  const last = data.length - 1;

  return (
    <figure className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
      <figcaption className="mb-4 text-sm font-medium text-foreground">{title}</figcaption>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full touch-none select-none"
          role="img"
          aria-label={`${title}: ${data.map((d) => `${d.label} ${fmt(d.value)}`).join(", ")}`}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* recessive grid + axis labels */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--border)"
                strokeWidth="1"
                strokeDasharray={t === 0 ? undefined : "3 5"}
              />
              <text
                x={PAD.left - 8}
                y={y(t) + 3.5}
                textAnchor="end"
                fontSize="10.5"
                fill="var(--faint)"
              >
                {fmt(t)}
              </text>
            </g>
          ))}
          {data.map((d, i) =>
            i % Math.ceil(data.length / 8) === 0 || i === last ? (
              <text
                key={i}
                x={x(i)}
                y={H - 8}
                textAnchor="middle"
                fontSize="10.5"
                fill="var(--faint)"
              >
                {d.label}
              </text>
            ) : null
          )}

          <path d={area} fill="url(#rev-fill)" />
          <path d={line} fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

          {/* direct label on the latest point */}
          <circle cx={x(last)} cy={y(data[last].value)} r="4" fill="var(--gold)" stroke="var(--surface)" strokeWidth="2" />
          <text
            x={Math.min(x(last), W - PAD.right - 4)}
            y={y(data[last].value) - 10}
            textAnchor="end"
            fontSize="11.5"
            fontWeight="600"
            fill="var(--foreground)"
          >
            {fmt(data[last].value)}
          </text>

          {/* crosshair */}
          {hover !== null && (
            <g>
              <line
                x1={x(hover)}
                x2={x(hover)}
                y1={PAD.top}
                y2={PAD.top + ih}
                stroke="var(--border-strong)"
                strokeWidth="1"
              />
              <circle cx={x(hover)} cy={y(data[hover].value)} r="4.5" fill="var(--gold)" stroke="var(--surface)" strokeWidth="2" />
            </g>
          )}
        </svg>

        {hover !== null && (
          <div
            role="status"
            className="pointer-events-none absolute -top-1 z-10 -translate-x-1/2 rounded-md border border-border bg-surface-raised px-3 py-1.5 shadow-soft"
            style={{ left: `${(x(hover) / W) * 100}%` }}
          >
            <p className="whitespace-nowrap text-[11px] text-faint">{data[hover].label}</p>
            <p className="whitespace-nowrap text-sm font-semibold text-foreground">
              {fmt(data[hover].value)}
            </p>
          </div>
        )}
      </div>
    </figure>
  );
}

/** Horizontal single-hue magnitude bars with baseline-anchored rounded ends. */
export function BarList({
  data,
  money = true,
  title,
}: {
  data: SeriesPoint[];
  money?: boolean;
  title: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const fmt = (v: number) => (money ? formatMoneyCompact(v) : v.toLocaleString());
  return (
    <figure className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
      <figcaption className="mb-4 text-sm font-medium text-foreground">{title}</figcaption>
      <ul className="space-y-3.5">
        {data.map((d) => (
          <li key={d.label} className="group">
            <div className="mb-1 flex items-baseline justify-between gap-4 text-xs">
              <span className="truncate text-muted">{d.label}</span>
              <span className="shrink-0 font-medium tabular-nums text-foreground">{fmt(d.value)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-raised">
              <div
                className="h-full rounded-r-full bg-gold/80 transition-all duration-500 group-hover:bg-gold"
                style={{ width: `${Math.max(2, (d.value / max) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </figure>
  );
}

function niceCeil(v: number) {
  const pow = 10 ** Math.floor(Math.log10(v));
  const unit = v / pow;
  const nice = unit <= 1 ? 1 : unit <= 2 ? 2 : unit <= 5 ? 5 : 10;
  return nice * pow;
}
