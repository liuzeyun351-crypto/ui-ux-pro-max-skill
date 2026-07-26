import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shell";
import { AvailabilityEditor } from "./availability-editor";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resolveTalentContext } from "@/lib/talent";

export const metadata: Metadata = { title: "Availability" };

export default async function AvailabilityPage() {
  const session = await auth();
  const { celebrity } = await resolveTalentContext(session!.user.id, session!.user.role);
  if (!celebrity) return null;

  const slots = await db.availability.findMany({
    where: { celebrityId: celebrity.id },
    orderBy: { date: "asc" },
  });

  return (
    <>
      <PageHeader
        title="Availability"
        lead={`Clients see this calendar live on ${celebrity.name}'s profile — click a date to cycle open → held → blocked.`}
      />
      <div className="max-w-2xl">
        <AvailabilityEditor
          celebrityId={celebrity.id}
          slots={slots.map((s) => ({ date: s.date.toISOString(), status: s.status as "open" | "held" | "booked" | "blocked" }))}
        />
      </div>
    </>
  );
}
