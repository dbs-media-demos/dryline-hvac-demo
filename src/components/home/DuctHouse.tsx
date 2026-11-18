"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import clsx from "clsx";
import { useBiz } from "@/components/preview/BizContext";
import { getGsap, prefersReducedMotion } from "@/lib/motion";
import { whenLoaderDone } from "@/lib/loader";
import { TEMP_MAX, TEMP_MIN, getTemp, modeFor, setTemp, subscribeTemp } from "@/lib/mode";
import { FlameIcon, SnowIcon } from "@/components/ui/Icons";

/*
 * The /v2 hero (no 3D): a cutaway of a two-storey house drawn in fine lines. The attic unit pushes
 * air down the ducts (moving dashes), the registers breathe, the condenser outside spins while it
 * cools and rests while the furnace heats, and every room's temperature walks to the setting, the
 * nearest rooms first. Cool / Heat and − / + set the same thermostat as the 3D dial on `/`, so the
 * whole site re-themes with it.
 *
 * SVG and CSS for the drawing and the flow; one requestAnimationFrame loop moves the room numbers
 * and tints, and stops once every room has settled or the hero is off screen. Desktop only (the
 * column is phone:hidden); reduced motion shows the settled house.
 */

const W = 640;
const H = 500;

type Room = { id: string; x: number; y: number; w: number; h: number; reg: number; en: string; sr: string; lag: number; tau: number; off: number };

/** Rooms, their ceiling register, how long the air takes to reach them (ms) and how fast they follow. */
const ROOMS: Room[] = [
  { id: "r1", x: 40, y: 176, w: 186, h: 124, reg: 112, en: "Primary bedroom", sr: "Spavaća soba", lag: 260, tau: 1300, off: 11 },
  { id: "r2", x: 226, y: 176, w: 194, h: 124, reg: 344, en: "Kids’ room", sr: "Dečja soba", lag: 320, tau: 1450, off: 12 },
  { id: "r3", x: 40, y: 312, w: 206, h: 134, reg: 128, en: "Living room", sr: "Dnevna soba", lag: 620, tau: 1250, off: 9 },
  { id: "r4", x: 246, y: 312, w: 174, h: 134, reg: 344, en: "Kitchen", sr: "Kuhinja", lag: 700, tau: 1500, off: 10 },
];

/** The house's outline (roof with eaves, walls), also the glass panel behind it. */
const SHELL = "M24 176 L230 58 L436 176 L420 176 L420 446 L40 446 L40 176 Z";

/** Supply ducts from the attic unit, in the direction the air goes. */
const DUCTS = [
  "M186 154 H112 V176", // to the primary bedroom
  "M270 154 H344 V176", // to the kids' room
  "M236 170 V306 H128 V312", // down the chase, to the living room
  "M236 306 H344 V312", // and the kitchen
];
const LINESET = "M476 424 H430 V186 L418 166 H270";

const toC = (f: number) => ((f - 32) * 5) / 9;
const toF = (c: number) => (c * 9) / 5 + 32;

