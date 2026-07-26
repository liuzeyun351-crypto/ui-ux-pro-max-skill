/**
 * Payment provider abstraction.
 *
 * Every rail (Stripe, PayPal, Apple Pay, Google Pay) implements the same
 * PaymentProvider interface, so booking flows never talk to an SDK directly.
 * In the demo the registry resolves to MockProvider unless real keys are
 * configured; swapping in the live SDKs changes only this directory.
 *
 * Money flow (escrow model):
 *   createEscrowIntent → funds captured into a segregated escrow balance
 *   release            → milestone payout to talent (deposit / balance)
 *   refund             → return to client per contract terms
 */
import type { PaymentProviderId } from "@/lib/types";

export interface EscrowIntent {
  providerRef: string;
  provider: PaymentProviderId;
  amountCents: number;
  currency: string;
  /** hosted checkout / confirmation url the client is sent to */
  checkoutUrl: string;
  status: "requires_payment" | "held_in_escrow";
}

export interface PaymentProvider {
  readonly id: PaymentProviderId;
  readonly displayName: string;
  /** wallet rails (Apple/Google Pay) ride on a card processor */
  readonly kind: "processor" | "wallet";
  isConfigured(): boolean;
  createEscrowIntent(input: {
    bookingReference: string;
    amountCents: number;
    currency: string;
    customerEmail: string;
  }): Promise<EscrowIntent>;
  release(providerRef: string, amountCents: number): Promise<{ ok: boolean; payoutRef: string }>;
  refund(providerRef: string, amountCents: number): Promise<{ ok: boolean; refundRef: string }>;
  /** verify + parse an incoming webhook (signature check in real impls) */
  parseWebhook(payload: string, signature: string | null): Promise<PaymentWebhookEvent | null>;
}

export interface PaymentWebhookEvent {
  type: "escrow.funded" | "escrow.released" | "payment.failed" | "refund.completed";
  providerRef: string;
  amountCents: number;
}
