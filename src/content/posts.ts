import { img, type Photo } from "@/lib/images";

export type Block =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "h3"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "quote"; text: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  season: "Summer" | "Winter" | "Spring";
  published: string;
  readMins: number;
  photo: Photo;
  keywords: string[];
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "surviving-an-oklahoma-july",
    title: "The 104° playbook: keeping your AC alive through an Oklahoma July",
    excerpt: "Seven things our technicians do at home when the heat dome parks over the metro — and the three mistakes that kill air conditioners in August.",
    season: "Summer",
    published: "2026-06-18",
    readMins: 6,
    photo: img.summerFan,
    keywords: ["AC tips Oklahoma summer", "keep AC running heat wave", "AC not keeping up 100 degrees"],
    body: [
      {
        t: "p",
        text: "Most residential air conditioners in Oklahoma City are designed to hold about a 20-degree difference between outside and inside. When it's 104° on the porch, that means a perfectly healthy system may only manage 78–80° indoors in the late afternoon. That's not a failure — it's physics. But a tired or dirty system will do much worse, and that's where heat-wave breakdowns come from.",
      },
      { t: "h2", text: "1. Change the filter before the first 100° day" },
      {
        t: "p",
        text: "A clogged filter starves the indoor coil of airflow. The coil gets too cold, freezes into a block of ice, and suddenly nothing comes out of the vents. It's the single most common no-cool call we run in July, and it costs about $8 to prevent.",
      },
      { t: "h2", text: "2. Hose off the outdoor unit (gently)" },
      {
        t: "p",
        text: "Cottonwood fluff, grass clippings and red dirt pack into the condenser coil all spring. With the power off at the disconnect, rinse the coil from the inside out with a garden hose — no pressure washer. A clean coil can drop head pressure enough to keep a marginal compressor alive through August.",
      },
      { t: "h2", text: "3. Don't crank it to 65°" },
      {
        t: "p",
        text: "Setting the thermostat lower doesn't cool the house faster; it just makes the system run longer and increases the chance of a frozen coil. Pick a steady setting — 74–76° is realistic on a 104° day — and let it run.",
      },
      { t: "h2", text: "4. Pre-cool in the morning" },
      {
        t: "p",
        text: "Drop the house two or three degrees before noon while the system has headroom, then let it drift up slightly in the late afternoon. A smart thermostat can do this automatically.",
      },
      { t: "h2", text: "5. Close the blinds on the west side" },
      {
        t: "p",
        text: "West-facing glass can add thousands of BTUs of heat after 3 p.m. Blinds, solar screens or even a closed door on the hottest room make a measurable difference.",
      },
      { t: "h2", text: "6. Watch the drain line" },
      {
        t: "p",
        text: "In humid weeks an AC can pull several gallons of water out of the air a day. If the condensate line clogs, a safety switch shuts the system down — or water ends up in your ceiling. A cup of white vinegar in the drain access every month keeps algae down.",
      },
      { t: "h2", text: "7. Listen for the warning signs" },
      {
        t: "ul",
        items: [
          "A humming outdoor unit with a fan that won't start (usually a capacitor)",
          "Clicking or chattering at start-up",
          "Ice on the copper line at the outdoor unit",
          "A system that runs all night and never shuts off",
        ],
      },
      {
        t: "quote",
        text: "Most mid-summer breakdowns started as a spring problem nobody noticed. A tune-up in April is the cheapest AC repair you'll ever buy.",
      },
      { t: "h2", text: "The three mistakes that kill air conditioners" },
      {
        t: "p",
        text: "Covering the outdoor unit with a tarp during the season, stacking patio furniture against it, and repeatedly resetting a tripped breaker. That breaker is trying to tell you something — call us before the compressor pays the price.",
      },
    ],
  },
  {
    slug: "before-the-first-freeze",
    title: "Before the first freeze: a 15-minute furnace check anyone can do",
    excerpt: "The first blue norther of the season is when furnaces that sat idle for eight months find out they're not okay. Here's how to find out first.",
    season: "Winter",
    published: "2025-10-21",
    readMins: 5,
    photo: img.winterHouseNight,
    keywords: ["furnace check before winter", "furnace not working first cold day", "furnace safety Oklahoma"],
    body: [
      {
        t: "p",
        text: "Every year, the first night the temperature drops below 35°, our phones light up. Furnaces that sat untouched since March try to fire, and weak igniters, dirty flame sensors and dead batteries in thermostats all reveal themselves at once. You can catch most of it on a mild October afternoon.",
      },
      { t: "h2", text: "Step 1: Test the thermostat" },
      {
        t: "p",
        text: "Switch it to Heat and raise the setting five degrees above room temperature. You should hear the inducer motor within a minute, then ignition, then the blower. If the screen is blank or nothing happens, start with fresh batteries.",
      },
      { t: "h2", text: "Step 2: Replace the filter" },
      {
        t: "p",
        text: "A restricted filter makes a furnace overheat and shut itself down on the high-limit switch. It's the most common cause of 'it runs for a few minutes then stops'.",
      },
      { t: "h2", text: "Step 3: Expect the dusty smell — briefly" },
      {
        t: "p",
        text: "A faint burnt-dust smell on the first run is normal and should fade within an hour. A sharp electrical smell, or the rotten-egg odor of gas, is not. Shut the system off and call us.",
      },
      { t: "h2", text: "Step 4: Check your carbon monoxide alarms" },
      {
        t: "p",
        text: "Press the test button on every CO detector, and replace any unit older than seven years. A cracked heat exchanger can leak carbon monoxide without any other symptom.",
      },
      { t: "h2", text: "Step 5: Clear the area around the furnace" },
      {
        t: "ul",
        items: [
          "Keep at least 30 inches clear around the furnace and water heater",
          "Move paint, cleaners and anything flammable out of the closet",
          "Make sure the combustion air vents aren't blocked by boxes",
        ],
      },
      {
        t: "quote",
        text: "If the flame looks yellow and lazy instead of crisp and blue, don't wait. That's a combustion problem, and it's worth a professional look.",
      },
      { t: "h2", text: "When to call" },
      {
        t: "p",
        text: "If the furnace clicks without lighting, lights and shuts off repeatedly, or blows cold air, book a visit before the cold front arrives. Comfort Club members get their fall tune-up scheduled automatically — and skip the line when the first freeze hits.",
      },
    ],
  },
  {
    slug: "hail-cottonwood-and-your-condenser",
    title: "Hail, cottonwood and your condenser: spring storm season in OKC",
    excerpt: "What an Oklahoma spring does to the metal box in your backyard, how to check it after a storm, and when hail damage is an insurance claim.",
    season: "Spring",
    published: "2026-04-02",
    readMins: 5,
    photo: img.stormSupercell,
    keywords: ["hail damage AC unit Oklahoma", "cottonwood AC condenser", "storm damage HVAC OKC"],
    body: [
      {
        t: "p",
        text: "Central Oklahoma averages more hail days than almost anywhere in the country, and your outdoor unit sits in the open for every one of them. Add a month of cottonwood fluff in May and you have the two biggest threats to spring-time airflow.",
      },
      { t: "h2", text: "What hail does to a condenser" },
      {
        t: "p",
        text: "The thin aluminum fins around the coil fold over easily. A few bent fins are cosmetic; a coil that looks like crushed foil can't release heat, and the system will run hot, lose capacity and work the compressor harder all summer.",
      },
      { t: "h3", text: "After a storm, look for:" },
      {
        t: "ul",
        items: [
          "Dents in the top panel or fan guard",
          "Flattened fins covering large areas of the coil",
          "Debris lodged in the fan blades",
          "Refrigerant lines knocked loose or insulation torn",
        ],
      },
      { t: "h2", text: "Is it an insurance claim?" },
      {
        t: "p",
        text: "Often, yes. Most homeowner policies cover hail damage to HVAC equipment. We document damage with photos and a written assessment that adjusters accept, and we'll give you honest advice on whether combing the fins is enough or the coil needs to be replaced.",
      },
      { t: "h2", text: "Cottonwood season" },
      {
        t: "p",
        text: "Cottonwood fluff forms a felt-like mat on the outside of the coil. From outside it can look clean while airflow drops by a third. With the power off, rinse from the inside out — or have it cleaned during your spring tune-up.",
      },
      {
        t: "quote",
        text: "Never run the AC with the fan blades obstructed or the top panel crushed. A five-minute look after every big storm can save a compressor.",
      },
      { t: "h2", text: "Power surges and outages" },
      {
        t: "p",
        text: "Storm outages and surges take out capacitors, contactors and control boards. A whole-home surge protector for your HVAC equipment costs less than a single control board replacement.",
      },
    ],
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
