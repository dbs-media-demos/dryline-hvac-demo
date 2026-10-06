"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Logo } from "@/components/brand/Logo";
import { ArrowUpRight, PhoneIcon } from "@/components/ui/Icons";
import { nav } from "@/lib/site";
import { useBiz } from "@/components/preview/BizContext";
import { telOf } from "@/lib/biz-core";
import { services, kindLabel, type ServiceKind } from "@/content/services";

const groups: ServiceKind[] = ["cool", "heat", "air"];

export function Header() {
  const biz = useBiz();
  const telHref = telOf(biz);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  // Menus remember which page they were opened on, so navigating closes them without an effect.
  const [menuAt, setMenuAt] = useState<string | null>(null);
  const [megaAt, setMegaAt] = useState<string | null>(null);
  const menuOpen = menuAt === pathname;
  const megaOpen = megaAt === pathname;
  const setMenuOpen = (v: boolean | ((o: boolean) => boolean)) => setMenuAt((typeof v === "function" ? v(menuOpen) : v) ? pathname : null);
  const setMegaOpen = (v: boolean) => setMegaAt(v ? pathname : null);
  const [preview, setPreview] = useState(services[0]);
  const lastY = useRef(0);
  const closeTimer = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Only flip on a clear direction change; tiny Lenis deltas (<4px) keep the current state.
      if (y < 320 || y < lastY.current - 4) setHidden(false);
      else if (y > lastY.current + 4) setHidden(true);
      else return;
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) window.__lenis?.stop();
    else window.__lenis?.start();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuAt(null);
        setMegaAt(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const solid = scrolled || megaOpen;
  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 140);
  };

  return (
    <>
      <header
        style={{ viewTransitionName: "site-header", top: "var(--bar-h)" }}
        className={clsx(
          "fixed inset-x-0 z-50 transition-[transform,background-color,color,box-shadow] duration-500 ease-[var(--ease-out-expo)]",
          hidden && !menuOpen && !megaOpen ? "-translate-y-[140%]" : "translate-y-0",
          solid && !menuOpen ? "bg-frost/85 text-navy shadow-[0_1px_0_var(--line)] backdrop-blur-xl" : "bg-transparent text-frost",
        )}
      >
        <div className="mx-auto flex h-[var(--header-h)] max-w-[1480px] items-center justify-between gap-6 px-5 md:px-8">
          <Link href="/" className="relative z-10 rounded-lg">
            <Logo tone={solid && !menuOpen ? "light" : "dark"} />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            <div onMouseEnter={openMega} onMouseLeave={closeMega} className="relative">
              <Link
                href="/services"
                aria-expanded={megaOpen}
                aria-controls="mega"
                onFocus={openMega}
                className={clsx("rounded-full px-3.5 py-2 text-[0.94rem] font-medium transition-colors hover:bg-current/8", pathname.startsWith("/services") && "underline decoration-2 underline-offset-8")}
              >
                Services
              </Link>
            </div>
            {nav.slice(1).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={clsx("whitespace-nowrap rounded-full px-3 py-2 xl:px-3.5", l.href === "/repair-or-replace" && "hidden xl:block", "rounded-full py-2 text-[0.94rem] font-medium transition-colors hover:bg-current/8", pathname === l.href && "underline decoration-2 underline-offset-8")}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="relative z-10 flex items-center gap-2">
            <a href={telHref} className="hidden items-center gap-2 rounded-full px-3 py-2 font-mono text-[0.8rem] tracking-tight xl:flex" aria-label={`${biz.lang === "sr" ? "Pozovite" : "Call"} ${biz.phoneDisplay}`}>
              <PhoneIcon width={16} height={16} />
              {biz.phoneDisplay}
            </a>
            <Link href="/schedule" className="btn btn-accent hidden min-h-[44px] px-5 text-[0.9rem] sm:inline-flex">
              Schedule service
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid h-11 w-11 place-items-center rounded-full border border-current/25 lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span className={clsx("absolute left-0 h-[2px] w-5 bg-current transition-transform duration-500", menuOpen ? "top-[5px] rotate-45" : "top-0")} />
                <span className={clsx("absolute left-0 h-[2px] w-5 bg-current transition-transform duration-500", menuOpen ? "top-[5px] -rotate-45" : "top-[10px]")} />
              </span>
            </button>
          </div>
        </div>

        {/* Services mega menu (desktop) */}
        <div
          id="mega"
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
          className={clsx(
            "absolute inset-x-0 top-full hidden border-t border-line bg-frost text-navy shadow-[0_30px_60px_-30px_rgb(10_23_38/0.35)] transition-[opacity,clip-path] duration-500 ease-[var(--ease-out-expo)] lg:block",
            megaOpen ? "pointer-events-auto opacity-100 [clip-path:inset(0_0_0_0)]" : "pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]",
          )}
          inert={!megaOpen}
        >
          <div className="mx-auto grid max-w-[1480px] grid-cols-[1fr_1fr_1fr_1.1fr] gap-8 px-8 py-10">
            {groups.map((g) => (
              <div key={g}>
                <p className="eyebrow text-muted">{kindLabel[g]}</p>
                <ul className="mt-4 space-y-1">
                  {services
                    .filter((s) => s.kind === g)
                    .map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}`}
                          onMouseEnter={() => setPreview(s)}
                          onFocus={() => setPreview(s)}
                          className="group flex items-center justify-between rounded-xl px-3 py-2.5 -mx-3 font-display text-[1.05rem] tracking-[-0.03em] transition-colors hover:bg-white"
                        >
                          {s.name}
                          <ArrowUpRight width={16} height={16} className="opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
            <Link href={`/services/${preview.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-2xl" tabIndex={-1}>
              <Image
                key={preview.slug}
                src={preview.photo.src}
                alt=""
                fill
                sizes="360px"
                quality={60}
                className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                style={{ backgroundColor: preview.photo.color }}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
              <span className="absolute inset-x-5 bottom-5 text-frost">
                <span className="block font-mono text-xs opacity-80">{preview.price}</span>
                <span className="mt-1 block text-[0.95rem] leading-snug">{preview.short}</span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={clsx(
          "theme-navy fixed inset-0 z-40 flex flex-col overflow-y-auto px-5 pt-[calc(var(--header-h)+24px)] pb-28 transition-[clip-path] duration-700 ease-[var(--ease-in-out-quart)] lg:hidden",
          menuOpen ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]",
        )}
        inert={!menuOpen}
      >
        <nav aria-label="Mobile">
          <ul>
            {[{ href: "/", label: "Home" }, ...nav, { href: "/specials", label: "Specials" }, { href: "/contact", label: "Contact" }].map((l, i) => (
              <li
                key={l.href}
                className="border-b border-line transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]"
                style={{ transitionDelay: menuOpen ? `${120 + i * 45}ms` : "0ms", opacity: menuOpen ? 1 : 0, transform: menuOpen ? "none" : "translateY(24px)" }}
              >
                <Link href={l.href} className="flex items-center justify-between py-4 font-display text-[1.9rem] tracking-[-0.04em]">
                  {l.label}
                  <ArrowUpRight className="text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 grid gap-3">
          <a href={telHref} className="btn btn-accent w-full">
            <PhoneIcon /> Call {biz.phoneDisplay}
          </a>
          <Link href="/schedule" className="btn btn-ghost w-full">
            Schedule service
          </Link>
        </div>
      </div>
    </>
  );
}
