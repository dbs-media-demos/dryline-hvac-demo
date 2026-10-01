import type { Metadata, Viewport } from "next";
import { Unbounded, Figtree, Martian_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/fx/Cursor";
import { modeBootScript } from "@/lib/mode";
import { site, siteUrl, noindex, agencyName, agencyUrl } from "@/lib/site";

const unbounded = Unbounded({ subsets: ["latin", "latin-ext"], variable: "--font-unbounded", weight: ["400", "500", "600"], display: "swap" });
const figtree = Figtree({ subsets: ["latin", "latin-ext"], variable: "--font-figtree", display: "swap" });
const martian = Martian_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-martian", weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name} | Heating & Air Conditioning in Oklahoma City`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: agencyName, url: agencyUrl }],
  creator: agencyName,
  formatDetection: { telephone: false },
  robots: noindex ? { index: false, follow: false, googleBot: { index: false, follow: false } } : { index: true, follow: true },
  category: "HVAC contractor",
};

export const viewport: Viewport = {
  themeColor: "#0a1726",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-US" className={`${unbounded.variable} ${figtree.variable} ${martian.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeBootScript }} />
      </head>
      <body>
        <a href="#main" className="sr-only z-[200] rounded-full bg-navy px-4 py-2 text-frost focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          Skip to content
        </a>
        {/* Header, footer and the rest come from (site)/layout or for/[token]/layout (SiteChrome) */}
        {children}
        <Cursor />
        <SmoothScroll />
      </body>
    </html>
  );
}
