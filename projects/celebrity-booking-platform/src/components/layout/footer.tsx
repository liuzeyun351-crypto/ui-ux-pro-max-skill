import Link from "next/link";
import { Logo } from "./logo";
import { NewsletterForm } from "@/components/marketing/newsletter-form";

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Platform",
    links: [
      ["Browse talent", "/celebrities"],
      ["How it works", "/how-it-works"],
      ["Stories", "/news"],
      ["FAQ", "/faq"],
    ],
  },
  {
    title: "Categories",
    links: [
      ["Music", "/celebrities?category=music"],
      ["Film & Television", "/celebrities?category=film"],
      ["Sports", "/celebrities?category=sports"],
      ["Keynote Speakers", "/celebrities?category=speakers"],
    ],
  },
  {
    title: "Company",
    links: [
      ["For managers", "/signin"],
      ["Client dashboard", "/dashboard"],
      ["Image credits", "/credits"],
      ["Terms", "/legal/terms"],
      ["Privacy", "/legal/privacy"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="hairline-gold relative mt-32 border-t border-border bg-background-deep">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              The world&apos;s stage, on request. Aurum connects extraordinary occasions with
              extraordinary people — concerts, keynotes, campaigns and moments in between.
            </p>
            <div className="mt-8">
              <p className="kicker mb-3">The Aurum Letter</p>
              <NewsletterForm />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-faint">
                  {col.title}
                </h3>
                <ul className="space-y-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={href + label}>
                      <Link
                        href={href}
                        className="text-sm text-muted transition-colors hover:text-gold"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Aurum Talent Group. A design & engineering demonstration.</p>
          <p className="max-w-xl leading-relaxed">
            Demo platform: talent profiles pair publicly known career facts with fictional fees
            and freely-licensed photography (see{" "}
            <Link href="/credits" className="underline underline-offset-2 hover:text-gold">
              image credits
            </Link>
            ). No endorsement or affiliation is implied.
          </p>
        </div>
      </div>
    </footer>
  );
}
