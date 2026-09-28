export type Plan = {
  id: string;
  name: string;
  blurb: string;
  monthly: number;
  yearly: number;
  featured?: boolean;
  rows: { label: string; value: string }[];
  extras: string[];
};

export const plans: Plan[] = [
  {
    id: "essential",
    name: "Essential",
    blurb: "One tune-up a year and a little insurance for the hottest week.",
    monthly: 14.95,
    yearly: 159,
    rows: [
      { label: "Tune-ups per year", value: "1" },
      { label: "Priority service", value: "Next-day" },
      { label: "Off repairs", value: "10%" },
      { label: "Overtime fees", value: "Never" },
    ],
    extras: ["$0 diagnostic fee", "Photo report after every visit"],
  },
  {
    id: "plus",
    name: "Plus",
    blurb: "Spring AC and fall furnace tune-ups — the Oklahoma standard.",
    monthly: 22.95,
    yearly: 249,
    featured: true,
    rows: [
      { label: "Tune-ups per year", value: "2" },
      { label: "Priority service", value: "Same-day" },
      { label: "Off repairs", value: "15%" },
      { label: "Overtime fees", value: "Never" },
    ],
    extras: ["$0 diagnostic fee", "2 filter deliveries a year", "Extended 2-year repair warranty"],
  },
  {
    id: "total",
    name: "Total Comfort",
    blurb: "Front of the line, every time, plus your indoor air handled.",
    monthly: 34.95,
    yearly: 379,
    rows: [
      { label: "Tune-ups per year", value: "2 + IAQ check" },
      { label: "Priority service", value: "2-hour window" },
      { label: "Off repairs", value: "20%" },
      { label: "Overtime fees", value: "Never" },
    ],
    extras: ["$0 diagnostic fee", "4 filter deliveries a year", "Annual duct camera check", "10% off a second system"],
  },
];
