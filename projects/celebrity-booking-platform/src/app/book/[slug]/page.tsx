import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { getCelebrityBySlug } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Book ${slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}` };
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCelebrityBySlug(slug);
  if (!c) notFound();

  return (
    <div className="min-h-svh bg-background">
      {/* focused header: logo + escape hatch, nothing else */}
      <header className="glass fixed inset-x-0 top-0 z-40">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href={`/celebrities/${c.slug}`}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-gold hover:text-gold"
            >
              Exit booking
            </Link>
          </div>
        </div>
      </header>

      <main>
        <BookingWizard
          celebrity={{
            slug: c.slug,
            name: c.name,
            hue: c.accentHue,
            category: c.category.name,
            country: `${c.country.flag} ${c.country.name}`,
            verified: c.verified,
            photo: c.photo,
            feeFromCents: c.feeFromCents,
            feeToCents: c.feeToCents,
            managerName: c.manager.user.name,
            agencyName: c.manager.agencyName,
            slots: c.availability_.map((s) => ({
              date: s.date.toISOString(),
              status: s.status as "open" | "held" | "booked" | "blocked",
            })),
          }}
        />
      </main>
    </div>
  );
}
