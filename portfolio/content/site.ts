import { articles } from "./writing";

// Site-wide details. Edit these values to update the header, footer and Contact page.

export const site = {
  name: "Maha Fatima",
  role: "Marketing · Creative Strategy",
  statement:
    "I build brands, campaigns and content systems that connect strategy with strong visual storytelling.",
  // The phrase in the statement set in the italic accent face.
  statementAccent: "visual storytelling",
  footerLine: "Brand strategy, campaigns and content.",
  description:
    "Maha Fatima — marketing and creative strategy. Brands, campaigns and content systems that connect strategy with strong visual storytelling.",

  // Contact methods. Leave a value empty ("") and it is not shown anywhere.
  email: "maha.f.2001@hotmail.com",
  linkedin: "https://www.linkedin.com/in/maha-fatima-69b863306",
  cv: "", // put the PDF in /public (e.g. /public/maha-fatima-cv.pdf) and set "/maha-fatima-cv.pdf"
};

// Main navigation.
// Writing appears once content/writing.ts has articles.
export const nav = [
  { label: "Work", href: "/#work" },
  ...(articles.length > 0 ? [{ label: "Writing", href: "/writing/" }] : []),
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];
