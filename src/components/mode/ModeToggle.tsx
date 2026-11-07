"use client";

import { useSyncExternalStore } from "react";
import { useBiz } from "@/components/preview/BizContext";
import { getTemp, modeFor, setTemp, subscribeTemp } from "@/lib/mode";
import { L } from "@/lib/biz-core";
import { FlameIcon, SnowIcon } from "@/components/ui/Icons";

/**
 * The thermostat on phones: a small Cool/Heat tap control below the first screen. It re-themes the
 * site like the desktop dial; a swipe that starts on it just scrolls the page.
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
        <p className="eyebrow text-frost/70">
          <span className="show-cool">{L(biz, "Cooling to", "Hlađenje na")}</span>
          <span className="show-heat">{L(biz, "Heating to", "Grejanje na")}</span>{" "}
          <span className="tabular inline-block min-w-[2ch] text-frost" data-no-translate>
            {shown}
          </span>
          °
        </p>
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
