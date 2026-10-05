/**
 * ═════════════════════════════════════════════════════════════════════════
 *  AUTHORS
 * ═════════════════════════════════════════════════════════════════════════
 *  Author pages are created automatically from content/books.ts.
 *  Add an entry here only if you want to show dates or a short biography.
 *
 *  The name on the left must be spelled exactly as in books.ts.
 * ═════════════════════════════════════════════════════════════════════════
 */

import type { AuthorInput } from "@/lib/types";

export const authors: Record<string, AuthorInput> = {
  "Virginia Woolf": {
    born: 1882,
    died: 1941,
    bio: "Novelist, essayist and publisher, at the centre of the Bloomsbury Group. Woolf remade the English novel from the inside, following thought as it moves rather than events as they happen. Her books return again and again to houses, to the sea, and to the hours.",
  },
  "Ali Smith": {
    born: 1962,
    bio: "Scottish novelist whose playful, politically alert fiction braids art history, wordplay and the news. Her Seasonal Quartet was written and published in near real time, a novel for each season of a divided few years.",
  },
  "Ernest Hemingway": {
    born: 1899,
    died: 1961,
    bio: "American novelist and short-story writer, an ambulance driver on the Italian front in 1918. His spare, declarative prose leaves its deepest feeling unsaid, in what he called the iceberg beneath the surface.",
  },

  /* ↑ Add new authors above this line, in the same format:
   *
   *   "Author Name": {
   *     born: 1900,
   *     died: 1980,
   *     bio: "A few sentences.",
   *   },
   */
};
