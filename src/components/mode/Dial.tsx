"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import { useBiz } from "@/components/preview/BizContext";
import { getGsap, prefersReducedMotion } from "@/lib/motion";
import { TEMP_MAX, TEMP_MIN, getTemp, modeFor, setTemp, subscribeTemp } from "@/lib/mode";
import { PHONE_QUERY } from "@/lib/phone";
import { FlameIcon, SnowIcon } from "@/components/ui/Icons";
import { FACE, FC, LAYOUT, START, SWEEP, TICK, TICKS, faceText, polar, toAngle } from "./dialFace";
import type { ThermostatHandle } from "./thermostatScene";

/*
 * The thermostat: a real one in turned aluminium (thermostatScene.ts, three.js) on a desktop with
 * a mouse, and a still rendered from that scene everywhere else, with its readout drawn on top.
 * 270° of travel, 60–85 °F. Drag it round, or focus it and use the arrow keys. A wheel over it
 * scrolls the page, and so does a finger swiping up or down (touch-pan-y). It drives the whole
 * site's palette.
 *
 * three.js is imported only inside the effect below, after load, once a big screen with a mouse,
 * no ask for less motion, no Save-Data and a real graphics chip are confirmed: nothing else imports
 * it. The still stays until the scene has compiled and drawn a frame; if its first 2 s run slowly
 * it fades back to the still, and the rest of the visit (sessionStorage) starts on the still.
 */

/** Live 3D only for a big screen with a mouse (and no ask for less motion or data). Keep in step with .dial-stage in globals.css. */
const LIVE_3D = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

/**
 * Where the scene puts the thermostat in its square canvas at rest (printed by
 * scripts/render-3d-stills.mjs): the ring's width and centre, and the display's.
 */
const PROJ = { ring: { w: 0.5897, cx: 0.4879, cy: 0.4937 }, face: { cx: 0.4789, cy: 0.4937, w: 0.4873, h: 0.4999 } };
const CANVAS = 100 / PROJ.ring.w; // canvas size, % of the stage (the ring)
const pct = (n: number) => `${Math.round(n * 1000) / 1000}%`;

const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

/** Set once the 3D ran too slowly here: the rest of the visit keeps the still. */
const SLOW_KEY = "dryline-3d-slow";
const slowBefore = () => {
  try {
    return sessionStorage.getItem(SLOW_KEY) === "1";
  } catch {
    return false;
  }
};
/** WebGL on a real graphics chip: no software rendering (SwiftShader, llvmpipe, Microsoft Basic Render). Checked before three.js is fetched. */
const hasGpu = () => {
  const gl = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true, powerPreference: "high-performance" });
  if (!gl) return false;
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const name = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
};

const noopSubscribe = () => () => {};
/** Whether this screen gets the live thermostat (the server assumes so; CSS hides the drawn readout only where it can). */
const readCanLive = () => {
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return window.matchMedia(LIVE_3D).matches && !prefersReducedMotion() && !saveData && !slowBefore();
};
const readHint = () => {
  try {
    return localStorage.getItem("dryline-dial-used") === "1";
  } catch {
    return false;
  }
};

