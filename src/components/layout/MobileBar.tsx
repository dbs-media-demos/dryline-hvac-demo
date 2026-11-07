"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useBiz } from "@/components/preview/BizContext";
import { L, telOf } from "@/lib/biz-core";
import { PhoneIcon } from "@/components/ui/Icons";

/**
 * Phones: thumb-reach Call + Schedule. On the homepage it waits until the hero's own Call button
 * has scrolled away, so the first screen has one Call button and the next section can peek in.
 */
export function MobileBar() {
  const biz = useBiz();
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname.startsWith("/for/");
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const call = document.querySelector("[data-hero-call]");
    if (!call) return;
    const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(call);
    return () => io.disconnect();
  }, [isHome]);

  const hidden = isHome && !pastHero;
  return (
    <div
      data-mobile-bar
      inert={hidden}
      className={clsx(
        "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-frost transition-transform duration-300 ease-[var(--ease-out-expo)] lg:hidden",
        hidden && "translate-y-full",
      )}
    >
      <p className="mb-1.5 flex items-center justify-center gap-2 font-mono text-[0.62rem] tracking-[0.12em] text-frost/75 uppercase">
        <span className="live-dot" aria-hidden /> No cool? No heat? On call 24/7
      </p>
      <div className="grid grid-cols-[1.6fr_1fr] gap-2">
        <a href={telOf(biz)} className="btn btn-accent min-h-[48px] w-full min-w-0 px-3 text-[0.9rem]">
          <PhoneIcon width={18} height={18} /> {L(biz, "Call", "Pozovite")} {biz.phoneDisplay}
        </a>
        <Link href="/schedule" className="btn min-h-[48px] w-full min-w-0 border border-white/25 px-3 text-[0.9rem]">
          Schedule
        </Link>
      </div>
    </div>
  );
}
