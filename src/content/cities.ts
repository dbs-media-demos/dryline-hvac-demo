import { img, type Photo } from "@/lib/images";

export type City = {
  slug: string;
  name: string;
  county: string;
  zips: string[];
  drive: string;
  lat: number;
  lng: number;
  photo: Photo;
  intro: string;
  neighborhoods: string[];
  local: { title: string; body: string }[];
  review: { name: string; text: string };
};

export const cities: City[] = [
  {
    slug: "edmond",
    name: "Edmond",
    county: "Oklahoma County",
    zips: ["73003", "73012", "73013", "73025", "73034"],
    drive: "18 min from our shop",
    lat: 35.6528,
    lng: -97.4781,
    photo: img.cityEdmond,
    intro:
      "From the 1950s bungalows near downtown Edmond to two-story builds out in Oak Tree and Iron Horse, Edmond homes ask a lot of their HVAC systems. We keep a truck stationed north of Memorial Road all summer so Edmond calls don't wait on I-35 traffic.",
    neighborhoods: ["Downtown Edmond", "Oak Tree", "Kickingbird", "Fox Lake", "Iron Horse Ranch", "Coffee Creek", "Hafer Park area", "Arcadia Lake"],
    local: [
      {
        title: "Two-story homes, one system",
        body: "Many Edmond two-stories run one system for both floors, so upstairs bedrooms cook in July. Zoning, a dedicated mini-split or a properly sized variable-speed system fixes it.",
      },
      {
        title: "Older ductwork near downtown",
        body: "Mid-century homes often have undersized or leaky ducts in tight crawlspaces. We test and seal before recommending bigger equipment.",
      },
    ],
    review: { name: "Brianna T., Edmond", text: "In our driveway by 5:10 on a 103° Saturday. Cold air in 25 minutes." },
  },
  {
    slug: "norman",
    name: "Norman",
    county: "Cleveland County",
    zips: ["73019", "73026", "73069", "73071", "73072"],
    drive: "26 min from our shop",
    lat: 35.2226,
    lng: -97.4395,
    photo: img.cityNorman,
    intro:
      "Norman is university rentals, historic homes near Campus Corner and newer neighborhoods out west — and all of it gets the same brutal July. We service landlords, homeowners and property managers from Brookhaven to Lake Thunderbird.",
    neighborhoods: ["Campus Corner", "Brookhaven", "Hall Park", "Eagle Cliff", "Summit Lakes", "Cobblestone Creek", "Lake Thunderbird area"],
    local: [
      {
        title: "Rental properties",
        body: "Landlords get one invoice per property, photos of every visit and priority scheduling with a multi-home Comfort Club plan.",
      },
      {
        title: "Storm-season checks",
        body: "Hail and debris bend condenser fins every spring. A quick coil comb and cleaning restores airflow before summer.",
      },
    ],
    review: { name: "Karen W., Norman", text: "Furnace died at 2 a.m. in the ice storm. Tech there before 4 — and no overtime charge." },
  },
  {
    slug: "moore",
    name: "Moore",
    county: "Cleveland County",
    zips: ["73153", "73160", "73165", "73170"],
    drive: "17 min from our shop",
    lat: 35.3395,
    lng: -97.4867,
    photo: img.cityMoore,
    intro:
      "Moore rebuilt stronger, and many homes here have newer systems that just need to be kept that way. We handle tune-ups, warranty repairs and upgrades across Moore and South OKC — usually same day.",
    neighborhoods: ["Old Town Moore", "Kingsridge", "Southmoore", "Eagle Ridge", "Little River Park area", "Plaza Towers area"],
    local: [
      {
        title: "Protect newer systems",
        body: "Manufacturer warranties often require documented annual maintenance. Every Comfort Club visit is logged with photos for your records.",
      },
      {
        title: "Heat pump upgrades",
        body: "Many rebuilt homes are all-electric. A modern heat pump can cut winter bills sharply versus electric strip heat.",
      },
    ],
    review: { name: "Darnell M., Moore", text: "January bill went from $412 to $186 after our dual-fuel heat pump." },
  },
  {
    slug: "yukon",
    name: "Yukon",
    county: "Canadian County",
    zips: ["73085", "73099"],
    drive: "22 min from our shop",
    lat: 35.5067,
    lng: -97.7625,
    photo: img.stormFarmhouse,
    intro:
      "Yukon mixes established neighborhoods with acreage homes out toward Mustang and Piedmont. Long line-set runs, propane furnaces and big open-plan houses are all normal days for our west-side crew.",
    neighborhoods: ["Downtown Yukon", "Surrey Hills", "Westbury", "Czech Hall Road area", "Frisco Road acreage", "Chisholm Trail area"],
    local: [
      {
        title: "Propane & dual fuel",
        body: "Outside gas service areas, a heat pump paired with a propane furnace keeps winter fuel costs down.",
      },
      {
        title: "Big open floor plans",
        body: "Tall ceilings and open layouts need careful airflow design. We map returns and supplies, not just tonnage.",
      },
    ],
    review: { name: "Tom H., Yukon", text: "Blower motor went out in December — we were first on the list and saved 15%." },
  },
];

export const cityBySlug = (slug: string) => cities.find((c) => c.slug === slug);

/** Every place we serve, for the metro map (includes places without their own page). */
export const serviceTowns = [
  { name: "Oklahoma City", lat: 35.4676, lng: -97.5164, hq: true },
  { name: "Edmond", lat: 35.6528, lng: -97.4781, slug: "edmond" },
  { name: "Norman", lat: 35.2226, lng: -97.4395, slug: "norman" },
  { name: "Moore", lat: 35.3395, lng: -97.4867, slug: "moore" },
  { name: "Yukon", lat: 35.5067, lng: -97.7625, slug: "yukon" },
  { name: "Mustang", lat: 35.3842, lng: -97.7245 },
  { name: "Nichols Hills", lat: 35.5509, lng: -97.5489 },
  { name: "Bethany", lat: 35.5187, lng: -97.6323 },
  { name: "Midwest City", lat: 35.4495, lng: -97.3967 },
] as { name: string; lat: number; lng: number; slug?: string; hq?: boolean }[];
