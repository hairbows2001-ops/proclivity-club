import type { Img } from "@/content/images";
import { Picture } from "./Picture";

// One or more images side by side at a shared height.
// Columns are sized by aspect ratio, and the row is capped so that no image
// is ever displayed larger than its native pixel size.
export function ImageRow({
  images,
  caption,
  eager = false,
  stackOnMobile = true,
}: {
  images: Img[];
  caption?: string;
  eager?: boolean;
  stackOnMobile?: boolean;
}) {
  const minHeight = Math.min(...images.map((i) => i.height));
  const nativeWidth = Math.round(images.reduce((sum, i) => sum + (i.width / i.height) * minHeight, 0));
  const gaps = images.length - 1;

  return (
    <figure
      className={`image-row${stackOnMobile ? " stack-mobile" : ""}`}
      style={{ maxWidth: gaps ? `calc(${nativeWidth}px + ${gaps} * var(--img-gap))` : `${nativeWidth}px` }}
    >
      <div
        className="image-row-grid"
        style={{ gridTemplateColumns: images.map((i) => `${(i.width / i.height).toFixed(4)}fr`).join(" ") }}
      >
        {images.map((im, n) => (
          <Picture key={im.src} img={im} eager={eager && n === 0} />
        ))}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
