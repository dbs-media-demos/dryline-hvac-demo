import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { Dial } from "@/components/mode/Dial";
import { LiveWeather } from "@/components/mode/LiveWeather";
import { Airflow } from "@/components/fx/Airflow";
import { PhoneIcon, StarIcon } from "@/components/ui/Icons";
import { img } from "@/lib/images";
import { site, telHref } from "@/lib/site";

function Letters({ text, accentFrom }: { text: string; accentFrom: number }) {
  const words = text.split(" ");
  let i = 0;
  return (
    <>
      {words.map((w, wi) => (
        <span key={wi} className={`inline-block whitespace-nowrap ${wi >= accentFrom ? "text-accent" : ""}`}>
          {w.split("").map((ch) => (
            <span key={i} className="mode-word" style={{ "--i": i++ } as React.CSSProperties}>
              {ch}
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block w-[0.28em]" />}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <section className="theme-navy relative isolate flex min-h-[100svh] flex-col overflow-hidden" aria-labelledby="hero-title">
      {/* Photo layers: frost for cooling, flame for heating — crossfaded by --mix. */}
      <div className="absolute inset-0 -z-10">
        <div className="anim-zoom absolute inset-0">
          <Photo photo={img.heroFrost} sizes="100vw" preload quality={60} />
        </div>
        <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: "var(--mix)" }}>
          <Photo photo={img.heroFlame} sizes="100vw" quality={60} />
        </div>
        <div className="absolute inset-0 mix-blend-color opacity-40" style={{ background: "var(--accent)" }} />
        <div className="absolute inset-0 bg-navy/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/20 to-transparent" />
        <div className="grain absolute inset-0 overflow-hidden" />
      </div>
      <Airflow className="absolute inset-0 -z-10 h-full w-full" />

      <div className="mx-auto grid w-full max-w-[1480px] flex-1 content-center items-center gap-x-10 gap-y-7 px-5 pt-[calc(var(--bar-h)+var(--header-h)+28px)] pb-10 md:px-8 lg:grid-cols-12 lg:gap-6 lg:pb-6">
        {/* On phones the column dissolves (display: contents) so the dial can sit right under the headline. */}
        <div className="contents lg:col-span-7 lg:block">
          <h1 id="hero-title" className="anim-fade eyebrow order-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-frost/85" style={{ "--d": "0.05s" } as React.CSSProperties}>
            <span className="h-px w-8 bg-accent" aria-hidden />
            Heating &amp; air conditioning · Oklahoma City
          </h1>

          <div className="anim-heading relative order-2 lg:mt-6" aria-hidden style={{ "--d": "0.1s" } as React.CSSProperties}>
            <p className="mode-cool display-xl">
              <Letters text="Cool it down." accentFrom={2} />
            </p>
            <p className="mode-heat display-xl">
              <Letters text="Warm it up." accentFrom={2} />
            </p>
          </div>

          <p className="lede order-4 max-w-[34rem] text-frost/80 lg:mt-7">
            Oklahoma weather doesn&rsquo;t do mild. We do. Same-day AC and furnace repair, honest replacements, and a real person on the phone at 3 a.m. —{" "}
            <span className="text-frost">at the same flat rate as noon.</span>
          </p>

          <div className="anim-fade order-5 flex flex-col gap-3 sm:flex-row lg:mt-9" style={{ "--d": "0.35s" } as React.CSSProperties}>
            <a href={telHref} className="btn btn-accent on-dark min-h-[56px] px-7 text-[1.02rem]">
              <PhoneIcon /> Call {site.phoneDisplay}
            </a>
            <Link href="/schedule" className="btn btn-ghost min-h-[56px] px-7 text-[1.02rem]">
              Schedule service
            </Link>
          </div>
        </div>

        <div className="anim-fade order-3 mx-auto w-full max-w-[290px] sm:max-w-[380px] lg:order-none lg:col-span-5 lg:max-w-[480px]" style={{ "--d": "0.3s" } as React.CSSProperties}>
          <Dial />
        </div>
      </div>

      <div className="anim-fade relative mx-auto w-full max-w-[1480px] px-5 pb-8 md:px-8" style={{ "--d": "0.5s" } as React.CSSProperties}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/15 pt-6 md:grid-cols-4">
          <p>
            <span className="flex items-center gap-1 text-accent" role="img" aria-label={`Rated ${site.rating.value} out of 5`}>
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} width={14} height={14} />
              ))}
            </span>
            <span className="mt-1 block font-display text-[1.05rem] tracking-[-0.03em]">
              {site.rating.value} <span className="text-frost/60">· {site.rating.count.toLocaleString("en-US")} Google reviews</span>
            </span>
          </p>
          <p>
            <span className="block font-mono text-[0.66rem] tracking-[0.14em] text-frost/60 uppercase">Emergency arrival</span>
            <span className="mt-1 block font-display text-[1.05rem] tracking-[-0.03em]">{site.stats.arrival} min average</span>
          </p>
          <p>
            <span className="block font-mono text-[0.66rem] tracking-[0.14em] text-frost/60 uppercase">Pricing</span>
            <span className="mt-1 block font-display text-[1.05rem] tracking-[-0.03em]">Flat-rate · no overtime</span>
          </p>
          <LiveWeather />
        </div>
      </div>
    </section>
  );
}
