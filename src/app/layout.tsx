import type { Metadata, Viewport } from "next";
import { Unbounded, Figtree, Martian_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EmergencyBar } from "@/components/layout/EmergencyBar";
import { MobileBar } from "@/components/layout/MobileBar";
import { DemoPill } from "@/components/layout/DemoPill";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { JsonLd } from "@/components/layout/JsonLd";
import { Cursor } from "@/components/fx/Cursor";
import { modeBootScript } from "@/lib/mode";
import { site, siteUrl, noindex, agencyName, agencyUrl } from "@/lib/site";
import { businessSchema, websiteSchema, graph } from "@/lib/schema";

const unbounded = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", weight: ["400", "500", "600"], display: "swap" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const martian = Martian_Mono({ subsets: ["latin"], variable: "--font-martian", weight: ["400", "500"], display: "swap" });

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
        <EmergencyBar />
        <Header />
        {children}
        <Footer />
        <MobileBar />
        <DemoPill />
        <Cursor />
        <SmoothScroll />
        <JsonLd data={graph(businessSchema(), websiteSchema())} />
      </body>
    </html>
  );
}
