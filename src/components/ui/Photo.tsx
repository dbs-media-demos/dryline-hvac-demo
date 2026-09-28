import Image from "next/image";
import clsx from "clsx";
import type { Photo as PhotoT } from "@/lib/images";

type Props = {
  photo: PhotoT;
  sizes: string;
  className?: string;
  /** Only for the single LCP image of a page. */
  preload?: boolean;
  quality?: 60 | 75 | 85;
  alt?: string;
  position?: string;
};

/** Cover-fill photo with its average colour as the loading placeholder. Parent must be positioned. */
export function Photo({ photo, sizes, className, preload, quality = 75, alt, position }: Props) {
  return (
    <Image
      src={photo.src}
      alt={alt ?? photo.alt}
      fill
      sizes={sizes}
      quality={quality}
      preload={preload}
      className={clsx("object-cover", className)}
      style={{ backgroundColor: photo.color, objectPosition: position }}
    />
  );
}
