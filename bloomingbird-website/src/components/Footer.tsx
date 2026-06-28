"use client";

export default function Footer() {
  return (
    <footer className="bg-bg border-t border-border-subtle">
      <div className="max-w-6xl mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          <div>
            <p className="font-[var(--font-playfair)] text-accent text-2xl mb-2">
              Bloomingbird
            </p>
            <p className="text-text-muted text-sm">Real Estate</p>
          </div>

          <div className="space-y-2 text-sm text-text-secondary">
            <p>Dubai, UAE</p>
            <a
              href="https://www.bloomingbirdrealestate.ae"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-accent transition-colors"
            >
              www.bloomingbirdrealestate.ae
            </a>
            <a
              href="mailto:admin@bloomingbirdre.ae"
              className="block hover:text-accent transition-colors"
            >
              admin@bloomingbirdre.ae
            </a>
          </div>

          <div className="space-y-2 text-sm text-text-secondary md:text-right">
            <a href="tel:+971565599600" className="block hover:text-accent transition-colors">
              +971 56 559 9600
            </a>
            <a href="tel:+971504256348" className="block hover:text-accent transition-colors">
              +971 50 425 6348
            </a>
          </div>
        </div>

        <div className="h-px bg-border-subtle my-12" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-text-muted text-xs">
          <p>&copy; {new Date().getFullYear()} Bloomingbird Real Estate. All rights reserved.</p>
          <p className="font-[var(--font-space-mono)]">Dubai, United Arab Emirates</p>
        </div>
      </div>
    </footer>
  );
}
