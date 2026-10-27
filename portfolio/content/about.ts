// Biography, experience, education and expertise for the About page.
// The homepage shows only the first paragraph of `bio`.

export const lede = "I am a marketer and creative strategist.";

export const bio = [
  "I build brands, campaigns and content systems that connect strategy with strong visual storytelling. My work sits at the intersection of brand strategy, social media, cultural insight and creative direction.",
  "I’m interested in what makes people pay attention — and how consumer behaviour, culture and creativity can be translated into campaigns that feel relevant, intentional and memorable.",
  "I help businesses create a brand or identity that is clear, strong and reflective of what they are.",
];

// Homepage About preview: background that continues from the intro without repeating it.
// Built from the entries below so it stays in step with the About page.
export function previewParagraph() {
  return `My work sits at the intersection of brand strategy, social media, cultural insight and creative direction. I studied psychology and sociology at the University of Waterloo, and I’m currently ${experience[0].role} at ${experience[0].org}.`;
}

export const experience = [
  { role: "Marketing & Communications Lead", org: "Women’s Habitat of Etobicoke", years: "2025–Present" },
  { role: "Marketing & Communications Coordinator", org: "Academy of Learning Career College", years: "2025–2026" },
  { role: "VP of Marketing", org: "Chai and Verse, University of Waterloo", years: "2022–2024" },
];

export const education = [
  { role: "BA, Liberal Studies", org: "University of Waterloo · Psychology + Sociology", years: "2019–2024" },
];

export const expertise = [
  "Brand strategy & positioning",
  "Integrated campaign development",
  "Social media strategy & content",
  "Digital marketing & paid media",
  "Email marketing & CRM",
  "Creative direction & visual storytelling",
  "Audience & cultural research",
  "Website & landing page content",
  "Marketing analytics & reporting",
];
