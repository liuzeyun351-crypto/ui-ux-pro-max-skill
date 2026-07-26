import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Aurum — The world's stage, on request";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Sitewide OG card: dark stage, spotlight glow, serif wordmark. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(90% 70% at 50% 0%, #2e2617 0%, #171310 60%, #0f0c0a 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            color: "#e9e2d6",
            fontSize: 64,
            letterSpacing: "0.35em",
          }}
        >
          <svg width="72" height="72" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18.5" fill="none" stroke="#c9a24b" strokeWidth="1.4" />
            <path
              fill="#c9a24b"
              d="M20 6l2.2 9.3a3.5 3.5 0 0 0 2.5 2.5L34 20l-9.3 2.2a3.5 3.5 0 0 0-2.5 2.5L20 34l-2.2-9.3a3.5 3.5 0 0 0-2.5-2.5L6 20l9.3-2.2a3.5 3.5 0 0 0 2.5-2.5z"
            />
          </svg>
          AURUM
        </div>
        <div
          style={{
            marginTop: 34,
            width: 560,
            height: 1,
            background: "linear-gradient(90deg, transparent, #c9a24b, transparent)",
          }}
        />
        <div
          style={{
            marginTop: 34,
            color: "#a89e8d",
            fontSize: 30,
            fontStyle: "italic",
          }}
        >
          The world&apos;s stage, on request.
        </div>
      </div>
    ),
    size
  );
}
