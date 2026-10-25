import type { Img } from "@/content/projects";

// Plain <img> with intrinsic size to prevent layout shift. Images are
// pre-sized WebP files in /public/images, so no runtime optimisation is needed.
export function Picture({ img, eager = false, sizes }: { img: Img; eager?: boolean; sizes?: string }) {
  return (
    <img
      src={img.src}
      alt={img.alt}
      width={img.width}
      height={img.height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      sizes={sizes}
    />
  );
}
