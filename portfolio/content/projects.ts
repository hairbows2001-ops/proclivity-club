// Selected work, in order. Used by the homepage list and the case-study pages.
// All three are self-initiated concept projects; the site says so on every entry.

import { images, type Img } from "./images";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  disciplines: string[];
  // TODO(owner): HEWN's year comes from the portfolio ("Estd 2026"); confirm Compass and Gallery 188.
  year: string;
  href: string;
  cover: Img[];
};

export const projects: Project[] = [
  {
    slug: "hewn",
    title: "HEWN",
    summary: "A wellness brand that turns exercise equipment into sculptural objects for the home.",
    disciplines: ["Brand Strategy", "Identity Design", "Packaging", "Wellness"],
    year: "2026",
    href: "/work/hewn/",
    cover: [images.hewnHero],
  },
  {
    slug: "compass",
    title: "Compass",
    summary: "A calmer caregiving app for young adults supporting their ageing parents.",
    disciplines: ["Brand Strategy", "Identity Design", "Digital Product", "Health Tech"],
    year: "2026",
    href: "/work/compass/",
    cover: [images.compassHero],
  },
  {
    slug: "gallery-188",
    title: "Gallery 188",
    summary: "A social and content strategy that makes contemporary art feel less intimidating.",
    disciplines: ["Social Strategy", "Content Systems", "Short-Form Video", "Arts & Culture"],
    year: "2026",
    href: "/work/gallery-188/",
    cover: [images.g188Hall, images.g188Viewer],
  },
];

export function projectIndex(slug: string) {
  return projects.findIndex((p) => p.slug === slug);
}
