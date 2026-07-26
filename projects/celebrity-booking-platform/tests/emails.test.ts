import { describe, expect, it } from "vitest";
import { emails } from "@/emails/templates";

const booking = {
  clientName: "Ava Sinclair",
  celebrityName: "Burna Boy",
  reference: "AUR-2026-0142",
  eventType: "corporate event",
  eventDate: "Friday, September 11, 2026",
  location: "Dubai, United Arab Emirates",
  amount: "$180,000",
  dashboardUrl: "https://aurum.example/dashboard/bookings",
};

describe("transactional emails", () => {
  it("renders all seven templates as complete documents", () => {
    const rendered = [
      emails.welcome({ name: "Ava Sinclair", dashboardUrl: booking.dashboardUrl }),
      emails.bookingConfirmation(booking),
      emails.paymentConfirmation(booking),
      emails.invoice({ ...booking, dueDate: "Oct 1, 2026", invoiceNumber: "INV-2026-0087" }),
      emails.eventReminder({ ...booking, daysOut: 14 }),
      emails.contractReady(booking),
      emails.cancellation({ ...booking, refundAmount: "$180,000" }),
    ];
    for (const html of rendered) {
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("A U R U M");
      expect(html).toContain("demonstration platform");
    }
  });

  it("carries the booking reference and escapes HTML", () => {
    const html = emails.bookingConfirmation({
      ...booking,
      celebrityName: "<script>alert(1)</script>",
    });
    expect(html).toContain("AUR-2026-0142");
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
