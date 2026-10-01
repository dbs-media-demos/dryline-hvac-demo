"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { openStatus } from "@/lib/biz-core";
import { useBiz } from "@/components/preview/BizContext";

/** Live "Office open · until 7 pm" badge in the business's own time. Emergency line is always on. */
export function OpenBadge({ className }: { className?: string }) {
  const biz = useBiz();
  const [status, setStatus] = useState<{ open: boolean; text: string } | null>(null);
  useEffect(() => {
    const update = () => setStatus(openStatus(biz));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, [biz]);
  const always = biz.lang === "sr" ? "hitne intervencije 24/7" : "24/7 emergency";
  return (
    <span className={clsx("inline-flex items-center gap-2 rounded-full border border-current/20 px-3 py-1.5 font-mono text-[0.7rem] tracking-wide", className)}>
      <span className={clsx("h-2 w-2 rounded-full", status?.open === false ? "bg-amber-400" : "bg-emerald-400")} aria-hidden />
      {status ? `${status.text} · ${always}` : biz.lang === "sr" ? "Hitne intervencije 24/7" : "24/7 emergency dispatch"}
    </span>
  );
}
