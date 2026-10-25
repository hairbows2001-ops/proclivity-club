// MISSOSOUP essays on Substack, shown on /writing (all) and on the homepage (first four).
// Dated entries sort newest first; undated ones keep the order listed here.
// Only add a date, description or topic that the article itself gives; otherwise leave it out.
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

// Titles and links as supplied by Maha. No dates, subtitles or topics were supplied, so none are set.
export const articles: Article[] = [
  {
    title: "Beauty Wants Out of the Makeup Bag",
    url: "https://substack.com/@missossoup/note/p-222087617",
    publication: "MISSOSOUP",
  },
  {
    title: "Marketing Is Entering Its Show-Your-Work Era",
    url: "https://substack.com/@missossoup/note/p-221790471",
    publication: "MISSOSOUP",
  },
  {
    title: "The Next Luxury Is Having One Less Decision to Make",
    url: "https://substack.com/@missossoup/note/c-361898914",
    publication: "MISSOSOUP",
  },
  {
    title: "Why Brands Are Building Entertainment Catalogues",
    url: "https://substack.com/@missossoup/note/c-356728477",
    publication: "MISSOSOUP",
  },
  {
    title: "The Next AI Promise Is Knowing Its Place",
    url: "https://substack.com/@missossoup/note/p-218501158",
    publication: "MISSOSOUP",
  },
  {
    title: "Social Video Wins Attention but Loses the Brand",
    url: "https://substack.com/@missossoup/note/p-218343534",
    publication: "MISSOSOUP",
  },
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
