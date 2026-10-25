// MISSOSOUP essays on Substack, shown on /writing (all) and on the homepage (latest four).
// Use only details confirmed from the live Substack page; leave a field out if it isn't there.
// The Writing nav link, page and homepage section appear once `articles` has entries.
//
// {
//   title: "Exact published title",
//   url: "https://…substack.com/p/…",   // canonical article URL
//   date: "2026-03-14",                 // publication date, YYYY-MM-DD (optional)
//   description: "The article's own subtitle.", // optional
//   topic: "Marketing",                 // only if Substack labels it (optional)
//   publication: "MISSOSOUP",
// },

export type Article = {
  title: string;
  url: string;
  date?: string;
  description?: string;
  topic?: string;
  publication?: "MISSOSOUP";
};

export const articles: Article[] = [];

// Links supplied by Maha that could not be opened from the build environment
// (Substack is blocked by its network policy), so nothing about them is confirmed.
// Not rendered anywhere. Move each into `articles` once its details are verified.
// URL format only: "p-" note links usually point to a post, "c-" to a note or comment.
export const unresolved = [
  "https://substack.com/@missossoup/note/p-222087617",
  "https://substack.com/@missossoup/note/p-221790471",
  "https://substack.com/@missossoup/note/c-361898914",
  "https://substack.com/@missossoup/note/c-356728477",
  "https://substack.com/@missossoup/note/p-218501158",
  "https://substack.com/@missossoup/note/p-218343534",
];

// Newest first; undated entries keep their listed order after dated ones.
export const sortedArticles = articles
  .map((a, i) => ({ a, i }))
  .sort((x, y) => {
    if (x.a.date && y.a.date) return y.a.date.localeCompare(x.a.date);
    if (x.a.date) return -1;
    if (y.a.date) return 1;
    return x.i - y.i;
  })
  .map(({ a }) => a);

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
