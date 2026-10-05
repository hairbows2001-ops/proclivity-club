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

  "Marlen Haushofer": {
    born: 1920,
    died: 1970,
    bio: "Austrian novelist who wrote in the hours left over from family life and a dental practice in Steyr, Upper Austria. Her books return to women at the edge of ordinary existence, watching it closely and without consolation.",
  },
  "Amal El-Mohtar & Max Gladstone": {
    bio: "Two writers of speculative fiction who wrote their novella as an exchange of letters, each taking one of its two voices. El-Mohtar is also a poet and critic; Gladstone is the author of the Craft Sequence novels.",
  },
  "Rachel Cusk": {
    born: 1967,
    bio: "Novelist and memoirist whose writing turns the conventional novel inside out — most recently in the Outline trilogy, where the narrator recedes and other people's stories fill the space.",
  },
  "James Hogg": {
    born: 1770,
    died: 1835,
    bio: "Scottish poet and novelist, a shepherd in the Ettrick valley before he was a writer, known in his lifetime as the Ettrick Shepherd. His one great novel was largely ignored for a century.",
  },
  "William Shakespeare": {
    born: 1564,
    died: 1616,
    bio: "Playwright and poet of Stratford-upon-Avon and London. Comedies, histories, tragedies and romances, written for an open-air theatre and a company of actors he belonged to.",
  },
  "Leo Tolstoy": {
    born: 1828,
    died: 1910,
    bio: "Russian novelist, soldier in the Crimean War, and later a moral and religious thinker. He wrote his two great novels on his family estate, Yasnaya Polyana.",
  },
  "Evelyn McDonnell": {
    bio: "American journalist and critic who writes on music, women and popular culture, and teaches journalism in Los Angeles.",
  },
  "Aeschylus": {
    bio: "The earliest of the three great Athenian tragedians, born around 525 BC. He fought against the Persians at Marathon and wrote some ninety plays, of which seven survive.",
  },
  "Walter Pater": {
    born: 1839,
    died: 1894,
    bio: "Oxford critic and essayist whose prose, as finely worked as the art it described, shaped the aesthetic movement and the young Oscar Wilde.",
  },
  "Doris Lessing": {
    born: 1919,
    died: 2013,
    bio: "Novelist raised on a farm in Southern Rhodesia, who moved to London in 1949 with the manuscript of her first novel. She was awarded the Nobel Prize in Literature in 2007.",
  },
  "Hafsah Faizal": {
    bio: "American writer of fantasy whose novels draw on the histories, landscapes and stories of the Arab world.",
  },
  "Joan Didion": {
    born: 1934,
    died: 2021,
    bio: "Essayist and novelist from Sacramento, who chronicled California and American unease in prose of exacting coolness, and later wrote about grief with the same precision.",
  },
  "Sally Rooney": {
    born: 1991,
    bio: "Irish novelist from County Mayo whose books follow young people in love, friendship and politics, with close attention to how they speak and fail to speak.",
  },
  "Taylor Jenkins Reid": {
    bio: "American novelist whose books imagine the private lives of public women — film stars, rock singers, athletes — across the second half of the twentieth century.",
  },
  "Bram Stoker": {
    born: 1847,
    died: 1912,
    bio: "Irish writer, for many years manager of Henry Irving's Lyceum Theatre in London. He wrote novels and stories in the hours his theatre left him.",
  },
  "Oscar Wilde": {
    born: 1854,
    died: 1900,
    bio: "Irish poet, playwright and wit. His society comedies filled London theatres in the 1890s, until his prosecution in 1895; he died in exile in Paris.",
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
