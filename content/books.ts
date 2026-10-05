/**
 * ═════════════════════════════════════════════════════════════════════════
 *
 *    PROCLIVITY CLUB — THE BOOKS
 *
 *    This is the only file you need to edit to add a book.
 *
 *    When you add a book here, the site automatically creates:
 *      • its own page             (/books/its-slug)
 *      • its card in the Library  (with all the filters)
 *      • its stars on the Atlas   (one in every constellation it belongs to)
 *      • constellation pages      (any new theme name becomes a new constellation)
 *      • its author's page        (or adds it to an existing author)
 *      • place pages              (one for each location)
 *      • related-book suggestions (worked out from shared themes, places,
 *                                  moods and authors)
 *      • its illustrated BookWorld (drawn from the `world` settings)
 *
 *    HOW TO ADD A BOOK
 *    ─────────────────
 *    1. Scroll to the bottom of this file, to the line that says
 *       "ADD NEW BOOKS ABOVE THIS LINE".
 *    2. Copy the TEMPLATE below (everything between the { and the },).
 *    3. Paste it just above that line, remove the  //  at the start of each
 *       line, and fill in your own details.
 *    4. Save. If the site is running (`npm run dev`), the page appears at once.
 *
 *    Tips
 *    ────
 *    • Text goes inside "double quotes". If your text contains a double quote,
 *      use the curly ones (“ ”) or write it inside `backticks` instead.
 *    • Longer writing (reflection, setting) is easiest inside `backticks`,
 *      which let you write over several lines. Leave a blank line between
 *      paragraphs.
 *    • Every entry ends with  },  — don't forget the comma.
 *    • Theme names are matched regardless of capital letters, so "memory"
 *      and "Memory" are the same constellation.
 *    • Write the author's name identically each time, so their books are
 *      gathered onto one author page.
 *    • If something is wrong, the site shows a message naming the book and
 *      the problem.
 *
 *    THE TEMPLATE
 *    ────────────
 *
 *  {
 *    title: "The Book's Title",
 *    author: "Author Name",
 *    year: 1900,
 *    genres: ["Novel"],
 *    themes: ["Time", "Memory"],
 *    locations: ["Town, Country"],
 *    moods: ["luminous", "melancholy"],
 *    description: "One or two sentences about what the book is.",
 *    setting: `A few lines evoking where the book takes place.`,
 *    reflection: `Your own writing about the book.
 *
 *  A second paragraph, if you like.`,
 *    quote: { text: "A line from the book.", source: "Chapter One" },
 *    observation: "Optional: one sentence you carried away.",
 *    related: [],                 // optional: slugs of books to always suggest
 *    brightness: 2,               // optional: 1 faint, 2 normal, 3 brilliant
 *    read: "2026",                // optional: when you read it
 *    world: {
 *      landscape: "coast",        // coast | countryside | city | mountains | lake | river | moor
 *      landmark: "lighthouse",    // lighthouse | clocktower | oak | bridge | statue | sculpture | obelisk | church | observatory | none
 *      architecture: "cottage",   // country-house | manor | townhouses | cottage | village | none
 *      sky: "crescent",           // crescent | full-moon | new-moon | eclipse | sun | starfield | comet
 *      atmosphere: "mist",        // clear | mist | rain | snow
 *      trees: "round",            // round | cypress | pine | bare | poplar | none
 *      details: ["boat", "figures"], // any of: boat, figures, path, birds, aeroplane, smoke
 *      symbol: "none",            // armillary | hourglass | compass | eye | key | orbit | none
 *    },
 *  },
 *
 *    Optional art direction for `world` (gives a book a composed scene):
 *      art: {
 *        scene: "lighthouse-bay",   // one of the hand-composed scenes in
 *                                   // components/bookworld/scenes.tsx
 *        density: "medium-high",    // sparse | medium | medium-high | dense
 *        focalPoint: "…", composition: "…", foreground: "…",
 *        middleGround: "…", background: "…", atmosphere: "…",
 *        goldEmphasis: "…", secondaryMotifs: ["…"],
 *      },
 *    Without `art.scene`, the site composes the world from the settings above.
 *
 *    Optional extras for `world`:
 *      water: "river"            adds a river to any landscape
 *      landmarkSide: "left"      or "right" — which side the landmark stands
 *      seed: 7                   any number; reshuffles stars, hills and trees
 *
 * ═════════════════════════════════════════════════════════════════════════
 */

