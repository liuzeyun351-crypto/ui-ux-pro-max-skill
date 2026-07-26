import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Image credits",
  description:
    "Photographers, licences and sources for every photograph used on Aurum. All imagery is freely licensed; no endorsement or affiliation is implied.",
};

/**
 * Site-wide attribution. CC BY and CC BY-SA require the author and licence to
 * travel with the work, and a single credits page is the accepted way to
 * discharge that across a whole site.
 */
export default async function CreditsPage() {
  const media = await db.media.findMany({
    where: { url: { not: "" } },
    include: { celebrity: { select: { name: true, slug: true } } },
    orderBy: [{ celebrityId: "asc" }, { kind: "asc" }],
  });

  const withCredit = media.filter((m) => m.credit || m.licence);

  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-36 sm:px-8">
      <Reveal>
        <p className="kicker mb-4 flex items-center gap-3">
          <span aria-hidden className="h-px w-8 bg-gold/60" />
          Attribution
        </p>
        <h1 className="font-display text-[length:var(--text-headline)] font-medium leading-[1.1] tracking-[-0.015em] text-foreground">
          Image credits
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted">
          Aurum uses only freely-licensed photography — public domain, CC0, CC BY and
          CC BY-SA. Each photograph below is listed with its author, licence and source
          file. Appearance on this platform does not imply any endorsement, affiliation or
          business relationship with the people depicted.
        </p>
      </Reveal>

      {withCredit.length === 0 ? (
        <Reveal delay={0.1}>
          <div className="mt-12 rounded-[var(--radius-xl)] border border-dashed border-border-strong p-12 text-center">
            <p className="font-display text-2xl text-foreground">No photography loaded yet</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              Every talent profile is currently using generated artwork. Run{" "}
              <code className="text-gold">npm run fetch:images</code> followed by{" "}
              <code className="text-gold">npx prisma db seed</code> to pull freely-licensed
              photographs from Wikimedia Commons — their credits will appear here
              automatically.
            </p>
            <Link
              href="/celebrities"
              className="mt-6 inline-block text-sm text-gold underline-offset-4 hover:underline"
            >
              Browse the roster →
            </Link>
          </div>
        </Reveal>
      ) : (
        <Reveal delay={0.1}>
          <ul className="mt-12 divide-y divide-border overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
            {withCredit.map((m) => (
              <li key={m.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-6 py-4">
                <span className="min-w-40 flex-1 text-sm font-medium text-foreground">
                  {m.celebrity ? (
                    <Link
                      href={`/celebrities/${m.celebrity.slug}`}
                      className="underline-offset-4 hover:text-gold hover:underline"
                    >
                      {m.celebrity.name}
                    </Link>
                  ) : (
                    "Platform imagery"
                  )}
                  <span className="ml-2 text-[11px] uppercase tracking-[0.14em] text-faint">
                    {m.kind}
                  </span>
                </span>
                <span className="text-sm text-muted">{m.credit ?? "Unknown author"}</span>
                <span className="text-xs text-faint">
                  {m.licenceUrl ? (
                    <a
                      href={m.licenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-gold"
                    >
                      {m.licence}
                    </a>
                  ) : (
                    m.licence
                  )}
                  {m.sourceUrl && (
                    <>
                      {" · "}
                      <a
                        href={m.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-gold"
                      >
                        source
                      </a>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      <Reveal delay={0.15}>
        <p className="mt-10 text-xs leading-relaxed text-faint">
          Requests to remove or correct an image credit are handled within one business
          day — this is a demonstration project, and any rights-holder concern takes
          precedence over the demo.
        </p>
      </Reveal>
    </div>
  );
}
