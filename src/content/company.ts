import { img, type Photo } from "@/lib/images";

export const specials = [
  { id: "tuneup", tag: "New customers", title: "$69 tune-up", body: "21-point AC or furnace tune-up for first-time customers. Normally $129.", code: "DRY69", until: "2026-11-30" },
  { id: "system", tag: "New systems", title: "$500 off", body: "A complete AC, furnace or heat pump system. Stacks with rebates that may be available.", code: "LINE500", until: "2026-12-31" },
  { id: "second", tag: "Replacement quotes", title: "Free second opinion", body: "Got a replacement quote from another company? We'll give you a no-pressure second look, free.", code: "2NDLOOK", until: null },
  { id: "heroes", tag: "Seniors, military & teachers", title: "10% off repairs", body: "Our thank-you to the people who hold this city together. Up to $250 off.", code: "OKHEROES", until: null },
] as const;

export type TeamMember = { name: string; role: string; since: number; bio: string; photo?: Photo };

export const team: TeamMember[] = [
  { name: "Marcus Hale", role: "Lead service technician", since: 2014, bio: "NATE-certified in AC and heat pumps. Holds the shop record for fastest capacitor swap on a 106° day.", photo: img.techSmiling },
  { name: "Jess Okafor", role: "Comfort advisor", since: 2017, bio: "Former energy auditor. Will talk you out of a bigger system if your ducts are the real problem." },
  { name: "Ray Delgado", role: "Install crew lead", since: 2012, bio: "Has installed over 2,000 systems across the metro. Floor covers go down before the toolbox comes in." },
  { name: "Tamika Brooks", role: "Dispatch & customer care", since: 2016, bio: "The calm voice on the other end of the 2 a.m. no-heat call." },
];

export const timeline = [
  { year: "2011", title: "The hottest summer on record", body: "OKC hit 100°+ on 63 days. Founders Dean Whitaker and Marisol Reyes start Dryline with one truck and a promise: no overtime, ever." },
  { year: "2014", title: "24/7 dispatch", body: "A real person answers every call, every hour. It's still how we work today." },
  { year: "2018", title: "The Comfort Club", body: "Maintenance memberships launch. Today more than 4,000 metro homes are members." },
  { year: "2022", title: "Heat pumps go mainstream", body: "We train every tech on cold-climate heat pumps and dual-fuel systems." },
  { year: "2026", title: "21 trucks, 6 cities", body: "Still family-owned, still in Midtown, still answering at 3 a.m." },
];

/** "A day on call" — the horizontal photo story on the home page. */
export const dayOnCall: { time: string; place: string; title: string; body: string; photo: Photo }[] = [
  { time: "7:02 AM", place: "Edmond", title: "No cool, newborn at home", body: "Failed capacitor. Replaced from the truck. Cold air by 7:48.", photo: img.techCondenserGauges },
  { time: "9:30 AM", place: "Nichols Hills", title: "Spring tune-up", body: "21 points, coil rinse, drain flush. Photo report in the owner's inbox by 10:15.", photo: img.techManifoldHands },
  { time: "12:15 PM", place: "Moore", title: "New heat pump, day one", body: "Old R-22 system out, 17 SEER2 dual-fuel in. Crew of three, floors covered.", photo: img.unitHeatPumpModern },
  { time: "3:40 PM", place: "Norman", title: "Upstairs 9° too warm", body: "Crushed flex duct in the attic. Re-hung, sealed, balanced. Upstairs within 2°.", photo: img.ductFlex },
  { time: "6:55 PM", place: "Yukon", title: "Mini-split for the shop", body: "One head, line-hide covers, app set up before dinner.", photo: img.minisplitInterior },
  { time: "11:48 PM", place: "Midtown OKC", title: "After-hours call", body: "Tripped float switch, clogged drain. Same price as noon. Back to sleep by 12:30.", photo: img.okcMemorialDusk },
];
