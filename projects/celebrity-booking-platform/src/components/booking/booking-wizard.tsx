"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TalentImage } from "@/components/art/TalentImage";
import { AvailabilityCalendar, type DaySlot } from "@/components/celebrity/availability-calendar";
import { Button, ButtonLink, ArrowGlyph } from "@/components/ui/button";
import { Input, Label, Textarea, FieldError, FieldHint } from "@/components/ui/input";
import { VerifiedSeal } from "@/components/ui/badge";
import { submitBooking } from "@/lib/actions/booking";
import { EVENT_TYPES } from "@/lib/types";
import { cn, formatDateLong, formatMoney, formatMoneyCompact } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export interface WizardCelebrity {
  slug: string;
  name: string;
  hue: number;
  category: string;
  country: string;
  verified: boolean;
  photo?: string | null;
  feeFromCents: number;
  feeToCents: number;
  managerName: string;
  agencyName: string;
  slots: DaySlot[];
}

interface Draft {
  eventType: string;
  city: string;
  countryName: string;
  venue: string;
  guestCount: string;
  eventDate: string | null;
  budgetCents: number | null;
  requests: string;
}

const EMPTY: Draft = {
  eventType: "",
  city: "",
  countryName: "",
  venue: "",
  guestCount: "",
  eventDate: null,
  budgetCents: null,
  requests: "",
};

const STEPS = [
  "Talent",
  "Event type",
  "Location",
  "Date",
  "Budget",
  "Requests",
  "Review",
  "Submit",
] as const;

