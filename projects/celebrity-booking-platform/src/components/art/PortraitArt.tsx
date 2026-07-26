/**
 * Generated placeholder portrait — the platform's substitute for real
 * celebrity photography (see README "Demo data"). Each talent gets a
 * deterministic cinematic composition derived from their name and accent
 * hue: a lit stage ground, sweeping spotlight beams, contour lines and a
 * serif monogram. The artwork is labeled "AURUM · DEMO ARTWORK" along its
 * edge so it can never be mistaken for a photograph.
 */

// Deterministic hash → [0,1) sequence so a talent's art never changes
function seeded(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function monogram(name: string) {
  const parts = name.replace(/[^A-Za-z' ]/g, "").split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export interface PortraitArtProps {
  name: string;
  hue: number;
  /** visual variant seed — pass an index to get gallery variations */
  variant?: number;
  className?: string;
  /** rounded corners are applied by the parent wrapper via overflow hidden */
  priority?: boolean;
}

export function PortraitArt({ name, hue, variant = 0, className }: PortraitArtProps) {
  const rnd = seeded(`${name}::${variant}`);
  const uid = `pa-${name.replace(/[^a-z0-9]/gi, "").toLowerCase()}-${variant}`;

  const beamCount = 3 + Math.floor(rnd() * 2);
  const beams = Array.from({ length: beamCount }, () => ({
    x: 40 + rnd() * 320,
    angle: -34 + rnd() * 68,
    width: 36 + rnd() * 70,
    opacity: 0.1 + rnd() * 0.16,
  }));
  const contours = Array.from({ length: 4 }, (_, i) => {
    const yBase = 150 + i * 90 + rnd() * 40;
    const c1 = 60 + rnd() * 140;
    const c2 = 240 + rnd() * 140;
    return `M -20 ${yBase} C 100 ${yBase - c1}, 280 ${yBase + c2 - 140}, 420 ${yBase - 30 + rnd() * 60}`;
  });
  const orbX = 90 + rnd() * 220;
  const orbY = 90 + rnd() * 140;
  const mono = monogram(name);

  return (
    <svg
      viewBox="0 0 400 533"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`Stylized placeholder artwork representing ${name}`}
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={`oklch(0.32 0.09 ${hue})`} />
          <stop offset="55%" stopColor={`oklch(0.2 0.06 ${hue})`} />
          <stop offset="100%" stopColor={`oklch(0.13 0.03 ${(hue + 30) % 360})`} />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.42" r="0.75">
          <stop offset="0%" stopColor={`oklch(0.75 0.14 ${hue} / 0.55)`} />
          <stop offset="45%" stopColor={`oklch(0.55 0.12 ${hue} / 0.18)`} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id={`${uid}-beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.98 0.02 95 / 0.9)" />
          <stop offset="100%" stopColor="oklch(0.98 0.02 95 / 0)" />
        </linearGradient>
        <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0 0 0 / 0)" />
          <stop offset="100%" stopColor="oklch(0.08 0.02 260 / 0.85)" />
        </linearGradient>
        <filter id={`${uid}-grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.06" />
          </feComponentTransfer>
          <feComposite operator="over" in2="SourceGraphic" />
        </filter>
      </defs>

      <rect width="400" height="533" fill={`url(#${uid}-bg)`} />

      {/* spotlight beams from above */}
      {beams.map((b, i) => (
        <g key={i} transform={`rotate(${b.angle} ${b.x} 0)`}>
          <polygon
            points={`${b.x - b.width * 0.2},0 ${b.x + b.width * 0.2},0 ${b.x + b.width},533 ${b.x - b.width},533`}
            fill={`url(#${uid}-beam)`}
            opacity={b.opacity}
          />
        </g>
      ))}

      {/* halo */}
      <rect width="400" height="533" fill={`url(#${uid}-glow)`} />

      {/* contour flow lines */}
      {contours.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={`oklch(0.85 0.08 ${hue} / ${0.14 - i * 0.02})`}
          strokeWidth={i === 0 ? 1.5 : 1}
        />
      ))}

      {/* orbiting accent ring */}
      <circle
        cx={orbX}
        cy={orbY}
        r={46 + rnd() * 30}
        fill="none"
        stroke={`oklch(0.88 0.1 ${hue} / 0.35)`}
        strokeWidth="1"
        strokeDasharray="1 6"
        strokeLinecap="round"
      />

      {/* serif monogram, cropped large like an editorial masthead */}
      <text
        x="200"
        y={330 + rnd() * 40}
        textAnchor="middle"
        fontFamily="'Playfair Display Variable', Georgia, serif"
        fontWeight="600"
        fontSize={rnd() > 0.5 ? 240 : 210}
        fill={`oklch(0.93 0.05 ${hue} / 0.16)`}
        stroke={`oklch(0.93 0.07 ${hue} / 0.3)`}
        strokeWidth="1"
      >
        {mono}
      </text>

      {/* stage floor */}
      <rect y="360" width="400" height="173" fill={`url(#${uid}-floor)`} />

      {/* grain */}
      <rect width="400" height="533" filter={`url(#${uid}-grain)`} opacity="0.5" />

      {/* provenance label — this is generated art, not a photo */}
      <text
        x="392"
        y="524"
        textAnchor="end"
        fontFamily="ui-sans-serif, system-ui"
        fontSize="9"
        letterSpacing="2"
        fill="oklch(1 0 0 / 0.35)"
      >
        AURUM · DEMO ARTWORK
      </text>
    </svg>
  );
}

/** Wide 16:9 variant used for article heroes and event banners. */
export function BannerArt({
  title,
  hue,
  className,
}: {
  title: string;
  hue: number;
  className?: string;
}) {
  const rnd = seeded(`banner::${title}`);
  const uid = `ba-${title.replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 24)}`;
  const beams = Array.from({ length: 4 }, () => ({
    x: rnd() * 800,
    angle: -30 + rnd() * 60,
    width: 50 + rnd() * 90,
    opacity: 0.08 + rnd() * 0.12,
  }));
  return (
    <svg
      viewBox="0 0 800 450"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`Stylized placeholder banner for ${title}`}
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`oklch(0.3 0.08 ${hue})`} />
          <stop offset="100%" stopColor={`oklch(0.14 0.03 ${(hue + 40) % 360})`} />
        </linearGradient>
        <linearGradient id={`${uid}-beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.98 0.02 95 / 0.85)" />
          <stop offset="100%" stopColor="oklch(0.98 0.02 95 / 0)" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill={`url(#${uid}-bg)`} />
      {beams.map((b, i) => (
        <g key={i} transform={`rotate(${b.angle} ${b.x} 0)`}>
          <polygon
            points={`${b.x - b.width * 0.25},0 ${b.x + b.width * 0.25},0 ${b.x + b.width},450 ${b.x - b.width},450`}
            fill={`url(#${uid}-beam)`}
            opacity={b.opacity}
          />
        </g>
      ))}
      <circle
        cx={600 + rnd() * 120}
        cy={100 + rnd() * 120}
        r={60 + rnd() * 50}
        fill="none"
        stroke={`oklch(0.88 0.1 ${hue} / 0.3)`}
        strokeDasharray="1 7"
      />
      <text
        x="792"
        y="440"
        textAnchor="end"
        fontFamily="ui-sans-serif, system-ui"
        fontSize="10"
        letterSpacing="2"
        fill="oklch(1 0 0 / 0.32)"
      >
        AURUM · DEMO ARTWORK
      </text>
    </svg>
  );
}
