import type { Biz } from "./biz-core";

const METRO = /\b(South OKC|Midtown OKC|OKC|Oklahoma City|Edmond|Norman|Moore|Yukon|Mustang)\b/g;

/**
 * The concept copy names Dryline and its Oklahoma towns. On an English preview those lines are
 * about a real business, so its name and area go in. Serbian previews use the dictionary.
 */
export function scrub(text: string, biz: Pick<Biz, "preview" | "shortName" | "area" | "lang">) {
  // Serbian previews translate the original text from the dictionary
  if (!biz.preview || biz.lang === "sr") return text;
  return text.replace(/Dryline Heat & Air|Dryline/g, biz.shortName).replace(METRO, biz.area);
}
