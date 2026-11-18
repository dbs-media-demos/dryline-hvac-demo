import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeContent } from "@/components/home/HomeContent";
import { DuctHouse } from "@/components/home/DuctHouse";
import { previewBiz } from "@/lib/preview";
import { previewMetadata } from "@/lib/preview-meta";

/** The preview without 3D: the same page as /for/<token>, the drawn-house hero in place of the thermostat. */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return previewMetadata((await params).token);
}

export default async function PreviewPageV2({ params }: Props) {
  const biz = await previewBiz((await params).token);
  if (!biz) notFound();
  return <HomeContent biz={biz} hero={<DuctHouse />} />;
}
