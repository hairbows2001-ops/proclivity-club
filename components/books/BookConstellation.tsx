import Link from "next/link";
import { r1 } from "@/lib/rng";
import type { Book, Theme } from "@/lib/types";

/**
 * THE CONSTELLATION section of a book page: the book at the centre, its
 * themes around it, and beyond them the other books that share each theme.
 * Generated entirely from theme tags.
 */
export function BookConstellation({ book, groups }: { book: Book; groups: { theme: Theme; companions: Book[] }[] }) {
  const W = 900, H = 560, cx = W / 2, cy = H / 2;
  const n = groups.length;
  const themeNodes = groups.map((g, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { ...g, a, x: r1(cx + Math.cos(a) * 210), y: r1(cy + Math.sin(a) * 150) };
  });

  // Each companion book is placed once on the outer ring, at the mean angle of the themes it shares.
  const companions = new Map<string, { book: Book; angles: number[]; themes: number[] }>();
  themeNodes.forEach((t, ti) =>
    t.companions.forEach((c) => {
      const e = companions.get(c.slug) ?? { book: c, angles: [], themes: [] };
      e.angles.push(t.a);
      e.themes.push(ti);
      companions.set(c.slug, e);
    }),
  );
  const outer = [...companions.values()]
    .map((c) => {
      const x = c.angles.reduce((s, a) => s + Math.cos(a), 0), y = c.angles.reduce((s, a) => s + Math.sin(a), 0);
      return { ...c, a: Math.atan2(y, x) };
    })
    .sort((p, q) => p.a - q.a);
  // spread them evenly so labels never collide
  const placed = outer.map((c, i) => {
    const a = outer.length > 1 ? c.a * 0.4 + ((i / outer.length) * Math.PI * 2 - Math.PI / 2 + 0.4) * 0.6 : c.a;
    return { ...c, x: r1(cx + Math.cos(a) * 385), y: r1(cy + Math.sin(a) * 235) };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden>
      <defs>
        <radialGradient id="bc-halo">
          <stop offset="0" stopColor="var(--color-gold-soft)" stopOpacity="0.4" />
          <stop offset="1" stopColor="var(--color-gold-soft)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx="210" ry="150" fill="none" stroke="var(--rule)" strokeWidth="0.6" strokeDasharray="1 5" />
      <ellipse cx={cx} cy={cy} rx="385" ry="235" fill="none" stroke="var(--rule)" strokeWidth="0.5" />
      {themeNodes.map((t) => (
        <line key={"c" + t.theme.slug} x1={cx} y1={cy} x2={t.x} y2={t.y} stroke="var(--color-gold)" strokeWidth="0.8" opacity="0.8" />
      ))}
      {placed.map((c) =>
        c.themes.map((ti) => (
          <line key={c.book.slug + ti} x1={themeNodes[ti].x} y1={themeNodes[ti].y} x2={c.x} y2={c.y} stroke="var(--color-faded)" strokeWidth="0.6" opacity="0.7" />
        )),
      )}
      {/* the book itself */}
      <circle cx={cx} cy={cy} r="46" fill="url(#bc-halo)" />
      <path d={`M${cx} ${cy - 14}l2.8 11.2 11.2 2.8-11.2 2.8-2.8 11.2-2.8-11.2-11.2-2.8 11.2-2.8z`} fill="var(--color-gold-soft)" />
      <circle cx={cx} cy={cy} r="20" fill="none" stroke="var(--color-gold)" strokeWidth="0.6" />

      {themeNodes.map((t) => (
        <Link key={t.theme.slug} href={`/constellations/${t.theme.slug}`} tabIndex={-1}>
          <circle cx={t.x} cy={t.y} r="5" fill="var(--color-midnight)" stroke="var(--color-gold)" strokeWidth="1" />
          <circle cx={t.x} cy={t.y} r="1.8" fill="var(--color-gold-soft)" />
          <text x={t.x} y={t.y + (t.y > cy ? 26 : -14)} textAnchor="middle" fontSize="15" letterSpacing="3.5" fill="var(--color-gold-soft)" fontFamily="var(--font-display)">
            {t.theme.name.toUpperCase()}
          </text>
        </Link>
      ))}
      {placed.map((c) => (
        <Link key={c.book.slug} href={`/books/${c.book.slug}`} tabIndex={-1}>
          <circle cx={c.x} cy={c.y} r="3.4" fill="var(--color-gold-soft)" />
          <text x={c.x} y={c.y + (c.y > cy ? 24 : -12)} textAnchor="middle" fontSize="17" fontStyle="italic" fill="var(--color-parchment)" fontFamily="var(--font-display)">
            {c.book.title}
          </text>
        </Link>
      ))}
    </svg>
  );
}
