import type { BookingStatus } from "@/lib/types";

/**
 * The escrow milestone schedule and booking-status transition rules.
 * Pure functions — unit-tested in tests/escrow.test.ts.
 */

export interface MilestoneSchedule {
  depositCents: number; // due at contract signature, held in escrow
  balanceCents: number; // due at completion
  totalCents: number;
}

export const DEPOSIT_RATE = 0.25;

export function milestoneSchedule(quoteCents: number): MilestoneSchedule {
  if (!Number.isInteger(quoteCents) || quoteCents <= 0) {
    throw new Error("quoteCents must be a positive integer");
  }
  const depositCents = Math.round(quoteCents * DEPOSIT_RATE);
  return { depositCents, balanceCents: quoteCents - depositCents, totalCents: quoteCents };
}

/** Legal transitions of the booking state machine. */
const TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  DRAFT: ["SUBMITTED", "CANCELLED"],
  SUBMITTED: ["UNDER_REVIEW", "CANCELLED"],
  UNDER_REVIEW: ["CONTRACT_SENT", "CANCELLED"],
  CONTRACT_SENT: ["DEPOSIT_PAID", "CANCELLED"],
  DEPOSIT_PAID: ["CONFIRMED", "CANCELLED", "REFUNDED"],
  CONFIRMED: ["COMPLETED", "CANCELLED", "REFUNDED"],
  COMPLETED: [],
  CANCELLED: ["REFUNDED"],
  REFUNDED: [],
};

export function canTransition(from: BookingStatus, to: BookingStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Refund entitlement per the standard contract:
 *  - before deposit: nothing was paid, nothing to refund
 *  - deposit paid, >30 days out: full escrow refund
 *  - deposit paid, ≤30 days out: deposit forfeited
 *  - after completion: no refund
 */
export function refundEntitlementCents(input: {
  status: BookingStatus;
  depositCents: number;
  paidCents: number;
  eventDate: Date;
  now?: Date;
}): number {
  const { status, depositCents, paidCents, eventDate } = input;
  const now = input.now ?? new Date();
  if (paidCents <= 0) return 0;
  if (status === "COMPLETED" || status === "REFUNDED") return 0;
  const daysOut = (eventDate.getTime() - now.getTime()) / 86_400_000;
  if (daysOut > 30) return paidCents;
  return Math.max(0, paidCents - depositCents);
}
