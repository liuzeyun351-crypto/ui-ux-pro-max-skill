export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-bg">
      {/* Hero background placeholder */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 to-bg/90 z-10" />
      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-60" />

      <div className="relative z-20 flex-1 flex flex-col justify-center container-x pt-32">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="font-[var(--font-playfair)] italic text-cream text-[clamp(32px,5vw,64px)] leading-[1.1] mb-6">
              Property. Strategy. Legacy.
            </h1>
            <p className="eyebrow text-accent">
              A PRIVATE REAL ESTATE ADVISORY BUILT ON TRUST AND INSIGHT.
            </p>
          </div>

          <div className="text-right">
            <p className="font-[var(--font-playfair)] italic text-cream/80 text-[clamp(24px,3.5vw,48px)] leading-[1.1]">
              Company<br />Profile
            </p>
          </div>
        </div>
      </div>

      {/* Giant brand name */}
      <div className="relative z-20 container-x pb-8">
        <h2 className="text-hero font-[var(--font-playfair)] text-accent font-normal tracking-[-0.06em] leading-[0.88]">
          Bloomingbird
          <span className="text-[0.3em] align-super ml-2">®</span>
        </h2>
      </div>
    </section>
  );
}
