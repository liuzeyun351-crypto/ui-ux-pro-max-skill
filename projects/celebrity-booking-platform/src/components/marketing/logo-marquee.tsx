import { PARTNER_BRANDS } from "../../../prisma/seed-data";

/**
 * Trust band: an infinite marquee of (fictional) partner wordmarks set in
 * the display serif, faded at the edges. Pure CSS animation.
 */
export function LogoMarquee() {
  const brands = [...PARTNER_BRANDS, ...PARTNER_BRANDS]; // doubled for seamless loop
  return (
    <section aria-label="Trusted by leading organizations" className="border-y border-border bg-surface/40 py-8">
      <p className="kicker mb-6 text-center !text-faint">
        Trusted for the moments that matter
      </p>
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <ul className="flex w-max animate-marquee items-center gap-16 pr-16 hover:[animation-play-state:paused]">
          {brands.map((brand, i) => (
            <li
              key={`${brand}-${i}`}
              aria-hidden={i >= PARTNER_BRANDS.length}
              className="shrink-0 select-none whitespace-nowrap font-display text-xl text-faint transition-colors duration-300 hover:text-gold"
            >
              {brand}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
