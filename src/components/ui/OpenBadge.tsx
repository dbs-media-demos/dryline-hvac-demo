"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { openStatus } from "@/lib/biz-core";
import { useBiz } from "@/components/preview/BizContext";
import { isPhone } from "@/lib/motion";

/** Live "Office open · until 7 pm" badge in the business's own time. Emergency line is always on. */
export function OpenBadge({ className }: { className?: string }) {
  const biz = useBiz();
  const [status, setStatus] = useState<{ open: boolean; text: string } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let id = 0;
    const update = () => setStatus(openStatus(biz));
    const start = () => {
      update();
      id = window.setInterval(update, 60_000);
    };
    // Phones read the clock once the badge comes near: it starts up Intl, a long task during hydration.
    const io = isPhone()
      ? new IntersectionObserver(
          ([e]) => {
            if (!e.isIntersecting) return;
            io?.disconnect();
            start();
          },
          { rootMargin: "100% 0px" },
        )
      : null;
    if (io) io.observe(ref.current!);
    else start();
    return () => {
      io?.disconnect();
      window.clearInterval(id);
    };
  }, [biz]);
  const always = biz.lang === "sr" ? "hitne intervencije 24/7" : "24/7 emergency";
  return (
    <span ref={ref} className={clsx("inline-flex items-center gap-2 rounded-full border border-current/20 px-3 py-1.5 font-mono text-[0.7rem] tracking-wide phone:min-h-[2.6em] phone:rounded-2xl phone:py-1 phone:text-[0.7rem] phone:leading-tight", className)}>
      <span className={clsx("h-2 w-2 rounded-full", status?.open === false ? "bg-amber-400" : "bg-emerald-400")} aria-hidden />
      {status ? `${status.text} · ${always}` : biz.lang === "sr" ? "Hitne intervencije 24/7" : "24/7 emergency dispatch"}
    </span>
  );
}