export function BookingWizard({ celebrity }: { celebrity: WizardCelebrity }) {
  const reduced = useReducedMotion();
  const draftKey = `aurum-draft-${celebrity.slug}`;
  const [step, setStep] = React.useState(0);
  const [dir, setDir] = React.useState(1);
  const [draft, setDraft] = React.useState<Draft>(EMPTY);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [reference, setReference] = React.useState<string | null>(null);
  const liveRef = React.useRef<HTMLParagraphElement>(null);

  // Restore + autosave draft
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) setDraft({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
  }, [draftKey]);
  React.useEffect(() => {
    try {
      localStorage.setItem(draftKey, JSON.stringify(draft));
    } catch {}
  }, [draft, draftKey]);

  function patch(p: Partial<Draft>) {
    setDraft((d) => ({ ...d, ...p }));
    setError(null);
  }

  function validate(s: number): string | null {
    switch (s) {
      case 1:
        return draft.eventType ? null : "Choose the kind of moment you're planning.";
      case 2:
        if (draft.city.trim().length < 2) return "City is required.";
        if (draft.countryName.trim().length < 2) return "Country is required.";
        return null;
      case 3:
        return draft.eventDate ? null : "Pick an open date from the calendar.";
      case 4:
        if (!draft.budgetCents) return "Select or enter a budget.";
        if (draft.budgetCents < 100_000) return "Minimum budget is $1,000.";
        return null;
      default:
        return null;
    }
  }

  function go(delta: number) {
    if (delta > 0) {
      const err = validate(step);
      if (err) {
        setError(err);
        liveRef.current?.focus();
        return;
      }
    }
    setDir(delta);
    setStep((s) => Math.min(STEPS.length - 1, Math.max(0, s + delta)));
    setError(null);
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const res = await submitBooking({
      celebritySlug: celebrity.slug,
      eventType: draft.eventType,
      city: draft.city.trim(),
      countryName: draft.countryName.trim(),
      venue: draft.venue.trim(),
      guestCount: draft.guestCount ? Number(draft.guestCount) : undefined,
      eventDate: draft.eventDate!,
      budgetCents: draft.budgetCents!,
      requests: draft.requests.trim(),
    });
    setSubmitting(false);
    if (res.ok && res.reference) {
      setReference(res.reference);
      try {
        localStorage.removeItem(draftKey);
      } catch {}
    } else {
      setError(res.error ?? "Something went wrong — please try again.");
    }
  }

  if (reference) return <SuccessState reference={reference} celebrity={celebrity} />;

  const progress = step / (STEPS.length - 1);

  return (
    <div className="mx-auto grid grid-cols-1 w-full max-w-6xl gap-10 px-5 pb-20 pt-28 sm:px-8 lg:grid-cols-[240px_1fr]">
      {/* progress rail */}
      <nav aria-label="Booking progress" className="lg:sticky lg:top-28 lg:self-start">
        {/* mobile bar */}
        <div className="mb-6 lg:hidden">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium text-foreground">{STEPS[step]}</span>
            <span className="text-faint">
              {step + 1} / {STEPS.length}
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-raised">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>
        </div>
        {/* desktop rail */}
        <ol className="relative hidden lg:block">
          <span aria-hidden className="absolute bottom-4 left-[0.9rem] top-4 w-px bg-border" />
          <motion.span
            aria-hidden
            className="absolute left-[0.9rem] top-4 w-px origin-top bg-gold"
            style={{ height: "calc(100% - 2rem)" }}
            animate={{ scaleY: progress }}
            transition={{ duration: 0.5, ease: EASE }}
          />
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={label} className="relative flex items-center gap-4 py-2.5">
                <span
                  className={cn(
                    "relative z-10 grid size-7 shrink-0 place-items-center rounded-full border text-[11px] font-semibold transition-all duration-400",
                    done
                      ? "border-gold bg-gold text-on-gold"
                      : active
                        ? "border-gold bg-background text-gold shadow-glow"
                        : "border-border bg-background text-faint"
                  )}
                >
                  {done ? "✓" : i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => i < step && (setDir(-1), setStep(i))}
                  disabled={i > step}
                  className={cn(
                    "text-sm transition-colors",
                    active
                      ? "font-medium text-foreground"
                      : done
                        ? "text-muted hover:text-gold"
                        : "cursor-default text-faint"
                  )}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* step panel */}
      <div className="min-w-0">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.section
            key={step}
            custom={dir}
            initial={reduced ? false : { opacity: 0, x: dir * 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? undefined : { opacity: 0, x: dir * -48 }}
            transition={{ duration: 0.45, ease: EASE }}
            aria-label={`Step ${step + 1}: ${STEPS[step]}`}
          >
            {step === 0 && <StepTalent celebrity={celebrity} />}
            {step === 1 && (
              <StepShell
                kicker="Step 2 · Event type"
                title="What are we creating?"
                lead="Format shapes everything — the fee, the production advance, the team that travels."
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-label="Event type">
                  {EVENT_TYPES.map((t) => {
                    const active = draft.eventType === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => patch({ eventType: t.value })}
                        className={cn(
                          "group rounded-[var(--radius-lg)] border p-5 text-left transition-all duration-300 ease-[var(--ease-out-expo)]",
                          active
                            ? "border-gold bg-gold/8 shadow-glow"
                            : "border-border bg-surface hover:-translate-y-0.5 hover:border-border-strong"
                        )}
                      >
                        <span
                          className={cn(
                            "block font-display text-lg font-medium transition-colors",
                            active ? "text-gold" : "text-foreground"
                          )}
                        >
                          {t.label}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-faint">{t.blurb}</span>
                      </button>
                    );
                  })}
                </div>
              </StepShell>
            )}
            {step === 2 && (
              <StepShell
                kicker="Step 3 · Location"
                title="Where does it happen?"
                lead="Routing drives cost — an artist already on your continent quotes very differently."
              >
                <div className="grid grid-cols-1 max-w-2xl gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={draft.city}
                      onChange={(e) => patch({ city: e.target.value })}
                      placeholder="Dubai"
                      autoComplete="address-level2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={draft.countryName}
                      onChange={(e) => patch({ countryName: e.target.value })}
                      placeholder="United Arab Emirates"
                      autoComplete="country-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      value={draft.venue}
                      onChange={(e) => patch({ venue: e.target.value })}
                      placeholder="Atlantis The Royal"
                    />
                    <FieldHint>Optional — our producers can shortlist venues.</FieldHint>
                  </div>
                  <div>
                    <Label htmlFor="guests">Expected guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      min={0}
                      value={draft.guestCount}
                      onChange={(e) => patch({ guestCount: e.target.value })}
                      placeholder="400"
                    />
                  </div>
                </div>
              </StepShell>
            )}
            {step === 3 && (
              <StepShell
                kicker="Step 4 · Date"
                title="Choose an open night"
                lead={`Live calendar from ${celebrity.agencyName} — green dates are genuinely open.`}
              >
                <div className="max-w-xl">
                  <AvailabilityCalendar
                    slots={celebrity.slots}
                    selected={draft.eventDate}
                    onSelect={(iso) => patch({ eventDate: iso })}
                  />
                  {draft.eventDate && (
                    <p className="mt-4 flex items-center gap-2 text-sm text-gold">
                      <span aria-hidden>✦</span>
                      {formatDateLong(draft.eventDate)} — we&apos;ll hold this date through review.
                    </p>
                  )}
                </div>
              </StepShell>
            )}
            {step === 4 && (
              <StepBudget celebrity={celebrity} draft={draft} patch={patch} />
            )}
            {step === 5 && (
              <StepShell
                kicker="Step 6 · Requests"
                title="The details that make it yours"
                lead="Song requests, surprise reveals, security constraints, dietary riders — the more we know, the sharper the quote."
              >
                <div className="max-w-2xl">
                  <Label htmlFor="requests">Special requests</Label>
                  <Textarea
                    id="requests"
                    rows={7}
                    maxLength={2000}
                    value={draft.requests}
                    onChange={(e) => patch({ requests: e.target.value })}
                    placeholder="e.g. A 20-minute acoustic set closing with the couple's first-dance song, followed by a 15-minute meet & greet with the wedding party…"
                  />
                  <FieldHint>{2000 - draft.requests.length} characters remaining · optional</FieldHint>
                </div>
              </StepShell>
            )}
            {step === 6 && <StepReview celebrity={celebrity} draft={draft} onEdit={(i) => (setDir(-1), setStep(i))} />}
            {step === 7 && (
              <StepShell
                kicker="Step 8 · Submit"
                title="Send it to the stage door"
                lead={`Your request goes directly to ${celebrity.managerName} at ${celebrity.agencyName}. No payment is taken now — your itemized quote arrives within five business days, and funds only ever move into escrow.`}
              >
                <div className="max-w-xl rounded-[var(--radius-lg)] border border-gold/30 bg-surface p-6">
                  <ul className="space-y-3 text-sm text-muted">
                    <li className="flex gap-3">
                      <span aria-hidden className="text-gold">✓</span>
                      Date held for 5 business days while management reviews
                    </li>
                    <li className="flex gap-3">
                      <span aria-hidden className="text-gold">✓</span>
                      Itemized quote — production, travel and fee, no hidden lines
                    </li>
                    <li className="flex gap-3">
                      <span aria-hidden className="text-gold">✓</span>
                      Cancel freely before contract signature
                    </li>
                  </ul>
                </div>
              </StepShell>
            )}
          </motion.section>
        </AnimatePresence>

        <p
          ref={liveRef}
          tabIndex={-1}
          aria-live="assertive"
          className={cn("mt-6 text-sm text-danger", !error && "sr-only")}
        >
          {error}
        </p>

        {/* nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-6">
          <Button variant="ghost" onClick={() => go(-1)} disabled={step === 0} type="button">
            ← Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => go(1)} size="lg" type="button">
              Continue <ArrowGlyph />
            </Button>
          ) : (
            <Button onClick={handleSubmit} size="lg" disabled={submitting} type="button">
              {submitting ? (
                <>
                  <span
                    aria-hidden
                    className="size-4 animate-spin rounded-full border-2 border-on-gold border-t-transparent"
                  />
                  Submitting…
                </>
              ) : (
                <>Submit request <ArrowGlyph /></>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── step components ───────────────────────── */

function StepShell({
  kicker,
  title,
  lead,
  children,
}: {
  kicker: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="kicker mb-3">{kicker}</p>
      <h1 className="font-display text-[length:var(--text-headline)] font-medium leading-[1.08] tracking-[-0.015em] text-foreground">
        {title}
      </h1>
      {lead && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">{lead}</p>}
      <div className="mt-8">{children}</div>
    </div>
  );
}

function StepTalent({ celebrity: c }: { celebrity: WizardCelebrity }) {
  return (
    <StepShell
      kicker="Step 1 · Talent"
      title="Confirm your headliner"
      lead="You can switch names any time before submitting — nothing is committed yet."
    >
      <div className="flex max-w-2xl flex-col gap-6 rounded-[var(--radius-xl)] border border-border bg-surface p-6 sm:flex-row">
        <div className="relative h-48 w-36 shrink-0 overflow-hidden rounded-[var(--radius-lg)] border border-border">
          <TalentImage
            celebrity={{ name: c.name, accentHue: c.hue, photo: c.photo }}
            className="absolute inset-0 h-full w-full object-cover"
            sizes="144px"
          />
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-display text-3xl font-medium text-foreground">
            {c.name} {c.verified && <VerifiedSeal size={20} />}
          </p>
          <p className="mt-1 text-sm text-muted">
            {c.category} · {c.country}
          </p>
          <p className="mt-4 text-sm text-muted">
            Engagements from{" "}
            <span className="font-semibold text-gold">{formatMoney(c.feeFromCents)}</span>
          </p>
          <p className="mt-1 text-xs text-faint">
            Represented by {c.managerName}, {c.agencyName}
          </p>
          <ButtonLink variant="outline" size="sm" href="/celebrities" className="mt-5">
            Choose different talent
          </ButtonLink>
        </div>
      </div>
    </StepShell>
  );
}

function StepBudget({
  celebrity: c,
  draft,
  patch,
}: {
  celebrity: WizardCelebrity;
  draft: Draft;
  patch: (p: Partial<Draft>) => void;
}) {
  const floor = c.feeFromCents;
  const presets = [
    { cents: floor, label: "Standard", note: "Core appearance, standard production" },
    { cents: Math.round(floor * 1.5), label: "Extended", note: "Longer set + meet & greet" },
    { cents: Math.round(floor * 2.5), label: "Signature", note: "Full production, custom moments" },
  ];
  const [custom, setCustom] = React.useState(
    draft.budgetCents && !presets.some((p) => p.cents === draft.budgetCents)
      ? String(Math.round(draft.budgetCents / 100))
      : ""
  );
  return (
    <StepShell
      kicker="Step 5 · Budget"
      title="Set the envelope"
      lead={`${c.name.split(" ")[0]}'s engagements start at ${formatMoneyCompact(floor)}. Your budget frames the quote — it is not charged now.`}
    >
      <div className="grid grid-cols-1 max-w-2xl gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Budget">
        {presets.map((p) => {
          const active = draft.budgetCents === p.cents && !custom;
          return (
            <button
              key={p.label}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                setCustom("");
                patch({ budgetCents: p.cents });
              }}
              className={cn(
                "rounded-[var(--radius-lg)] border p-5 text-left transition-all duration-300",
                active
                  ? "border-gold bg-gold/8 shadow-glow"
                  : "border-border bg-surface hover:-translate-y-0.5 hover:border-border-strong"
              )}
            >
              <span className="block text-xs uppercase tracking-[0.16em] text-faint">{p.label}</span>
              <span className={cn("mt-1 block font-display text-2xl font-semibold", active ? "text-gold" : "text-foreground")}>
                {formatMoneyCompact(p.cents)}
              </span>
              <span className="mt-2 block text-xs leading-relaxed text-faint">{p.note}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-6 max-w-sm">
        <Label htmlFor="custom-budget">Or a custom budget (USD)</Label>
        <div className="relative">
          <span aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-faint">
            $
          </span>
          <Input
            id="custom-budget"
            type="number"
            min={1000}
            step={1000}
            className="pl-8"
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              const n = Number(e.target.value);
              patch({ budgetCents: n > 0 ? Math.round(n * 100) : null });
            }}
            placeholder={String(Math.round(floor / 100))}
          />
        </div>
        {draft.budgetCents && draft.budgetCents < floor && (
          <FieldError>
            Below the typical floor — management may counter with adjusted formats.
          </FieldError>
        )}
      </div>
    </StepShell>
  );
}

function StepReview({
  celebrity: c,
  draft,
  onEdit,
}: {
  celebrity: WizardCelebrity;
  draft: Draft;
  onEdit: (step: number) => void;
}) {
  const eventLabel = EVENT_TYPES.find((t) => t.value === draft.eventType)?.label ?? draft.eventType;
  const rows: { label: string; value: React.ReactNode; step: number }[] = [
    { label: "Talent", value: c.name, step: 0 },
    { label: "Event type", value: eventLabel, step: 1 },
    {
      label: "Location",
      value: [draft.venue, draft.city, draft.countryName].filter(Boolean).join(", "),
      step: 2,
    },
    { label: "Guests", value: draft.guestCount || "—", step: 2 },
    { label: "Date", value: draft.eventDate ? formatDateLong(draft.eventDate) : "—", step: 3 },
    { label: "Budget", value: draft.budgetCents ? formatMoney(draft.budgetCents) : "—", step: 4 },
    { label: "Requests", value: draft.requests ? draft.requests : "None", step: 5 },
  ];
  return (
    <StepShell
      kicker="Step 7 · Review"
      title="Read it like a manager will"
      lead="A sharp brief gets a sharp quote. Everything can still be edited."
    >
      <dl className="max-w-2xl divide-y divide-border overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
        {rows.map((r) => (
          <div key={r.label} className="group flex items-start gap-4 px-6 py-4">
            <dt className="w-28 shrink-0 pt-0.5 text-xs uppercase tracking-[0.14em] text-faint">
              {r.label}
            </dt>
            <dd className="min-w-0 flex-1 text-sm leading-relaxed text-foreground">{r.value}</dd>
            <button
              type="button"
              onClick={() => onEdit(r.step)}
              className="shrink-0 text-xs text-faint underline-offset-4 transition-colors hover:text-gold hover:underline"
              aria-label={`Edit ${r.label}`}
            >
              Edit
            </button>
          </div>
        ))}
      </dl>
    </StepShell>
  );
}

function SuccessState({
  reference,
  celebrity: c,
}: {
  reference: string;
  celebrity: WizardCelebrity;
}) {
  const reduced = useReducedMotion();
  return (
    <div className="grain relative mx-auto flex min-h-[80svh] max-w-3xl flex-col items-center justify-center px-5 pb-20 pt-28 text-center">
      <motion.div
        initial={reduced ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
        aria-hidden
        className="relative mb-10"
      >
        <span className="absolute inset-0 -m-6 rounded-full bg-gold/15 blur-2xl" />
        <span className="relative grid size-24 place-items-center rounded-full border border-gold bg-gold/10 text-4xl text-gold shadow-glow">
          ✦
        </span>
      </motion.div>
      <motion.h1
        initial={reduced ? false : { opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        className="font-display text-[length:var(--text-display)] font-medium leading-[1.05] text-foreground"
      >
        The stage door is <em className="gold-text not-italic">open.</em>
      </motion.h1>
      <motion.p
        initial={reduced ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        className="mt-6 max-w-lg text-base leading-relaxed text-muted"
      >
        Request <span className="font-semibold text-gold">{reference}</span> is with{" "}
        {c.managerName} at {c.agencyName}. Your date is held, and an itemized quote will reach
        your inbox and dashboard within five business days.
      </motion.p>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
        className="mt-10 flex flex-wrap justify-center gap-3"
      >
        <ButtonLink href="/dashboard/bookings" size="lg">
          Track in dashboard <ArrowGlyph />
        </ButtonLink>
        <ButtonLink variant="outline" size="lg" href="/celebrities">
          Browse more talent
        </ButtonLink>
      </motion.div>
      <p className="mt-12 text-xs text-faint">
        A confirmation email has been prepared —{" "}
        <Link href="/dashboard/bookings" className="underline underline-offset-4 hover:text-gold">
          view your booking
        </Link>
        .
      </p>
    </div>
  );
}
