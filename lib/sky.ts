/**
 * Constellation geometry. Positions are generated from the book and theme
 * names, so the sky is the same on every visit and re-arranges itself
 * gracefully as new books are added — nothing is drawn by hand.
 */

import { createRng, hash, r1 } from "./rng";
import type { Book, Theme } from "./types";

export interface SkyStar {
  id: string;
  x: number;
  y: number;
  /** Present when this star is a book; absent for the faint anonymous stars that complete a figure. */
  book?: string;
  magnitude: 1 | 2 | 3;
}

export interface SkyConstellation {
  theme: Theme;
  cx: number;
  cy: number;
  stars: SkyStar[];
  edges: [number, number][];
}

/** Join points into a constellation figure using a minimum spanning tree (plus, sometimes, one closing line). */
export function constellationEdges(points: { x: number; y: number }[], seed = 0): [number, number][] {
  const n = points.length;
  if (n < 2) return [];
  const inTree = new Set([0]);
  const edges: [number, number][] = [];
  const d = (a: number, b: number) => Math.hypot(points[a].x - points[b].x, points[a].y - points[b].y);
  while (inTree.size < n) {
    let best: [number, number] | null = null;
    let bestD = Infinity;
    for (const a of inTree) {
      for (let b = 0; b < n; b++) {
        if (inTree.has(b)) continue;
        const dist = d(a, b);
        if (dist < bestD) { bestD = dist; best = [a, b]; }
      }
    }
    edges.push(best!);
    inTree.add(best![1]);
  }
  // A closed loop gives some figures the look of a real asterism.
  if (n >= 4 && seed % 3 === 0) {
    const leaves = [...Array(n).keys()].filter((i) => edges.filter((e) => e.includes(i)).length === 1);
    if (leaves.length >= 2) edges.push([leaves[0], leaves[leaves.length - 1]]);
  }
  return edges;
}

export const ATLAS_W = 1600;
export const ATLAS_H = 1000;

/** Lay out every constellation inside the oval of a planisphere (an old celestial chart). */
export function layoutAtlas(themes: Theme[], books: Book[]): SkyConstellation[] {
  const size = 1000;
  const n = themes.length;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const bookBySlug = new Map(books.map((b) => [b.slug, b]));

  // Largest constellations nearest the pole of the chart.
  const ordered = [...themes].sort((a, b) => b.books.length - a.books.length || a.name.localeCompare(b.name));

  return ordered.map((theme, i) => {
    const r = Math.sqrt((i + 0.6) / n);
    const a = i * golden - Math.PI / 2;
    const cx = ATLAS_W / 2 + r * Math.cos(a) * ATLAS_W * 0.33;
    const cy = ATLAS_H / 2 + r * Math.sin(a) * ATLAS_H * 0.32;
    const rng = createRng("atlas:" + theme.slug);

    const anon = Math.max(0, 4 - theme.books.length) + rng.int(1, 2);
    const total = theme.books.length + anon;
    const spread = size * (0.05 + Math.min(theme.books.length, 6) * 0.007);
    const start = rng.range(0, Math.PI * 2);

    // Interleave book stars and anonymous stars round the figure.
    const slots = [...theme.books.map((b) => ({ book: b })), ...Array.from({ length: anon }, () => ({ book: undefined as string | undefined }))];
    slots.sort(() => rng.next() - 0.5);

    const stars: SkyStar[] = slots.map((slot, k) => {
      const angle = start + (k / total) * Math.PI * 2 + rng.range(-0.35, 0.35);
      const dist = spread * rng.range(0.45, 1.05);
      const book = slot.book ? bookBySlug.get(slot.book) : undefined;
      return {
        id: `${theme.slug}:${slot.book ?? "anon-" + k}`,
        x: r1(cx + Math.cos(angle) * dist),
        y: r1(cy + Math.sin(angle) * dist * 0.85),
        book: slot.book,
        magnitude: book ? book.brightness : 1,
      };
    });

    return { theme, cx: r1(cx), cy: r1(cy), stars, edges: constellationEdges(stars, hash(theme.slug)) };
  });
}

/**
 * A theme's figure, normalised to fit a box — used for the small glyphs that
 * stand for each constellation around the site. It is the same shape the
 * constellation has on the Atlas.
 */
export function constellationGlyph(c: SkyConstellation, box = 100, pad = 12) {
  const xs = c.stars.map((s) => s.x);
  const ys = c.stars.map((s) => s.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const scale = (box - pad * 2) / Math.max(maxX - minX, maxY - minY, 1);
  const ox = (box - (maxX - minX) * scale) / 2;
  const oy = (box - (maxY - minY) * scale) / 2;
  return {
    stars: c.stars.map((s) => ({ ...s, x: r1(ox + (s.x - minX) * scale), y: r1(oy + (s.y - minY) * scale) })),
    edges: c.edges,
  };
}
