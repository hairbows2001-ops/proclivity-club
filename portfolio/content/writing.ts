// Substack essays shown on /writing (all) and on the homepage (the four most recent).
// Add one entry per published article, using only details from the real article.
// The Writing page, its nav link and the homepage section appear once this list has entries.
//
// {
//   title: "Exact article title",
//   date: "2026-03-14",                 // publication date, YYYY-MM-DD
//   dek: "One-line description, taken from the article's subtitle.",
//   url: "https://yourname.substack.com/p/article-slug",
//   topics: ["Culture", "Marketing"],   // optional
// },

export type Article = {
  title: string;
  date: string;
  dek: string;
  url: string;
  topics?: string[];
};

export const articles: Article[] = [];

export const sortedArticles = [...articles].sort((a, b) => b.date.localeCompare(a.date));

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
