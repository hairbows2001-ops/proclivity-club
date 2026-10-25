// Selected work shown on the homepage, in order.
// `href` is the case-study page. Leave it out until that page exists and the
// project is shown without a link.

export type Img = { src: string; alt: string; width: number; height: number };

export type Project = {
  slug: string;
  title: string;
  summary: string;
  discipline: string;
  tags: string[];
  href?: string;
  cover: Img[];
};

export const projects: Project[] = [
  {
    slug: "hewn",
    title: "HEWN",
    summary: "Sculptural fitness objects designed to be seen as much as they are used.",
    discipline: "Brand identity",
    tags: ["Wellness", "Brand strategy", "Identity", "Packaging", "Retail"],
    cover: [
      {
        src: "/images/hewn-hero.webp",
        alt: "HEWN campaign image: dark oak and black ash fitness weights arranged on a stone ledge in warm light.",
        width: 1365,
        height: 768,
      },
    ],
  },
  {
    slug: "compass",
    title: "Compass",
    summary: "A calmer caregiving app for young adults supporting their ageing parents.",
    discipline: "Brand identity · Digital product",
    tags: ["Health tech", "Brand strategy", "Identity", "UX/UI"],
    cover: [
      {
        src: "/images/compass-hero.webp",
        alt: "Compass logo, a soft four-point star inside a glowing circle, with the line “Guiding your health. Every day.” on deep green.",
        width: 1365,
        height: 768,
      },
    ],
  },
  {
    slug: "gallery-188",
    title: "Gallery 188",
    summary: "A social and content strategy that makes contemporary art feel less intimidating.",
    discipline: "Social & content strategy",
    tags: ["Arts & culture", "Content systems", "Short-form video", "Campaign"],
    cover: [
      {
        src: "/images/g188-hall.webp",
        alt: "A bright gallery hall with a glass roof, concrete columns and a single large painting on the far wall.",
        width: 737,
        height: 700,
      },
      {
        src: "/images/g188-viewer.webp",
        alt: "A visitor standing in front of a large abstract painting in black and cream.",
        width: 519,
        height: 768,
      },
    ],
  },
];
