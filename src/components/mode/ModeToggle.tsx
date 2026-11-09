"use client";

import { useSyncExternalStore } from "react";
import { useBiz } from "@/components/preview/BizContext";
import { getTemp, modeFor, setTemp, subscribeTemp } from "@/lib/mode";
import { L } from "@/lib/biz-core";
import { FlameIcon, SnowIcon } from "@/components/ui/Icons";

/**
 * The thermostat on phones: a small Cool/Heat tap control below the first screen. It re-themes the
 * site like the desktop dial; a swipe that starts on it just scrolls the page. Beside it, the
 * desktop's 3D thermostat as a still rendered from that scene (scripts/render-3d-stills.mjs), one
 * per mode (lazy: only the one shown is fetched), with the setting on its display.
 */
export function ModeToggle() {
  const biz = useBiz();
  const temp = useSyncExternalStore(subscribeTemp, getTemp, () => null);
  const sr = biz.lang === "sr";
  const shown = temp === null ? null : sr ? Math.round(((temp - 32) * 5) / 9) : Math.round(temp);
  const mode = temp === null ? null : modeFor(temp);
  return (
    <div className="theme-navy touch-pan-y px-5 pt-4">
      <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-4">
        {/* Read in order: the label, then the setting on the thermostat's display (shown first) */}
        <div className="flex min-w-0 items-center gap-2.5">
          <p className="eyebrow order-2 text-frost/70 max-[359px]:sr-only">
            <span className="show-cool">{L(biz, "Cooling to", "Hlađenje na")}</span>
            <span className="show-heat">{L(biz, "Heating to", "Grejanje na")}</span>
          </p>
          <span className="relative order-1 block size-[68px] shrink-0">
            {(["cool", "heat"] as const).map((m) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={m} src={`/images/dial/dial-phone-${m}.webp`} alt="" width={240} height={240} loading="lazy" decoding="async" className={`show-${m} absolute inset-0 size-full`} />
            ))}
            <span className="absolute top-1/2 left-[48.8%] -translate-x-1/2 -translate-y-1/2 pl-[0.2em] font-display text-[0.95rem] leading-none font-medium tracking-[-0.05em] whitespace-nowrap text-frost tabular" data-no-translate>
              {shown}
              <span className="align-top text-[0.6em] text-accent">°</span>
            </span>
          </span>
        </div>
        <div className="flex shrink-0 gap-1.5" role="group" aria-label={L(biz, "Thermostat mode", "Režim termostata")}>
          <button type="button" onClick={() => setTemp(66)} aria-pressed={mode === "cool"} className="mode-btn mode-btn-cool">
            <SnowIcon width={15} height={15} /> {L(biz, "Cool", "Hladi")}
          </button>
          <button type="button" onClick={() => setTemp(78)} aria-pressed={mode === "heat"} className="mode-btn mode-btn-heat">
            <FlameIcon width={15} height={15} /> {L(biz, "Heat", "Greje")}
          </button>
        </div>
      </div>
    </div>
  );
}
