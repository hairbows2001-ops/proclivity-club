/**
 * THE CATALOGUE
 * ─────────────
 * Reads the hand-written files in /content and works out everything else:
 * slugs, constellations, authors, places, decades and related books.
 * Every page on the site asks this file for its data, so adding a book in
 * content/books.ts is all it takes for the whole site to know about it.
 */

import { books as bookInputs } from "@/content/books";
import { themes as themeInputs } from "@/content/themes";
import { authors as authorInputs } from "@/content/authors";
import { journal as journalInputs } from "@/content/journal";
import type { Author, Book, JournalEntry, Place, Theme } from "./types";
import { slugify } from "./format";
import { layoutAtlas } from "./sky";

/* ── Friendly errors ────────────────────────────────────────────────────── */

function problem(message: string): never {
  throw new Error(`\n\n✶ Proclivity Club — there is a problem in the content files:\n\n  ${message}\n`);
}

/* ── Themes (constellations) ────────────────────────────────────────────── */

const themeKey = (name: string) => slugify(name);

const definedThemes = new Map(
  Object.entries(themeInputs).map(([name, input]) => [themeKey(name), { name, ...input }]),
);

/* ── Books ──────────────────────────────────────────────────────────────── */

function placeParts(label: string) {
  const [name, ...rest] = label.split(",").map((s) => s.trim());
  return { name, region: rest.join(", ") || undefined };
}

export const books: Book[] = bookInputs.map((input, index) => {
  const where = input.title ? `the book "${input.title}"` : `book number ${index + 1}`;
  for (const field of ["title", "author", "year", "themes", "locations", "moods", "genres", "description", "reflection", "world"] as const) {
    if (input[field] === undefined || input[field] === "") problem(`${where} is missing its "${field}".`);
  }
  if (!input.world.landscape) problem(`${where} needs a world.landscape (for example "coast").`);
  const slug = input.slug ? slugify(input.slug) : slugify(input.title);
  return {
    ...input,
    slug,
    brightness: input.brightness ?? 2,
    authorSlug: slugify(input.author),
    themeSlugs: [...new Set(input.themes.map(themeKey))],
    placeSlugs: [...new Set(input.locations.map(slugify))],
    decade: input.year < 0 ? `${Math.ceil(-input.year / 10) * 10}s BC` : `${Math.floor(input.year / 10) * 10}s`,
    yearLabel: input.year < 0 ? `${-input.year} BC` : String(input.year),
    plate: index + 1,
  };
});

{
  const seen = new Set<string>();
  for (const b of books) {
    if (seen.has(b.slug)) problem(`Two books share the web address "${b.slug}". Give one of them a different "slug".`);
    seen.add(b.slug);
  }
  for (const b of books) {
    for (const r of b.related ?? []) {
      if (!seen.has(r)) problem(`"${b.title}" lists a related book "${r}", but no book has that slug. Check the spelling (slugs look like "to-the-lighthouse").`);
    }
  }
}

const bookBySlug = new Map(books.map((b) => [b.slug, b]));

export function getBook(slug: string): Book | undefined {
  return bookBySlug.get(slug);
}

export function booksBySlugs(slugs: string[]): Book[] {
  return slugs.map((s) => bookBySlug.get(s)).filter((b): b is Book => Boolean(b));
}

/* ── Derived collections ────────────────────────────────────────────────── */

export const themes: Theme[] = (() => {
  const map = new Map<string, Theme>();
  // Constellations described in content/themes.ts keep their written order…
  for (const [slug, t] of definedThemes) {
    map.set(slug, { slug, name: t.name, latin: t.latin, description: t.description, books: [] });
  }
  // …and any new theme used by a book is created automatically.
  for (const b of books) {
    b.themes.forEach((name) => {
      const slug = themeKey(name);
      if (!map.has(slug)) {
        map.set(slug, {
          slug,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          description: `Books gathered under the sign of ${name.toLowerCase()}.`,
          books: [],
        });
      }
      const t = map.get(slug)!;
      if (!t.books.includes(b.slug)) t.books.push(b.slug);
    });
  }
  return [...map.values()];
})();

