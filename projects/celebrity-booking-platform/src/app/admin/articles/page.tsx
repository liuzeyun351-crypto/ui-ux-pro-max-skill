import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/shell";
import { BannerArt } from "@/components/art/PortraitArt";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "CMS · Admin" };

export default async function AdminArticles() {
  const articles = await db.article.findMany({
    include: { celebrity: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <PageHeader
        title="Content"
        lead="Stories, guides and press — the editorial layer of the platform."
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((a) => (
          <article
            key={a.id}
            className="group overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface transition-all duration-300 hover:border-gold/40"
          >
            <div className="relative aspect-[16/8] overflow-hidden">
              <BannerArt title={a.title} hue={a.heroHue} className="absolute inset-0 h-full w-full" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2">
                <Badge tone="gold" className="capitalize">
                  {a.kind}
                </Badge>
                <span className="text-xs text-faint">
                  {formatDate(a.publishedAt)} · {a.readMinutes} min
                </span>
              </div>
              <h2 className="mt-3 font-display text-lg font-medium leading-snug text-foreground">
                {a.title}
              </h2>
              {a.celebrity && (
                <p className="mt-1 text-xs text-faint">Tagged: {a.celebrity.name}</p>
              )}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                <Link href={`/news/${a.slug}`} className="text-gold underline-offset-4 hover:underline">
                  View live →
                </Link>
                <span className="text-faint">/{a.slug}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
