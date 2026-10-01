import { site } from "./site";
import { type Biz, type DayHours } from "./biz-core";

export type { Biz } from "./biz-core";

const hh = (h: number | null) => (h == null ? null : `${String(h).padStart(2, "0")}:00`);

/** The fictional company as a Biz: what the concept site shows (previews swap in a real one). */
export const defaultBiz: Biz = {
  lang: "en",
  name: site.name,
  shortName: site.shortName,
  tagline: null,
  area: site.address.city,
  phone: site.phone,
  phoneDisplay: site.phoneDisplay,
  address: {
    street: site.address.street,
    city: site.address.city,
    region: site.address.region,
    postal: site.address.postal,
    full: `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postal}`,
  },
  timezone: "America/Chicago",
  hours: site.hours.map((h): DayHours => ({ day: h.day, open: hh(h.open), close: hh(h.close) })),
  hoursSummary: "Mon–Fri 7–7 · Sat 8–4",
  rating: { ...site.rating },
  preview: false,
};