import type { BookInput } from "@/lib/types";

export const books: BookInput[] = [
  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "To the Lighthouse",
    author: "Virginia Woolf",
    year: 1927,
    genres: ["Modernist novel"],
    themes: ["Time", "Memory", "Grief", "Womanhood", "Identity"],
    locations: ["Isle of Skye, Scotland", "St Ives, Cornwall"],
    moods: ["luminous", "elegiac", "contemplative"],
    description:
      "A family's summers in a house by the sea, divided by ten years in which the house stands empty and the world changes. A novel about a trip to a lighthouse that takes the length of the book to make.",
    setting: `A holiday house on the edge of the Hebrides, its garden running down to the bay. Across the water the lighthouse stands on its rock, a stroke of light at night and a stark tower by day. Woolf moved the house of her own childhood summers, in St Ives, north to Skye — and kept its light.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `What stayed was not the plot, which barely exists, but the middle section — “Time Passes” — where the house is left alone and the novel simply watches it. Deaths arrive in square brackets, as asides. The wind tries the doors. It is the most frightening thing I have read about grief, because it does not look at the grieving at all.

And then Lily Briscoe, at the end, at her easel, making a single line down the centre of a canvas. I keep returning to that line: the idea that a whole life of looking might resolve, at last, into one deliberate stroke.`,
    quote: { text: "For nothing was simply one thing.", source: "The Lighthouse" },
    observation: "A lighthouse is two things at once: a beam seen from far off, and a tower seen up close.",
    related: ["mrs-dalloway"],
    brightness: 3,
    read: "Spring 2024",
    world: {
      landscape: "coast",
      landmark: "lighthouse",
      architecture: "country-house",
      sky: "crescent",
      atmosphere: "mist",
      trees: "round",
      details: ["boat", "figures", "path", "birds"],
      symbol: "compass",
      landmarkSide: "right",
      art: {
        scene: "lighthouse-bay",
        density: "medium-high",
        focalPoint: "The lighthouse lamp, across still water",
        composition: "Coastline enters from the lower left; lighthouse in the middle distance, slightly right of centre; the house barely visible on the far shore",
        foreground: "A grassy bank with flowers, a path to a little jetty, Lily at her easel; textured water marks lower right",
        middleGround: "The lighthouse on its rocks, a small sailing boat",
        background: "Faint hills, the house among trees, constellation fragments",
        atmosphere: "Still, suspended, late evening; low mist",
        goldEmphasis: "The lamp and its reflection, and one star",
        secondaryMotifs: ["boat", "path", "house", "crescent", "flowers"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "Orlando",
    author: "Virginia Woolf",
    year: 1928,
    genres: ["Modernist novel", "Fantasy"],
    themes: ["Time", "Identity", "Desire", "Transformation", "Womanhood", "Memory"],
    locations: ["Knole, Kent", "London, England", "Constantinople, Ottoman Empire"],
    moods: ["exuberant", "playful", "dreamlike"],
    description:
      "A mock biography of a poet who lives for more than three centuries, from the court of Elizabeth I to 1928, and who wakes one morning in Constantinople as a woman.",
    setting: `A great house of three hundred and sixty-five rooms, its courtyards and gables spread across the Kentish downs. On the hill above it, an oak tree under which Orlando lies and writes, generation after generation. Beyond: the Thames frozen solid in the Great Frost, a Turkish embassy, a gypsy camp, a Victorian damp that gets into everything.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `I came to it expecting a novel and found a love letter that pretends to be a history. It is funny in the way only very serious books can afford to be.

What remained was the oak — a single tree that stays while centuries, costumes and even sexes change around it. Orlando's poem "The Oak Tree" takes three hundred years to finish. I find that consoling: some work is simply the length of a life, however long a life turns out to be.`,
    quote: { text: "Memory is the seamstress, and a capricious one at that.", source: "Chapter II" },
    observation: "Identity as a wardrobe rather than a fixed address.",
    related: ["to-the-lighthouse"],
    brightness: 3,
    read: "Summer 2023",
    world: {
      landscape: "countryside",
      landmark: "oak",
      architecture: "manor",
      sky: "full-moon",
      atmosphere: "clear",
      trees: "round",
      details: ["figures", "path", "birds", "smoke"],
      symbol: "hourglass",
      landmarkSide: "left",
      art: {
        scene: "oak-and-great-house",
        density: "medium-high",
        focalPoint: "The oak tree on the hill",
        composition: "The oak fills the left of the plate on a crest; the great house sits small in the valley at the end of an avenue",
        foreground: "The hillside, grasses and the poet beneath the tree",
        middleGround: "Rolling downs, ploughed fields, hedgerows, an avenue of trees",
        background: "The great house with its chimneys smoking; a full moon",
        atmosphere: "Clear, timeless, faintly comic",
        goldEmphasis: "The moon and the windows of the house",
        secondaryMotifs: ["avenue", "hourglass", "birds"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "Mrs Dalloway",
    author: "Virginia Woolf",
    year: 1925,
    genres: ["Modernist novel"],
    themes: ["Time", "Memory", "War", "Identity", "Alienation", "Desire"],
    locations: ["Westminster, London", "Regent's Park, London"],
    moods: ["luminous", "tender", "anxious"],
    description:
      "A single day in June 1923. Clarissa Dalloway prepares for a party; across London, Septimus Warren Smith, a veteran of the war, moves towards catastrophe. Their paths never cross, and yet the book binds them together.",
    setting: `Westminster on a bright morning: the leaden circles of Big Ben dissolving in the air, the bustle of Bond Street, an aeroplane writing letters of smoke above the park. A city of thresholds — doorsteps, shop windows, the open window of a drawing room in which the party will be held.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The hours strike, and each chime pulls everyone back into the same moment for a second before they scatter again into their own heads. I had never seen time made so audible.

What remained was the aeroplane: the whole city looking up, each person reading a different word in the smoke. It is the book in miniature — one sky, a thousand private interpretations, no one quite agreeing on what is being said.`,
    quote: { text: "Mrs Dalloway said she would buy the flowers herself.", source: "The opening line" },
    observation: "A party can be an act of defiance against the dark.",
    related: ["to-the-lighthouse"],
    brightness: 2,
    read: "Autumn 2022",
    world: {
      landscape: "city",
      landmark: "clocktower",
      architecture: "townhouses",
      sky: "full-moon",
      atmosphere: "clear",
      water: "river",
      trees: "round",
      details: ["figures", "aeroplane", "birds"],
      symbol: "orbit",
      landmarkSide: "left",
      art: {
        scene: "westminster-morning",
        density: "dense",
        focalPoint: "The clock tower across the river",
        composition: "Westminster Bridge enters from the left in perspective; the city crowds the far bank; the tower right of centre",
        foreground: "The bridge with lamps and passers-by",
        middleGround: "The river, rowing boats, the embankment wall",
        background: "The long gothic range, terraces, St Paul's far off; an aeroplane writing in the sky",
        atmosphere: "A bright, crowded June evening",
        goldEmphasis: "The clock face and its reflection",
        secondaryMotifs: ["aeroplane", "bridge lamps", "boats", "birds"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "Winter",
    author: "Ali Smith",
    year: 2017,
    genres: ["Contemporary fiction"],
    themes: ["Time", "Memory", "Power", "Identity", "Alienation", "Transformation"],
    locations: ["Cornwall, England"],
    moods: ["wry", "wintry", "hopeful"],
    description:
      "Christmas in a vast, cold house in Cornwall. Two estranged sisters, a son who has hired a stranger to pretend to be his girlfriend, and a country dividing against itself. The second of Smith's seasonal quartet.",
    setting: `A fifteen-bedroom house at the end of a lane in Cornwall, nearly empty, unheated, full of the past. Outside, frost on the moor and the long dark of December. Somewhere in the book's memory, the pierced stone forms of Barbara Hepworth, holes through which you can see the sky.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `Smith writes as though the novel is being made in the same weeks you are reading it, and that urgency is exhilarating. Politics comes into the house like weather.

What remained was the idea of winter as a season that holds something in reserve — the sense that dormancy is not death. A book about people who cannot speak to one another, which somehow leaves you more able to speak.`,
    quote: { text: "God was dead: to begin with.", source: "The opening line" },
    observation: "Winter is not an ending; it is the part of the year that keeps things.",
    brightness: 2,
    read: "December 2025",
    world: {
      landscape: "moor",
      landmark: "sculpture",
      architecture: "country-house",
      sky: "starfield",
      atmosphere: "snow",
      trees: "bare",
      details: ["figures", "path", "smoke"],
      symbol: "eye",
      landmarkSide: "right",
      art: {
        scene: "winter-house",
        density: "medium",
        focalPoint: "One lit window in a cold, distant house",
        composition: "A wide, deliberately empty moor; the house far off right of centre; a great bare tree in the right foreground",
        foreground: "Frosted ground, a track, the bare tree's branches reaching into the sky",
        middleGround: "A field wall leading to the house, a pierced standing stone, a lone figure",
        background: "Bare poplars behind the house; thin lines of cold air; a pale ringed sun",
        atmosphere: "Snow, stillness, intentional emptiness",
        goldEmphasis: "The single lit window",
        secondaryMotifs: ["frost", "wall", "sculpture", "smoke"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "A Farewell to Arms",
    author: "Ernest Hemingway",
    year: 1929,
    genres: ["Modernist novel", "War novel"],
    themes: ["War", "Desire", "Grief", "Alienation"],
    locations: ["Gorizia, Italy", "Lake Maggiore, Italy", "Montreux, Switzerland"],
    moods: ["spare", "rain-dark", "tender"],
    description:
      "An American ambulance driver on the Italian front falls in love with an English nurse. After the rout at Caporetto he deserts, and the two row across Lake Maggiore, through the night, into Switzerland.",
    setting: `Mountains above a river, trucks moving along the roads in the dust, then the rain. A town on a lake, lit windows on the shore, and a small boat rowing north in the dark towards the border. Above it all, the cold white peaks that will be there after everyone has gone.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The prose is so plain that the feeling has nowhere to hide. Rain falls in nearly every chapter, and by the end you understand that it was never weather.

What remained was the rowing: a whole night of it, hands blistering, Catherine holding the umbrella as a sail. The happiest stretch of the book is an escape across dark water, which tells you everything about what it thinks of the world on either shore.`,
    quote: {
      text: "The world breaks every one and afterward many are strong at the broken places.",
      source: "Book Four",
    },
    observation: "Some love stories are really stories about weather.",
    brightness: 2,
    read: "Summer 2021",
    world: {
      landscape: "lake",
      landmark: "church",
      architecture: "village",
      sky: "crescent",
      atmosphere: "rain",
      trees: "cypress",
      details: ["boat", "figures"],
      symbol: "key",
      landmarkSide: "left",
      art: {
        scene: "lake-crossing",
        density: "medium-high",
        focalPoint: "A small boat rowing through the rain",
        composition: "Mountains close in from behind; the lake fills the middle; the boat left of centre; cypresses at the near shore",
        foreground: "Cypresses and a watching figure on the near shore",
        middleGround: "The boat with its umbrella, the dark water",
        background: "Three ranges of mountains, the village and campanile, lights along the shore",
        atmosphere: "Night rain",
        goldEmphasis: "The lights of the far shore and their reflections",
        secondaryMotifs: ["umbrella", "campanile", "crescent"],
      },
    },
  },

  /* ═════════════════════════════════════════════════════════════════════
   *  ↑↑↑  ADD NEW BOOKS ABOVE THIS LINE  ↑↑↑
   *  Paste a copy of the TEMPLATE (from the top of this file) here.
   * ═════════════════════════════════════════════════════════════════════ */
];
