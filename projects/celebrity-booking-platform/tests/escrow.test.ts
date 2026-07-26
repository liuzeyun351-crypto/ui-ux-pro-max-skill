import { describe, expect, it } from "vitest";
import {
  canTransition,
  milestoneSchedule,
  refundEntitlementCents,
} from "@/lib/payments/escrow";

describe("milestoneSchedule", () => {
  it("splits a quote into a 25% deposit and 75% balance", () => {
    const s = milestoneSchedule(720_000_00);
    expect(s.depositCents).toBe(180_000_00);
    expect(s.balanceCents).toBe(540_000_00);
    expect(s.depositCents + s.balanceCents).toBe(s.totalCents);
  });

  it("never loses a cent to rounding", () => {
    for (const quote of [1_000_01, 33_333, 999_999_99]) {
      const s = milestoneSchedule(quote);
      expect(s.depositCents + s.balanceCents).toBe(quote);
    }
  });

  it("rejects non-positive and fractional quotes", () => {
    expect(() => milestoneSchedule(0)).toThrow();
    expect(() => milestoneSchedule(-5)).toThrow();
    expect(() => milestoneSchedule(10.5)).toThrow();
  });
});

describe("booking state machine", () => {
  it("follows the happy path", () => {
    expect(canTransition("SUBMITTED", "UNDER_REVIEW")).toBe(true);
    expect(canTransition("UNDER_REVIEW", "CONTRACT_SENT")).toBe(true);
    expect(canTransition("CONTRACT_SENT", "DEPOSIT_PAID")).toBe(true);
    expect(canTransition("DEPOSIT_PAID", "CONFIRMED")).toBe(true);
    expect(canTransition("CONFIRMED", "COMPLETED")).toBe(true);
  });

  it("forbids skipping and reversing", () => {
    expect(canTransition("SUBMITTED", "CONFIRMED")).toBe(false);
    expect(canTransition("COMPLETED", "SUBMITTED")).toBe(false);
    expect(canTransition("CONFIRMED", "UNDER_REVIEW")).toBe(false);
  });

  it("terminal states stay terminal (except cancel→refund)", () => {
    expect(canTransition("COMPLETED", "REFUNDED")).toBe(false);
    expect(canTransition("CANCELLED", "REFUNDED")).toBe(true);
    expect(canTransition("REFUNDED", "SUBMITTED")).toBe(false);
  });
});

describe("refundEntitlementCents", () => {
  const base = {
    depositCents: 100_00,
    paidCents: 100_00,
    eventDate: new Date("2026-12-01T00:00:00Z"),
  };

  it("refunds everything more than 30 days out", () => {
    expect(
      refundEntitlementCents({
        ...base,
        status: "DEPOSIT_PAID",
        now: new Date("2026-10-01T00:00:00Z"),
      })
    ).toBe(100_00);
  });

  it("forfeits the deposit inside 30 days", () => {
    expect(
      refundEntitlementCents({
        ...base,
        status: "DEPOSIT_PAID",
        paidCents: 400_00,
        now: new Date("2026-11-20T00:00:00Z"),
      })
    ).toBe(300_00);
  });

  it("returns nothing after completion or with nothing paid", () => {
    expect(
      refundEntitlementCents({
        ...base,
        status: "COMPLETED",
        now: new Date("2026-10-01T00:00:00Z"),
      })
    ).toBe(0);
    expect(
      refundEntitlementCents({
        ...base,
        status: "SUBMITTED",
        paidCents: 0,
        now: new Date("2026-10-01T00:00:00Z"),
      })
    ).toBe(0);
  });
});
