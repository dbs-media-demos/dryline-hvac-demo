"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import { useBiz } from "@/components/preview/BizContext";
import { gsap } from "@/lib/gsap";
import { TEMP_MAX, TEMP_MIN, getTemp, modeFor, setTemp, subscribeTemp } from "@/lib/mode";
import { FlameIcon, SnowIcon } from "@/components/ui/Icons";

/*
 * The thermostat dial. 270° of travel, 60–85 °F.
 * Drag it, scroll it, or focus it and use the arrow keys. It drives the whole site's palette.
 */

const SWEEP = 270;
const START = -135;
const R = 150; // tick ring radius in the 400×400 viewBox
const C = 200;

const toAngle = (t: number) => START + ((t - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * SWEEP;
const polar = (angleDeg: number, r: number) => {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: Math.round((C + r * Math.cos(a)) * 100) / 100, y: Math.round((C + r * Math.sin(a)) * 100) / 100 };
};
const arcPath = (a0: number, a1: number, r: number) => {
  const p0 = polar(a0, r);
  const p1 = polar(a1, r);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y}`;
};

const noopSubscribe = () => () => {};
const readHint = () => {
  try {
    return localStorage.getItem("dryline-dial-used") === "1";
  } catch {
    return false;
  }
};

const TICKS = Array.from({ length: (TEMP_MAX - TEMP_MIN) * 2 + 1 }, (_, i) => TEMP_MIN + i / 2);

export function Dial({ className }: { className?: string }) {
  const biz = useBiz();
  const svg = useRef<SVGSVGElement>(null);
  const temp = useSyncExternalStore(subscribeTemp, getTemp, () => null);
  const [dragging, setDragging] = useState(false);
  const storedHint = useSyncExternalStore(noopSubscribe, readHint, () => true);
  const [used, setUsed] = useState(false);
  const hinted = used || storedHint;
  const lastWhole = useRef<number>(0);
  const tween = useRef<gsap.core.Tween | null>(null);
  const animateTo = (to: number, duration: number, ease: string) => {
    tween.current?.kill();
    const obj = { t: getTemp() };
    tween.current = gsap.to(obj, { t: to, duration, ease, onUpdate: () => commit(obj.t) });
  };

  const markUsed = () => {
    if (hinted) return;
    setUsed(true);
    try {
      localStorage.setItem("dryline-dial-used", "1");
    } catch {}
  };

  const commit = useCallback((t: number) => {
    const clamped = Math.min(TEMP_MAX, Math.max(TEMP_MIN, t));
    const whole = Math.round(clamped);
    if (whole !== lastWhole.current) {
      lastWhole.current = whole;
      if ("vibrate" in navigator && window.matchMedia("(pointer: coarse)").matches) navigator.vibrate?.(4);
    }
    setTemp(clamped);
  }, []);

  const tempFromPointer = (e: { clientX: number; clientY: number }) => {
    const rect = svg.current!.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    let ang = (Math.atan2(dx, -dy) * 180) / Math.PI; // 0 = top, clockwise +
    // Dead zone at the bottom: snap to the nearest end.
    if (ang > 135) ang = 135;
    if (ang < -135) ang = -135;
    return TEMP_MIN + ((ang - START) / SWEEP) * (TEMP_MAX - TEMP_MIN);
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.preventDefault();
    svg.current?.setPointerCapture(e.pointerId);
    setDragging(true);
    markUsed();
    // Ease to the clicked point, then follow the finger 1:1.
    animateTo(tempFromPointer(e), 0.35, "power3.out");
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    tween.current?.kill();
    commit(tempFromPointer(e));
  };
  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    setDragging(false);
    svg.current?.releasePointerCapture(e.pointerId);
  };

  // Wheel needs a non-passive listener to stop the page scrolling while turning the dial.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      markUsed();
      tween.current?.kill();
      commit(getTemp() + (e.deltaY > 0 ? -0.5 : 0.5));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commit]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const t = getTemp();
    const map: Record<string, number> = {
      ArrowUp: t + 1,
      ArrowRight: t + 1,
      ArrowDown: t - 1,
      ArrowLeft: t - 1,
      PageUp: t + 5,
      PageDown: t - 5,
      Home: TEMP_MIN,
      End: TEMP_MAX,
    };
    if (e.key in map) {
      e.preventDefault();
      markUsed();
      animateTo(Math.round(map[e.key]), 0.4, "power2.out");
    }
  };

  const jump = (to: number) => {
    markUsed();
    animateTo(to, 1.1, "expo.inOut");
  };

  const t = temp ?? 68;
  // Serbian previews read Celsius; the dial's logic stays in °F
  const celsius = biz.lang === "sr";
  const toC = (f: number) => Math.round(((f - 32) * 5) / 9);
  const shown = celsius ? toC(t) : Math.round(t);
  const mode = modeFor(t);
  const angle = toAngle(t);
  const knob = polar(angle, R);

  return (
    <div className={clsx("relative select-none", className)}>
      <svg
        ref={svg}
        viewBox="0 0 400 400"
        role="slider"
        tabIndex={0}
        aria-label="Thermostat — sets the site's heating or cooling mode"
        aria-valuemin={TEMP_MIN}
        aria-valuemax={TEMP_MAX}
        aria-valuenow={shown}
        aria-valuetext={`${shown} degrees, ${mode === "cool" ? "cooling" : "heating"}`}
        aria-orientation="horizontal"
        data-cursor="Drag"
        data-lenis-prevent
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className={clsx("block h-auto w-full touch-none outline-none [&:focus-visible_.focus-ring]:opacity-100", dragging ? "cursor-grabbing" : "cursor-grab")}
      >
        <defs>
          <radialGradient id="dial-face" cx="50%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#1f3a5a" />
            <stop offset="70%" stopColor="#0d1c2e" />
            <stop offset="100%" stopColor="#081321" />
          </radialGradient>
          <radialGradient id="dial-glow" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.0" />
            <stop offset="80%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="dial-rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
          </linearGradient>
        </defs>

        {/* ambient glow */}
        <circle cx={C} cy={C} r={198} fill="url(#dial-glow)" className="transition-opacity duration-700" />

        {/* ticks */}
        <g>
          {TICKS.map((v) => {
            const a = toAngle(v);
            const major = v % 5 === 0;
            const p0 = polar(a, major ? R + 16 : R + 10);
            const p1 = polar(a, R + 26);
            const lit = v <= t;
            return (
              <line
                key={v}
                x1={p0.x}
                y1={p0.y}
                x2={p1.x}
                y2={p1.y}
                strokeWidth={major ? 2.4 : 1.4}
                strokeLinecap="round"
                stroke={lit ? "var(--accent)" : "rgba(245,249,251,0.22)"}
                style={{ transition: "stroke 0.3s" }}
              />
            );
          })}
        </g>

        {/* track + progress */}
        <path d={arcPath(START, START + SWEEP, R - 8)} fill="none" stroke="rgba(245,249,251,0.1)" strokeWidth={3} strokeLinecap="round" />
        <path d={arcPath(START, Math.max(START + 0.01, angle), R - 8)} fill="none" stroke="var(--accent)" strokeWidth={3} strokeLinecap="round" />

        {/* face */}
        <circle cx={C} cy={C} r={122} fill="url(#dial-face)" />
        <circle cx={C} cy={C} r={121.5} fill="none" stroke="url(#dial-rim)" strokeWidth={1} />
        <circle className="focus-ring opacity-0 transition-opacity" cx={C} cy={C} r={186} fill="none" stroke="var(--accent)" strokeWidth={2} strokeDasharray="4 6" />

        {/* grip lines on the face, rotating with the value */}
        <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "200px 200px", transition: dragging ? "none" : "transform 0.2s" }}>
          <line x1={C} y1={C - 108} x2={C} y2={C - 90} stroke="var(--accent)" strokeWidth={4} strokeLinecap="round" />
        </g>

        {/* knob on the ring */}
        <circle cx={knob.x} cy={knob.y} r={dragging ? 17 : 14} fill="var(--accent)" style={{ transition: "r 0.3s" }} />
        <circle cx={knob.x} cy={knob.y} r={5} fill="#0a1726" />

        {/* readout */}
        <text x={C} y={C - 40} textAnchor="middle" fill="rgba(245,249,251,0.66)" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="2.5">
          {mode === "cool" ? "COOLING TO" : "HEATING TO"}
        </text>
        <text x={C - 6} y={C + 34} textAnchor="middle" fill="#f5f9fb" fontFamily="var(--font-display)" fontSize="92" fontWeight={500} letterSpacing="-6">
          {temp === null ? "" : shown}
        </text>
        <text x={C + 64} y={C - 8} fill="var(--accent)" fontFamily="var(--font-display)" fontSize="26">
          °
        </text>
        <text x={C} y={C + 70} textAnchor="middle" fill="rgba(245,249,251,0.55)" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="2">
          {mode === "cool" ? "FAN · AUTO" : "FAN · AUTO"}
        </text>

        {/* end labels */}
        <text {...polar(START - 8, R + 44)} textAnchor="middle" fill="rgba(245,249,251,0.6)" fontFamily="var(--font-mono)" fontSize="11">
          {celsius ? `${toC(60)}°` : "60°"}
        </text>
        <text {...polar(START + SWEEP + 8, R + 44)} textAnchor="middle" fill="rgba(245,249,251,0.6)" fontFamily="var(--font-mono)" fontSize="11">
          {celsius ? `${toC(85)}°` : "85°"}
        </text>
      </svg>

      {/* quick jumps */}
      <div className="mt-2 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => jump(66)}
          aria-pressed={mode === "cool"}
          className={clsx(
            "flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-[0.85rem] font-medium transition-colors",
            mode === "cool" ? "border-transparent bg-cool text-navy" : "border-white/25 text-frost/85 hover:border-white/60",
          )}
        >
          <SnowIcon width={16} height={16} /> Cool
        </button>
        <button
          type="button"
          onClick={() => jump(78)}
          aria-pressed={mode === "heat"}
          className={clsx(
            "flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-[0.85rem] font-medium transition-colors",
            mode === "heat" ? "border-transparent bg-heat text-navy" : "border-white/25 text-frost/85 hover:border-white/60",
          )}
        >
          <FlameIcon width={16} height={16} /> Heat
        </button>
      </div>
      <p
        className={clsx(
          "mt-3 text-center font-mono text-[0.66rem] tracking-[0.14em] text-frost/60 uppercase transition-opacity duration-700",
          hinted ? "opacity-0" : "opacity-100",
        )}
        aria-hidden
      >
        Drag · scroll · or use arrow keys
      </p>
    </div>
  );
}
