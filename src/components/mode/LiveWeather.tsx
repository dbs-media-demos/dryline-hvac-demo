"use client";

import { useEffect, useState } from "react";

type Wx = { temp: number; code: number };

const describe = (code: number) =>
  code === 0 ? "clear" : code <= 3 ? "partly cloudy" : code <= 48 ? "foggy" : code <= 67 ? "rain" : code <= 77 ? "snow" : code <= 82 ? "showers" : "storms";

/** Live Oklahoma City temperature from Open-Meteo (free, keyless). Quietly hides on failure. */
export function LiveWeather({ className }: { className?: string }) {
  const [wx, setWx] = useState<Wx | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 800));
    const id = ric(() => {
      fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=35.4676&longitude=-97.5164&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America%2FChicago",
        { signal: ctrl.signal },
      )
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d) => setWx({ temp: Math.round(d.current.temperature_2m), code: d.current.weather_code }))
        .catch(() => {});
    });
    return () => {
      ctrl.abort();
      (window.cancelIdleCallback ?? window.clearTimeout)(id as number);
    };
  }, []);

  return (
    <p className={className} aria-live="polite">
      <span className="block font-mono text-[0.66rem] tracking-[0.14em] text-frost/60 uppercase">Right now in OKC</span>
      <span className="mt-1 block font-display text-[1.05rem] tracking-[-0.03em]">
        {wx ? (
          <>
            {wx.temp}°F <span className="text-frost/60">· {describe(wx.code)}</span>
          </>
        ) : (
          <span className="text-frost/60">Checking the sky…</span>
        )}
      </span>
    </p>
  );
}
