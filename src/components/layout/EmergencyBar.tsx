"use client";

import { useEffect, useState } from "react";
import { site, telHref } from "@/lib/site";
import { techsAvailable } from "@/lib/hours";
import { PhoneIcon } from "@/components/ui/Icons";

/** Desktop: thin always-on bar above the header. Phones get the same promise in the bottom bar. */
export function EmergencyBar() {
  const [techs, setTechs] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setTechs(techsAvailable());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      style={{ viewTransitionName: "site-bar" }}
      className="fixed inset-x-0 top-0 z-[60] hidden h-[var(--bar-h)] items-center bg-navy text-frost lg:flex"
    >
      <div className="mx-auto flex w-full max-w-[1480px] items-center justify-between gap-6 px-8 text-[0.82rem]">
        <p className="flex items-center gap-3">
          <span className="font-semibold">No cool? No heat?</span>
          <span className="text-frost/70">We&rsquo;re on call 24/7 — same flat rate at 3 a.m.</span>
        </p>
        <div className="flex items-center gap-5">
          <p className="flex items-center gap-2 font-mono text-[0.72rem] tracking-wide text-frost/85" aria-live="polite">
            <span className="live-dot" aria-hidden />
            {techs === null ? "Technicians on call now" : `${techs} technicians available now`}
          </p>
          <a href={telHref} className="flex items-center gap-2 rounded-full bg-accent px-3 py-1 font-semibold text-navy transition-transform hover:scale-[1.04]">
            <PhoneIcon width={14} height={14} />
            {site.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
