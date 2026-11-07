import { Reveal, ScrubWords } from "@/components/ui/Reveal";
import { ComfortLine } from "@/components/home/ComfortLine";
import { Promises } from "@/components/home/Promises";
import { defaultBiz } from "@/lib/biz";
import type { Biz } from "@/lib/biz-core";

const statement = {
  concept: "104° in July. 9° in January. Sometimes a forty-degree swing before dinner. Oklahoma weather doesn't do mild — so since 2011 we've kept 12,400 metro homes on the comfortable side of the line.",
  en: "Scorching summers. Freezing winters. Sometimes a forty-degree swing before dinner. Weather here doesn't do mild — so we keep homes on the comfortable side of the line, whatever the forecast says.",
  sr: "Leti 40°. Zimi minus deset. Ponekad skok od dvadeset stepeni pre večere. Vreme ovde ne zna za umereno — zato mi držimo vaš dom na prijatnoj strani, šta god prognoza kaže.",
};

export function Statement({ biz = defaultBiz }: { biz?: Biz }) {
  // ScrubWords splits words as it renders, so the copy is picked here rather than translated later
  const text = !biz.preview ? statement.concept : biz.lang === "sr" ? statement.sr : statement.en;
  const accent = !biz.preview ? ["104°", "9°", "line"] : biz.lang === "sr" ? ["40°.", "deset.", "strani,"] : ["summers.", "winters.", "line,"];
  return (
    <section className="mix-scope relative py-24 md:py-36 phone:py-8" aria-labelledby="statement-title">
      <div className="mx-auto grid max-w-[1480px] gap-14 px-5 phone:gap-3 md:px-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0">
        <div>
          <Reveal>
            <h2 id="statement-title" className="eyebrow text-accent-auto flex items-center gap-3">
              <span className="h-px w-8 bg-current" aria-hidden />
              {biz.preview ? (biz.lang === "sr" ? "Zašto mi" : `Why ${biz.shortName}`) : "Why Dryline"}
            </h2>
          </Reveal>
          <ScrubWords
            className="mt-8 font-display text-[clamp(1.75rem,3.4vw,3.2rem)] leading-[1.08] tracking-[-0.045em] phone:mt-2.5 phone:text-[1.06rem] phone:leading-[1.26] phone:tracking-[-0.03em]"
            text={text}
            accent={accent}
          />
        </div>

        {/* Phones: the chart right after the statement; desktop: a sticky column beside it */}
        <Reveal className="lg:sticky lg:top-[calc(var(--bar-h)+var(--header-h)+24px)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[min(700px,calc(100svh-var(--bar-h)-var(--header-h)-48px))] lg:self-start">
          <ComfortLine lang={biz.lang === "sr" ? "sr" : "en"} />
        </Reveal>

        {/* Phones show these with the estimate, further up the page */}
        <Promises className="phone:hidden" />
      </div>
    </section>
  );
}
