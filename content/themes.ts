/**
 * ═════════════════════════════════════════════════════════════════════════
 *  CONSTELLATIONS (THEMES)
 * ═════════════════════════════════════════════════════════════════════════
 *  Every theme used in content/books.ts becomes a constellation on the Atlas.
 *
 *  You do NOT have to add a theme here before using it in a book — a new
 *  theme name simply appears with a short default description. Add an entry
 *  below when you want to write that constellation's description yourself.
 *
 *  The name on the left must match the theme name used in books.ts
 *  (capital letters don't matter).
 * ═════════════════════════════════════════════════════════════════════════
 */

import type { ThemeInput } from "@/lib/types";

export const themes: Record<string, ThemeInput> = {
  Time: {
    latin: "Tempus",
    description:
      "Books in which hours strike, centuries pass in a paragraph, or a single day is made to hold a life.",
  },
  Memory: {
    latin: "Memoria",
    description:
      "The past as a room you can walk back into, rearranged each time. Books that remember, and books about remembering.",
  },
  Desire: {
    latin: "Cupido",
    description: "Wanting as a kind of weather — love, longing, envy, and the things people reach for and cannot hold.",
  },
  Womanhood: {
    latin: "Femina",
    description:
      "Lives shaped by being, or becoming, a woman: rooms of one's own, drawing rooms, and the long work of being seen.",
  },
  Identity: {
    latin: "Persona",
    description: "Who a person is, and whether they are one person at all. Selves that split, change costume, or refuse to settle.",
  },
  War: {
    latin: "Bellum",
    description: "Books written in the shadow of war, at the front or long after — where the violence happens offstage and stays.",
  },
  Power: {
    latin: "Potestas",
    description: "Who holds it, who is held by it. Families, nations, and the quiet politics of who gets to speak.",
  },
  Grief: {
    latin: "Luctus",
    description: "Loss, mourning, and the strange persistence of the people who are gone.",
  },
  Transformation: {
    latin: "Metamorphosis",
    description: "Change at the scale of a body, a season or an age. Books in which no one ends as they began.",
  },
  Alienation: {
    latin: "Peregrinus",
    description: "Being a stranger — in a city, a family, a country, or one's own mind.",
  },

  Art: {
    latin: "Ars",
    description:
      "Books about making things and looking at them — paintings, poems, films, sentences — and what that attention does to a life.",
  },
  Fate: {
    latin: "Fatum",
    description:
      "Gods, predestination, history's long tide: books in which people act freely and are carried anyway.",
  },
  Performance: {
    latin: "Theatrum",
    description: "Masks, roles, disguises and second selves. Books that know the world is a stage, and ask who is underneath.",
  },
  Haunting: {
    latin: "Umbra",
    description: "Dread, doubles, the uncanny. Books in which something unseen presses on the edges of the page.",
  },

  /* ↑ Add new constellation descriptions above this line, in the same format:
   *
   *   Solitude: {
   *     latin: "Solitudo",
   *     description: "Your description here.",
   *   },
   */
};
