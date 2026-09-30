/** Business facts for the (fictional) Dryline Heat & Air. One source of truth for copy, schema and UI. */

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://dryline-hvac-demo.vercel.app").replace(/\/$/, "");

/** The agency that built this concept site. Change the URL here only (custom domain later). */
export const agencyName = "Scale by Noon";
export const agencyUrl = "https://scale-by-noon.vercel.app";

export const absoluteUrl = (path = "/") => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

/** Demos stay out of search engines unless NEXT_PUBLIC_NOINDEX is explicitly "false". */
export const noindex = process.env.NEXT_PUBLIC_NOINDEX !== "false";

export const site = {
  name: "Dryline Heat & Air",
  shortName: "Dryline",
  legalName: "Dryline Heat & Air, LLC",
  tagline: "Oklahoma weather doesn't do mild. We do.",
  description:
    "Same-day AC repair, furnace repair and new heating & cooling systems across Oklahoma City, Edmond, Norman, Moore, Yukon and Mustang. Upfront flat-rate pricing, NATE-certified technicians, 24/7 emergency service.",
  url: siteUrl,
  phone: "+14055550142",
  phoneDisplay: "(405) 555-0142",
  email: "hello@drylineair.com",
  founded: 2011,
  address: {
    street: "1701 NW 23rd St, Suite 5",
    city: "Oklahoma City",
    region: "OK",
    postal: "73106",
    country: "US",
  },
  geo: { lat: 35.4935, lng: -97.5397 },
  rating: { value: 4.9, count: 1284 },
  license: "OK CIB Mechanical #MEC-0418-DL",
  areaServed: ["Oklahoma City", "Edmond", "Norman", "Moore", "Yukon", "Mustang"],
  /** Office hours (America/Chicago). Emergency dispatch runs 24/7 regardless. 0 = Sunday. */
  hours: [
    { day: 0, open: null, close: null },
    { day: 1, open: 7, close: 19 },
    { day: 2, open: 7, close: 19 },
    { day: 3, open: 7, close: 19 },
    { day: 4, open: 7, close: 19 },
    { day: 5, open: 7, close: 19 },
    { day: 6, open: 8, close: 16 },
  ] as { day: number; open: number | null; close: number | null }[],
  stats: {
    homes: 12400,
    arrival: 38,
    techs: 21,
    warranty: 10,
  },
  credentials: [
    "NATE-certified technicians",
    "EPA Section 608 certified",
    "Licensed, bonded & insured",
    "Background-checked & drug-tested",
    "ACCA member",
    "100% satisfaction guarantee",
  ],
} as const;

export const telHref = `tel:${site.phone}`;
export const mailHref = `mailto:${site.email}`;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/comfort-club", label: "Comfort Club" },
  { href: "/repair-or-replace", label: "Repair or replace" },
  { href: "/financing", label: "Financing" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
] as const;
