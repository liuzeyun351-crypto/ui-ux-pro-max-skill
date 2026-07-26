import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shell";
import { CelebrityCard } from "@/components/celebrity/celebrity-card";
import { ButtonLink, ArrowGlyph } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { celebrityInclude } from "@/lib/queries";

export const metadata: Metadata = { title: "Saved talent" };

export default async function SavedPage() {
  const session = await auth();
  const saved = await db.savedCelebrity.findMany({
    where: { userId: session!.user.id },
    include: { celebrity: { include: celebrityInclude } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader
        title="Saved talent"
        lead="Your shortlist — availability updates live on each card."
      />
      {saved.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {saved.map((s) => (
            <CelebrityCard key={s.id} celebrity={s.celebrity} />
          ))}
        </div>
      ) : (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-border-strong p-16 text-center">
          <p className="font-display text-2xl text-foreground">Nothing saved yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Tap the heart on any profile to build a shortlist for your next production.
          </p>
          <ButtonLink href="/celebrities" className="mt-6">
            Browse talent <ArrowGlyph />
          </ButtonLink>
        </div>
      )}
    </>
  );
}
