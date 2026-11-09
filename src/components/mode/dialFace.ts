/*
 * The thermostat's display, laid out once for both of its forms: the 3D scene draws it on a canvas
 * (the glass face's light), and where there's no live 3D the Dial draws the same thing in SVG over
 * the still. Units: a 1024 square around the round display, centre 512. No three.js in here.
 */

import { TEMP_MAX, TEMP_MIN } from "@/lib/mode";

export const FACE = 1024;
export const FC = 512;

export const SWEEP = 270;
export const START = -135;
export const toAngle = (t: number) => START + ((t - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * SWEEP;
export const polar = (angleDeg: number, r: number, c = FC) => {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: Math.round((c + r * Math.cos(a)) * 100) / 100, y: Math.round((c + r * Math.sin(a)) * 100) / 100 };
};

/** Every half degree, a longer tick each 5 °F. */
export const TICKS = Array.from({ length: (TEMP_MAX - TEMP_MIN) * 2 + 1 }, (_, i) => TEMP_MIN + i / 2);
export const TICK = { r0: 404, major0: 384, r1: 440, w: 7, majorW: 11 };

export const LAYOUT = {
  label: { y: FC - 168, size: 31, track: 7 },
  number: { y: FC + 104, size: 292, track: -20, dx: -14 },
  degree: { size: 70, dy: -196 },
  fan: { y: FC + 202, size: 26, track: 6 },
  ends: { r: 424, da: 11, size: 25 },
};

export type FaceText = { label: string; fan: string; number: string; lo: string; hi: string };

/** The strings on the display, in the visitor's language: Serbian previews read Celsius. */
export function faceText(t: number, mode: "cool" | "heat", sr: boolean): FaceText {
  const c = (f: number) => Math.round(((f - 32) * 5) / 9);
  return {
    label: sr ? (mode === "cool" ? "HLAĐENJE NA" : "GREJANJE NA") : mode === "cool" ? "COOLING TO" : "HEATING TO",
    fan: sr ? "VENTILATOR · AUTO" : "FAN · AUTO",
    number: String(sr ? c(t) : Math.round(t)),
    lo: sr ? `${c(TEMP_MIN)}°` : `${TEMP_MIN}°`,
    hi: sr ? `${c(TEMP_MAX)}°` : `${TEMP_MAX}°`,
  };
}

const smooth = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

/**
 * Draws the lit display on a canvas: black where the glass is dark. `on` (0..1) is the power-on:
 * the scale comes up, the arc sweeps to the setting, then the number appears.
 */
export function drawFace(
  ctx: CanvasRenderingContext2D,
  o: { t: number; text: FaceText; accent: [number, number, number]; on: number; display: string; mono: string },
) {
  const { t, text, accent, on } = o;
  const [r, g, b] = accent;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, FACE, FACE);
  if (on <= 0) return;

  const scale = smooth(0, 0.3, on);
  const sweep = smooth(0.12, 0.8, on);
  const words = smooth(0.45, 1, on);
  const value = toAngle(t);
  const reach = START + (value - START) * sweep;

  // A soft glow under the arc, like light in the glass
  const glow = ctx.createRadialGradient(FC, FC, 300, FC, FC, 470);
  glow.addColorStop(0, `rgba(${r},${g},${b},0)`);
  glow.addColorStop(0.75, `rgba(${r},${g},${b},${0.07 * sweep})`);
  glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, FACE, FACE);

  ctx.lineCap = "round";
  for (const v of TICKS) {
    const a = toAngle(v);
    const major = v % 5 === 0;
    const p0 = polar(a, major ? TICK.major0 : TICK.r0);
    const p1 = polar(a, TICK.r1);
    const lit = a <= reach + 0.01;
    ctx.lineWidth = major ? TICK.majorW : TICK.w;
    if (lit) {
      ctx.strokeStyle = `rgb(${r},${g},${b})`;
      ctx.shadowColor = `rgba(${r},${g},${b},0.9)`;
      ctx.shadowBlur = 22;
      ctx.globalAlpha = 1;
    } else {
      ctx.strokeStyle = "#f5f9fb";
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.2 * scale;
    }
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f5f9fb";
  const L = LAYOUT;

  ctx.globalAlpha = 0.55 * scale;
  ctx.font = `400 ${L.ends.size}px ${o.mono}`;
  const lo = polar(START - L.ends.da, L.ends.r);
  const hi = polar(START + SWEEP + L.ends.da, L.ends.r);
  ctx.fillText(text.lo, lo.x, lo.y + 8);
  ctx.fillText(text.hi, hi.x, hi.y + 8);

  ctx.globalAlpha = 0.66 * words;
  ctx.font = `500 ${L.label.size}px ${o.mono}`;
  ctx.letterSpacing = `${L.label.track}px`;
  ctx.fillText(text.label, FC + L.label.track / 2, L.label.y);
  ctx.globalAlpha = 0.5 * words;
  ctx.font = `400 ${L.fan.size}px ${o.mono}`;
  ctx.letterSpacing = `${L.fan.track}px`;
  ctx.fillText(text.fan, FC + L.fan.track / 2, L.fan.y);

  ctx.globalAlpha = words;
  ctx.font = `500 ${L.number.size}px ${o.display}`;
  ctx.letterSpacing = `${L.number.track}px`;
  ctx.shadowColor = "rgba(255,255,255,0.28)";
  ctx.shadowBlur = 30;
  const nx = FC + L.number.dx;
  ctx.fillText(text.number, nx, L.number.y);
  const w = ctx.measureText(text.number).width;
  ctx.shadowBlur = 0;
  ctx.letterSpacing = "0px";
  ctx.textAlign = "left";
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.font = `500 ${L.degree.size}px ${o.display}`;
  ctx.fillText("°", nx + w / 2 + 4, L.number.y + L.degree.dy);
  ctx.globalAlpha = 1;
}
