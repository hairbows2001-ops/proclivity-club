# Add a book

Fill this in whenever you want to add a title to Proclivity Club. Write as much or as little as you like; only the fields marked **required** are needed.

When it's done, either:

- **hand it to Claude:** paste the filled-in template into a Claude Code session on this repository and say *"Add this book to Proclivity Club."* Claude turns it into an entry in `content/books.ts`, checks the build, and opens the change for you to review; or
- **add it yourself:** copy each answer into the matching field of the TEMPLATE at the top of `content/books.ts` (the right-hand column below shows which field). Paste the result above the line `ADD NEW BOOKS ABOVE THIS LINE`.

Make a copy of the blank template below for each new book. Keep this file as it is.

---

## The template

```
TITLE (required):


AUTHOR (required, spelled the same way every time):


YEAR first published (required):


GENRE (one or more, e.g. Modernist novel, Poetry, Memoir):


THEMES (required: the constellations it belongs to; reuse existing ones where they fit,
or name a new one and it will appear on the Atlas):


PLACES (required: one per line, written "Place, Region", e.g. "Lake Maggiore, Italy"):


FEELINGS / MOOD (two or three words, e.g. luminous, elegiac, wry):


SHORT DESCRIPTION (required: one or two sentences, what the book is):


SETTING (optional: a few lines evoking where it takes place, for THE PLACE section):


PERSONAL REFLECTION (required: your own writing about the book; leave a blank line
between paragraphs):


WHAT REMAINED (a quotation from the book, and where it comes from):
  Quotation:
  Source (e.g. "Chapter II", "The opening line"):


WHAT REMAINED (optional: one sentence you carried away, your "observation"):


RELATED BOOKS (optional: other titles already in the atlas that should always be
suggested alongside this one; more are found automatically):


WHEN YOU READ IT (optional, e.g. "Winter 2026"):


HOW BRIGHTLY IT SHINES (optional: faint, normal or brilliant):


BOOKWORLD SCENE PREFERENCE (choose one):
  [ ] Let the site compose it from the setting
  [ ] Use an existing composed scene:  lighthouse-bay · oak-and-great-house ·
      westminster-morning · winter-house · lake-crossing
  [ ] Compose from these ingredients (pick any):
        Landscape:    coast · countryside · city · mountains · lake · river · moor
        Landmark:     lighthouse · clocktower · oak · bridge · statue · sculpture ·
                      obelisk · church · observatory · none
        Buildings:    country-house · manor · townhouses · cottage · village · none
        Sky:          crescent · full-moon · new-moon · eclipse · sun · starfield · comet
        Weather:      clear · mist · rain · snow
        Trees:        round · cypress · pine · bare · poplar · none
        Details:      boat · figures · path · birds · aeroplane · smoke
        Sky symbol:   armillary · hourglass · compass · eye · key · orbit · none


ART-DIRECTION NOTES (optional: describe the picture you'd like):
  Focal point (the one thing the eye should find first):
  Composition (where things sit, what enters from where):
  Foreground:
  Middle ground:
  Background:
  Atmosphere (time of day, weather, feeling):
  Gold emphasis (what should glow: a lamp, one window, a star):
  Density (sparse · medium · medium-high · dense):
  Secondary motifs:
```

---

## Where each answer goes in `content/books.ts`

| In this template | In `content/books.ts` |
| --- | --- |
| Title | `title` |
| Author | `author` |
| Year | `year` |
| Genre | `genres` |
| Themes | `themes` |
| Places | `locations` |
| Feelings / mood | `moods` |
| Short description | `description` |
| Setting | `setting` |
| Personal reflection | `reflection` |
| What Remained: quotation and source | `quote: { text, source }` |
| What Remained: observation | `observation` |
| Related books | `related` (as slugs, e.g. `"mrs-dalloway"`) |
| When you read it | `read` |
| How brightly it shines | `brightness` (1 faint, 2 normal, 3 brilliant) |
| BookWorld ingredients | `world: { landscape, landmark, architecture, sky, atmosphere, trees, details, symbol }` |
| Existing composed scene | `world.art.scene` |
| Art-direction notes | `world.art: { focalPoint, composition, foreground, middleGround, background, atmosphere, goldEmphasis, density, secondaryMotifs }` |

A note on art direction: the five composed scenes were each drawn for a particular book. Choosing one for a new title reuses that picture exactly. For most new books, pick ingredients and add art-direction notes; the notes are kept with the book, so a scene of its own can be composed for it later.

---

## An example, filled in

```
TITLE: The Waves
AUTHOR: Virginia Woolf
YEAR: 1931
GENRE: Modernist novel
THEMES: Time, Identity, Grief
PLACES:
  Sussex, England
FEELINGS / MOOD: luminous, rhythmic, elegiac
SHORT DESCRIPTION: Six friends speak in turn, from childhood to old age, while
  the sun crosses the sky above the sea.
PERSONAL REFLECTION: (your writing)
WHAT REMAINED:
  Quotation: (a line from the book)
  Source: (where it comes from)
RELATED BOOKS: To the Lighthouse
BOOKWORLD SCENE PREFERENCE:
  [x] Compose from these ingredients
        Landscape: coast   Sky: sun   Weather: mist   Details: birds
ART-DIRECTION NOTES:
  Focal point: the sun low over the waves
  Atmosphere: one whole day compressed into a single light
  Gold emphasis: the sun, and its path on the water
```
