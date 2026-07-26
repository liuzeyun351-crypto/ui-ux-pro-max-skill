import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BannerArt } from "@/components/art/PortraitArt";
import { CelebrityCard } from "@/components/celebrity/celebrity-card";
import { Reveal } from "@/components/motion/reveal";
import { db } from "@/lib/db";
import { celebrityInclude } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const articles = await db.article.findMany({ select: { slug: true } });
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await db.article.findUnique({ where: { slug } });
  if (!a) return {};
  return { title: a.title, description: a.excerpt };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await db.article.findUnique({
    where: { slug },
    include: { celebrity: { include: celebrityInclude } },
  });
  if (!article) notFound();

  const paragraphs = article.body.split("\n\n");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt.toISOString(),
    publisher: { "@type": "Organization", name: "Aurum Talent Group" },
  };

  return (
    <article className="pb-24 pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-faint">
            <Link href="/news" className="transition-colors hover:text-gold">
              Stories
            </Link>{" "}
            <span aria-hidden>/</span> <span className="capitalize">{article.kind}</span>
          </nav>
          <h1 className="font-display text-[length:var(--text-headline)] font-medium leading-[1.1] tracking-[-0.015em] text-foreground">
            {article.title}
          </h1>
          <p className="mt-5 text-sm text-faint">
            {formatDate(article.publishedAt)} · {article.readMinutes} min read
          </p>
        </Reveal>
      </div>

      <Reveal className="mx-auto mt-10 max-w-5xl px-5 sm:px-8">
        <div className="relative aspect-[21/9] overflow-hidden rounded-[var(--radius-xl)] border border-border">
          <BannerArt title={article.title} hue={article.heroHue} className="absolute inset-0 h-full w-full" />
        </div>
      </Reveal>

      <div className="mx-auto mt-12 max-w-3xl px-5 sm:px-8">
        <div className="space-y-6">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "font-display text-xl leading-relaxed text-foreground first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.85] first-letter:text-gold"
                  : "text-base leading-[1.85] text-muted"
              }
            >
              {para}
            </p>
          ))}
        </div>

        {article.celebrity && (
          <aside className="mt-14 border-t border-border pt-10" aria-label="Featured in this story">
            <p className="kicker mb-6">Featured in this story</p>
            <div className="max-w-xs">
              <CelebrityCard celebrity={article.celebrity} />
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
