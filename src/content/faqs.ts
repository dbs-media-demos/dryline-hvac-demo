export type Faq = { q: string; a: string; topic: "Service" | "Pricing" | "Systems" | "Comfort Club" };

export const faqs: Faq[] = [
  {
    topic: "Service",
    q: "Do you really offer same-day service?",
    a: "Yes. Calls booked before 2 pm almost always get a same-day visit, and emergency no-cool or no-heat calls are dispatched around the clock. Last summer our average emergency arrival inside the metro was 38 minutes.",
  },
  {
    topic: "Service",
    q: "Which areas do you serve?",
    a: "Oklahoma City and the surrounding metro: Edmond, Norman, Moore, Yukon, Mustang, Nichols Hills, The Village, Warr Acres, Bethany, Midwest City and Del City.",
  },
  {
    topic: "Pricing",
    q: "How does flat-rate pricing work?",
    a: "After the diagnostic, you get a written price for each repair option before any work starts. The price is the price — it doesn't change if the job takes longer, and it's the same at 2 p.m. or 2 a.m.",
  },
  {
    topic: "Pricing",
    q: "Do you charge extra for nights, weekends or holidays?",
    a: "No. Dryline never charges overtime. Comfort Club members also pay $0 for the diagnostic.",
  },
  {
    topic: "Pricing",
    q: "Do you offer financing?",
    a: "Yes — on approved credit, with options including 0% APR for 18 months and low monthly payments for up to 10 years on new systems. See the Financing page for details.",
  },
  {
    topic: "Systems",
    q: "How long should an AC or furnace last in Oklahoma?",
    a: "Air conditioners and heat pumps typically last 12–15 years here (our summers are hard on them). Gas furnaces often last 18–20 years. Regular tune-ups add years to both.",
  },
  {
    topic: "Systems",
    q: "Should I repair or replace my system?",
    a: "A good rule of thumb: multiply the system's age by the repair cost. If it's over $5,000, replacement usually makes more sense. Our repair-or-replace calculator walks through it with your numbers.",
  },
  {
    topic: "Systems",
    q: "Are there rebates for high-efficiency equipment?",
    a: "Energy-efficiency rebates and federal tax credits may be available for qualifying heat pumps, AC systems, furnaces and smart thermostats. We check current programs for every quote.",
  },
  {
    topic: "Systems",
    q: "How often should I change my filter?",
    a: "1-inch filters every 1–2 months in summer and winter; 4–5 inch media filters every 6–12 months. Homes with pets or allergies should go sooner.",
  },
  {
    topic: "Comfort Club",
    q: "What's included in a Comfort Club tune-up?",
    a: "A 21-point inspection: refrigerant pressures, electrical connections, capacitor readings, coil and drain cleaning, burner and flame-sensor service, CO test, airflow and thermostat check — with photos of everything.",
  },
  {
    topic: "Comfort Club",
    q: "Can I cancel the Comfort Club?",
    a: "Anytime. Monthly plans cancel with no fee; annual plans are prorated after your first tune-up.",
  },
  {
    topic: "Service",
    q: "Are your technicians certified?",
    a: "Every Dryline technician is EPA 608 certified, background-checked and drug-tested, and most are NATE-certified. We're licensed with the Oklahoma CIB and fully insured.",
  },
];
