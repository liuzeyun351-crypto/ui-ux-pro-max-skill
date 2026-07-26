import Link from "next/link";
import type { Metadata } from "next";
import { ArticleImage } from "@/components/art/TalentImage";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { getArticles } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Dispatches from the booking floor — guides, industry shifts and the craft of extraordinary events.",
};

export default async function NewsIndex() {
  const articles = await getArticles();
  const [lead, ...rest] = articles;

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8">
      <header className="mb-14 max-w-2xl">
        <p className="kicker mb-4 flex items-center gap-3">
          <span aria-hidden className="h-px w-8 bg-gold/60" />
          From the wire
        </p>
        <h1 className="font-display text-[length:var(--text-display)] font-medium leading-[1.05] tracking-[-0.02em] text-foreground">
          Stories from the <em className="gold-text not-italic">booking floor</em>
        </h1>
      </header>

      {lead && (
        <Reveal>
          <Link
            href={`/news/${lead.slug}`}
            className="group mb-14 grid grid-cols-1 gap-8 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface transition-all duration-500 hover:border-gold/40 hover:shadow-lift lg:grid-cols-2"
          >
            <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto">
              <ArticleImage
                title={lead.title}
                hue={lead.heroHue}
                celebrity={lead.celebrity}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <p className="kicker mb-4">
                {lead.kind} · {formatDate(lead.publishedAt)}
              </p>
              <h2 className="font-display text-[length:var(--text-title)] font-medium leading-snug text-foreground group-hover:text-gold">
                {lead.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted">{lead.excerpt}</p>
              <p className="mt-6 text-sm font-medium text-gold">
                Read the story <span aria-hidden>→</span>
              </p>
            </div>
          </Link>
        </Reveal>
      )}

      <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((a) => (
          <StaggerItem key={a.id}>
            <Link
              href={`/news/${a.slug}`}
              className="group block h-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <ArticleImage
                  title={a.title}
                  hue={a.heroHue}
                  celebrity={a.celebrity}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-gold">
                  {a.kind} · {a.readMinutes} min
                </p>
                <h2 className="mt-2 font-display text-xl font-medium leading-snug text-foreground group-hover:text-gold">
                  {a.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{a.excerpt}</p>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
