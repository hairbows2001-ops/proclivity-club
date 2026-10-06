/**
 * ─────────────────────────────────────────────────────────────────────────
 *  DATA SCHEMA
 * ─────────────────────────────────────────────────────────────────────────
 *  These types describe the shape of everything in the /content folder.
 *  You should rarely need to edit this file — but it is the reference for
 *  which fields a book can have, and which illustration options exist.
 *
 *  If you hover over a field in content/books.ts (in VS Code), the comment
 *  written here will appear as a tooltip.
 * ─────────────────────────────────────────────────────────────────────────
 */

/* ── BookWorld illustration options ─────────────────────────────────────── */

/** The ground of the scene. */
export type Landscape =
  | "coast" //       cliffs on one side, open sea on the other
  | "countryside" // rolling hills, ploughed fields, hedgerows
  | "city" //        a flat street line, ideal for townhouses and towers
  | "mountains" //   high ranges and a valley floor
  | "lake" //        mountains behind, still water in front
  | "river" //       a river winding towards the horizon
  | "moor"; //       bare, open, sparse upland

/** The single prominent structure in the scene. */
export type Landmark =
  | "lighthouse"
  | "clocktower"
  | "oak" //         a great, ancient tree
  | "bridge" //      a stone arched bridge
  | "statue" //      a classical figure on a plinth
  | "sculpture" //   a pierced, abstract standing stone (Hepworth-like)
  | "obelisk"
  | "church" //      a campanile / spire
  | "observatory"
  | "none";

/** Buildings that sit in the landscape. */
export type Architecture =
  | "country-house" // Georgian facade, pediment, rows of windows
  | "manor" //         long Jacobean range of gables and gatehouse towers
  | "townhouses" //    a terrace of tall city houses
  | "cottage"
  | "village" //       a cluster of low Mediterranean houses
  | "none";

/** What hangs in the sky. */
export type Sky =
  | "crescent"
  | "full-moon"
  | "new-moon"
  | "eclipse"
  | "sun" //        a pale, low sun drawn as an engraved disc
  | "starfield" //  no moon, a dense band of stars
  | "comet";

export type Atmosphere = "clear" | "mist" | "rain" | "snow";

export type Trees = "round" | "cypress" | "pine" | "bare" | "poplar" | "none";

/** Small optional details sprinkled into the scene. */
export type Detail =
  | "boat" //        a sailing boat or rowing boat (needs water)
  | "figures" //     tiny human figures
  | "path" //        a winding path through the foreground
  | "birds"
  | "aeroplane" //   a little biplane writing in the sky
  | "smoke"; //      chimney smoke

/** A faint celestial symbol engraved into the corner of the sky. */
export type CelestialSymbol =
  | "armillary"
  | "hourglass"
  | "compass"
  | "eye"
  | "key"
  | "orbit"
  | "none";

/**
 * Hand-composed scenes. Each is a deliberate composition (see
 * components/bookworld/scenes.tsx) built from the shared line-art primitives.
 */
export type SceneName =
  | "lighthouse-bay" | "oak-and-great-house" | "westminster-morning" | "winter-house" | "lake-crossing"
  | "alpine-enclosure" | "crossing-threads" | "carpathian-pass" | "winter-plain" | "veld-farmhouse";

/**
 * Optional art direction. `scene` chooses a composed scene; `density` sets
 * how much fine detail is engraved. The other fields are the written brief
 * for the composition — they document intent and guide whoever composes it.
 */
export interface ArtDirection {
  /** A hand-composed scene. Leave out to let the site compose one from the settings above. */
  scene?: SceneName;
  /** How much fine detail: "sparse" | "medium" | "medium-high" | "dense". */
  density?: "sparse" | "medium" | "medium-high" | "dense";
  focalPoint?: string;
  composition?: string;
  foreground?: string;
  middleGround?: string;
  background?: string;
  atmosphere?: string;
  goldEmphasis?: string;
  secondaryMotifs?: string[];
}

