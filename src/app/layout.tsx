import type { Metadata, Viewport } from "next";
import { Martian_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/fx/Cursor";
import { modeBootScript } from "@/lib/mode";
import { site, siteUrl, noindex, agencyName, agencyUrl } from "@/lib/site";

// Subset to Latin + Latin Ext-A (Serbian included) and the weights in use: two files, under 100 KB together.
const unbounded = localFont({ src: "./fonts/unbounded-latin-var.woff2", variable: "--font-unbounded", weight: "400 600", display: "swap" });
const figtree = localFont({ src: "./fonts/figtree-latin-var.woff2", variable: "--font-figtree", weight: "400 700", display: "swap" });
// Desktop only: phones set their mono labels in Figtree (globals.css) and never fetch this one.
const martian = Martian_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-martian", weight: ["400", "500"], display: "swap", preload: false });

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