/** The display drawn in SVG, the same layout as the 3D one (dialFace.ts): for the still. */
function Readout({ t, sr }: { t: number | null; sr: boolean }) {
  const v = t ?? TEMP_MIN;
  const reach = t === null ? START - 1 : toAngle(v);
  const text = faceText(v, modeFor(v), sr);
  const L = LAYOUT;
  const lo = polar(START - L.ends.da, L.ends.r);
  const hi = polar(START + SWEEP + L.ends.da, L.ends.r);
  const label = (m: "cool" | "heat") => faceText(v, m, sr).label;
  return (
    <svg
      viewBox={`0 0 ${FACE} ${FACE}`}
      preserveAspectRatio="none"
      aria-hidden
      className="dial-readout pointer-events-none absolute transition-opacity duration-500"
      style={{
        left: pct(50 + ((PROJ.face.cx - PROJ.ring.cx - PROJ.face.w / 2) / PROJ.ring.w) * 100),
        top: pct(50 + ((PROJ.face.cy - PROJ.ring.cy - PROJ.face.h / 2) / PROJ.ring.w) * 100),
        width: pct((PROJ.face.w / PROJ.ring.w) * 100),
        height: pct((PROJ.face.h / PROJ.ring.w) * 100),
      }}
    >
      <defs>
        <filter id="dial-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g strokeLinecap="round">
        {TICKS.map((tv) => {
          const a = toAngle(tv);
          const major = tv % 5 === 0;
          const p0 = polar(a, major ? TICK.major0 : TICK.r0);
          const p1 = polar(a, TICK.r1);
          const lit = a <= reach + 0.01;
          return (
            <line
              key={tv}
              x1={p0.x}
              y1={p0.y}
              x2={p1.x}
              y2={p1.y}
              strokeWidth={major ? TICK.majorW : TICK.w}
              stroke={lit ? "var(--accent)" : "rgba(245,249,251,0.2)"}
              filter={lit ? "url(#dial-glow)" : undefined}
              style={{ transition: "stroke 0.3s" }}
            />
          );
        })}
      </g>
      <g fill="#f5f9fb" textAnchor="middle" fontFamily="var(--font-mono)">
        <text x={lo.x} y={lo.y + 8} fontSize={L.ends.size} fillOpacity={0.55}>
          {text.lo}
        </text>
        <text x={hi.x} y={hi.y + 8} fontSize={L.ends.size} fillOpacity={0.55}>
          {text.hi}
        </text>
        <text x={FC + L.label.track / 2} y={L.label.y} fontSize={L.label.size} fontWeight={500} letterSpacing={L.label.track} fillOpacity={0.66} data-no-translate>
          <tspan className="show-cool">{label("cool")}</tspan>
          <tspan className="show-heat">{label("heat")}</tspan>
        </text>
        <text x={FC + L.fan.track / 2} y={L.fan.y} fontSize={L.fan.size} letterSpacing={L.fan.track} fillOpacity={0.5} data-no-translate>
          {text.fan}
        </text>
      </g>
      {t !== null && (
        <text x={FC + L.number.dx} y={L.number.y} textAnchor="middle" fill="#f5f9fb" fontFamily="var(--font-display)" fontWeight={500} fontSize={L.number.size} letterSpacing={L.number.track}>
          {text.number}
          <tspan fill="var(--accent)" fontSize={L.degree.size} dy={L.degree.dy} dx={6}>
            °
          </tspan>
        </text>
      )}
    </svg>
  );
}

/** The still under the canvas, one per mode (only the shown one is fetched; phones fetch neither). */
function Still() {
  return (
    <>
      {(["cool", "heat"] as const).map((m) => (
        <picture key={m} className={m === "cool" ? "show-cool" : "show-heat"}>
          <source media={PHONE_QUERY} srcSet={BLANK} />
          <source type="image/avif" srcSet={`/images/dial/dial-${m}.avif`} />
          <img src={`/images/dial/dial-${m}.webp`} alt="" width={1200} height={1200} loading="lazy" decoding="async" className="absolute inset-0 size-full" />
        </picture>
      ))}
    </>
  );
}

