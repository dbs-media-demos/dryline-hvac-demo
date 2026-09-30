"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/ui/Icons";
import { agencyName, agencyUrl } from "@/lib/site";

const KEY = "dryline-demo-pill";

/** Tasteful "this is a concept site" marker, dismissible for the session. */
export function DemoPill() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(KEY) === "1";
    } catch {}
    const id = window.setTimeout(() => setShow(!dismissed), 1600);
    return () => window.clearTimeout(id);
  }, []);
  if (!show) return null;
  return (
    <div className="anim-fade fixed bottom-[112px] left-3 z-[45] flex items-center rounded-full bg-white/95 py-1 pr-1 pl-3.5 text-[0.75rem] font-medium text-navy shadow-[0_10px_30px_-10px_rgb(10_23_38/0.45)] ring-1 ring-navy/10 backdrop-blur lg:bottom-5 lg:left-auto lg:right-5">
      <a href={agencyUrl} target="_blank" rel="noopener" className="py-1.5">
        <span className="sm:hidden">Concept by </span>
        <span className="hidden sm:inline">Concept site by </span>
        <span className="font-semibold">{agencyName}</span> ↗
      </a>
      <button
        type="button"
        aria-label="Dismiss concept site notice"
        onClick={() => {
          setShow(false);
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
        }}
        className="ml-1 grid h-8 w-8 place-items-center rounded-full hover:bg-navy/5"
      >
        <CloseIcon width={14} height={14} />
      </button>
    </div>
  );
}
