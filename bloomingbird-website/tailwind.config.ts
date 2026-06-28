import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#070707",
        surface: "#111111",
        "surface-elevated": "#181818",
        cream: "#F5F2EA",
        "text-primary": "#F5F2EA",
        "text-secondary": "#B8B2A8",
        "text-muted": "#7D776F",
        accent: "#C9905B",
        "accent-light": "#D4A373",
        "accent-dark": "#A87545",
        charcoal: "#202020",
        "border-subtle": "rgba(245, 242, 234, 0.10)",
        "border-strong": "rgba(245, 242, 234, 0.22)",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"Inter"', '"Helvetica Neue"', "Arial", "sans-serif"],
        mono: ['"Space Mono"', '"IBM Plex Mono"', "monospace"],
      },
      fontSize: {
        hero: [
          "clamp(64px, 10vw, 168px)",
          { lineHeight: "0.88", letterSpacing: "-0.06em" },
        ],
        h1: [
          "clamp(44px, 7vw, 112px)",
          { lineHeight: "0.92", letterSpacing: "-0.05em" },
        ],
        h2: [
          "clamp(30px, 4.2vw, 72px)",
          { lineHeight: "1", letterSpacing: "-0.04em" },
        ],
        h3: [
          "clamp(22px, 3vw, 42px)",
          { lineHeight: "1.1", letterSpacing: "-0.03em" },
        ],
      },
      spacing: {
        section: "clamp(96px, 12vw, 180px)",
        gutter: "clamp(20px, 4vw, 64px)",
      },
      borderRadius: {
        lg: "28px",
        xl: "40px",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(0,0,0,.35)",
        lifted: "0 40px 120px rgba(0,0,0,.45)",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.22, 1, 0.36, 1)",
        "soft-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "type-in": {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "type-in": "type-in 1.2s steps(40) forwards",
      },
    },
  },
  plugins: [],
};
export default config;
