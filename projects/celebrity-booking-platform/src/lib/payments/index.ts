import type { PaymentProvider, EscrowIntent, PaymentWebhookEvent } from "./provider";
import type { PaymentProviderId } from "@/lib/types";

export type { PaymentProvider, EscrowIntent, PaymentWebhookEvent };

/** Deterministic demo provider: instant escrow holds, no network. */
class MockProvider implements PaymentProvider {
  constructor(
    readonly id: PaymentProviderId,
    readonly displayName: string,
    readonly kind: "processor" | "wallet"
  ) {}
  isConfigured() {
    return true;
  }
  async createEscrowIntent(input: {
    bookingReference: string;
    amountCents: number;
    currency: string;
    customerEmail: string;
  }): Promise<EscrowIntent> {
    const ref = `${this.id}_demo_${input.bookingReference}_${input.amountCents}`;
    return {
      providerRef: ref,
      provider: this.id,
      amountCents: input.amountCents,
      currency: input.currency,
      checkoutUrl: `/dashboard/invoices?intent=${encodeURIComponent(ref)}`,
      status: "held_in_escrow",
    };
  }
  async release(providerRef: string, amountCents: number) {
    return { ok: true, payoutRef: `po_${providerRef}_${amountCents}` };
  }
  async refund(providerRef: string, amountCents: number) {
    return { ok: true, refundRef: `re_${providerRef}_${amountCents}` };
  }
  async parseWebhook(payload: string): Promise<PaymentWebhookEvent | null> {
    try {
      const data = JSON.parse(payload) as PaymentWebhookEvent;
      return data.type ? data : null;
    } catch {
      return null;
    }
  }
}

/*
 * Live implementations drop in here:
 *
 * class StripeProvider implements PaymentProvider {
 *   isConfigured() { return !!process.env.STRIPE_SECRET_KEY }
 *   createEscrowIntent(...) {
 *     // PaymentIntent with capture_method: "manual" +
 *     // transfer_data to the connected talent account (Stripe Connect,
 *     // separate charges & transfers = the escrow pattern)
 *   }
 *   parseWebhook(payload, sig) {
 *     // stripe.webhooks.constructEvent(payload, sig, STRIPE_WEBHOOK_SECRET)
 *   }
 * }
 *
 * PayPal maps to Orders API with intent=AUTHORIZE, Apple/Google Pay ride
 * the Stripe PaymentRequest rail. See docs/ARCHITECTURE.md → Payments.
 */

const registry: Record<PaymentProviderId, PaymentProvider> = {
  stripe: new MockProvider("stripe", "Stripe", "processor"),
  paypal: new MockProvider("paypal", "PayPal", "processor"),
  "apple-pay": new MockProvider("apple-pay", "Apple Pay", "wallet"),
  "google-pay": new MockProvider("google-pay", "Google Pay", "wallet"),
  mock: new MockProvider("mock", "Demo rail", "processor"),
};

export function getProvider(id: PaymentProviderId): PaymentProvider {
  return registry[id] ?? registry.mock;
}

export function availableProviders(): PaymentProvider[] {
  return Object.values(registry).filter((p) => p.id !== "mock" && p.isConfigured());
}
