import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { PageShell } from "@/components/layout/PageShell";
import { Photo } from "@/components/ui/Photo";
import { PhoneIcon } from "@/components/ui/Icons";
import { img } from "@/lib/images";
import { site, telHref } from "@/lib/site";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <SiteChrome>
      <PageShell>
        <section className="theme-navy relative isolate flex min-h-[100svh] items-end overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="anim-zoom absolute inset-0">
              <Photo photo={img.heatCoil} sizes="100vw" preload quality={60} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/30" />
          </div>
          <div className="mx-auto w-full max-w-[1480px] px-5 pt-40 pb-20 md:px-8">
            <p className="anim-fade eyebrow text-heat">Error 404 · page overheated</p>
            <h1 className="anim-heading display-xl mt-6 max-w-[12ch]" style={{ "--d": "0.1s" } as React.CSSProperties}>
              This room&rsquo;s at 404°.
            </h1>
            <p className="anim-fade lede mt-6 max-w-[34rem] text-frost/80" style={{ "--d": "0.25s" } as React.CSSProperties}>
              The page you&rsquo;re looking for moved or never existed. We&rsquo;ll send someone — or you can head somewhere cooler.
            </p>
            <div className="anim-fade mt-9 flex flex-col gap-3 sm:flex-row" style={{ "--d": "0.35s" } as React.CSSProperties}>
              <Link href="/" className="btn btn-accent on-dark">
                Back to home
              </Link>
              <Link href="/services" className="btn btn-ghost">
                Browse services
              </Link>
              <a href={telHref} className="btn btn-ghost">
                <PhoneIcon width={18} height={18} /> {site.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </PageShell>
    </SiteChrome>
  );
}
