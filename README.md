# Proclivity Club

*An atlas of books, places and ideas.*

Proclivity Club is an illustrated celestial atlas of literature. Every book is drawn as a small engraved world, every theme is a constellation, and the books are stars within them. It is built with Next.js, TypeScript, Tailwind CSS and Framer Motion.

---

## Running the site on your computer

You need [Node.js](https://nodejs.org) (version 20 or newer). Then, in a terminal, inside this folder:

```bash
npm install      # once, to download everything the site needs
npm run dev      # starts the site at http://localhost:3000
```

Leave `npm run dev` running while you edit. Every time you save a content file, the page in your browser updates by itself.

To check that everything is in order before publishing:

```bash
npm run build
```

---

## Adding a book — the only file you need

**Open `content/books.ts`.** At the top is a commented TEMPLATE. Copy it, paste it just above the line that says

```
↑↑↑  ADD NEW BOOKS ABOVE THIS LINE  ↑↑↑
```

remove the `//` or ` * ` at the start of each line, and fill in your details. Save.

That one entry automatically creates:

| What                    | Where                                          |
| ----------------------- | ---------------------------------------------- |
| The book's own page     | `/books/the-book-title`                        |
| Its Library card        | `/library`, with all six filters               |
| Its stars on the Atlas  | `/atlas`, one in each of its constellations    |
| New constellations      | any theme name not used before                 |
| Its author's page       | `/authors/author-name`                         |
| Place pages             | `/places/…`, one per location                  |
| Related-book suggestions| worked out from shared themes, places, moods and author |
| Its illustration        | drawn from the `world` settings                |

The smallest possible entry looks like this:

```ts
{
  title: "The Waves",
  author: "Virginia Woolf",
  year: 1931,
  genres: ["Modernist novel"],
  themes: ["Time", "Solitude"],
  locations: ["Sussex, England"],
  moods: ["luminous"],
  description: "Six voices, from childhood to old age.",
  reflection: `What stayed with me…`,
  world: { landscape: "coast", sky: "sun" },
},
```

If something is wrong (a missing field, two books with the same address, a related book that doesn't exist), the site shows a message naming the book and the problem.

### Designing a book's world

The `world` settings choose what appears in the engraving. Hover over any field in VS Code to see the options, or use this table:

| Setting        | Options |
| -------------- | ------- |
| `landscape`    | `coast` · `countryside` · `city` · `mountains` · `lake` · `river` · `moor` |
| `landmark`     | `lighthouse` · `clocktower` · `oak` · `bridge` · `statue` · `sculpture` · `obelisk` · `church` · `observatory` · `none` |
| `architecture` | `country-house` · `manor` · `townhouses` · `cottage` · `village` · `none` |
| `sky`          | `crescent` · `full-moon` · `new-moon` · `eclipse` · `sun` · `starfield` · `comet` |
| `atmosphere`   | `clear` · `mist` · `rain` · `snow` |
| `trees`        | `round` · `cypress` · `pine` · `bare` · `poplar` · `none` |
| `details`      | any of `boat` · `figures` · `path` · `birds` · `aeroplane` · `smoke` |
| `symbol`       | `armillary` · `hourglass` · `compass` · `eye` · `key` · `orbit` · `none` |
| `water`        | `river` adds a river to any landscape |
| `landmarkSide` | `left` or `right` |
| `seed`         | any number — reshuffles stars, hills and trees if you'd like a different arrangement |

### Adding a cover image (optional)

Put the image in `public/covers/` (for example `public/covers/the-waves.jpg`) and add `cover: "/covers/the-waves.jpg",` to the book.

---

## Other things you can edit

| File                  | What it holds |
| --------------------- | ------------- |
| `content/books.ts`    | All the books. |
| `content/themes.ts`   | Descriptions and Latin star-names for the constellations. Optional — new themes work without an entry. |
| `content/authors.ts`  | Dates and short biographies. Optional. |
| `content/journal.ts`  | Journal entries. |
| `content/site.ts`     | The site name, tagline, About page text and colophon. |
| `components/layout/nav.ts` | The navigation menu. |

Text marked `// PLACEHOLDER` is stand-in writing waiting for your own.

---

## How it is built (for anyone helping you)

```
content/        ← the hand-written content (the only place you normally edit)
lib/
  types.ts      ← the data schema, with every field documented
  catalogue.ts  ← turns content into books, constellations, authors, places, related books
  sky.ts        ← generates constellation figures and the Atlas layout
app/            ← one folder per page; dynamic pages are generated from the catalogue
components/
  bookworld/    ← the procedural SVG engraving system (BookWorld)
  atlas/        ← the planisphere, constellation glyphs and charts
  books/        ← book cards and the per-book constellation diagram
  home/         ← the homepage hero and its scroll-drawn panorama
  library/      ← the filterable catalogue
  layout/, ui/  ← header, footer, ornaments, headings
app/globals.css ← design tokens: colours, type, stroke weights, motion
```

**Design tokens** (in `app/globals.css`): Midnight `#111A38`, Deep Navy `#17264A`, Antique Gold `#C5A36A`, Soft Gold `#E1C58C`, Parchment `#E8DFD0`, Faded Blue `#7383A4`. Type: Cormorant Garamond for display and labels, EB Garamond for reading. Fonts are bundled locally.

**Motion** is restrained and always respects the visitor's *reduce motion* setting: stars flicker, constellation lines draw themselves, windows glow slowly, BookWorld plates ink themselves in, and an occasional shooting star crosses the sky.

**Illustrations** are generated deterministically from each book's title, so a world looks the same on every visit. All line work runs through `components/bookworld/Ink.tsx`, which sets the stroke weight classes (`s0` finest hatching → `s2` emphasised outline).

### Publishing

The site is fully static, and works on [Vercel](https://vercel.com) without any configuration: import the repository and deploy. When you have a real domain, update `url` in `content/site.ts`.
