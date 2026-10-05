/**
 * ═════════════════════════════════════════════════════════════════════════
 *  JOURNAL
 * ═════════════════════════════════════════════════════════════════════════
 *  Each entry gets its own page at /journal/its-slug.
 *  Newest entries are shown first automatically — order here doesn't matter.
 *  Separate paragraphs in the body with a blank line.
 * ═════════════════════════════════════════════════════════════════════════
 */

import type { JournalInput } from "@/lib/types";

export const journal: JournalInput[] = [
  {
    slug: "books-are-places-you-enter",
    title: "Books are places you enter",
    date: "2026-09-21",
    excerpt: "Why this is an atlas, and not a list.",
    // PLACEHOLDER — replace with your own words.
    body: `I have never been able to remember books by their plots. I remember them as places: a garden running down to the sea, a terrace of houses in the June light, a lake crossed at night in the rain.

So this is not a list of books I have read, or a set of verdicts. It is a map. Each book is a small world you can step into. The lines between them are the ideas they share — time, grief, desire, the strangeness of being one person — and those lines, drawn together, make constellations.

The map will grow slowly. New worlds will appear; old ones will gather new connections. That is the pleasure of an atlas: it is never finished, only more fully known.`,
  },
  {
    slug: "the-lighthouse-from-both-sides",
    title: "The lighthouse, seen from both sides",
    date: "2026-10-02",
    excerpt: "On reading Woolf twice, ten years apart.",
    // PLACEHOLDER — replace with your own words.
    body: `The first time I read To the Lighthouse I was James, desperate to get there. The second time I was Mr Ramsay, rather afraid of what arriving would mean.

Woolf knew this would happen. The lighthouse is a different object depending on where you stand: a silvery, misty-looking tower from the window, a stark thing of black and white bars up close. "For nothing was simply one thing."

Perhaps the best books are like that. They stay where they are, on their rock, and we are the ones who row nearer.`,
    books: ["to-the-lighthouse"],
  },

  /* ↑ Add new journal entries above this line. */
];
