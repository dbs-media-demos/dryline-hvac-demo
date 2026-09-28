/**
 * Photo registry. Every image lives in /public/images (credits in public/images/SOURCES.md).
 * `color` is the average colour, used as the placeholder background while the photo loads.
 */

export type Photo = { src: string; width: number; height: number; color: string; alt: string };

const p = (name: string, width: number, height: number, color: string, alt: string): Photo => ({
  src: `/images/${name}.jpg`,
  width,
  height,
  color,
  alt,
});

export const img = {
  heroFrost: p("hero-frost", 2400, 3200, "#6e7c81", "Frost crystals spreading across a cold window pane"),
  heroFlame: p("hero-flame", 2400, 3598, "#88410c", "Close-up of warm orange flames"),

  okcDevonDusk: p("okc-devon-dusk", 2000, 2666, "#8f7770", "Devon Tower and the downtown Oklahoma City skyline at sunset"),
  okcSkylineDay: p("okc-skyline-day", 2000, 1500, "#6c797f", "Downtown Oklahoma City towers under a clear blue sky"),
  okcHighway: p("okc-highway", 2000, 1125, "#7e8f8f", "Highways curving into downtown Oklahoma City"),
  okcAerialSunset: p("okc-aerial-sunset", 2400, 1797, "#393e47", "Aerial view of the Oklahoma City metro and interchanges at dusk"),
  okcReflection: p("okc-reflection", 2000, 1333, "#9d9098", "Oklahoma City skyline reflected in still water at golden hour"),
  okcMemorialDusk: p("okc-memorial-dusk", 2000, 1336, "#484240", "Reflecting pool and a downtown tower silhouetted at dusk in Oklahoma City"),
  okcStreetGolden: p("okc-street-golden", 1600, 1069, "#453e41", "Golden-hour light between brick buildings in downtown Oklahoma City"),

  stormSupercell: p("storm-supercell", 2400, 1800, "#3e6d93", "A towering Oklahoma thunderstorm with lightning over the prairie"),
  stormLightning: p("storm-prairie-lightning", 2000, 1500, "#836d70", "Lightning over a golden prairie field under a purple sky"),
  stormRoadFire: p("storm-road-fire-sky", 2400, 1800, "#815137", "A straight Oklahoma road under a fiery orange storm sky"),
  stormFarmhouse: p("storm-farmhouse", 2000, 1500, "#607163", "A white farmhouse under dark storm clouds"),
  stormShelf: p("storm-shelf-cloud", 2000, 1500, "#809092", "A shelf cloud rolling over green Oklahoma fields"),

  techCondenserGauges: p("tech-condenser-gauges", 2000, 1421, "#4e4e4e", "Technician connecting gauges to an outdoor air conditioning condenser"),
  techCondenserSiding: p("tech-condenser-siding", 2000, 1333, "#8c8e93", "Technician inspecting a residential AC condenser beside a white-sided home"),
  techPanel: p("tech-panel-inspection", 1600, 1064, "#9f9a93", "Technician checking a home's electrical panel before an HVAC install"),
  techManifoldHands: p("tech-manifold-hands", 1600, 2288, "#545542", "Hands adjusting a refrigerant manifold gauge set"),
  techManifoldKneel: p("tech-manifold-kneel", 1600, 2432, "#4c5546", "Technician kneeling beside a condenser reading refrigerant pressures"),
  techRooftop: p("tech-rooftop-unit", 1600, 1322, "#434342", "Technician repairing a packaged air conditioning unit"),
  techFurnaceHands: p("tech-furnace-hands", 2000, 1333, "#a39183", "Gloved hands servicing the controls of a heating system"),
  techHeatingSystem: p("tech-heating-system", 2000, 1500, "#888076", "Technician installing a new high-efficiency heating system"),
  techSmiling: p("tech-smiling", 1600, 1067, "#576c82", "Smiling technician in a navy uniform and cap"),
  techVentGrille: p("tech-vent-grille", 2000, 1124, "#aaafb1", "Technician removing a ceiling return-air grille"),

  unitHeatPumpModern: p("unit-heat-pump-modern", 2000, 1333, "#9ea0a3", "A modern heat pump beside a contemporary home"),
  unitHeatPumpGarden: p("unit-heat-pump-garden", 1600, 1067, "#71764e", "Outdoor heat pump unit next to a brick home and garden"),
  unitTealWall: p("unit-teal-wall", 2000, 1125, "#275561", "Outdoor AC condenser against a teal wall in hard afternoon light"),
  unitMinimalWhite: p("unit-minimal-white", 1600, 1200, "#e5e6e7", "Outdoor air conditioning unit against a white wall"),
  unitBlueSky: p("unit-blue-sky", 2000, 1333, "#a9c5d1", "Wall-mounted outdoor AC unit on a white building under a blue sky"),
  unitGrate: p("unit-grate-abstract", 2000, 1333, "#363636", "Close-up of the circular fan grate on an outdoor unit"),
  minisplitInterior: p("minisplit-interior", 2000, 1333, "#babbc0", "Ductless mini-split air handler mounted high on a living room wall"),
  minisplit22: p("minisplit-22", 1600, 1067, "#8a8c8e", "Ductless wall unit displaying a set temperature"),

  thermostatSmartHand: p("thermostat-smart-hand", 2000, 1333, "#ccc6c0", "Hand pressing a smart thermostat on a white wall"),
  thermostatNest: p("thermostat-nest-63", 1600, 1067, "#a8aba9", "Round smart thermostat on a wall"),
  thermostatManHome: p("thermostat-man-home", 1600, 2400, "#a09e9e", "Homeowner adjusting a wall thermostat in a bright hallway"),

  humidifierMist: p("humidifier-mist", 1600, 2400, "#cbc2b5", "Humidifier releasing soft mist in a bright room"),
  ductFlex: p("duct-flex", 1600, 2400, "#35342f", "Close-up of flexible aluminum ductwork"),
  ductSupply: p("duct-supply", 1600, 1067, "#948e81", "Supply air duct running along a ceiling"),
  heatCoil: p("heat-coil-glow", 2000, 1333, "#85553d", "Electric heating element glowing orange"),

  homeFireplace: p("home-fireplace-warm", 2000, 1333, "#a68058", "Warm living room with a fireplace and afternoon light"),
  homeBright: p("home-bright-white", 2000, 2666, "#a1978b", "Bright, airy living room with white sofas and tall windows"),
  homeAiry: p("home-living-airy", 2000, 1125, "#d1cec1", "Calm white living room with natural light"),
  homeStairs: p("home-stairs-fireplace", 1600, 1067, "#8e8574", "Cozy living room with a stone fireplace and staircase"),

  familyFloor: p("family-floor-dog", 2000, 1500, "#8a8270", "Family relaxing on the living room floor with their dog"),
  familyCouch: p("family-couch", 1600, 1067, "#837e72", "Family laughing together on a couch"),
  familyKitchen: p("family-kitchen", 1600, 1067, "#bda694", "Family cooking together in a sunny kitchen"),

  winterHouseNight: p("winter-house-night", 2000, 1334, "#3a2a1b", "A house glowing warm at night behind snowy branches"),
  winterCabin: p("winter-cabin-snow", 1600, 1067, "#40536a", "Snow-covered homes lit up at blue hour"),
  winterMug: p("winter-mug-blanket", 1600, 1143, "#7a7260", "Hands holding a warm mug under a soft blanket"),
  winterWindowTea: p("winter-window-tea", 1600, 1067, "#ad9f91", "A mug on a blanket-draped chair by a bright window"),

  summerFan: p("summer-desk-fan", 2000, 1333, "#8e5f2f", "A metal desk fan in a hot, sun-soaked room"),
  summerSun: p("summer-sun-orange", 1600, 2386, "#e7a441", "A blazing orange summer sky"),
  summerBlinds: p("summer-blinds-shadow", 1600, 2400, "#514730", "Hard afternoon sun casting blind shadows on a wall"),

  cityEdmond: p("city-edmond-street", 2000, 2667, "#767856", "Tree-lined residential sidewalk in a quiet neighborhood"),
  cityNorman: p("city-norman-house", 2000, 1333, "#989f84", "Two-story family home with a wide lawn"),
  cityMoore: p("city-moore-ranch", 2000, 2500, "#40564f", "Single-story brick ranch home at golden hour"),
} satisfies Record<string, Photo>;

export type ImgKey = keyof typeof img;
