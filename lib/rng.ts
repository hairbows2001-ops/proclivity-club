/** Small deterministic helpers so that every illustration is identical on every visit. */

/** Turn any string into a stable 32-bit number. */
export function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface Rng {
  /** 0 ≤ n < 1 */
  next(): number;
  /** min ≤ n < max */
  range(min: number, max: number): number;
  int(min: number, max: number): number;
  pick<T>(items: readonly T[]): T;
  chance(p: number): boolean;
}

/** Mulberry32 — a tiny, fast seeded random generator. */
export function createRng(seed: number | string): Rng {
  let a = typeof seed === "string" ? hash(seed) : seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    range: (min, max) => min + next() * (max - min),
    int: (min, max) => Math.floor(min + next() * (max - min + 1)),
    pick: (items) => items[Math.floor(next() * items.length)],
    chance: (p) => next() < p,
  };
}

/** Round to one decimal place — keeps SVG markup small. */
export const r1 = (n: number) => Math.round(n * 10) / 10;
