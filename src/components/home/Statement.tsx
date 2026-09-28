import { Photo } from "@/components/ui/Photo";
import { Parallax, Reveal, ScrubWords } from "@/components/ui/Reveal";
import { img } from "@/lib/images";

export function Statement() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36" aria-labelledby="statement-title">
      <div className="mx-auto grid max-w-[1480px] gap-16 px-5 md:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Reveal>
            <h2 id="statement-title" className="eyebrow text-accent-auto flex items-center gap-3">
              <span className="h-px w-8 bg-current" aria-hidden />
              Why Dryline
            </h2>
          </Reveal>
          <ScrubWords
            className="mt-8 font-display text-[clamp(1.75rem,3.6vw,3.35rem)] leading-[1.08] tracking-[-0.045em]"
            text="104° in July. 9° in January. Sometimes a forty-degree swing before dinner. Oklahoma weather doesn't do mild — so since 2011 we've kept 12,400 metro homes on the comfortable side of the line."
            accent={["104°", "9°", "line"]}
          />
          <Reveal className="mt-12 grid max-w-[40rem] gap-8 sm:grid-cols-2" stagger={0.1}>
            <div className="border-t border-line pt-5">
              <p className="font-display text-lg tracking-[-0.03em]">Flat-rate, in writing</p>
              <p className="mt-2 text-muted">You approve the price before we start. It doesn&rsquo;t change at midnight, on Sundays or on the Fourth of July.</p>
            </div>
            <div className="border-t border-line pt-5">
              <p className="font-display text-lg tracking-[-0.03em]">Fixed right, or it&rsquo;s free</p>
              <p className="mt-2 text-muted">100% satisfaction guarantee and a 1-year warranty on every repair. Ten years on every install.</p>
            </div>
          </Reveal>
        </div>

        <div className="relative h-[520px] sm:h-[620px] lg:col-span-5 lg:h-auto">
          <Parallax className="absolute top-0 right-0 h-[72%] w-[70%] rounded-[28px]" amount={14}>
            <div className="absolute inset-0">
              <Photo photo={img.summerSun} sizes="(min-width: 1024px) 28vw, 70vw" />
            </div>
          </Parallax>
          <span className="absolute top-5 right-5 z-10 rounded-full bg-navy/70 px-3 py-1.5 font-mono text-[0.7rem] tracking-wide text-frost backdrop-blur">JUL · 104°F</span>
          <Parallax className="absolute bottom-0 left-0 h-[52%] w-[62%] rounded-[28px] ring-8 ring-frost" amount={18}>
            <div className="absolute inset-0">
              <Photo photo={img.winterHouseNight} sizes="(min-width: 1024px) 24vw, 62vw" />
            </div>
          </Parallax>
          <span className="absolute bottom-5 left-5 z-10 rounded-full bg-navy/70 px-3 py-1.5 font-mono text-[0.7rem] tracking-wide text-frost backdrop-blur">JAN · 9°F</span>
        </div>
      </div>
    </section>
  );
}
