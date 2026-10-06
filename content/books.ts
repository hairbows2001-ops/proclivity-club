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
   *  FIRST BATCH — reflections are placeholders, written as observations
   *  rather than opinions. Replace them with your own words.
   * ═════════════════════════════════════════════════════════════════════ */

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "The Wall",
    author: "Marlen Haushofer",
    year: 1963,
    genres: ["Speculative fiction"],
    themes: ["Alienation", "Time", "Womanhood", "Grief", "Haunting"],
    locations: ["Austrian Alps, Austria"],
    moods: ["spare", "contemplative", "wintry"],
    description:
      "A woman wakes alone in a hunting lodge in the Austrian mountains to find the valley sealed by an invisible wall. Beyond it, nothing moves. She writes an account of the years that follow, kept company by a dog, a cow and a cat.",
    setting: `A lodge at the head of a mountain valley, pine forest climbing on every side, an alpine meadow higher up where the cow can graze in summer. The wall is invisible: a cold, smooth resistance in the air, and on the far side an old man by a well, frozen mid-gesture.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The catastrophe is never explained, and the book does not seem to need it explained. What fills the pages instead is work: hay to be cut, potatoes to be planted, a calendar kept on whatever paper is left. Survival becomes a kind of attention.

The wall is the strangest object in the novel because it is the least described. Everything inside it — the dog, the weather, the light on the meadow — is rendered with tenderness; everything beyond it simply stops. It reads less like science fiction than like a portrait of solitude drawn to its full size.`,
    observation: "When the world falls silent, the days fill up with animals, weather and chores — and that turns out to be a life.",
    related: ["winter"],
    brightness: 2,
    world: {
      landscape: "mountains",
      landmark: "none",
      architecture: "cottage",
      sky: "starfield",
      atmosphere: "clear",
      trees: "pine",
      details: ["smoke", "figures", "path"],
      symbol: "eye",
      landmarkSide: "left",
      art: {
        scene: "alpine-enclosure",
        density: "medium",
        focalPoint: "The lodge's single chimney of smoke, the only movement in the valley",
        composition: "A closed valley, mountains on every side; the lodge small in the middle ground, the woman and her dog on the path",
        foreground: "Valley grass and a worn path",
        middleGround: "The hunting lodge among pines",
        background: "High ranges sealing the valley in; a dense, indifferent field of stars",
        atmosphere: "Still, clear, enormously quiet",
        goldEmphasis: "The lodge's lit window and the smoke above it",
        secondaryMotifs: ["dog", "pines", "starfield"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "Summer",
    author: "Ali Smith",
    year: 2020,
    genres: ["Contemporary fiction"],
    themes: ["Time", "Memory", "Power", "Transformation", "Art"],
    locations: ["Brighton, England", "Isle of Man, British Isles"],
    moods: ["hopeful", "luminous", "wry"],
    description:
      "The closing book of Smith's seasonal quartet, set in the first summer of the pandemic. A Brighton family, a stranger's errand, and an old man remembering the summer of 1940, when he was interned as an 'enemy alien' on the Isle of Man.",
    setting: `Brighton's seafront in the strange quiet of 2020: shut shops, a shingle beach, the sea doing what it always does. Behind it, in memory, a camp of requisitioned boarding houses on the Isle of Man, wired in, where artists and scholars passed a summer behind barbed wire.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `Summer gathers up the whole quartet. Characters from the earlier books cross paths, and the seasons, which began in division, end in something closer to a reckoning with time itself.

What remains is the way the book holds two summers in one frame — a pandemic lockdown and a wartime internment — and lets each shed light on the other. Smith keeps returning to the idea that the present is never only itself; it is also every summer that came before it.`,
    observation: "Every summer contains every other summer.",
    related: ["winter", "spring"],
    brightness: 2,
    world: {
      landscape: "coast",
      landmark: "none",
      architecture: "townhouses",
      sky: "sun",
      atmosphere: "clear",
      trees: "none",
      details: ["boat", "birds", "figures"],
      symbol: "orbit",
      landmarkSide: "right",
      art: {
        density: "medium",
        focalPoint: "A pale, engraved summer sun over the sea",
        composition: "Seafront terraces on the headland; open sea and a boat across the rest of the plate",
        foreground: "Shingle shore and a few distant walkers",
        middleGround: "The sea, a small boat, gulls",
        background: "A low sun with a full ring of rays; a faint orbit marking the turn of the year",
        atmosphere: "Bright, quiet, held breath",
        goldEmphasis: "The sun and its broken path on the water",
        secondaryMotifs: ["gulls", "terraces", "boat"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "This Is How You Lose the Time War",
    slug: "time-war",
    author: "Amal El-Mohtar & Max Gladstone",
    year: 2019,
    genres: ["Science fiction"],
    themes: ["Time", "Desire", "War", "Identity"],
    locations: ["The strands of time, Everywhere"],
    moods: ["exuberant", "tender", "dreamlike"],
    description:
      "Red and Blue, agents on opposite sides of a war fought up and down the braids of time, begin leaving each other letters — in tree rings, in seeds, in the margins of history. Taunts become correspondence; correspondence becomes love.",
    setting: `No single place: dying worlds, drowned cities, besieged empires, futures made of light. The war is fought in history's margins, and the letters are hidden there too, where only one reader will think to look.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The novella is written almost entirely in letters, and the letters are flirtatious, competitive, showy — each writer trying to outdo the other in the beauty of their hiding places. The war is enormous; the story is two voices.

What remains is how the form becomes the feeling. A love affair conducted across centuries, by people who can never safely meet, turns out to be a love affair with reading itself: the delay, the decoding, the hope that someone, somewhere, will find what you left.`,
    quote: { text: "Burn before reading.", source: "The first letter" },
    observation: "Every letter is also a hiding place.",
    related: ["orlando"],
    brightness: 2,
    world: {
      landscape: "moor",
      landmark: "observatory",
      architecture: "none",
      sky: "comet",
      atmosphere: "mist",
      trees: "none",
      details: ["birds"],
      symbol: "hourglass",
      landmarkSide: "left",
      art: {
        scene: "crossing-threads",
        density: "medium-high",
        focalPoint: "A comet crossing a sky full of time",
        composition: "An empty, timeless upland; a lone observatory on one side, the comet's long tail sweeping across the other",
        foreground: "Bare ground with no landmarks of any age",
        middleGround: "The observatory, its telescope raised",
        background: "The comet, an hourglass in the margin, birds that might carry a letter",
        atmosphere: "Mist, uncertainty, every century at once",
        goldEmphasis: "The comet's head",
        secondaryMotifs: ["hourglass", "birds", "telescope"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "Spring",
    author: "Ali Smith",
    year: 2019,
    genres: ["Contemporary fiction"],
    themes: ["Power", "Time", "Alienation", "Transformation", "Art"],
    locations: ["Kingussie, Scotland"],
    moods: ["hopeful", "wry", "tender"],
    description:
      "A grieving television director takes a train north to the Highlands. At a station he crosses paths with Brit, an officer at an immigration removal centre, and Florence, a schoolgirl who seems able to walk into places no one else can.",
    setting: `The Highland line running north out of the cities, a small station at Kingussie, mountains still holding snow above the spring. Elsewhere, the fences and locked corridors of a removal centre — a place built to make people disappear in plain sight.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `Spring is the most openly angry of the quartet, and also the most hopeful. Its cruelty is administrative — a detention system run by tired people — and its hope arrives in the shape of a child who simply refuses to accept that a door is closed.

What remains is the idea of spring as something insistent rather than gentle: the season that comes back whether or not anyone deserves it. Rilke and Katherine Mansfield drift through the book like weather.`,
    observation: "Spring does not ask permission.",
    related: ["winter", "summer"],
    brightness: 2,
    world: {
      landscape: "mountains",
      landmark: "none",
      architecture: "village",
      sky: "crescent",
      atmosphere: "mist",
      water: "river",
      trees: "pine",
      details: ["figures", "birds", "smoke"],
      symbol: "compass",
      landmarkSide: "right",
      art: {
        density: "medium",
        focalPoint: "A small Highland village where a river comes down from the hills",
        composition: "Mountains behind, a river winding through the valley, the village on one bank",
        foreground: "Valley floor, pines, a figure walking",
        middleGround: "The river and the village roofs",
        background: "Snow still on the high ranges; a thin crescent",
        atmosphere: "Cold spring mist lifting",
        goldEmphasis: "A few lit windows in the village",
        secondaryMotifs: ["river", "birds", "pines"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "The Last Supper",
    author: "Rachel Cusk",
    year: 2009,
    genres: ["Memoir", "Travel writing"],
    themes: ["Art", "Transformation", "Identity", "Desire"],
    locations: ["Tuscany, Italy"],
    moods: ["luminous", "contemplative", "wry"],
    description:
      "Rachel Cusk, her husband and their two daughters leave England for a summer in Italy — a rented house in Tuscany, then further south — looking at paintings, eating, and asking what it would mean to live differently.",
    setting: `A farmhouse on a Tuscan hillside, cypresses along the road, a church tower over the nearest town. Inside the churches, frescoes by Piero della Francesca; outside, heat, cicadas, and the long afternoons in which a family discovers what it is like when no one has to be anywhere.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The book is subtitled a summer in Italy, and it reads like one: unhurried, sun-struck, full of small domestic comedies. But underneath the travel writing runs a sharper question — whether a life can be changed simply by changing its scenery.

What remains is the way the paintings work on the book. Cusk looks at Renaissance art not as a tourist ticking off masterpieces but as someone trying to learn how to see, and the act of looking slowly becomes the real journey.`,
    observation: "To look at a painting properly is to be changed, slightly, by the length of the look.",
    related: ["the-renaissance"],
    brightness: 2,
    world: {
      landscape: "countryside",
      landmark: "church",
      architecture: "village",
      sky: "sun",
      atmosphere: "clear",
      trees: "cypress",
      details: ["path", "figures"],
      symbol: "none",
      landmarkSide: "right",
      art: {
        density: "medium",
        focalPoint: "A campanile rising from a hill town in the heat",
        composition: "Rolling Tuscan hills; the town and its church on one side, a cypress-lined road winding towards it",
        foreground: "Grasses, a family on the road",
        middleGround: "Furrowed hills and lines of cypress",
        background: "A white sun with long engraved rays",
        atmosphere: "High summer, heat, stillness",
        goldEmphasis: "The sun and the church windows",
        secondaryMotifs: ["cypresses", "road", "fields"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "The Private Memoirs and Confessions of a Justified Sinner",
    slug: "justified-sinner",
    author: "James Hogg",
    year: 1824,
    genres: ["Gothic novel"],
    themes: ["Fate", "Haunting", "Identity", "Power"],
    locations: ["Edinburgh, Scotland", "Scottish Borders, Scotland"],
    moods: ["anxious", "rain-dark", "wry"],
    description:
      "Two accounts of the same events in early-eighteenth-century Scotland: an editor's narrative, and the confession of Robert Wringhim, raised to believe himself among God's elect, who falls under the sway of a mysterious companion and commits murder in God's name.",
    setting: `The closes and wynds of old Edinburgh, a mansion house in the country, moorland where shepherds talk of strange sightings. At the end, a suicide's grave on a hill in the Borders, opened a century later — and a manuscript inside it.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The book tells its story twice, and the two versions never quite agree. Is Robert's companion, Gil-Martin, the devil? A projection of his own certainty? The novel refuses to choose, and the refusal is where its terror lives.

What remains is the portrait of conviction as a kind of possession. A young man who believes nothing he does can damn him becomes capable of anything — and Hogg sets that theological nightmare against a world of ordinary, sceptical, very Scottish voices.`,
    observation: "Certainty can be a stranger who walks beside you, wearing your face.",
    related: ["dracula"],
    brightness: 2,
    world: {
      landscape: "moor",
      landmark: "obelisk",
      architecture: "manor",
      sky: "eclipse",
      atmosphere: "mist",
      trees: "bare",
      details: ["figures", "path"],
      symbol: "eye",
      landmarkSide: "right",
      art: {
        density: "medium",
        focalPoint: "A grave marker on the hill, under an eclipsed sun",
        composition: "Open Border moorland; the old house distant on one side, the marker close on the other, a path between",
        foreground: "Heather, stones, a single walker",
        middleGround: "Bare trees and the mansion house",
        background: "An eclipse with a ragged corona",
        atmosphere: "Mist, doubt, a sky that should not be dark",
        goldEmphasis: "The eclipse's corona",
        secondaryMotifs: ["double figures", "bare trees", "watching eye"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "Much Ado About Nothing",
    author: "William Shakespeare",
    year: 1600,
    genres: ["Play", "Comedy"],
    themes: ["Desire", "Performance", "Identity", "Power"],
    locations: ["Messina, Sicily"],
    moods: ["playful", "exuberant", "tender"],
    description:
      "In Messina, soldiers return from war. Claudio falls for Hero; Beatrice and Benedick, sworn enemies of marriage, are tricked into love; a villain's plot nearly destroys a wedding.",
    setting: `Leonato's house and garden in Messina: an orchard to hide in, an arbour to overhear from, a masked dance at night. Sicily in peacetime, where the only battles left are verbal.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The title puns on "noting" — overhearing, observing — and the whole play runs on it. People hide behind hedges and believe what they hear; the same device produces both the lovers and the catastrophe.

What remains is Beatrice and Benedick, who talk themselves into love by talking about how impossible love is. Their wit is a kind of armour, and the play's tenderness is in watching it come off.`,
    quote: { text: "I do love nothing in the world so well as you: is not that strange?", source: "Benedick, Act IV" },
    observation: "Overhearing makes lovers and ruins them by the same trick.",
    related: ["loves-labours-lost", "the-importance-of-being-earnest-and-other-plays"],
    brightness: 2,
    world: {
      landscape: "countryside",
      landmark: "none",
      architecture: "village",
      sky: "full-moon",
      atmosphere: "clear",
      trees: "cypress",
      details: ["figures", "path", "birds"],
      symbol: "armillary",
      landmarkSide: "left",
      art: {
        density: "medium",
        focalPoint: "Moonlight over Leonato's villa on the night of the masked dance",
        composition: "Garden terraces and cypresses; the villa on its hill; paths for overhearing",
        foreground: "Figures on garden paths, half hidden",
        middleGround: "The villa and its walls among cypress",
        background: "A full moon with its rings",
        atmosphere: "Warm night, festivity, secrets",
        goldEmphasis: "The moon and the villa windows",
        secondaryMotifs: ["cypresses", "garden paths", "armillary"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "War and Peace",
    author: "Leo Tolstoy",
    year: 1869,
    genres: ["Historical novel"],
    themes: ["War", "Fate", "Power", "Desire", "Grief", "Transformation"],
    locations: ["Moscow, Russia", "Borodino, Russia", "Austerlitz, Moravia"],
    moods: ["elegiac", "luminous", "contemplative"],
    description:
      "Russian society from 1805 to 1812 and after: the Rostovs, the Bolkonskys and Pierre Bezukhov, through ballrooms and battles at Austerlitz and Borodino, the burning of Moscow, and the long retreat of the French through the snow.",
    setting: `Moscow drawing rooms and country estates; the field of Borodino under smoke; a burning city; the white road west. And over it all, early in 1812, the great comet that Pierre sees from a Moscow street and takes for a sign.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The novel is famous for its size, but its most memorable moments are small: a wounded prince looking up at the sky at Austerlitz, a girl singing, an old oak coming into leaf. History thunders; individual lives go on underneath it.

What remains is Tolstoy's argument that no general, not even Napoleon, truly commands events — that history is made of countless ordinary choices. The book gives that idea a scale nothing else could.`,
    observation: "History is made of countless small decisions that no one person commands.",
    related: ["a-farewell-to-arms"],
    brightness: 3,
    world: {
      landscape: "countryside",
      landmark: "church",
      architecture: "manor",
      sky: "comet",
      atmosphere: "snow",
      trees: "bare",
      details: ["smoke", "figures"],
      symbol: "none",
      landmarkSide: "left",
      art: {
        scene: "winter-plain",
        density: "dense",
        focalPoint: "The great comet of 1812 over a winter landscape",
        composition: "A wide Russian plain; a church on one side, a great country house on the other, the comet across the sky between",
        foreground: "Snowfields, figures on the road",
        middleGround: "The manor, bare trees, smoke rising",
        background: "The comet and its long tail",
        atmosphere: "Snow, smoke, an omen in the sky",
        goldEmphasis: "The comet's head and the house windows",
        secondaryMotifs: ["smoke", "bare birches", "winter road"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "The World According to Joan Didion",
    author: "Evelyn McDonnell",
    year: 2023,
    genres: ["Biography"],
    themes: ["Identity", "Art", "Memory", "Womanhood"],
    locations: ["Sacramento, California", "Los Angeles, California", "New York, New York"],
    moods: ["luminous", "contemplative", "spare"],
    description:
      "An illustrated guide to Joan Didion's life and work, moving through the places, people and preoccupations that shaped her sentences.",
    setting: `The Sacramento Valley where Didion grew up, its river and its pioneer stories; Los Angeles houses with the Santa Ana blowing; New York apartments; the airports and hotels in between. A life told as a map.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The book approaches Didion obliquely, through things — houses, cars, clothes, cities — as though the only way to describe a writer so careful about surfaces is to begin with them.

What remains is the sense of a life as a set of places, each one leaving its mark on the prose. It is a companion to the essays rather than a substitute for them, and it sends you back to them.`,
    observation: "A writer's style can be read like a map of the places she lived.",
    related: ["the-white-album"],
    brightness: 1,
    world: {
      landscape: "river",
      landmark: "bridge",
      architecture: "country-house",
      sky: "sun",
      atmosphere: "clear",
      trees: "poplar",
      details: ["figures", "birds"],
      symbol: "compass",
      art: {
        density: "medium",
        focalPoint: "A bridge over the Sacramento River where her story begins",
        composition: "A wide valley with the river winding through it; a bridge across it; a house on one bank",
        foreground: "River banks, poplars, a figure",
        middleGround: "The bridge and the house",
        background: "Low hills and a pale Californian sun; a compass in the corner",
        atmosphere: "Dry, bright, clear",
        goldEmphasis: "The sun on the river",
        secondaryMotifs: ["compass", "poplars", "birds"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "Oresteia",
    author: "Aeschylus",
    year: -458,
    genres: ["Play", "Tragedy"],
    themes: ["Fate", "Power", "Grief", "War", "Haunting"],
    locations: ["Argos, Greece", "Athens, Greece"],
    moods: ["elegiac", "anxious", "spare"],
    description:
      "The only complete trilogy of Greek tragedy to survive. Agamemnon returns from Troy and is murdered by his wife; their son Orestes avenges him; the Furies pursue Orestes to Athens, where a court decides his fate.",
    setting: `The palace at Argos, where a watchman on the roof has waited a year for the beacon fires that mean Troy has fallen. Then Agamemnon's tomb, then the temple at Delphi, and finally Athens — a hill where, for the first time, the dead are answered by a court rather than by blood.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The trilogy begins with a man watching the stars and ends with the founding of a law court. Between them, a family repeats its violence generation after generation, each killing answering the last.

What remains is the strange hope of the ending: that the Furies themselves can be persuaded to stay, renamed and given a home beneath the city. Grief and vengeance are not abolished; they are housed.`,
    observation: "Justice begins when the cycle of revenge is given somewhere to sit and be heard.",
    related: ["antony-and-cleopatra"],
    brightness: 3,
    world: {
      landscape: "mountains",
      landmark: "statue",
      architecture: "village",
      sky: "starfield",
      atmosphere: "clear",
      trees: "cypress",
      details: ["figures", "smoke"],
      symbol: "armillary",
      landmarkSide: "right",
      art: {
        density: "medium-high",
        focalPoint: "The watchman's stars, and a figure on a plinth below them",
        composition: "Mountains around Argos; the town and its palace on one side, a classical figure on the other, beacon smoke rising",
        foreground: "Stony ground, cypresses",
        middleGround: "The town and the statue",
        background: "A dense band of stars the watchman has learned by heart",
        atmosphere: "Night vigil, waiting, dread",
        goldEmphasis: "The stars and the beacon",
        secondaryMotifs: ["beacon smoke", "cypresses", "armillary"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "Studies in the History of the Renaissance",
    slug: "the-renaissance",
    author: "Walter Pater",
    year: 1873,
    genres: ["Essays"],
    themes: ["Art", "Time", "Desire"],
    locations: ["Florence, Italy"],
    moods: ["luminous", "contemplative", "dreamlike"],
    description:
      "Essays on Renaissance painters, poets and thinkers — Botticelli, Leonardo, Michelangelo, Pico della Mirandola — and a short Conclusion urging the reader to live for intense experience, which scandalised Victorian Oxford.",
    setting: `Florence along the Arno: towers and roofs, cypresses on the hills of Fiesole, the dim chapels where Botticelli's Madonnas wait. Pater's Renaissance is less a period than a quality of light.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `Pater writes about paintings in sentences that are themselves almost too beautiful — slow, layered, self-aware. His famous description of the Mona Lisa is less an analysis than a reverie.

What remains is the Conclusion, a few pages long, which argues that life is a series of fleeting impressions and that the only success is to notice them as fully as possible. Pater withdrew it from the second edition, fearing it might mislead the young. It was already too late.`,
    quote: { text: "To burn always with this hard, gem-like flame, to maintain this ecstasy, is success in life.", source: "Conclusion" },
    observation: "Attention, not achievement, is the measure of a life.",
    related: ["the-last-supper"],
    brightness: 2,
    world: {
      landscape: "city",
      landmark: "church",
      architecture: "village",
      sky: "crescent",
      atmosphere: "mist",
      trees: "cypress",
      water: "river",
      details: ["figures"],
      symbol: "armillary",
      landmarkSide: "left",
      art: {
        density: "medium-high",
        focalPoint: "A campanile over Florentine roofs at dusk",
        composition: "A river city; the bell tower on one side, a cluster of roofs on the other, the river below",
        foreground: "The embankment and the river",
        middleGround: "Roofs, towers, cypresses",
        background: "A crescent moon and a faint distant skyline",
        atmosphere: "Golden dusk, mist off the river",
        goldEmphasis: "The windows of the town, as if lit by the gem-like flame",
        secondaryMotifs: ["cypresses", "river", "armillary"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "A Room of One's Own",
    author: "Virginia Woolf",
    year: 1929,
    genres: ["Essays"],
    themes: ["Womanhood", "Power", "Art", "Identity"],
    locations: ["Cambridge, England", "London, England"],
    moods: ["wry", "luminous", "contemplative"],
    description:
      "An essay grown from two lectures given at Cambridge women's colleges in 1928. Woolf imagines a writer turned off the grass at 'Oxbridge', a dinner of prunes and custard, and Shakespeare's sister, Judith, to ask why women have so rarely written.",
    setting: `An October afternoon at 'Oxbridge': a river, a college lawn a woman may not walk on, a library she may not enter unaccompanied. Then a sparse dinner at the women's college, 'Fernham', and the next morning the reading room of the British Museum, where every book about women was written by a man.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The argument is simple and material — money, a lock on the door, time — but it is delivered as a wandering, fictionalised ramble, full of jokes and digressions. Woolf persuades by walking the reader through the afternoon.

What remains is Judith Shakespeare, the imagined sister as gifted as her brother, whose story ends in a grave at a crossroads. She is invented, and she is the most persuasive thing in the book.`,
    quote: { text: "A woman must have money and a room of her own if she is to write fiction.", source: "Chapter One" },
    observation: "Genius needs a door that locks and an income that arrives.",
    related: ["orlando", "to-the-lighthouse"],
    brightness: 3,
    world: {
      landscape: "river",
      landmark: "church",
      architecture: "manor",
      sky: "new-moon",
      atmosphere: "clear",
      trees: "round",
      details: ["figures", "path"],
      symbol: "key",
      landmarkSide: "left",
      art: {
        density: "medium",
        focalPoint: "A college chapel by the river at dusk, its doors closed",
        composition: "A university town by a slow river; the chapel on one side, the long college range on the other, a lawn between",
        foreground: "The towpath and a single walker turned off the grass",
        middleGround: "The river and the college buildings",
        background: "A new moon — present but unlit — and a key in the margin",
        atmosphere: "October afternoon turning to evening",
        goldEmphasis: "A few college windows, warm and out of reach",
        secondaryMotifs: ["key", "river", "chapel"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "The Voyage Out",
    author: "Virginia Woolf",
    year: 1915,
    genres: ["Modernist novel"],
    themes: ["Womanhood", "Desire", "Grief", "Transformation", "Identity"],
    locations: ["Santa Marina, South America", "London, England"],
    moods: ["dreamlike", "elegiac", "tender"],
    description:
      "Rachel Vinrace, twenty-four and sheltered, sails from London to South America on her father's ship. At a resort town she falls in love, joins an expedition up a river into the forest, and comes back changed — and ill.",
    setting: `The Thames at night as the ship slips out, then open sea, then Santa Marina: a villa above a bay, an English hotel full of gossip, and beyond it a river leading into a forest so dense the light turns green.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `Woolf's first novel is more conventional than what followed, but the later writer is already visible in its silences — in the long passages where Rachel looks at the sea or plays the piano and the plot simply waits.

What remains is the river journey, where the talk of the hotel falls away and two people try to say what love is in a landscape that dwarfs them. The voyage out is also a voyage inward, and it does not end where a romance would.`,
    observation: "A first journey can carry a person further than she can return from.",
    related: ["to-the-lighthouse", "a-room-of-ones-own"],
    brightness: 2,
    world: {
      landscape: "coast",
      landmark: "none",
      architecture: "village",
      sky: "crescent",
      atmosphere: "mist",
      trees: "round",
      details: ["boat", "birds"],
      symbol: "compass",
      landmarkSide: "left",
      art: {
        density: "medium-high",
        focalPoint: "A ship's sail arriving in a misted bay",
        composition: "A resort town above a bay on one side; open sea and the arriving boat filling the rest",
        foreground: "The shore and dense, rounded trees",
        middleGround: "The bay and the sailing ship",
        background: "A crescent moon, a compass rose for the voyage",
        atmosphere: "Tropical mist, the end of a long passage",
        goldEmphasis: "The town's lit windows and the moon on the water",
        secondaryMotifs: ["compass", "seabirds", "villa"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "The Grass Is Singing",
    author: "Doris Lessing",
    year: 1950,
    genres: ["Literary fiction"],
    themes: ["Power", "Alienation", "Womanhood", "Haunting"],
    locations: ["Southern Rhodesia, Zimbabwe"],
    moods: ["anxious", "spare", "elegiac"],
    description:
      "On a failing farm in Southern Rhodesia, Mary Turner is found murdered and the Turners' servant, Moses, gives himself up. The novel goes back to show how heat, poverty, a loveless marriage and the rigid order of colonial life brought her there.",
    setting: `A small brick house with a tin roof that holds the heat like an oven, a farm that never pays, the bush pressing in on every side. Drought, then the long wait for rain, under a sky that offers nothing.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `Lessing tells the ending first, so the novel reads less as a mystery than as an autopsy — of a marriage, of a woman's mind, and of the white settler society that closes ranks around the killing.

What remains is the house itself, airless and claustrophobic, and the way the landscape around it seems to wait. The colonial order presents itself as permanent; the book shows it as brittle, frightened and already decaying.`,
    quote: { text: "the grass is singing / Over the tumbled graves", source: "T. S. Eliot, The Waste Land (the epigraph)" },
    observation: "A social order built on fear is always closer to collapse than it looks.",
    related: ["the-wall"],
    brightness: 2,
    world: {
      landscape: "moor",
      landmark: "none",
      architecture: "cottage",
      sky: "full-moon",
      atmosphere: "clear",
      trees: "bare",
      details: ["figures", "path"],
      symbol: "none",
      landmarkSide: "right",
      art: {
        scene: "veld-farmhouse",
        density: "sparse",
        focalPoint: "A small tin-roofed farmhouse alone under the moon",
        composition: "A flat, dry expanse with the house small in the middle distance, drought-stripped trees around it",
        foreground: "Cracked ground and dry grass",
        middleGround: "The farmhouse and a track leading to it",
        background: "A full moon in an empty sky — the faint moonlight of the epigraph",
        atmosphere: "Heat at night, oppressive stillness",
        goldEmphasis: "The moon, and one lit window",
        secondaryMotifs: ["bare trees", "track", "dry grass"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "We Hunt the Flame",
    author: "Hafsah Faizal",
    year: 2019,
    genres: ["Fantasy"],
    themes: ["Identity", "Power", "Transformation", "Desire"],
    locations: ["Demenhur, Arawiya", "Sharr, Arawiya"],
    moods: ["exuberant", "anxious", "dreamlike"],
    description:
      "In the kingdom of Arawiya, Zafira hunts the cursed forest of the Arz disguised as a man; Nasir, the Prince of Death, is sent by his father to kill her. Both are drawn to the lost island of Sharr, in search of a book that could restore magic to the land.",
    setting: `Demenhur, a land buried in snow beside a dark forest that swallows those who enter it; and across the sea, the island of Sharr — ruins, sand and something waiting. A world drawn from the stories and landscapes of ancient Arabia.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The book has two narrators who should never meet — a hunter who hides her face and an assassin who hides his heart — and much of its pleasure is in watching them circle each other.

What remains is the island of Sharr, where every companion's loyalty is tested and magic, long lost, begins to stir. Underneath the adventure runs a quieter question about who each of them is when the disguise comes off.`,
    observation: "A disguise worn long enough becomes a second self that must be faced.",
    related: ["time-war"],
    brightness: 1,
    world: {
      landscape: "lake",
      landmark: "obelisk",
      architecture: "village",
      sky: "crescent",
      atmosphere: "mist",
      trees: "pine",
      details: ["boat", "figures"],
      symbol: "compass",
      landmarkSide: "left",
      art: {
        density: "medium",
        focalPoint: "An obelisk on the far shore of the sea, marking the lost island",
        composition: "Water between the near shore and a ruined far shore; mountains closing behind; a boat crossing",
        foreground: "A dark shore with pines — the edge of the Arz",
        middleGround: "The crossing boat on misted water",
        background: "The island's ruins and obelisk under a crescent moon",
        atmosphere: "Mist, quest, enchantment",
        goldEmphasis: "Lights on the far shore and the crescent",
        secondaryMotifs: ["boat", "pines", "compass"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "The White Album",
    author: "Joan Didion",
    year: 1979,
    genres: ["Essays"],
    themes: ["Alienation", "Identity", "Memory", "Haunting", "Art"],
    locations: ["Los Angeles, California", "Malibu, California"],
    moods: ["spare", "anxious", "luminous"],
    description:
      "Essays on California at the end of the 1960s and into the 1970s — the Manson murders, the Doors, the Black Panthers, Hawaii, shopping malls, Georgia O'Keeffe, migraine — written by someone who felt the narrative of her own life coming apart.",
    setting: `A large, decaying house in Hollywood where the phone rings at odd hours and strangers come and go; recording studios at night; the freeway; a house above the Pacific at Malibu where fires come down the canyons in autumn.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The title essay is assembled from fragments — notes, a psychiatric report, scenes she cannot fit into a story — and the fragmentation is the point. The era refuses to make sense, and the prose refuses to pretend otherwise.

What remains is the coolness of the voice, which never raises itself even when describing dread. Didion's precision is a way of holding on: if the world will not cohere, at least the sentences will.`,
    quote: { text: "We tell ourselves stories in order to live.", source: "The White Album, the opening line" },
    observation: "When the story stops making sense, precision becomes a way to stay upright.",
    related: ["the-world-according-to-joan-didion"],
    brightness: 3,
    world: {
      landscape: "coast",
      landmark: "none",
      architecture: "country-house",
      sky: "sun",
      atmosphere: "mist",
      trees: "poplar",
      details: ["smoke", "figures"],
      symbol: "eye",
      landmarkSide: "left",
      art: {
        density: "medium",
        focalPoint: "A house above the Pacific, smoke rising somewhere behind it",
        composition: "A headland house on one side; the Pacific filling the rest; a hazy sun",
        foreground: "Coastal scrub and a figure on the shore",
        middleGround: "The sea and its long swell",
        background: "A low, veiled sun and marine haze",
        atmosphere: "Marine layer, fire season, unease",
        goldEmphasis: "The veiled sun and a few lit windows",
        secondaryMotifs: ["smoke", "palms", "watching eye"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "Normal People",
    author: "Sally Rooney",
    year: 2018,
    genres: ["Contemporary fiction"],
    themes: ["Desire", "Identity", "Power", "Alienation"],
    locations: ["Carricklea, County Sligo", "Dublin, Ireland"],
    moods: ["tender", "anxious", "rain-dark"],
    description:
      "Connell and Marianne grow up in the same small town in the west of Ireland — she in the big house, while his mother cleans it. Through school and four years at Trinity College Dublin, they keep coming back to each other.",
    setting: `A small town in County Sligo: the school corridors, a big white house at the end of a drive, a car parked in the dark. Then Dublin, Trinity's squares and rented flats, a summer in Italy, a winter in Sweden — and always the pull back west.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The novel is built from scenes of conversation, and its drama is almost entirely in what goes unsaid — the misunderstanding that costs a year, the call not made. Class sits quietly underneath every exchange.

What remains is how carefully the book attends to two people changing each other over time. It refuses the comfort of a grand ending, and lets intimacy be what it often is: unfinished.`,
    observation: "Two people can shape each other without ever quite managing to say so.",
    related: ["conversations-with-friends"],
    brightness: 2,
    world: {
      landscape: "countryside",
      landmark: "none",
      architecture: "country-house",
      sky: "crescent",
      atmosphere: "rain",
      trees: "round",
      details: ["figures", "path"],
      symbol: "none",
      landmarkSide: "right",
      art: {
        density: "sparse",
        focalPoint: "The big white house at the end of the drive, seen through rain",
        composition: "Rolling western fields; the house on its rise; two figures on the lane",
        foreground: "Hedgerows and the lane",
        middleGround: "Fields and the house",
        background: "A crescent moon behind rain",
        atmosphere: "Soft Irish rain, evening",
        goldEmphasis: "A single lit window in the big house",
        secondaryMotifs: ["lane", "hedgerows", "two figures"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "Conversations with Friends",
    author: "Sally Rooney",
    year: 2017,
    genres: ["Contemporary fiction"],
    themes: ["Desire", "Identity", "Performance", "Art"],
    locations: ["Dublin, Ireland", "Étables, Brittany"],
    moods: ["wry", "anxious", "tender"],
    description:
      "Frances, a student poet in Dublin, performs spoken word with Bobbi, her former girlfriend. They are taken up by Melissa, a writer and photographer, and her actor husband Nick — and Frances begins an affair with him.",
    setting: `Dublin readings and kitchen parties, a house in a wealthy suburb, a student flat; then a summer holiday house in Brittany where everyone is very polite and nobody says what they mean.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The novel is narrated by someone who observes everyone with great precision except herself. Frances describes her own feelings as if from a distance, and the distance is the story.

What remains is the sense of everyone performing — at readings, at parties, in emails — and the gradual, painful discovery of what lies beneath the performance. Its intelligence is in its dialogue, where wit becomes a way of not speaking.`,
    observation: "Being clever about one's feelings is not the same as having them.",
    related: ["normal-people"],
    brightness: 1,
    world: {
      landscape: "coast",
      landmark: "none",
      architecture: "cottage",
      sky: "sun",
      atmosphere: "clear",
      trees: "round",
      details: ["figures", "birds"],
      symbol: "none",
      landmarkSide: "right",
      art: {
        density: "sparse",
        focalPoint: "A holiday house on a Breton headland in summer light",
        composition: "A small house on one side, sea across the rest; figures on the shore keeping their distance",
        foreground: "The beach and a few walkers",
        middleGround: "The sea, still and bright",
        background: "A high summer sun",
        atmosphere: "Bright, polite, tense",
        goldEmphasis: "The sun on the water",
        secondaryMotifs: ["gulls", "holiday house", "figures apart"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    year: 2017,
    genres: ["Contemporary fiction"],
    themes: ["Performance", "Desire", "Identity", "Power", "Memory"],
    locations: ["Hollywood, California", "New York, New York"],
    moods: ["exuberant", "tender", "elegiac"],
    description:
      "Evelyn Hugo, a reclusive Hollywood star, chooses an unknown magazine writer, Monique Grant, to write her life story. She tells it husband by husband — and reveals the love she spent her career hiding.",
    setting: `A Manhattan apartment full of photographs, where an old woman talks for days; and, in her telling, the studios, premieres and swimming pools of Hollywood from the 1950s onwards, where every marriage was also a performance for the cameras.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The structure is a confession broken into seven chapters, one for each husband, and the husbands turn out to be the least important people in the story. The real subject is a love that could not be public.

What remains is the portrait of fame as a kind of permanent role — a woman who controls every image of herself and decides, at last, to tell the truth on her own terms.`,
    observation: "A life lived in public can be the most carefully hidden of all.",
    related: ["the-importance-of-being-earnest-and-other-plays"],
    brightness: 1,
    world: {
      landscape: "city",
      landmark: "statue",
      architecture: "townhouses",
      sky: "starfield",
      atmosphere: "clear",
      trees: "poplar",
      details: ["figures", "aeroplane"],
      symbol: "eye",
      landmarkSide: "left",
      art: {
        density: "medium-high",
        focalPoint: "A gilded figure on a plinth beneath a sky crowded with stars",
        composition: "A city street of tall houses on one side, the statue on the other, a river of lights below",
        foreground: "The embankment and passers-by",
        middleGround: "Townhouses with many lit windows",
        background: "A dense starfield — stars of every kind — and an aeroplane",
        atmosphere: "Glamour at night, secrets behind windows",
        goldEmphasis: "The lit windows and the brightest stars",
        secondaryMotifs: ["aeroplane", "watching eye", "palms"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "Dracula",
    author: "Bram Stoker",
    year: 1897,
    genres: ["Gothic novel"],
    themes: ["Haunting", "Desire", "Power", "Alienation"],
    locations: ["Transylvania, Romania", "Whitby, England", "London, England"],
    moods: ["anxious", "rain-dark", "dreamlike"],
    description:
      "Told in letters, journals and newspaper cuttings: Jonathan Harker travels to Count Dracula's castle in Transylvania; the Count comes to England, landing at Whitby; a small band led by Van Helsing pursues him back to his castle.",
    setting: `A castle on the edge of a precipice in the Carpathians, wolves howling below; a ship running aground at Whitby in a storm, a great dog leaping from it up the abbey steps; the asylums, cemeteries and fogs of London.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The novel is a collage of documents — diaries, letters, phonograph recordings, telegrams — and the vampire is never given a voice of his own. He is assembled from other people's fear.

What remains is how modern the book is about its own terror: typewriters, blood transfusions, railway timetables, all deployed against something very old. It reads as a story about a new century trying to keep out the past.`,
    quote: { text: "Listen to them — the children of the night. What music they make!", source: "Jonathan Harker's journal, Chapter II" },
    observation: "The monster never speaks for himself; he is made of other people's fear.",
    related: ["justified-sinner"],
    brightness: 2,
    world: {
      landscape: "mountains",
      landmark: "none",
      architecture: "manor",
      sky: "full-moon",
      atmosphere: "mist",
      trees: "bare",
      details: ["birds", "path"],
      symbol: "eye",
      landmarkSide: "right",
      art: {
        scene: "carpathian-pass",
        density: "medium-high",
        focalPoint: "A crenellated castle on a mountain ridge under the full moon",
        composition: "High Carpathian ranges; the castle on a shoulder of the mountain; a pass winding towards it",
        foreground: "Bare trees and the road up the pass",
        middleGround: "The castle with a few lit windows",
        background: "The full moon, ringed; dark birds against it",
        atmosphere: "Mist, night, wolves somewhere below",
        goldEmphasis: "The moon and the castle windows",
        secondaryMotifs: ["bats", "bare trees", "winding road"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "Love's Labour's Lost",
    author: "William Shakespeare",
    year: 1598,
    genres: ["Play", "Comedy"],
    themes: ["Desire", "Performance", "Time"],
    locations: ["Navarre, Iberia"],
    moods: ["playful", "wry", "elegiac"],
    description:
      "The King of Navarre and three of his lords swear to spend three years in study, without the company of women. The Princess of France arrives with her ladies; the vows break one by one; and the play ends not in weddings but in news of a death, and a year's wait.",
    setting: `The King's park in Navarre, turned into an academy: lawns, a hunting ground, a royal tent pitched outside the gates for the Princess, who has not been allowed in. A world of wordplay, sonnets and elaborate games, interrupted at the last by a messenger from France.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `This is Shakespeare at his most verbally extravagant — puns, sonnets, disguises, a masque of Muscovites — and for most of its length the play seems content to be a dazzling game.

What remains is the ending, when a death interrupts the games and the lovers are sent away for a year to prove themselves. Comedy, it turns out, cannot simply be declared; it has to be earned by time.`,
    quote: { text: "Our wooing doth not end like an old play; / Jack hath not Jill.", source: "Berowne, Act V" },
    observation: "A comedy that ends in waiting is braver than one that ends in weddings.",
    related: ["much-ado-about-nothing"],
    brightness: 1,
    world: {
      landscape: "lake",
      landmark: "statue",
      architecture: "manor",
      sky: "crescent",
      atmosphere: "clear",
      trees: "poplar",
      details: ["figures", "boat"],
      symbol: "armillary",
      landmarkSide: "left",
      art: {
        density: "medium",
        focalPoint: "A classical statue on the shore of the King's ornamental lake",
        composition: "A formal park with the court on the far shore of a lake; the statue near; poplars in rows",
        foreground: "The near shore and a figure",
        middleGround: "The lake with a small boat",
        background: "The court on the far shore, mountains beyond, a crescent moon",
        atmosphere: "Clear evening, games ending",
        goldEmphasis: "The court's windows and the moon",
        secondaryMotifs: ["armillary (the academy)", "poplars", "boat"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "The Importance of Being Earnest and Other Plays",
    author: "Oscar Wilde",
    year: 1899,
    genres: ["Play", "Comedy"],
    themes: ["Performance", "Identity", "Desire", "Power"],
    locations: ["London, England", "Woolton, Hertfordshire"],
    moods: ["playful", "exuberant", "wry"],
    description:
      "Wilde's society comedies in one volume. In The Importance of Being Earnest, two young men invent alter egos — a wicked brother called Ernest, an invalid called Bunbury — to escape their obligations, and are caught out by the women who love them for a name.",
    setting: `Algernon's flat in Half Moon Street, cucumber sandwiches on the tea table; then the garden of a manor house in Hertfordshire, a governess, a clergyman and a handbag once mislaid at Victoria Station.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The plays move at the speed of epigram, and the epigrams are so polished that it is easy to miss how sharply they cut. Every line about manners is also a line about money, marriage and hypocrisy.

What remains is the double life, which the comedy treats as a game and which Wilde, offstage, was living at great cost. Earnest opened in February 1895; within months its author was in prison. The jokes about secret selves read differently knowing that.`,
    quote: { text: "The truth is rarely pure and never simple.", source: "Algernon, Act I" },
    observation: "A mask worn lightly can still be carrying great weight.",
    related: ["much-ado-about-nothing", "the-seven-husbands-of-evelyn-hugo"],
    brightness: 2,
    world: {
      landscape: "countryside",
      landmark: "none",
      architecture: "country-house",
      sky: "sun",
      atmosphere: "clear",
      trees: "round",
      details: ["figures", "smoke", "birds"],
      symbol: "key",
      landmarkSide: "left",
      art: {
        density: "medium",
        focalPoint: "The manor house garden on a bright afternoon",
        composition: "Rolling Hertfordshire fields; the country house on its rise; figures on the garden path",
        foreground: "Grass and garden paths",
        middleGround: "The house and its chimneys",
        background: "A high sun; a key in the margin for the secrets",
        atmosphere: "Bright, artificial, delighted",
        goldEmphasis: "The sun and the house windows",
        secondaryMotifs: ["key", "chimney smoke", "birds"],
      },
    },
  },

  /* ───────────────────────────────────────────────────────────────────── */
  {
    title: "Antony and Cleopatra",
    author: "William Shakespeare",
    year: 1623,
    genres: ["Play", "Tragedy"],
    themes: ["Desire", "Power", "Fate", "Performance", "War", "Grief"],
    locations: ["Alexandria, Egypt", "Rome, Italy", "Actium, Greece"],
    moods: ["exuberant", "elegiac", "luminous"],
    description:
      "Mark Antony, one of three men ruling the Roman world, neglects his duties for Cleopatra, Queen of Egypt. War with Octavius follows; defeat at Actium; and two deaths in Alexandria that turn defeat into legend.",
    setting: `Alexandria's palaces and harbour, the Nile beyond them, a barge with a burnished throne; then Rome's cold council rooms, galleys off Actium, and at the end a monument in Egypt where a queen dresses for death.`,
    // PLACEHOLDER — replace with your own words.
    reflection: `The play swings between Rome and Egypt dozens of times, and each world judges the other. Rome sees indulgence; Egypt sees a life without poetry. Shakespeare never settles which is right.

What remains is the language, extravagant even for Shakespeare, in which a middle-aged general and a queen insist on their love as something larger than empire. They lose everything, and the play lets them win the argument anyway.`,
    quote: { text: "Age cannot wither her, nor custom stale / Her infinite variety.", source: "Enobarbus, Act II" },
    observation: "Love can lose every battle and still have the last word.",
    related: ["oresteia", "much-ado-about-nothing"],
    brightness: 2,
    world: {
      landscape: "coast",
      landmark: "lighthouse",
      architecture: "village",
      sky: "full-moon",
      atmosphere: "clear",
      trees: "poplar",
      details: ["boat", "figures"],
      symbol: "orbit",
      landmarkSide: "left",
      art: {
        density: "medium-high",
        focalPoint: "The Pharos, Alexandria's great lighthouse, over the harbour",
        composition: "Alexandria on its headland; the lighthouse on its rock in the harbour; a barge on the water",
        foreground: "Palms on the shore",
        middleGround: "The harbour and Cleopatra's barge",
        background: "A full moon over the Mediterranean",
        atmosphere: "Warm night, splendour, impending loss",
        goldEmphasis: "The lighthouse fire and its reflection",
        secondaryMotifs: ["barge", "palms", "orbit"],
      },
    },
  },

  /* ═════════════════════════════════════════════════════════════════════
   *  ↑↑↑  ADD NEW BOOKS ABOVE THIS LINE  ↑↑↑
   *  Paste a copy of the TEMPLATE (from the top of this file) here.
   * ═════════════════════════════════════════════════════════════════════ */
];
