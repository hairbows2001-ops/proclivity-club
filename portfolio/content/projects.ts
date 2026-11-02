// Selected work, in order. Used by the homepage list and the case-study pages.
// All three are self-initiated concept projects; the site says so on every entry.

import { images, type Img } from "./images";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  // Industry is kept apart from capabilities: what the project is about vs. what the work involved.
  industry: string;
  capabilities: string[];
  // How many capabilities the homepage entry lists before "+ n more" (the case study shows all).
  homeCapabilities: number;
  // Case study: one paragraph on Maha's contribution, and the closing capability summary.
  whatIDid: string;
  demonstrates: string[];
  // Only set a year the portfolio states. HEWN: "Estd 2026". Others: none stated, so omitted.
  year?: string;
  href: string;
  cover: Img[];
};

export const projects: Project[] = [
  {
    slug: "hewn",
    title: "HEWN",
    summary: "A wellness brand that turns exercise equipment into sculptural objects for the home.",
    industry: "Wellness / Consumer",
    capabilities: [
      "Brand Strategy",
      "Identity Design",
      "Product Design",
      "Packaging",
      "E-commerce",
      "Retail Experience",
      "Creative Direction",
    ],
    homeCapabilities: 5,
    whatIDid:
      "I developed HEWN from the strategy outward — defining the brand position, visual identity and product world, then extending the system across equipment concepts, packaging, e-commerce and retail experience.",
    demonstrates: [
      "Brand Strategy",
      "Identity Systems",
      "Product Thinking",
      "Packaging",
      "Digital Experience",
      "Retail Experience",
      "Creative Direction",
    ],
    year: "2026",
    href: "/work/hewn/",
    cover: [images.hewnHero],
  },
  {
    slug: "compass",
    title: "Compass",
    summary: "A calmer caregiving app for young adults supporting their ageing parents.",
    industry: "Caregiving / Health Tech",
    capabilities: [
      "Brand Strategy",
      "Identity Design",
      "Product Strategy",
      "UX/UI",
      "Digital Product",
      "Visual System",
      "Creative Direction",
    ],
    homeCapabilities: 5,
    whatIDid:
      "I developed the brand and digital product direction for Compass, connecting positioning and identity with UX/UI, product experience and a visual system designed for a caregiving context.",
    demonstrates: [
      "Brand Strategy",
      "Product Strategy",
      "UX/UI Thinking",
      "Identity Systems",
      "Digital Experience",
      "Information Clarity",
      "Creative Direction",
    ],
    href: "/work/compass/",
    cover: [images.compassHero],
  },
  {
    slug: "gallery-188",
    title: "Gallery 188",
    summary: "A social and content strategy that makes contemporary art feel less intimidating.",
    industry: "Arts & Culture",
    capabilities: [
      "Social Strategy",
      "Audience Strategy",
      "Content Systems",
      "Campaign Development",
      "Platform Strategy",
      "Short-Form Video",
      "Measurement",
      "Creative Direction",
    ],
    homeCapabilities: 5,
    whatIDid:
      "I developed a social and content strategy for Gallery 188, including audience thinking, recurring content systems, platform roles, short-form video concepts, campaign development and a measurement framework.",
    demonstrates: [
      "Social Strategy",
      "Audience Thinking",
      "Content Systems",
      "Campaign Development",
      "Platform Strategy",
      "Short-Form Video",
      "Measurement",
      "Creative Direction",
    ],
    href: "/work/gallery-188/",
    cover: [images.g188Hall, images.g188Viewer],
  },
];

export function projectIndex(slug: string) {
  return projects.findIndex((p) => p.slug === slug);
}