export function DuctHouse({ className }: { className?: string }) {
  const biz = useBiz();
  const sr = biz.lang === "sr";
  const root = useRef<HTMLDivElement>(null);
  const nums = useRef<(SVGTSpanElement | null)[]>([]);
  const hot = useRef<(SVGRectElement | null)[]>([]);
  const cold = useRef<(SVGRectElement | null)[]>([]);
  const glow = useRef<(SVGRectElement | null)[]>([]);
  const temp = useSyncExternalStore(subscribeTemp, getTemp, () => null);
  const tween = useRef<gsap.core.Tween | null>(null);

  const show = useCallback((f: number) => String(Math.round(sr ? toC(f) : f)), [sr]);

  // Room temperatures: each walks to the setting once the air reaches it (after a preview's logo loader).
  useEffect(() => whenLoaderDone(() => {
    const el = root.current;
    if (!el) return;
    const reduce = prefersReducedMotion();
    let target = getTemp();
    const now0 = performance.now();
    const heat = modeFor(target) === "heat";
    const T = ROOMS.map((r) => (reduce ? target : target + (heat ? -r.off : r.off)));
    let from = T.slice();
    const startAt = ROOMS.map((r) => now0 + 1500 + r.lag);
    const shown: string[] = ROOMS.map(() => "");
    let raf = 0;
    let visible = true;

    const paint = () => {
      ROOMS.forEach((_, i) => {
        const s = show(T[i]);
        if (s !== shown[i] && nums.current[i]) nums.current[i]!.textContent = shown[i] = s;
        const span = Math.max(4, Math.abs(from[i] - target));
        const k = Math.min(1, Math.abs(T[i] - target) / span);
        const warm = T[i] > target;
        hot.current[i]?.setAttribute("opacity", (warm ? 0.05 + 0.3 * k : 0).toFixed(3));
        cold.current[i]?.setAttribute("opacity", (warm ? 0 : 0.05 + 0.3 * k).toFixed(3));
        glow.current[i]?.setAttribute("opacity", (0.2 + 0.5 * (1 - k)).toFixed(3));
      });
    };

    let last = now0;
    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(64, now - last);
      last = now;
      let moving = false;
      ROOMS.forEach((r, i) => {
        const d = target - T[i];
        if (Math.abs(d) < 0.02) {
          T[i] = target;
          return;
        }
        moving = true;
        if (now >= startAt[i]) T[i] += d * (1 - Math.exp(-dt / r.tau));
      });
      paint();
      if (moving && visible && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const run = () => {
      if (!raf && visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    paint();
    if (!reduce) run();

    const unsub = subscribeTemp((t) => {
      if (Math.abs(t - target) < 0.01) return;
      target = t;
      from = T.slice();
      const now = performance.now();
      ROOMS.forEach((r, i) => (startAt[i] = Math.max(startAt[i], now + 200 + r.lag * 0.6)));
      if (reduce) {
        T.fill(target);
        paint();
      } else run();
    });
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      el.toggleAttribute("data-off", !visible);
      if (visible && !reduce) run();
    });
    io.observe(el);
    const onVis = () => !document.hidden && !reduce && run();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      unsub();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }), [show]);

  const animateTo = (to: number) => {
    tween.current?.kill();
    const t = Math.min(TEMP_MAX, Math.max(TEMP_MIN, to));
    const kit = getGsap();
    if (!kit || prefersReducedMotion()) return setTemp(t);
    const obj = { t: getTemp() };
    tween.current = kit.gsap.to(obj, { t, duration: 0.9, ease: "expo.inOut", onUpdate: () => setTemp(obj.t) });
  };
  const step = (dir: 1 | -1) => {
    const now = getTemp();
    animateTo(sr ? toF(Math.round(toC(now)) + dir) : Math.round(now) + dir);
  };

  const t = temp ?? null;
  const mode = t === null ? null : modeFor(t);
  const setting = t === null ? "" : show(t);
  const unit = sr ? "°C" : "°F";
  const label = (en: string, s: string) => (sr ? s : en);
  const pillBase = "flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-[0.85rem] font-medium transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.97]";

  return (
    <div ref={root} className={clsx("duct-house relative select-none", className)} data-no-translate>
      {/* Right-aligned in a flex row, so a drawing wider than the column spills left, into the gap */}
      <div className="flex justify-end">
      <div className="dh-stage relative">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label("A house in cutaway: air from the attic unit runs through the ducts and every room settles at the thermostat setting.", "Presek kuće: vazduh iz jedinice na tavanu ide kroz kanale i svaka prostorija dolazi na zadatu temperaturu.")} className="block h-auto w-full overflow-visible">
          <defs>
            <linearGradient id="dh-glass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#12263d" stopOpacity="0.72" />
              <stop offset="1" stopColor="#0a1726" stopOpacity="0.86" />
            </linearGradient>
            <radialGradient id="dh-air" cx="0.5" cy="0" r="0.9">
              <stop offset="0" style={{ stopColor: "var(--accent)" }} stopOpacity="0.55" />
              <stop offset="1" style={{ stopColor: "var(--accent)" }} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="dh-shadow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#000" stopOpacity="0.55" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <clipPath id="dh-clip">
              <path d={SHELL} />
            </clipPath>
          </defs>

          {/* Contact shadow and the ground */}
          <ellipse cx={300} cy={450} rx={330} ry={22} fill="url(#dh-shadow)" />
          <path className="dh-draw" pathLength={1} d="M0 446 H640" stroke="rgba(245,249,251,0.35)" strokeWidth={1} style={{ "--d": "0.05s" } as React.CSSProperties} />

          {/* Depth: the house's back edges, a step behind and up */}
          <g fill="none" stroke="rgba(245,249,251,0.2)" strokeWidth={1} strokeLinejoin="round">
            <path className="dh-draw" pathLength={1} d="M246 46 L452 164 V434 M230 58 L246 46 M436 176 L452 164 M420 446 L436 434 H420" style={{ "--d": "0.3s" } as React.CSSProperties} />
          </g>
          <path d="M230 58 L246 46 L452 164 V434 L436 434 V176 Z" fill="#0a1726" fillOpacity={0.55} className="dh-fade" />

          {/* The house: a dark glass panel, then each room's air */}
          <path d={SHELL} fill="url(#dh-glass)" className="dh-fade" />
          <g clipPath="url(#dh-clip)">
            {ROOMS.map((r, i) => (
              <g key={r.id} className="dh-room">
                <rect ref={(n) => void (hot.current[i] = n)} x={r.x} y={r.y} width={r.w} height={r.h} fill="var(--heat)" opacity={0} />
                <rect ref={(n) => void (cold.current[i] = n)} x={r.x} y={r.y} width={r.w} height={r.h} fill="var(--cool)" opacity={0} />
                <rect ref={(n) => void (glow.current[i] = n)} x={r.reg - 90} y={r.y} width={180} height={r.h * 0.9} fill="url(#dh-air)" opacity={0.2} className="dh-glow" />
              </g>
            ))}
          </g>

          {/* Structure: outline, floor, walls */}
          <g fill="none" stroke="rgba(245,249,251,0.62)" strokeLinejoin="round">
            <path className="dh-draw" pathLength={1} d={SHELL} strokeWidth={1.6} style={{ "--d": "0.1s" } as React.CSSProperties} />
            <path className="dh-draw" pathLength={1} d="M40 300 H420 M40 312 H420" strokeWidth={1.1} style={{ "--d": "0.35s" } as React.CSSProperties} />
            <path className="dh-draw" pathLength={1} d="M226 176 V300 M246 312 V446" strokeWidth={1.1} style={{ "--d": "0.5s" } as React.CSSProperties} />
            {/* Windows */}
            <path className="dh-draw" pathLength={1} d="M168 196 h38 v36 h-38 Z M378 196 h30 v36 h-30 Z M378 336 h30 v36 h-30 Z" strokeWidth={0.9} stroke="rgba(245,249,251,0.32)" style={{ "--d": "0.65s" } as React.CSSProperties} />
          </g>

          {/* Ducts: the sheet-metal run, then the moving air inside it */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {DUCTS.map((d, i) => (
              <path key={`s${i}`} className="dh-draw" pathLength={1} d={d} stroke="rgba(245,249,251,0.2)" strokeWidth={9} style={{ "--d": `${0.55 + i * 0.08}s` } as React.CSSProperties} />
            ))}
            <g className="dh-flow-group">
              {DUCTS.map((d, i) => (
                <path key={`f${i}`} className="dh-flow" d={d} stroke="var(--accent)" strokeWidth={2.6} />
              ))}
            </g>
            {/* Registers and their breath */}
            {ROOMS.map((r, i) => (
              <g key={`g${r.id}`}>
                <rect x={r.reg - 13} y={r.y} width={26} height={4} rx={1} fill="rgba(245,249,251,0.75)" className="dh-fade" />
                {[0, 1, 2].map((k) => (
                  <path
                    key={k}
                    className="dh-breath"
                    d={`M${r.reg - 9 + k * 9} ${r.y + 9} q 3 8 0 16`}
                    stroke="var(--accent)"
                    strokeWidth={1.6}
                    style={{ "--b": `${1.6 + i * 0.15 + k * 0.32}s` } as React.CSSProperties}
                  />
                ))}
              </g>
            ))}
          </g>

          {/* The attic unit: fan while cooling, burner while heating */}
          <g className="dh-fade" style={{ "--d": "0.6s" } as React.CSSProperties}>
            <rect x={186} y={128} width={84} height={42} rx={5} fill="#0d1d30" stroke="rgba(245,249,251,0.7)" strokeWidth={1.3} />
            <rect x={186} y={128} width={84} height={42} rx={5} fill="var(--accent)" opacity={0.1} />
            <g className="dh-spin" style={{ "--spin": "0.7s" } as React.CSSProperties}>
              <Fan cx={208} cy={149} r={12} />
            </g>
            <g className="show-cool">
              <path d="M232 138 v22 M240 138 v22 M248 138 v22 M256 138 v22" stroke="rgba(245,249,251,0.4)" strokeWidth={1} />
            </g>
            <g className="show-heat dh-flame">
              <path d="M244 162 c-9 -3 -10 -13 -3 -20 c0 6 4 7 5 4 c1 -4 -1 -7 2 -10 c2 6 9 9 7 18 c-1 5 -6 8 -11 8 z" fill="var(--heat)" />
            </g>
          </g>

          {/* Condenser outside: runs while cooling, rests while the furnace heats */}
          <g className="dh-fade" style={{ "--d": "0.75s" } as React.CSSProperties}>
            <path className="dh-draw" pathLength={1} d={LINESET} fill="none" stroke="rgba(245,249,251,0.28)" strokeWidth={4} strokeLinejoin="round" style={{ "--d": "0.8s" } as React.CSSProperties} />
            <path className="dh-flow dh-flow-slow show-cool" d={LINESET} fill="none" stroke="var(--cool)" strokeWidth={1.6} strokeLinejoin="round" />
            <path d="M478 352 L492 342 H596 L598 344 V432 L584 444" fill="#0a1726" stroke="rgba(245,249,251,0.35)" strokeWidth={1} strokeLinejoin="round" />
            <rect x={476} y={352} width={108} height={92} rx={6} fill="#0d1d30" stroke="rgba(245,249,251,0.7)" strokeWidth={1.3} />
            <path d="M488 432 h84" stroke="rgba(245,249,251,0.25)" strokeWidth={1} />
            <circle cx={530} cy={392} r={34} fill="none" stroke="rgba(245,249,251,0.45)" strokeWidth={1} />
            <circle cx={530} cy={392} r={24} fill="none" stroke="rgba(245,249,251,0.22)" strokeWidth={1} />
            <g className="dh-spin dh-condenser" style={{ "--spin": "0.55s" } as React.CSSProperties}>
              <Fan cx={530} cy={392} r={30} />
            </g>
            <rect x={482} y={444} width={10} height={2} fill="rgba(245,249,251,0.5)" />
            <rect x={568} y={444} width={10} height={2} fill="rgba(245,249,251,0.5)" />
          </g>

          {/* Labels */}
          <g fontFamily="var(--font-mono)" fill="#f5f9fb">
            <text x={476} y={328} fontSize={10.5} letterSpacing={1.4} fillOpacity={0.6} className="dh-fade" style={{ "--d": "0.9s" } as React.CSSProperties}>
              {label("CONDENSER", "SPOLJNA JEDINICA")}
            </text>
            {/* The supply-air annotation, leader line to the unit */}
            <g className="dh-fade" style={{ "--d": "1s" } as React.CSSProperties}>
              <path d="M272 138 L316 94 H470" fill="none" stroke="rgba(245,249,251,0.35)" strokeWidth={1} />
              <circle cx={272} cy={138} r={2.5} fill="var(--accent)" />
              <text x={476} y={86} fontSize={10.5} letterSpacing={1.4} fillOpacity={0.6}>
                {label("SUPPLY AIR", "VAZDUH IZ KANALA")}
              </text>
              <text x={476} y={112} fontFamily="var(--font-display)" fontSize={24} fontWeight={500} letterSpacing={-0.6}>
                <tspan className="show-cool">{sr ? "13" : "56"}</tspan>
                <tspan className="show-heat">{sr ? "52" : "125"}</tspan>
                <tspan fill="var(--accent)" fontSize={15} dy={-8}>
                  {unit}
                </tspan>
              </text>
            </g>
            {ROOMS.map((r, i) => (
              <g key={`l${r.id}`} className="dh-fade" style={{ "--d": `${1 + i * 0.08}s` } as React.CSSProperties}>
                <text x={r.x + 16} y={r.y + r.h - 54} fontSize={10} letterSpacing={1.3} fillOpacity={0.66}>
                  {(sr ? r.sr : r.en).toUpperCase()}
                </text>
                <text x={r.x + 16} y={r.y + r.h - 16} fontFamily="var(--font-display)" fontSize={34} fontWeight={500} letterSpacing={-1.2}>
                  <tspan ref={(n) => void (nums.current[i] = n)} />
                  <tspan fill="var(--accent)" fontSize={18} dy={-12}>
                    °
                  </tspan>
                </text>
              </g>
            ))}
            {/* The wall thermostat in the living room shows the setting */}
            <g className="dh-fade" style={{ "--d": "1.1s" } as React.CSSProperties}>
              <rect x={196} y={352} width={34} height={34} rx={17} fill="#0d1d30" stroke="var(--accent)" strokeWidth={1.4} />
              <text x={213} y={374} textAnchor="middle" fontFamily="var(--font-display)" fontSize={12} fontWeight={500}>
                {setting}
              </text>
            </g>
          </g>
        </svg>
      </div>
      </div>

      {/* The same thermostat as the dial on `/`: it re-themes the whole site */}
      <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => animateTo(68)}
          aria-pressed={mode === "cool"}
          className={clsx(pillBase, mode === "cool" ? "border-transparent bg-cool text-navy" : "border-white/25 text-frost/85 hover:border-white/60")}
        >
          <SnowIcon width={16} height={16} /> {label("Cool", "Hlađenje")}
        </button>
        <button
          type="button"
          onClick={() => animateTo(74)}
          aria-pressed={mode === "heat"}
          className={clsx(pillBase, mode === "heat" ? "border-transparent bg-heat text-navy" : "border-white/25 text-frost/85 hover:border-white/60")}
        >
          <FlameIcon width={16} height={16} /> {label("Heat", "Grejanje")}
        </button>
        <span className="mx-2 h-6 w-px bg-white/20" aria-hidden />
        <div className="flex items-center gap-1 rounded-full border border-white/25 p-1" role="group" aria-label={label("Thermostat setting", "Zadata temperatura")}>
          <button type="button" onClick={() => step(-1)} aria-label={label("One degree cooler", "Stepen niže")} className="grid size-9 place-items-center rounded-full text-[1.2rem] leading-none text-frost/85 transition-colors hover:bg-white/10 active:scale-95">
            −
          </button>
          <output className="min-w-[4.2ch] text-center font-display text-[1rem] tabular-nums" aria-live="polite">
            {setting ? `${setting}${unit}` : " "}
          </output>
          <button type="button" onClick={() => step(1)} aria-label={label("One degree warmer", "Stepen više")} className="grid size-9 place-items-center rounded-full text-[1.2rem] leading-none text-frost/85 transition-colors hover:bg-white/10 active:scale-95">
            +
          </button>
        </div>
      </div>
      <p className="relative mt-3 text-center font-mono text-[0.66rem] tracking-[0.14em] text-frost/60 uppercase" aria-hidden>
        {label("Change the setting · every room follows", "Promenite temperaturu · sve sobe prate")}
      </p>
    </div>
  );
}

/** A four-blade fan, centred on (cx, cy). */
function Fan({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const s = r / 12;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`} fill="rgba(245,249,251,0.78)">
      {[0, 90, 180, 270].map((a) => (
        <path key={a} d="M0 0C-0.8 -3.4 0 -7.4 2.6 -8.6c1.9 1.1 1.4 5.6 -2.6 8.6Z" transform={`rotate(${a})`} />
      ))}
      <circle r={2.1} fill="var(--accent)" />
    </g>
  );
}
