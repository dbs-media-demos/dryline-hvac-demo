import { site } from "./site";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const fmtHour = (h: number) => {
  const suffix = h >= 12 ? "pm" : "am";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr} ${suffix}`;
};

/** Current day/hour in Oklahoma City, regardless of the visitor's time zone. */
export function okcNow(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, hour: Number(get("hour")) + Number(get("minute")) / 60 };
}

export type OpenStatus = { open: boolean; label: string };

export function officeStatus(d = new Date()): OpenStatus {
  const { day, hour } = okcNow(d);
  const today = site.hours[day];
  if (today.open !== null && today.close !== null && hour >= today.open && hour < today.close) {
    return { open: true, label: `Office open · closes ${fmtHour(today.close)}` };
  }
  // Find the next opening.
  for (let i = 0; i < 7; i++) {
    const idx = (day + i) % 7;
    const h = site.hours[idx];
    if (h.open === null) continue;
    if (i === 0 && hour >= h.open) continue;
    const when = i === 0 ? "today" : i === 1 ? "tomorrow" : DAYS[idx];
    return { open: false, label: `Office opens ${when} ${fmtHour(h.open)}` };
  }
  return { open: false, label: "Office closed" };
}

/** Fictional "technicians available" count — more trucks on the road during the day. */
export function techsAvailable(d = new Date()) {
  const { hour, day } = okcNow(d);
  if (hour >= 7 && hour < 19) return day === 0 ? 3 : 5 + (Math.floor(hour) % 3);
  return hour >= 19 && hour < 23 ? 3 : 2;
}

export const hoursTable = site.hours
  .slice(1)
  .concat(site.hours[0])
  .map((h) => ({ day: DAYS[h.day], value: h.open === null ? "Emergency line only" : `${fmtHour(h.open)} – ${fmtHour(h.close!)}` }));
