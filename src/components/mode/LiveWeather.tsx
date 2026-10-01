"use client";

import { useEffect, useState } from "react";
import { useBiz } from "@/components/preview/BizContext";

type Wx = { temp: number; code: number };

const DESCRIBE = {
  en: ["clear", "partly cloudy", "foggy", "rain", "snow", "showers", "storms"],
  sr: ["vedro", "delimično oblačno", "magla", "kiša", "sneg", "pljuskovi", "nevreme"],
};
const describe = (code: number, lang: "en" | "sr") => {
  const i = code === 0 ? 0 : code <= 3 ? 1 : code <= 48 ? 2 : code <= 67 ? 3 : code <= 77 ? 4 : code <= 82 ? 5 : 6;
  return DESCRIBE[lang][i];
};

/**
 * Live temperature from Open-Meteo (free, keyless): Oklahoma City on the concept site, the
 * business's own city on a preview (looked up with Open-Meteo's geocoding). Quietly hides on failure.
 */
export function LiveWeather({ className }: { className?: string }) {
  const biz = useBiz();
  const sr = biz.lang === "sr";
  const city = biz.preview ? biz.address.city || biz.area : "Oklahoma City";
  const [wx, setWx] = useState<Wx | null>(null);
  useEffect(() => {
    const ctrl = new AbortController();
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 800));
    const where = (): Promise<{ lat: number; lng: number }> =>
      !biz.preview
        ? Promise.resolve({ lat: 35.4676, lng: -97.5164 })
        : fetch(`https://geocoding-api.open-meteo.com/v1/search?count=1&name=${encodeURIComponent(city)}`, { signal: ctrl.signal })
            .then((r) => (r.ok ? r.json() : Promise.reject()))
            .then((d) => (d.results?.[0] ? { lat: d.results[0].latitude, lng: d.results[0].longitude } : Promise.reject()));
    const id = ric(() => {
      where()
        .then(({ lat, lng }) =>
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&temperature_unit=${sr ? "celsius" : "fahrenheit"}&timezone=auto`,
            { signal: ctrl.signal },
          ),
        )
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d) => setWx({ temp: Math.round(d.current.temperature_2m), code: d.current.weather_code }))
        .catch(() => {});
    });
    return () => {
      ctrl.abort();
      (window.cancelIdleCallback ?? window.clearTimeout)(id as number);
    };
  }, [biz.preview, city, sr]);
  return (
    <p className={className} aria-live="polite">
      <span className="block font-mono text-[0.66rem] tracking-[0.14em] text-frost/60 uppercase">
        {sr ? `Trenutno · ${city}` : biz.preview ? `Right now in ${city}` : "Right now in OKC"}
      </span>
      <span className="mt-1 block font-display text-[1.05rem] tracking-[-0.03em]">
        {wx ? (
          <>
            {wx.temp}°{sr ? "C" : "F"} <span className="text-frost/60">· {describe(wx.code, sr ? "sr" : "en")}</span>
          </>
        ) : (
          <span className="text-frost/60">{sr ? "Gledamo u nebo…" : "Checking the sky…"}</span>
        )}
      </span>
    </p>
  );
}
