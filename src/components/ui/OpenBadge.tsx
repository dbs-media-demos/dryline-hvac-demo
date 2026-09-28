"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { officeStatus, type OpenStatus } from "@/lib/hours";

/** Live "Office open · closes 7 pm" badge (Oklahoma City time). Emergency line is always on. */
export function OpenBadge({ className }: { className?: string }) {
  const [status, setStatus] = useState<OpenStatus | null>(null);
  useEffect(() => {
    const update = () => setStatus(officeStatus());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className={clsx("inline-flex items-center gap-2 rounded-full border border-current/20 px-3 py-1.5 font-mono text-[0.7rem] tracking-wide", className)}>
      <span className={clsx("h-2 w-2 rounded-full", status?.open === false ? "bg-amber-400" : "bg-emerald-400")} aria-hidden />
      {status ? `${status.label} · 24/7 emergency` : "24/7 emergency dispatch"}
    </span>
  );
}
