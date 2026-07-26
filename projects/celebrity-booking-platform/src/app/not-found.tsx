import Link from "next/link";
import { LogoMark } from "@/components/layout/logo";

export default function NotFound() {
  return (
    <div className="grain relative grid min-h-svh place-items-center bg-background-deep px-6 text-center">
      <div>
        <LogoMark size={44} className="mx-auto animate-float" />
        <p className="kicker mt-10">404</p>
        <h1 className="mt-3 font-display text-[length:var(--text-display)] font-medium leading-tight text-foreground">
          This stage is <em className="gold-text not-italic">dark tonight</em>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted">
          The page you&apos;re after has left the venue. The roster, however, is very much on.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-gold px-7 py-3 text-sm font-medium text-on-gold transition-colors hover:bg-gold-bright"
          >
            Back to the stage
          </Link>
          <Link
            href="/celebrities"
            className="rounded-full border border-border-strong px-7 py-3 text-sm text-foreground transition-colors hover:border-gold hover:text-gold"
          >
            Browse talent
          </Link>
        </div>
      </div>
    </div>
  );
}
