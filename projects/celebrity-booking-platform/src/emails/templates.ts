/**
 * Transactional email templates. Each renders a complete, inline-styled
 * HTML document (email clients require inline CSS) in the Aurum register:
 * dark stage, serif headline, single gold accent.
 *
 * In production these are handed to the mail provider (Resend/SES/Postmark)
 * by src/lib/mailer.ts; in the demo they render to disk/preview.
 */

const GOLD = "#c9a24b";
const INK = "#161310";
const PAPER = "#1e1a16";
const TEXT = "#e9e2d6";
const MUTED = "#a89e8d";
const BORDER = "#3a332b";

function layout(title: string, preheader: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:${INK};font-family:Georgia,'Times New Roman',serif;">
  <span style="display:none;max-height:0;overflow:hidden;">${esc(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${INK};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="padding:0 8px 28px;text-align:center;">
          <span style="font-size:22px;letter-spacing:0.35em;color:${TEXT};">A U R U M</span>
          <div style="height:1px;margin-top:20px;background:linear-gradient(90deg,transparent,${GOLD},transparent);"></div>
        </td></tr>
        <tr><td style="background:${PAPER};border:1px solid ${BORDER};border-radius:16px;padding:40px 36px;">
          ${body}
        </td></tr>
        <tr><td style="padding:28px 8px;text-align:center;">
          <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;line-height:1.7;color:${MUTED};">
            Aurum Talent Group · The world's stage, on request<br>
            This is a demonstration platform — no real bookings, payments or endorsements.<br>
            <a href="#" style="color:${MUTED};">Unsubscribe</a> · <a href="#" style="color:${MUTED};">Preferences</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function h1(text: string) {
  return `<h1 style="margin:0 0 16px;font-size:28px;line-height:1.25;font-weight:500;color:${TEXT};">${text}</h1>`;
}
function p(text: string) {
  return `<p style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.75;color:${MUTED};">${text}</p>`;
}
function kicker(text: string) {
  return `<p style="margin:0 0 12px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${GOLD};">${esc(text)}</p>`;
}
function button(label: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 8px;"><tr>
    <td style="border-radius:999px;background:${GOLD};">
      <a href="${href}" style="display:inline-block;padding:13px 32px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:${INK};text-decoration:none;">${esc(label)}</a>
    </td></tr></table>`;
}
function detailRows(rows: [string, string][]) {
  const tr = rows
    .map(
      ([k, v]) => `<tr>
      <td style="padding:9px 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${MUTED};">${esc(k)}</td>
      <td style="padding:9px 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;color:${TEXT};text-align:right;">${esc(v)}</td>
    </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border-top:1px solid ${BORDER};border-bottom:1px solid ${BORDER};">${tr}</table>`;
}

export interface BookingEmailData {
  clientName: string;
  celebrityName: string;
  reference: string;
  eventType: string;
  eventDate: string;
  location: string;
  amount?: string;
  dashboardUrl: string;
}

export const emails = {
  welcome(d: { name: string; dashboardUrl: string }) {
    return layout(
      "Welcome to Aurum",
      "Your account is ready — the world's stage awaits.",
      [
        kicker("Welcome"),
        h1(`The curtain rises, ${esc(d.name.split(" ")[0])}.`),
        p(
          "Your Aurum account is ready. Browse five hundred verified names, shortlist your favourites, and when the moment is right, our eight-step booking flow takes you from brief to signed contract — with your funds protected in escrow throughout."
        ),
        button("Explore the roster", d.dashboardUrl),
      ].join("")
    );
  },

  bookingConfirmation(d: BookingEmailData) {
    return layout(
      `Request ${d.reference} received`,
      `Your request for ${d.celebrityName} is with management.`,
      [
        kicker("Booking request"),
        h1("Your request is on its way to the stage door."),
        p(
          `We've delivered your ${esc(d.eventType)} request for <strong style="color:${TEXT};">${esc(d.celebrityName)}</strong> directly to their management. An itemized quote will reach you within five business days; your date is held while they review.`
        ),
        detailRows([
          ["Reference", d.reference],
          ["Talent", d.celebrityName],
          ["Event", d.eventType],
          ["Date", d.eventDate],
          ["Location", d.location],
        ]),
        button("Track your request", d.dashboardUrl),
      ].join("")
    );
  },

  paymentConfirmation(d: BookingEmailData) {
    return layout(
      `Payment received — ${d.reference}`,
      "Your funds are protected in escrow.",
      [
        kicker("Payment confirmed"),
        h1("Funds secured in escrow."),
        p(
          `Your payment of <strong style="color:${GOLD};">${esc(d.amount ?? "")}</strong> for booking ${esc(d.reference)} is now held in a segregated escrow account. It releases to ${esc(d.celebrityName)}'s management only as contract milestones complete.`
        ),
        detailRows([
          ["Amount", d.amount ?? ""],
          ["Reference", d.reference],
          ["Status", "Held in escrow"],
          ["Releases", "Per milestone schedule"],
        ]),
        button("View receipt", d.dashboardUrl),
      ].join("")
    );
  },

  invoice(d: BookingEmailData & { dueDate: string; invoiceNumber: string }) {
    return layout(
      `Invoice ${d.invoiceNumber}`,
      `Invoice for ${d.celebrityName} — due ${d.dueDate}.`,
      [
        kicker("Invoice"),
        h1(`Invoice ${esc(d.invoiceNumber)}`),
        p(
          `Your invoice for booking ${esc(d.reference)} (${esc(d.celebrityName)}) is ready. Payment is due by ${esc(d.dueDate)} via Stripe, PayPal, Apple Pay or Google Pay.`
        ),
        detailRows([
          ["Invoice", d.invoiceNumber],
          ["Booking", d.reference],
          ["Amount due", d.amount ?? ""],
          ["Due date", d.dueDate],
        ]),
        button("Pay securely", d.dashboardUrl),
      ].join("")
    );
  },

  eventReminder(d: BookingEmailData & { daysOut: number }) {
    return layout(
      `${d.daysOut} days to curtain — ${d.reference}`,
      `${d.celebrityName} on ${d.eventDate}.`,
      [
        kicker("Reminder"),
        h1(`${d.daysOut} days to curtain.`),
        p(
          `${esc(d.celebrityName)} takes your stage on <strong style="color:${TEXT};">${esc(d.eventDate)}</strong> in ${esc(d.location)}. Your production advance is complete; final logistics land in your dashboard 72 hours out.`
        ),
        button("Review the run sheet", d.dashboardUrl),
      ].join("")
    );
  },

  contractReady(d: BookingEmailData) {
    return layout(
      `Contract ready — ${d.reference}`,
      "Review and sign to secure your date.",
      [
        kicker("Contract"),
        h1("Your contract is ready for signature."),
        p(
          `The Private Engagement Agreement for ${esc(d.celebrityName)} (${esc(d.reference)}) has been issued by management. Review the terms — including the escrow milestone schedule and cancellation clauses — and sign in-platform. Your date is released if unsigned after five business days.`
        ),
        button("Review & sign", d.dashboardUrl),
      ].join("")
    );
  },

  cancellation(d: BookingEmailData & { refundAmount: string }) {
    return layout(
      `Booking ${d.reference} cancelled`,
      "Your escrow refund is on its way.",
      [
        kicker("Cancellation"),
        h1("The engagement has been cancelled."),
        p(
          `Booking ${esc(d.reference)} with ${esc(d.celebrityName)} is cancelled per the contract's terms. A refund of <strong style="color:${GOLD};">${esc(d.refundAmount)}</strong> from escrow is being returned to your original payment method (3–5 business days).`
        ),
        detailRows([
          ["Reference", d.reference],
          ["Refund", d.refundAmount],
          ["Method", "Original payment rail"],
        ]),
        button("View details", d.dashboardUrl),
      ].join("")
    );
  },
} as const;

export type EmailTemplateName = keyof typeof emails;
