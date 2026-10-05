import Link from "next/link";
import { constellationGlyph, type SkyConstellation } from "@/lib/sky";
import { r1 } from "@/lib/rng";
import type { Book } from "@/lib/types";

/** A large drawing of one constellation, with each book star named. */
export function ConstellationChart({ constellation, books }: { constellation: SkyConstellation; books: Book[] }) {
  const g = constellationGlyph(constellation, 600, 90);
  const bySlug = new Map(books.map((b) => [b.slug, b]));
  return (
    <svg viewBox="0 0 600 600" className="mx-auto h-auto w-full max-w-xl" role="img" aria-label={`The ${constellation.theme.name} constellation`}>
      <defs>
        <radialGradient id="cc-halo">
          <stop offset="0" stopColor="var(--color-gold-soft)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--color-gold-soft)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="292" fill="none" stroke="var(--color-gold)" strokeWidth="0.8" opacity="0.7" />
      <circle cx="300" cy="300" r="284" fill="none" stroke="var(--color-gold)" strokeWidth="0.4" opacity="0.5" />
      {Array.from({ length: 72 }, (_, i) => {
        const a = (i / 72) * Math.PI * 2, l = i % 6 === 0 ? 10 : 5;
        return <line key={i} x1={r1(300 + Math.cos(a) * 284)} y1={r1(300 + Math.sin(a) * 284)} x2={r1(300 + Math.cos(a) * (284 - l))} y2={r1(300 + Math.sin(a) * (284 - l))} stroke="var(--color-gold)" strokeWidth="0.5" opacity="0.6" />;
      })}
      <circle cx="300" cy="300" r="190" fill="none" stroke="var(--color-faded)" strokeWidth="0.5" strokeDasharray="1 5" opacity="0.6" />
      {g.edges.map(([a, b], i) => (
        <line key={i} x1={g.stars[a].x} y1={g.stars[a].y} x2={g.stars[b].x} y2={g.stars[b].y} stroke="var(--color-gold)" strokeWidth="1" opacity="0.8" />
      ))}
      {g.stars.map((s, i) => {
        const book = s.book ? bySlug.get(s.book) : undefined;
        if (!book) return <circle key={s.id} cx={s.x} cy={s.y} r="2.4" fill="var(--color-gold)" opacity="0.6" className="twinkle" style={{ ["--d" as string]: `${i}s` }} />;
        const r = 6 + s.magnitude * 2;
        return (
          <Link key={s.id} href={`/books/${book.slug}`}>
            <circle cx={s.x} cy={s.y} r={r * 3} fill="url(#cc-halo)" />
            <path d={`M${s.x} ${r1(s.y - r)}l${r1(r * 0.2)} ${r1(r * 0.8)} ${r1(r * 0.8)} ${r1(r * 0.2)}-${r1(r * 0.8)} ${r1(r * 0.2)}-${r1(r * 0.2)} ${r1(r * 0.8)}-${r1(r * 0.2)}-${r1(r * 0.8)}-${r1(r * 0.8)}-${r1(r * 0.2)} ${r1(r * 0.8)}-${r1(r * 0.2)}z`} fill="var(--color-gold-soft)" />
            <text x={s.x} y={s.y + (s.y > 300 ? r + 26 : -r - 14)} textAnchor="middle" fontSize="20" fontStyle="italic" fill="var(--color-parchment)" fontFamily="var(--font-display)">
              {book.title}
            </text>
          </Link>
        );
      })}
    </svg>
  );
}
