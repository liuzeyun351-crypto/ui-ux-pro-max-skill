import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { PortraitArt } from "@/components/art/PortraitArt";

/** Split-stage auth layout: form on the left, a lit stage on the right. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 min-h-svh lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="flex flex-1 items-center">
          <div className="w-full max-w-md py-16">{children}</div>
        </div>
        <p className="text-xs text-faint">
          © {new Date().getFullYear()} Aurum Talent Group ·{" "}
          <Link href="/" className="underline-offset-4 hover:text-gold hover:underline">
            Back to the stage
          </Link>
        </p>
      </div>

      <div aria-hidden className="grain relative hidden overflow-hidden bg-background-deep lg:block">
        <PortraitArt name="Aurum Stage" hue={85} variant={7} className="absolute inset-0 h-full w-full opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        <blockquote className="absolute bottom-14 left-12 right-12">
          <p className="font-display text-3xl font-medium leading-snug text-white">
            “From shortlist to signed contract in under two weeks — for a name we assumed was
            unreachable.”
          </p>
          <footer className="mt-4 text-sm text-white/60">
            Priya Sharma · Founder, Solstice Weddings
          </footer>
        </blockquote>
      </div>
    </div>
  );
}
