import Link from "next/link";
import { telHref } from "@/lib/site";
import { PhoneIcon } from "@/components/ui/Icons";

/** Phones: thumb-reach Call + Schedule, always visible. */
export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-frost backdrop-blur-lg lg:hidden">
      <p className="mb-1.5 flex items-center justify-center gap-2 font-mono text-[0.62rem] tracking-[0.12em] text-frost/75 uppercase">
        <span className="live-dot" aria-hidden /> No cool? No heat? On call 24/7
      </p>
      <div className="grid grid-cols-2 gap-2">
        <a href={telHref} className="btn btn-accent min-h-[48px] w-full">
          <PhoneIcon width={18} height={18} /> Call now
        </a>
        <Link href="/schedule" className="btn min-h-[48px] w-full border border-white/25">
          Schedule
        </Link>
      </div>
    </div>
  );
}
