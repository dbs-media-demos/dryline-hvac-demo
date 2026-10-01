import type { ReactNode } from "react";
import { EmergencyBar } from "./EmergencyBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBar } from "./MobileBar";
import { DemoPill } from "./DemoPill";
import type { Biz } from "@/lib/biz-core";

/** Bars, header, the page, footer and the demo pill. Client parts read the business from BizProvider. */
export function SiteChrome({ children, biz }: { children: ReactNode; biz?: Biz }) {
  return (
    <>
      <EmergencyBar />
      <Header />
      {children}
      <Footer biz={biz} />
      <MobileBar />
      <DemoPill />
    </>
  );
}