export function Dial({ className }: { className?: string }) {
  const biz = useBiz();
  const sr = biz.lang === "sr";
  const svg = useRef<SVGSVGElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scene = useRef<ThermostatHandle | null>(null);
  const canLive = useSyncExternalStore(noopSubscribe, readCanLive, () => true);
  const [state, setLive] = useState<"wait" | "on" | "off">("wait");
  const live = canLive ? state : "off";
  const temp = useSyncExternalStore(subscribeTemp, getTemp, () => null);
  const [dragging, setDragging] = useState(false);
  const storedHint = useSyncExternalStore(noopSubscribe, readHint, () => true);
  const [used, setUsed] = useState(false);
  const hinted = used || storedHint;
  const lastWhole = useRef<number>(0);
  const tween = useRef<gsap.core.Tween | null>(null);

  // The real thermostat. three.js is only imported here, after load, once the check passes.
  useEffect(() => {
    const canvas = canvasRef.current;
    const el = stage.current;
    if (!canvas || !el) return;
    if (!canLive) return;

    let alive = true;
    let handle: ThermostatHandle | null = null;
    let idle: number | undefined;
    let io: IntersectionObserver | undefined;
    let ro: ResizeObserver | undefined;
    let unsub: (() => void) | undefined;
    let freeing: number | undefined;
    const hero = el.closest<HTMLElement>("[data-hero]");
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      handle?.setPointer((e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.5), -(e.clientY - (r.top + r.height / 2)) / (window.innerHeight * 0.5));
    };
    const onScroll = () => {
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      handle?.setProgress(-r.top / Math.max(1, r.height));
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      setLive("off");
    };

    // Too slow: back to the still for the rest of the visit, and free the renderer once the canvas has faded out.
    const onSlow = () => {
      try {
        sessionStorage.setItem(SLOW_KEY, "1");
      } catch {}
      if (!alive) return;
      setLive("off");
      freeing = window.setTimeout(() => {
        handle?.dispose();
        handle = null;
        scene.current = null;
      }, 800);
    };

    const start = async () => {
      if (!hasGpu()) {
        setLive("off");
        return;
      }
      const cs = getComputedStyle(document.documentElement);
      const fonts = { display: cs.getPropertyValue("--font-display").trim() || "sans-serif", mono: cs.getPropertyValue("--font-mono").trim() || "monospace" };
      const [{ createThermostatScene, idle }] = await Promise.all([
        import("./thermostatScene"),
        document.fonts.load(`500 100px ${fonts.display}`).catch(() => null),
        document.fonts.load(`500 30px ${fonts.mono}`).catch(() => null),
      ]);
      if (!alive) return;
      await idle(); // three.js has just been evaluated: build the scene in a task of its own
      if (!alive) return;
      let h: ThermostatHandle;
      try {
        h = await createThermostatScene(canvas, { temp: getTemp(), sr, fonts, onReady: () => alive && setLive("on"), onSlow });
      } catch {
        if (alive) setLive("off"); // no WebGL: the still and its readout stay
        return;
      }
      if (!alive) return h.dispose();
      handle = scene.current = h;
      unsub = subscribeTemp((t) => handle?.setTemp(t));
      io = new IntersectionObserver(([entry]) => handle?.setVisible(entry.isIntersecting));
      io.observe(el);
      ro = new ResizeObserver(() => handle?.resize());
      ro.observe(canvas);
      canvas.addEventListener("webglcontextlost", onLost);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    };
    const onLoad = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idle = ric(() => void start(), { timeout: 1200 }) as number;
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    return () => {
      alive = false;
      window.removeEventListener("load", onLoad);
      if (idle !== undefined) (window.cancelIdleCallback ?? window.clearTimeout)(idle);
      window.clearTimeout(freeing);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("webglcontextlost", onLost);
      io?.disconnect();
      ro?.disconnect();
      unsub?.();
      handle?.dispose();
      scene.current = null;
    };
  }, [sr, canLive]);

  useEffect(() => {
    scene.current?.setDragging(dragging);
  }, [dragging]);

  const commit = useCallback((t: number) => {
    const clamped = Math.min(TEMP_MAX, Math.max(TEMP_MIN, t));
    const whole = Math.round(clamped);
    if (whole !== lastWhole.current) {
      lastWhole.current = whole;
      if ("vibrate" in navigator && window.matchMedia("(pointer: coarse)").matches) navigator.vibrate?.(4);
    }
    setTemp(clamped);
  }, []);

  const animateTo = (to: number, duration: number, ease: string) => {
    tween.current?.kill();
    const kit = getGsap();
    if (!kit) return commit(to);
    const obj = { t: getTemp() };
    tween.current = kit.gsap.to(obj, { t: to, duration, ease, onUpdate: () => commit(obj.t) });
  };

  const markUsed = () => {
    if (hinted) return;
    setUsed(true);
    try {
      localStorage.setItem("dryline-dial-used", "1");
    } catch {}
  };

  const fromCentre = (e: { clientX: number; clientY: number }) => {
    const rect = svg.current!.getBoundingClientRect();
    return { dx: e.clientX - (rect.left + rect.width / 2), dy: e.clientY - (rect.top + rect.height / 2), r: rect.width / 2 };
  };
  const tempFromPointer = (e: { clientX: number; clientY: number }) => {
    const { dx, dy } = fromCentre(e);
    let ang = (Math.atan2(dx, -dy) * 180) / Math.PI; // 0 = top, clockwise +
    // Dead zone at the bottom: snap to the nearest end.
    if (ang > 135) ang = 135;
    if (ang < -135) ang = -135;
    return TEMP_MIN + ((ang - START) / SWEEP) * (TEMP_MAX - TEMP_MIN);
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const { dx, dy, r } = fromCentre(e);
    if (Math.hypot(dx, dy) > r * 1.06) return; // outside the ring
    e.preventDefault();
    svg.current?.setPointerCapture(e.pointerId);
    setDragging(true);
    markUsed();
    // Ease to the clicked point, then follow the pointer 1:1.
    animateTo(tempFromPointer(e), 0.35, "power3.out");
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    tween.current?.kill();
    commit(tempFromPointer(e));
  };
  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    setDragging(false);
    if (svg.current?.hasPointerCapture(e.pointerId)) svg.current.releasePointerCapture(e.pointerId);
  };

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
  const shown = sr ? Math.round(((t - 32) * 5) / 9) : Math.round(t);
  const mode = modeFor(t);

  return (
    <div className={clsx("relative select-none", className)}>
      <div ref={stage} data-live={live} className="dial-stage relative mx-auto aspect-square">
        <div
          className="pointer-events-none absolute aspect-square"
          style={{ width: pct(CANVAS), left: pct(50 - PROJ.ring.cx * CANVAS), top: pct(50 - PROJ.ring.cy * CANVAS) }}
        >
          <Still />
          <canvas ref={canvasRef} aria-hidden className={clsx("absolute inset-0 size-full transition-opacity duration-700 will-change-[opacity]", live === "on" ? "opacity-100" : "opacity-0")} />
        </div>
        <Readout t={temp} sr={sr} />
        <svg
          ref={svg}
          viewBox="0 0 400 400"
          role="slider"
          tabIndex={0}
          aria-label="Thermostat — sets the site's heating or cooling mode"
          aria-valuemin={sr ? 16 : TEMP_MIN}
          aria-valuemax={sr ? 29 : TEMP_MAX}
          aria-valuenow={shown}
          aria-valuetext={sr ? `${shown} stepeni, ${mode === "cool" ? "hlađenje" : "grejanje"}` : `${shown} degrees, ${mode === "cool" ? "cooling" : "heating"}`}
          aria-orientation="horizontal"
          data-cursor="Drag"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          className={clsx("absolute inset-0 block size-full touch-pan-y rounded-full outline-none [&:focus-visible_.focus-ring]:opacity-100", dragging ? "cursor-grabbing" : "cursor-grab")}
        >
          <circle cx={200} cy={200} r={200} fill="transparent" />
          <circle className="focus-ring opacity-0 transition-opacity" cx={200} cy={200} r={212} fill="none" stroke="var(--accent)" strokeWidth={2} strokeDasharray="4 6" />
        </svg>
      </div>

      {/* quick jumps */}
      <div className="relative mt-7 flex items-center justify-center gap-2">
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
          "relative mt-3 text-center font-mono text-[0.66rem] tracking-[0.14em] text-frost/60 uppercase transition-opacity duration-700",
          hinted ? "opacity-0" : "opacity-100",
        )}
        aria-hidden
      >
        Drag · or use arrow keys
      </p>
    </div>
  );
}
