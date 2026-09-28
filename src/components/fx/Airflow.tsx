"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { accentRgb, getTemp, mixFor, subscribeTemp } from "@/lib/mode";

/*
 * Airflow: a field of streaks drifting through the hero.
 * Cooling → air sinks and spills sideways, like cold air off a supply register.
 * Heating → air rises in lazy convection plumes. Everything in between blends.
 * Starts on idle, runs at 30fps on touch devices, pauses off-screen, skips reduced motion.
 */

type P = { x: number; y: number; px: number; py: number; life: number; max: number; s: number };

export function Airflow({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  function start() {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5);
    let w = 0;
    let h = 0;
    let particles: P[] = [];

    const spawn = (p?: P): P => {
      const q = p ?? ({} as P);
      q.x = Math.random() * w;
      q.y = Math.random() * h;
      q.px = q.x;
      q.py = q.y;
      q.life = 0;
      q.max = 90 + Math.random() * 160;
      q.s = 0.6 + Math.random() * 0.9;
      return q;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(coarse ? 170 : 520, (w * h) / (coarse ? 2600 : 2400)));
      particles = Array.from({ length: count }, () => spawn());
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let mix = mixFor(getTemp());
    let targetMix = mix;
    let energy = 0.4;
    const unsub = subscribeTemp((t) => {
      targetMix = mixFor(t);
      energy = Math.min(2.4, energy + 0.35);
    });

    const pointer = { x: -9999, y: -9999, active: false };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = pointer.y > -50 && pointer.y < h + 50;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);

    const minDelta = coarse ? 1000 / 30 : 1000 / 60;
    let last = 0;
    let raf = 0;
    const t0 = performance.now();
    canvas.style.opacity = "1";

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden || now - last < minDelta - 1) return;
      const dt = Math.min(2, (now - last) / 16.67);
      last = now;
      const t = (now - t0) / 1000;

      mix += (targetMix - mix) * 0.06;
      energy += (0.4 - energy) * 0.02;
      const [r, g, b] = accentRgb(mix);

      // Fade existing trails (keeps the canvas transparent over the photo).
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${coarse ? 0.14 : 0.1})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      // Cool air sinks (+y) and spills right; warm air rises (−y) and wanders.
      const baseX = 0.55 - mix * 0.45;
      const baseY = 0.75 - mix * 1.85;
      const turb = 0.55 + mix * 0.5;
      const speed = (1.1 + energy) * dt;

      ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`;
      ctx.lineWidth = coarse ? 1.3 : 1.1;
      ctx.beginPath();
      for (const p of particles) {
        const a = Math.sin(p.x * 0.0042 + t * 0.35) + Math.cos(p.y * 0.0051 - t * 0.27) + Math.sin((p.x + p.y) * 0.0023 + t * 0.12);
        let vx = baseX + Math.cos(a * 1.9) * turb;
        let vy = baseY + Math.sin(a * 1.9) * turb * 0.8;
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 22000) {
            const f = (1 - d2 / 22000) * 2.4;
            const d = Math.sqrt(d2) || 1;
            vx += (dx / d) * f;
            vy += (dy / d) * f;
          }
        }
        p.px = p.x;
        p.py = p.y;
        p.x += vx * speed * p.s;
        p.y += vy * speed * p.s;
        p.life += dt;
        if (p.life > p.max || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
          spawn(p);
          continue;
        }
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      unsub();
      window.removeEventListener("pointermove", onMove);
    };
  }

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 400));
    const handle = ric(
      () => {
        if (!cancelled) stop = start();
      },
      { timeout: 1800 },
    );
    return () => {
      cancelled = true;
      (window.cancelIdleCallback ?? window.clearTimeout)(handle as number);
      stop?.();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={clsx("pointer-events-none opacity-0 transition-opacity duration-[1.6s]", className)} />;
}
