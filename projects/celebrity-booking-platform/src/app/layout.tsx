import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/playfair-display";
import "@/styles/globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Aurum — Book the World's Most Extraordinary Talent",
    template: "%s · Aurum",
  },
  description:
    "Aurum is the luxury platform for booking celebrities, artists, athletes and speakers — concerts, keynotes, campaigns and private events, secured by escrow.",
  openGraph: {
    siteName: "Aurum",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#161310" },
    { media: "(prefers-color-scheme: light)", color: "#f7f5f2" },
  ],
};

// Applies the stored theme before first paint to avoid a flash.
const themeInit = `(function(){try{var t=localStorage.getItem("aurum-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
