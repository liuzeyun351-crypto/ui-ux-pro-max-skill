// Canonical string unions for fields the Prisma schema stores as strings
// (SQLite has no native enums — see prisma/schema.prisma header).

export const ROLES = ["USER", "TALENT", "MANAGER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const BOOKING_STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "CONTRACT_SENT",
  "DEPOSIT_PAID",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const EVENT_TYPES = [
  { value: "concert", label: "Concert", blurb: "Full production live performance" },
  { value: "wedding", label: "Wedding", blurb: "Private performance or appearance" },
  { value: "corporate", label: "Corporate Event", blurb: "Summits, galas & retreats" },
  { value: "speaking", label: "Speaking Engagement", blurb: "Keynotes & fireside chats" },
  { value: "tv-appearance", label: "TV Appearance", blurb: "Broadcast & streaming" },
  { value: "endorsement", label: "Brand Endorsement", blurb: "Campaigns & partnerships" },
  { value: "meet-greet", label: "Meet & Greet", blurb: "Intimate fan experiences" },
  { value: "birthday", label: "Birthday Appearance", blurb: "Private celebrations" },
  { value: "festival", label: "Festival", blurb: "Headline & featured slots" },
  { value: "award-show", label: "Award Show", blurb: "Hosting & presenting" },
  { value: "product-launch", label: "Product Launch", blurb: "Unveilings & premieres" },
  { value: "charity", label: "Charity Event", blurb: "Benefits & fundraisers" },
  { value: "influencer-campaign", label: "Influencer Campaign", blurb: "Social-first activations" },
] as const;
export type EventType = (typeof EVENT_TYPES)[number]["value"];

export const AVAILABILITY_STATES = ["available", "limited", "booked"] as const;
export type AvailabilityState = (typeof AVAILABILITY_STATES)[number];

export const PAYMENT_KINDS = ["deposit", "milestone", "balance", "refund"] as const;
export type PaymentKind = (typeof PAYMENT_KINDS)[number];

export const PAYMENT_STATUSES = [
  "pending",
  "held_in_escrow",
  "released",
  "refunded",
  "failed",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_PROVIDERS = ["stripe", "paypal", "apple-pay", "google-pay", "mock"] as const;
export type PaymentProviderId = (typeof PAYMENT_PROVIDERS)[number];

// Parsed shapes of the JSON-encoded string columns
export interface Award {
  name: string;
  year: number;
  work?: string;
}
export interface Work {
  title: string;
  year: number;
  kind: "film" | "album" | "book" | "show" | "event";
  meta?: string;
}
export interface Social {
  platform: string;
  handle: string;
  followers: number;
}
export interface FaqItem {
  q: string;
  a: string;
}
export interface InvoiceLineItem {
  label: string;
  amountCents: number;
}

export function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
