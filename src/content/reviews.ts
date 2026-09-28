export type Review = {
  name: string;
  area: string;
  date: string; // ISO
  rating: number;
  job: string;
  text: string;
};

/** Fictional reviews for a fictional company — realistic, specific, first name + last initial. */
export const reviews: Review[] = [
  {
    name: "Brianna T.",
    area: "Edmond",
    date: "2026-07-19",
    rating: 5,
    job: "AC repair",
    text: "AC quit at 4 pm on a 103° Saturday with a newborn in the house. Marcus was in our driveway by 5:10, found a failed capacitor and had it blowing cold in 25 minutes. Same price they quoted on the phone. Lifelong customers.",
  },
  {
    name: "Luis G.",
    area: "South OKC",
    date: "2026-06-30",
    rating: 5,
    job: "AC installation",
    text: "Three companies quoted us. Dryline was the only one that measured every room and looked in the attic. The new system is so quiet we had to go outside to check it was running. Upstairs finally matches downstairs.",
  },
  {
    name: "Karen W.",
    area: "Norman",
    date: "2026-01-14",
    rating: 5,
    job: "Furnace repair",
    text: "Furnace died at 2 a.m. during that ice storm. A real person answered, a tech showed up before 4, and they did NOT charge overtime. The flame sensor was replaced and he checked our CO levels too.",
  },
  {
    name: "Darnell M.",
    area: "Moore",
    date: "2026-05-22",
    rating: 5,
    job: "Heat pump",
    text: "Switched from all-electric strips to a dual-fuel heat pump. Our January bill went from $412 to $186. Jess walked us through every option and never pushed the most expensive one.",
  },
  {
    name: "Priya S.",
    area: "Nichols Hills",
    date: "2026-08-08",
    rating: 5,
    job: "Mini-split",
    text: "The bonus room over our garage was unusable from June to September. One mini-split later it's the coolest room in the house. The line-set covers look clean and they matched the paint.",
  },
  {
    name: "Tom H.",
    area: "Yukon",
    date: "2025-12-03",
    rating: 5,
    job: "Comfort Club tune-up",
    text: "Been in the Comfort Club for three years. They text before tune-ups, show up on time, send photos of everything, and when our blower motor went out in December we were first on the list and got 15% off.",
  },
  {
    name: "Alyssa R.",
    area: "Mustang",
    date: "2026-04-11",
    rating: 5,
    job: "Duct cleaning",
    text: "They showed us camera footage of our ducts before and after. I did not need to see what was in there, but I'm glad it's gone. My daughter's allergies are noticeably better.",
  },
  {
    name: "Greg P.",
    area: "Midtown OKC",
    date: "2026-07-02",
    rating: 5,
    job: "AC repair",
    text: "Honest. The other guys told me I needed a whole new unit. Dryline found a $190 contactor and said the system had years left. That's how you earn a customer.",
  },
  {
    name: "Maria C.",
    area: "Edmond",
    date: "2026-02-20",
    rating: 5,
    job: "Furnace installation",
    text: "Our 1998 furnace finally gave up. New 96% furnace installed in one day, floors covered, old unit hauled off, and our gas bill dropped by a third. Financing was simple.",
  },
  {
    name: "Jordan K.",
    area: "The Village",
    date: "2026-06-14",
    rating: 4,
    job: "Smart thermostat",
    text: "Great install and they ran a C-wire without a fuss. Took a second visit to get the heat pump staging perfect, but they came back the next morning at no charge.",
  },
  {
    name: "Sam O.",
    area: "Moore",
    date: "2026-08-25",
    rating: 5,
    job: "AC repair",
    text: "Fan motor went out on a Sunday. $0 overtime, fixed in an hour, tech wore boot covers and explained everything. Booked online in two minutes.",
  },
  {
    name: "Hannah B.",
    area: "Norman",
    date: "2026-03-09",
    rating: 5,
    job: "Indoor air quality",
    text: "Cedar season is brutal in our house. They tested the air, recommended a media filter and a UV light — not the $2,000 purifier I expected them to push. Big difference.",
  },
];

export const ratingBreakdown = [
  { stars: 5, pct: 92 },
  { stars: 4, pct: 6 },
  { stars: 3, pct: 1 },
  { stars: 2, pct: 0.5 },
  { stars: 1, pct: 0.5 },
];