/** Constellations that contain at least one book. */
export const litThemes = themes.filter((t) => t.books.length > 0);

export function getTheme(slug: string) {
  return themes.find((t) => t.slug === slug);
}

export const authors: Author[] = (() => {
  const map = new Map<string, Author>();
  for (const b of books) {
    if (!map.has(b.authorSlug)) {
      map.set(b.authorSlug, { slug: b.authorSlug, name: b.author, books: [], ...(authorInputs[b.author] ?? {}) });
    }
    map.get(b.authorSlug)!.books.push(b.slug);
  }
  return [...map.values()].sort((a, b) => surname(a.name).localeCompare(surname(b.name)));
})();

function surname(name: string) {
  return name.split(" ").slice(-1)[0];
}

export function getAuthor(slug: string) {
  return authors.find((a) => a.slug === slug);
}

export const places: Place[] = (() => {
  const map = new Map<string, Place>();
  for (const b of books) {
    for (const label of b.locations) {
      const slug = slugify(label);
      if (!map.has(slug)) map.set(slug, { slug, label, ...placeParts(label), books: [] });
      map.get(slug)!.books.push(b.slug);
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
})();

export function getPlace(slug: string) {
  return places.find((p) => p.slug === slug);
}

const unique = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b));

export const genres = unique(books.flatMap((b) => b.genres));
export const moods = unique(books.flatMap((b) => b.moods));
/** Decades in time order, oldest first. */
export const decades = [...new Map([...books].sort((a, b) => a.year - b.year).map((b) => [b.decade, b.decade])).keys()];

/* ── Relationships ──────────────────────────────────────────────────────── */

const overlap = (a: string[], b: string[]) => a.filter((x) => b.includes(x)).length;

/**
 * Related books, best first. Score:
 *   chosen by hand (related: [...])  +10
 *   each shared constellation         +3
 *   same author                       +2
 *   each shared place                 +2
 *   each shared mood                  +1
 *   written within twenty years       +0.5
 */
export function relatedBooks(book: Book, limit = 3): Book[] {
  return books
    .filter((b) => b.slug !== book.slug)
    .map((b) => {
      let score = 0;
      if (book.related?.includes(b.slug) || b.related?.includes(book.slug)) score += 10;
      score += overlap(book.themeSlugs, b.themeSlugs) * 3;
      if (b.authorSlug === book.authorSlug) score += 2;
      score += overlap(book.placeSlugs, b.placeSlugs) * 2;
      score += overlap(book.moods, b.moods);
      if (Math.abs(b.year - book.year) <= 20) score += 0.5;
      return { b, score };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score || x.b.year - y.b.year)
    .slice(0, limit)
    .map((x) => x.b);
}

/** Constellations that share books with this one, with how many they share. */
export function neighbouringThemes(theme: Theme) {
  return litThemes
    .filter((t) => t.slug !== theme.slug)
    .map((t) => ({ theme: t, shared: overlap(t.books, theme.books) }))
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared);
}

/** Other books in each of this book's constellations. */
export function bookConstellations(book: Book) {
  return book.themeSlugs.map((slug) => {
    const theme = getTheme(slug)!;
    return { theme, companions: booksBySlugs(theme.books.filter((s) => s !== book.slug)) };
  });
}

/* ── Journal ────────────────────────────────────────────────────────────── */

export const journal: JournalEntry[] = [...journalInputs].sort((a, b) => b.date.localeCompare(a.date));

export function getEntry(slug: string) {
  return journal.find((e) => e.slug === slug);
}

export function entriesForBook(slug: string) {
  return journal.filter((e) => e.books?.includes(slug));
}

/* ── The Atlas ──────────────────────────────────────────────────────────── */


/** Every lit constellation, laid out on the star chart. */
export const atlas = layoutAtlas(litThemes, books);

export function getConstellation(themeSlug: string) {
  return atlas.find((c) => c.theme.slug === themeSlug);
}
