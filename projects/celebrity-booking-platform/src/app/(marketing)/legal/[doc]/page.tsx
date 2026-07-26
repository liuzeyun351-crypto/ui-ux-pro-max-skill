import { notFound } from "next/navigation";
import type { Metadata } from "next";

const DOCS: Record<string, { title: string; sections: [string, string][] }> = {
  terms: {
    title: "Terms of Service",
    sections: [
      [
        "1. The platform",
        "Aurum provides a marketplace connecting clients with talent management for event engagements. Aurum is not a party to engagement contracts; it provides the brokerage, contracting and escrow infrastructure through which they are formed. This deployment is a demonstration: profiles describe real public figures using publicly known career information, while fees, availability, reviews and imagery are fictional or generated, and no endorsement or affiliation is implied.",
      ],
      [
        "2. Bookings & contracts",
        "A booking request is an invitation to negotiate, not a binding order. A contract forms only when both parties execute the engagement agreement in-platform. Quotes are valid for ten business days unless stated otherwise.",
      ],
      [
        "3. Escrow & payments",
        "Deposits are held in segregated escrow accounts and released per the milestone schedule encoded in each contract. Aurum's platform fee is included in itemized quotes. Refunds follow the cancellation terms of the executed contract.",
      ],
      [
        "4. Conduct",
        "Clients and talent representatives must keep engagement communications on-platform until contract execution, must not circumvent fees, and must treat counterparties' information as confidential.",
      ],
      [
        "5. Liability",
        "The platform is provided as-is for demonstration purposes. To the maximum extent permitted by law, Aurum disclaims liability arising from use of this demo.",
      ],
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      [
        "1. What we collect",
        "Account details (name, email, company), booking briefs, on-platform messages, and usage telemetry needed to operate the service. This demo stores data in a local database that resets with each seed.",
      ],
      [
        "2. How it's used",
        "To route booking requests to management teams, generate contracts and invoices, protect payments in escrow, and improve the product. We never sell personal data.",
      ],
      [
        "3. Sharing",
        "Booking briefs are shared with the talent's verified management team. Payment details go to the selected payment provider only. Aggregated, de-identified statistics may appear in platform reporting.",
      ],
      [
        "4. Security",
        "Passwords are hashed with bcrypt; sessions are signed JWTs; role-based access controls govern every console; consequential actions are recorded in an audit log.",
      ],
      [
        "5. Your rights",
        "Export or deletion of your account data is available from Settings → Danger zone. Demo accounts are reset on every database seed.",
      ],
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc } = await params;
  const d = DOCS[doc];
  return d ? { title: d.title } : {};
}

export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  const d = DOCS[doc];
  if (!d) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-36 sm:px-8">
      <p className="kicker mb-4">Legal</p>
      <h1 className="font-display text-[length:var(--text-headline)] font-medium tracking-[-0.015em] text-foreground">
        {d.title}
      </h1>
      <p className="mt-3 text-sm text-faint">Effective July 2026 · Demonstration document</p>
      <div className="mt-12 space-y-10">
        {d.sections.map(([h, body]) => (
          <section key={h}>
            <h2 className="mb-3 font-display text-xl font-medium text-foreground">{h}</h2>
            <p className="text-[15px] leading-[1.85] text-muted">{body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
