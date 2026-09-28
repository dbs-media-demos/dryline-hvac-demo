/**
 * The thermostat is the site's single source of mood.
 * One temperature (60–85 °F) → one number, --mix (0 cool … 1 heat), written to <html>.
 * Everything else — accent colours, particles, headline, logo — reads from that.
 */

export const TEMP_MIN = 60;
export const TEMP_MAX = 85;
export const STORAGE_KEY = "dryline-temp";

/** Below the comfort band = cooling, above = heating. The colour shift happens across 71–74 °F. */
export const mixFor = (t: number) => {
  const x = Math.min(1, Math.max(0, (t - 71) / 3));
  return x * x * (3 - 2 * x);
};
export const modeFor = (t: number): "cool" | "heat" => (t >= 72.5 ? "heat" : "cool");

/** Default follows the Oklahoma season: cooling April–October, heating November–March. */
export const seasonalDefault = (d = new Date()) => {
  const m = d.getMonth();
  return m >= 3 && m <= 9 ? 68 : 76;
};

/** Inline <head> script: applies the saved/seasonal temperature before first paint (no flash). */
export const modeBootScript = `(function(){try{var t=parseFloat(localStorage.getItem("${STORAGE_KEY}"));if(!(t>=${TEMP_MIN}&&t<=${TEMP_MAX})){var m=new Date().getMonth();t=m>=3&&m<=9?68:76}var x=Math.min(1,Math.max(0,(t-71)/3));x=x*x*(3-2*x);var d=document.documentElement;d.style.setProperty("--mix",x.toFixed(4));d.dataset.mode=t>=72.5?"heat":"cool";d.dataset.temp=String(Math.round(t))}catch(e){}})();`;

type Listener = (t: number) => void;
const listeners = new Set<Listener>();
let current: number | null = null;
let saveTimer = 0;

export function getTemp(): number {
  if (current !== null) return current;
  if (typeof document === "undefined") return 68;
  const fromDom = parseFloat(document.documentElement.dataset.temp ?? "");
  current = Number.isFinite(fromDom) ? fromDom : seasonalDefault();
  return current;
}

export function setTemp(t: number) {
  const next = Math.min(TEMP_MAX, Math.max(TEMP_MIN, t));
  current = next;
  const root = document.documentElement;
  root.style.setProperty("--mix", mixFor(next).toFixed(4));
  const mode = modeFor(next);
  if (root.dataset.mode !== mode) root.dataset.mode = mode;
  root.dataset.temp = String(Math.round(next));
  listeners.forEach((l) => l(next));
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(Math.round(next * 10) / 10));
    } catch {
      /* private mode — the choice just won't persist */
    }
  }, 250);
}

export function subscribeTemp(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/** Accent colours in JS (canvas can't read color-mix), interpolated the same "thermal" way. */
const COOL = [142, 227, 239];
const VIOLET = [150, 132, 255];
const MAGENTA = [244, 114, 182];
const HEAT = [255, 181, 71];
export function accentRgb(mix: number): [number, number, number] {
  const stops = [COOL, VIOLET, MAGENTA, HEAT];
  const f = Math.min(0.9999, Math.max(0, mix)) * (stops.length - 1);
  const i = Math.floor(f);
  const k = f - i;
  const a = stops[i];
  const b = stops[i + 1];
  return [0, 1, 2].map((c) => Math.round(a[c] + (b[c] - a[c]) * k)) as [number, number, number];
}