export interface BookWorldConfig {
  landscape: Landscape;
  landmark?: Landmark;
  architecture?: Architecture;
  sky?: Sky;
  atmosphere?: Atmosphere;
  /** Add open water. Coasts and lakes always have water; "river" adds one elsewhere. */
  water?: "sea" | "lake" | "river" | "none";
  trees?: Trees;
  details?: Detail[];
  symbol?: CelestialSymbol;
  /** Put the landmark on the left or the right. Defaults to a choice made from the title. */
  landmarkSide?: "left" | "right";
  /** Any number. Changing it reshuffles stars, hills and trees without changing anything else. */
  seed?: number;
  /** Optional art direction — see ArtDirection above. */
  art?: ArtDirection;
}

/* ── Books ──────────────────────────────────────────────────────────────── */

export interface BookQuote {
  /** The words themselves, without quotation marks. */
  text: string;
  /** Optional — e.g. "Part III" or "on the Great Frost". */
  source?: string;
}

export interface BookInput {
  /** The book's title, e.g. "To the Lighthouse". */
  title: string;
  /** Full author name, exactly as you want it shown. The same spelling joins books to one author page. */
  author: string;
  /** Year of first publication. For works before the common era, use a minus sign: -458 means 458 BC. */
  year: number;
  /** Optional. The web address part, e.g. "to-the-lighthouse". Made from the title if left out. */
  slug?: string;
  /** Optional. An image placed in /public/covers, e.g. "/covers/orlando.jpg". */
  cover?: string;
  /** Genres, e.g. ["Modernist novel"]. Used for the Library filter. */
  genres: string[];
  /** Constellation names, e.g. ["Time", "Memory"]. New names automatically create new constellations. */
  themes: string[];
  /** Places, written "Place, Region", e.g. "Isle of Skye, Scotland". Each place gets its own page. */
  locations: string[];
  /** Feelings the book leaves you with, e.g. ["luminous", "elegiac"]. Used for the Library "Feeling" filter. */
  moods: string[];
  /** One or two sentences: what the book is. */
  description: string;
  /** Optional. A short evocation of the book's setting, shown in THE PLACE. */
  setting?: string;
  /** Your own writing. Separate paragraphs with a blank line. Shown in WHAT REMAINED. */
  reflection: string;
  /** A quotation from the book. */
  quote?: BookQuote;
  /** Optional. A single sentence that you took away — shown beside the quote. */
  observation?: string;
  /** Optional. Slugs of books you want always suggested alongside this one. More are found automatically. */
  related?: string[];
  /** Optional. 1 (faint) to 3 (brilliant): how brightly this book shines on the Atlas. Default 2. */
  brightness?: 1 | 2 | 3;
  /** Optional. When you read it, e.g. "2024" or "Winter 2025". */
  read?: string;
  /** The illustration recipe for this book's world. */
  world: BookWorldConfig;
}

/** A book after the site has filled in the gaps (slug, plate number…). */
export interface Book extends Omit<BookInput, "slug" | "brightness"> {
  slug: string;
  brightness: 1 | 2 | 3;
  authorSlug: string;
  themeSlugs: string[];
  placeSlugs: string[];
  decade: string;
  /** The year as it is shown, e.g. "1927" or "458 BC". */
  yearLabel: string;
  /** 1-based order in the collection; shown as a Roman numeral plate number. */
  plate: number;
}

/* ── Constellations, authors, places, journal ───────────────────────────── */

export interface ThemeInput {
  /** One or two sentences that describe this constellation. */
  description: string;
  /** Optional Latin-ish star-chart name, shown in small italics, e.g. "Tempus". */
  latin?: string;
}

export interface Theme extends ThemeInput {
  slug: string;
  name: string;
  books: string[];
}

export interface AuthorInput {
  born?: number;
  died?: number;
  /** A few sentences about the author. */
  bio?: string;
}

export interface Author extends AuthorInput {
  slug: string;
  name: string;
  books: string[];
}

export interface Place {
  slug: string;
  /** Full label as written in the book entry, e.g. "Isle of Skye, Scotland". */
  label: string;
  name: string;
  region?: string;
  books: string[];
}

export interface JournalInput {
  /** The web address part, e.g. "on-entering-books". */
  slug: string;
  title: string;
  /** Written as YYYY-MM-DD, e.g. "2026-09-14". */
  date: string;
  /** One sentence shown in lists. */
  excerpt: string;
  /** The entry. Separate paragraphs with a blank line. */
  body: string;
  /** Optional slugs of books this entry is about. */
  books?: string[];
}

export type JournalEntry = JournalInput;
