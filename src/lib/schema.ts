import { absoluteUrl, site } from "./site";
import { reviews } from "@/content/reviews";

/** schema.org builders. Everything links back to one HVACBusiness node via @id. */

type Json = Record<string, unknown>;

export const bizId = `${site.url}/#business`;
export const websiteId = `${site.url}/#website`;

const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hh = (h: number) => `${String(h).padStart(2, "0")}:00`;

export function businessSchema(): Json {
  return {
    "@type": "HVACBusiness",
    "@id": bizId,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: absoluteUrl("/brand/icon-512.png"),
    image: [absoluteUrl("/images/tech-condenser-gauges.jpg"), absoluteUrl("/images/unit-heat-pump-modern.jpg")],
    description: site.description,
    telephone: site.phone,
    email: site.email,
    priceRange: "$$",
    foundingDate: String(site.founded),
    slogan: site.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postal,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: site.areaServed.map((name) => ({ "@type": "City", name: `${name}, OK` })),
    openingHoursSpecification: [
      ...site.hours
        .filter((h) => h.open !== null)
        .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: DAY[h.day], opens: hh(h.open!), closes: hh(h.close!) })),
    ],
    hasOfferCatalog: { "@id": `${site.url}/services#catalog` },
    paymentAccepted: "Cash, Check, Credit Card, Financing",
    currenciesAccepted: "USD",
    knowsAbout: ["Air conditioning repair", "Furnace repair", "Heat pumps", "Ductless mini-splits", "Indoor air quality", "Duct cleaning"],
    aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.value, reviewCount: site.rating.count, bestRating: 5, worstRating: 1 },
    review: reviews.slice(0, 6).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: r.date,
      reviewBody: r.text,
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    })),
    contactPoint: { "@type": "ContactPoint", contactType: "customer service", telephone: site.phone, availableLanguage: ["English", "Spanish"], hoursAvailable: "24/7 emergency dispatch" },
  };
}

export function websiteSchema(): Json {
  return { "@type": "WebSite", "@id": websiteId, url: site.url, name: site.name, description: site.description, publisher: { "@id": bizId }, inLanguage: "en-US" };
}

export function webPageSchema(opts: { path: string; name: string; description: string; type?: string }): Json {
  return {
    "@type": opts.type ?? "WebPage",
    "@id": `${absoluteUrl(opts.path)}#webpage`,
    url: absoluteUrl(opts.path),
    name: opts.name,
    description: opts.description,
    inLanguage: "en-US",
    isPartOf: { "@id": websiteId },
    about: { "@id": bizId },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })),
  };
}

export function serviceSchema(opts: { name: string; description: string; path: string; image: string; price?: string; area?: string[] }): Json {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(opts.path)}#service`,
    name: opts.name,
    serviceType: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    image: absoluteUrl(opts.image),
    provider: { "@id": bizId },
    areaServed: (opts.area ?? site.areaServed).map((name) => ({ "@type": "City", name: `${name}, OK` })),
    ...(opts.price ? { offers: { "@type": "Offer", description: opts.price, priceCurrency: "USD", seller: { "@id": bizId } } } : {}),
  };
}

export function offerCatalogSchema(items: { name: string; path: string }[]): Json {
  return {
    "@type": "OfferCatalog",
    "@id": `${site.url}/services#catalog`,
    name: "Heating & air conditioning services",
    itemListElement: items.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, url: absoluteUrl(s.path) } })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function articleSchema(opts: { path: string; headline: string; description: string; image: string; datePublished: string; keywords?: string[] }): Json {
  return {
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(opts.path)}#article`,
    mainEntityOfPage: { "@id": `${absoluteUrl(opts.path)}#webpage` },
    headline: opts.headline,
    description: opts.description,
    image: absoluteUrl(opts.image),
    datePublished: opts.datePublished,
    dateModified: opts.datePublished,
    inLanguage: "en-US",
    author: { "@id": bizId },
    publisher: { "@id": bizId },
    ...(opts.keywords ? { keywords: opts.keywords.join(", ") } : {}),
  };
}

export const graph = (...nodes: Json[]) => ({ "@context": "https://schema.org", "@graph": nodes });
