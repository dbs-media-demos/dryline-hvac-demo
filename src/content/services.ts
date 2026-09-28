import { img, type Photo } from "@/lib/images";

export type ServiceKind = "cool" | "heat" | "air";

export type Service = {
  slug: string;
  name: string;
  short: string;
  kind: ServiceKind;
  /** Headline shown on the detail page. */
  headline: string;
  intro: string;
  price: string;
  priceNote: string;
  photo: Photo;
  gallery: Photo[];
  signs: string[];
  included: string[];
  steps: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  keywords: string[];
};

export const services: Service[] = [
  {
    slug: "ac-repair",
    name: "AC Repair",
    short: "Same-day diagnosis and repair for every make, most fixed on the first visit.",
    kind: "cool",
    headline: "AC out in a 104° week? We'll be there today.",
    intro:
      "Oklahoma summers find every weak capacitor and tired fan motor in the metro. Our trucks carry the parts that fail most, so 8 in 10 AC repairs are finished on the first visit — at a flat price you approve before we pick up a tool.",
    price: "$89 diagnostic",
    priceNote: "Waived when you approve the repair. Most repairs land between $165 and $650.",
    photo: img.techCondenserGauges,
    gallery: [img.techManifoldHands, img.unitTealWall, img.summerFan],
    signs: [
      "Air from the vents is warm or barely cool",
      "The outdoor unit hums but the fan won't spin",
      "Ice on the copper lines or indoor coil",
      "Breaker trips when the AC kicks on",
      "Water pooling around the indoor unit",
      "Your bill jumped but the house feels warmer",
    ],
    included: [
      "Full-system diagnostic with refrigerant pressures and electrical readings",
      "Written flat-rate options before any work starts",
      "Common parts on the truck: capacitors, contactors, fan motors, relays",
      "Condensate drain flush with every repair visit",
      "1-year parts & labor warranty on every repair",
    ],
    steps: [
      { title: "Call or book online", body: "Tell us what the system is doing. We'll give you an arrival window, usually same day." },
      { title: "We diagnose it", body: "A NATE-certified tech tests the whole system — not just the first thing that looks wrong." },
      { title: "You pick the fix", body: "Flat-rate options on a tablet. No hourly meter, no surprise line items." },
      { title: "Cool again", body: "Most repairs are done in under two hours. We clean up and walk you through what we did." },
    ],
    faqs: [
      {
        q: "How fast can you get here?",
        a: "Most calls placed before 2 pm get a same-day visit. Our average arrival on emergency no-cool calls last summer was 38 minutes inside the OKC metro.",
      },
      {
        q: "Do you work on all brands?",
        a: "Yes — Trane, Carrier, Lennox, Goodman, Rheem, American Standard, Amana, Daikin and more, including older units that other companies won't touch.",
      },
      {
        q: "Is it worth repairing an AC that's over 12 years old?",
        a: "Sometimes. If the repair is small, fix it. If it's a compressor or coil on an R-22 system, it usually isn't. Our repair-or-replace calculator gives you an honest starting point.",
      },
    ],
    keywords: ["AC repair Oklahoma City", "air conditioner repair OKC", "emergency AC repair Edmond"],
  },
  {
    slug: "ac-installation",
    name: "AC Installation",
    short: "High-efficiency systems sized to your house, installed in a day, backed for ten years.",
    kind: "cool",
    headline: "A new AC, sized for your house — not the last one.",
    intro:
      "Most OKC homes have an AC that was sized by guesswork. We run a room-by-room Manual J load calculation, check your ductwork, and install a system that cools evenly and quietly for 15+ years.",
    price: "From $5,800",
    priceNote: "Complete 14.3 SEER2 systems installed. High-efficiency and variable-speed options up to about $11,500. Financing from $89/mo.",
    photo: img.techCondenserSiding,
    gallery: [img.unitMinimalWhite, img.techPanel, img.unitBlueSky],
    signs: [
      "Your system is 12–15+ years old",
      "It still uses R-22 refrigerant",
      "Upstairs is 6°+ warmer than downstairs",
      "Repairs have cost more than $1,500 in two years",
      "It runs all afternoon and never catches up",
    ],
    included: [
      "Manual J load calculation and duct inspection",
      "New condenser, matched indoor coil and line set",
      "New pad, disconnect, whip and thermostat wiring",
      "Permit, city inspection and haul-away of the old system",
      "10-year parts & labor warranty, registered for you",
      "First-year Comfort Club membership included",
    ],
    steps: [
      { title: "Free in-home estimate", body: "We measure, inspect the ducts and give you 2–3 options on the spot — good, better, best." },
      { title: "Pick a system", body: "Transparent pricing, rebates and financing laid out side by side. No pressure." },
      { title: "Install day", body: "A lead installer and a crew of two. Most installs finish the same day, floors covered." },
      { title: "Commissioning", body: "We verify charge, airflow and temperature split, then register your warranty." },
    ],
    faqs: [
      { q: "How long does an install take?", a: "Most straight AC replacements are done in one day. Full system changes with new ductwork can take two." },
      { q: "Are there rebates?", a: "Energy-efficiency rebates and federal tax credits may be available on qualifying high-efficiency systems. We'll check what applies to your home." },
      { q: "What's SEER2?", a: "The current efficiency rating for AC and heat pumps. Higher SEER2 = less electricity per unit of cooling. In Oklahoma, 15–17 SEER2 is the sweet spot for most homes." },
    ],
    keywords: ["AC installation Oklahoma City", "new air conditioner cost OKC", "AC replacement Norman"],
  },
  {
    slug: "furnace-repair",
    name: "Furnace Repair",
    short: "No heat at 6 a.m. in January? Night and weekend calls at the same flat rate.",
    kind: "heat",
    headline: "No heat? We answer at 3 a.m. — at the daytime price.",
    intro:
      "When a blue norther drops the temperature 40 degrees overnight, a furnace that coasted all fall suddenly quits. We fix gas furnaces, electric air handlers and heat strips of every brand — and we never charge overtime.",
    price: "$89 diagnostic",
    priceNote: "Waived with repair. Common repairs like igniters and flame sensors run $119–$295.",
    photo: img.techFurnaceHands,
    gallery: [img.heatCoil, img.winterHouseNight, img.winterMug],
    signs: [
      "Furnace runs but blows cold air",
      "Clicking with no flame, or flame that won't stay lit",
      "Burning or electrical smell that doesn't fade",
      "Short cycles every few minutes",
      "Yellow or flickering burner flame",
      "Carbon monoxide alarm sounded (leave the house, then call us)",
    ],
    included: [
      "Combustion and safety check with every visit",
      "Carbon monoxide test at the flue and in the living space",
      "Igniters, flame sensors, pressure switches and inducers on the truck",
      "Flat pricing nights, weekends and holidays",
      "1-year parts & labor warranty on repairs",
    ],
    steps: [
      { title: "Call anytime", body: "A real dispatcher answers 24/7 — not a voicemail tree." },
      { title: "Safety first", body: "We check for gas leaks and CO before anything else." },
      { title: "Flat-rate fix", body: "You approve the price before work begins. No overtime, ever." },
      { title: "Warm again", body: "We test a full heating cycle before we leave." },
    ],
    faqs: [
      { q: "Do you charge more at night or on weekends?", a: "No. Same flat rates 24/7/365. Comfort Club members also skip the diagnostic fee." },
      { q: "My furnace smells like burning dust — is that normal?", a: "A light dusty smell on the first cold day is normal and fades in an hour. An electrical or rotten-egg smell is not — turn it off and call us." },
      { q: "Can you fix my heat pump's emergency heat?", a: "Yes. Heat strips, sequencers and defrost controls are part of our standard heating repairs." },
    ],
    keywords: ["furnace repair Oklahoma City", "no heat emergency OKC", "heating repair Moore"],
  },
  {
    slug: "furnace-installation",
    name: "Furnace Installation",
    short: "Efficient gas furnaces and air handlers with quiet, variable-speed blowers.",
    kind: "heat",
    headline: "Quiet, even heat for the next twenty winters.",
    intro:
      "A modern 96% furnace turns almost every dollar of gas into heat — and a variable-speed blower moves it gently, so rooms stop swinging between chilly and stuffy. We size it properly and install it clean.",
    price: "From $3,900",
    priceNote: "80% furnaces installed. 96%+ high-efficiency and two-stage models to about $7,800. Financing available.",
    photo: img.techHeatingSystem,
    gallery: [img.homeFireplace, img.winterCabin, img.techFurnaceHands],
    signs: [
      "Furnace is 15–20+ years old",
      "Rising gas bills every winter",
      "Rooms that never warm up",
      "Cracked heat exchanger found on inspection",
      "Frequent ignition problems",
    ],
    included: [
      "Heat-load calculation and venting inspection",
      "New furnace, filter rack, gas connector and venting as needed",
      "Permit, inspection and removal of the old unit",
      "Combustion analysis at start-up",
      "10-year parts & labor warranty",
    ],
    steps: [
      { title: "Free estimate", body: "We look at venting, gas line, ducts and the rooms that give you trouble." },
      { title: "Choose your comfort level", body: "Single-stage, two-stage or modulating — explained in plain English." },
      { title: "One-day install", body: "Most furnace swaps are done before dinner." },
      { title: "Tune & register", body: "Combustion tested, thermostat set up, warranty filed in your name." },
    ],
    faqs: [
      { q: "Should I replace the furnace and AC together?", a: "If both are 12+ years old, usually yes — matched systems run more efficiently and you pay for one install instead of two." },
      { q: "Gas furnace or heat pump?", a: "In central Oklahoma, a heat pump with a gas furnace backup (dual fuel) is often the lowest-cost option to run. We'll model both." },
    ],
    keywords: ["furnace installation Oklahoma City", "new furnace cost OKC", "gas furnace replacement Edmond"],
  },
  {
    slug: "heat-pumps",
    name: "Heat Pumps",
    short: "One system that cools all summer and heats most of the winter — for less.",
    kind: "air",
    headline: "Cooling and heating from one quiet box.",
    intro:
      "A modern cold-climate heat pump moves heat instead of making it — so it can heat your home at a fraction of the cost of electric strips, then run in reverse to cool it in July. Pair it with a gas furnace and you get the best of both.",
    price: "From $7,200",
    priceNote: "Complete heat pump systems. Dual-fuel and variable-speed options to about $14,500. Rebates may be available.",
    photo: img.unitHeatPumpModern,
    gallery: [img.unitHeatPumpGarden, img.unitGrate, img.homeBright],
    signs: [
      "You're on all-electric heat with high winter bills",
      "Your AC and furnace are both due for replacement",
      "You want to cut gas use or add solar later",
      "Your existing heat pump struggles below 30°F",
    ],
    included: [
      "Heat-loss and heat-gain calculation",
      "Cold-climate or dual-fuel system options",
      "Smart thermostat configured for heat pump staging",
      "Rebate and tax-credit paperwork help",
      "10-year parts & labor warranty",
    ],
    steps: [
      { title: "Energy check", body: "We look at your current bills and model what a heat pump would cost to run." },
      { title: "Right-size it", body: "Load calculation and duct check — heat pumps are sensitive to sizing." },
      { title: "Install", body: "One to two days depending on dual-fuel and electrical work." },
      { title: "Dial it in", body: "Balance points and staging set for Oklahoma winters." },
    ],
    faqs: [
      { q: "Do heat pumps work in Oklahoma winters?", a: "Yes. Modern variable-speed heat pumps heat efficiently well below freezing, and a dual-fuel setup switches to gas on the coldest nights." },
      { q: "Will it save me money?", a: "Compared with electric strip heat, usually a lot. Compared with gas, it depends on rates — we'll show you the numbers for your home." },
    ],
    keywords: ["heat pump installation Oklahoma City", "dual fuel heat pump OKC", "heat pump repair Norman"],
  },
  {
    slug: "ductless-mini-splits",
    name: "Ductless Mini-Splits",
    short: "Perfect for garages, additions, sunrooms and that one room that's always hot.",
    kind: "air",
    headline: "Fix the room your central system forgot.",
    intro:
      "Bonus rooms over the garage. Converted sunporches. Shops and studios. A ductless mini-split heats and cools one space precisely, with no ductwork to run and an indoor head quieter than a library.",
    price: "From $3,800",
    priceNote: "Single-zone systems installed. Multi-zone systems from about $8,000.",
    photo: img.minisplitInterior,
    gallery: [img.minisplit22, img.unitBlueSky, img.homeAiry],
    signs: [
      "A room that's always 5–10° off",
      "New addition, garage or shop with no ductwork",
      "Window units you're tired of",
      "Older home with no room for ducts",
    ],
    included: [
      "Placement plan for the indoor head(s) and line-set route",
      "Inverter heat pump outdoor unit",
      "Line-hide covers for a clean exterior look",
      "Wi-Fi control setup",
      "10-year parts & labor warranty",
    ],
    steps: [
      { title: "Walk the space", body: "We pick head placement for even air — and for how the room looks." },
      { title: "Quote", body: "Flat price for the full install, including electrical." },
      { title: "Install", body: "Most single-zone installs take one day." },
      { title: "App setup", body: "We connect it to your phone before we go." },
    ],
    faqs: [
      { q: "Do mini-splits heat too?", a: "Yes — they're heat pumps. They heat efficiently through most Oklahoma winters." },
      { q: "Are they loud?", a: "Indoor heads run as quiet as 19–25 dB. You'll mostly notice the silence." },
    ],
    keywords: ["mini split installation Oklahoma City", "ductless AC OKC", "garage mini split Edmond"],
  },
  {
    slug: "indoor-air-quality",
    name: "Indoor Air Quality",
    short: "Cedar, cottonwood, wheat dust and wildfire smoke — filtered out.",
    kind: "air",
    headline: "Oklahoma air, minus the Oklahoma in it.",
    intro:
      "Mountain cedar in winter, cottonwood in spring, red dirt all year. Whole-home filtration, UV and humidity control clean the air in every room your system reaches — without a single plug-in purifier.",
    price: "From $650",
    priceNote: "UV and media filters from $650. Whole-home air purifiers and humidifiers $750–$2,400.",
    photo: img.humidifierMist,
    gallery: [img.techVentGrille, img.familyFloor, img.ductSupply],
    signs: [
      "Allergies that are worse indoors",
      "Dust returns a day after you clean",
      "Static shocks and dry skin in winter",
      "Musty smell when the AC starts",
    ],
    included: [
      "Indoor air test: particles, humidity, VOCs",
      "Options from media filters to whole-home purifiers",
      "UV lights for coil and air sanitation",
      "Whole-home humidifiers and dehumidifiers",
      "Filter reminders and delivery with Comfort Club",
    ],
    steps: [
      { title: "Test the air", body: "A 20-minute reading shows what's actually in your home's air." },
      { title: "Recommend", body: "Only what fixes your problem — sometimes that's just a better filter." },
      { title: "Install", body: "Most IAQ add-ons install in two to four hours." },
      { title: "Maintain", body: "Filters and bulbs on a schedule so it keeps working." },
    ],
    faqs: [
      { q: "Do I need a whole-home purifier?", a: "Not always. For many homes, a 4–5 inch MERV 11–13 media filter does most of the work. We'll tell you honestly." },
    ],
    keywords: ["indoor air quality Oklahoma City", "whole home air purifier OKC", "humidifier installation Edmond"],
  },
  {
    slug: "duct-cleaning",
    name: "Duct Cleaning & Sealing",
    short: "Negative-pressure cleaning and sealing that actually changes how your house feels.",
    kind: "air",
    headline: "Up to 30% of your air is escaping. We'll bring it back.",
    intro:
      "Leaky, dirty ducts waste the air you pay to cool and heat — often into a 130° attic. We clean with truck-mounted negative-pressure equipment, then seal the joints so more air reaches the rooms that need it.",
    price: "$399 – $799",
    priceNote: "Whole-home duct cleaning depending on size. Duct sealing from $1,200.",
    photo: img.techVentGrille,
    gallery: [img.ductFlex, img.ductSupply, img.homeStairs],
    signs: [
      "Visible dust around supply registers",
      "Rooms with weak airflow",
      "After a remodel or new flooring",
      "Rodent or pest activity in the attic",
    ],
    included: [
      "Before-and-after camera inspection",
      "Negative-pressure cleaning of supply and return trunks",
      "Register and grille cleaning",
      "Duct leakage test and sealing options",
    ],
    steps: [
      { title: "Camera inspection", body: "We show you what's in there before recommending anything." },
      { title: "Clean", body: "Negative pressure pulls debris out, not into your home." },
      { title: "Seal", body: "Mastic and aerosol sealing on leaky joints." },
      { title: "Prove it", body: "After photos and airflow readings." },
    ],
    faqs: [{ q: "How often should ducts be cleaned?", a: "Every 5–7 years for most homes, sooner after construction, pets, or pest problems." }],
    keywords: ["duct cleaning Oklahoma City", "duct sealing OKC", "air duct cleaning Norman"],
  },
  {
    slug: "smart-thermostats",
    name: "Smart Thermostats",
    short: "Installed, wired right and programmed for Oklahoma's 40-degree swings.",
    kind: "air",
    headline: "The smallest upgrade with the fastest payback.",
    intro:
      "A smart thermostat that's wired and configured properly — with the right staging, humidity settings and schedules — can trim 8–12% off heating and cooling costs. We install Ecobee, Nest, Honeywell and more.",
    price: "$249 – $549",
    priceNote: "Installed, including the thermostat. Common-wire (C-wire) runs included.",
    photo: img.thermostatSmartHand,
    gallery: [img.thermostatNest, img.thermostatManHome, img.homeBright],
    signs: [
      "An old dial or mercury thermostat",
      "Heat pump using emergency heat too often",
      "You want to control it from your phone",
      "Different schedules for weekdays and weekends",
    ],
    included: ["Compatibility check", "C-wire run if needed", "Staging and heat pump setup", "App and schedule setup with you"],
    steps: [
      { title: "Choose", body: "We recommend models that fit your system and budget." },
      { title: "Install", body: "About an hour, including wiring and setup." },
      { title: "Program", body: "Schedules, away modes and alerts set up with you." },
      { title: "Save", body: "Monthly energy reports right in the app." },
    ],
    faqs: [{ q: "Will a smart thermostat work with my system?", a: "Almost always — we check compatibility first and add a C-wire if needed." }],
    keywords: ["smart thermostat installation OKC", "ecobee installer Oklahoma City", "Nest thermostat install Edmond"],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

export const kindLabel: Record<ServiceKind, string> = { cool: "Cooling", heat: "Heating", air: "Air & comfort" };
