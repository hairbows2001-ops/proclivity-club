import Link from "next/link";
import { constellationGlyph, type SkyConstellation } from "@/lib/sky";
import { createRng, r1 } from "@/lib/rng";
import type { Book } from "@/lib/types";

const GREEK = ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ"];
const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/**
 * A large drawing of one constellation, set as an old celestial plate:
 * faint graduated rings, orbit lines, unlabelled background stars, and each
 * book star named with its Greek letter.
 */
export function ConstellationChart({ constellation, books }: { constellation: SkyConstellation; books: Book[] }) {
  const g = constellationGlyph(constellation, 600, 120);
  const bySlug = new Map(books.map((b) => [b.slug, b]));
  const rng = createRng("plate:" + constellation.theme.slug);
  const field = Array.from({ length: 70 }, () => {
    const a = rng.range(0, Math.PI * 2), d = Math.sqrt(rng.next()) * 270;
    return { x: r1(300 + Math.cos(a) * d), y: r1(300 + Math.sin(a) * d), r: r1(rng.range(0.4, 1.3)), o: r1(rng.range(0.25, 0.7)) };
  });
  const tilt = r1(rng.range(-24, -8));
  let letter = 0;

  return (
    <svg viewBox="0 0 600 600" className="mx-auto h-auto w-full max-w-xl" role="img" aria-label={`The ${constellation.theme.name} constellation`}>
      <defs>
        <radialGradient id="cc-halo">
          <stop offset="0" stopColor="var(--color-gold-soft)" stopOpacity="0.3" />
          <stop offset="1" stopColor="var(--color-gold-soft)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* rings and graduations */}
      <g fill="none" stroke="var(--color-gold)" opacity="0.45">
        <circle cx="300" cy="300" r="292" strokeWidth="0.7" />
        <circle cx="300" cy="300" r="286" strokeWidth="0.35" />
      </g>
      {Array.from({ length: 120 }, (_, i) => {
        const a = (i / 120) * Math.PI * 2, l = i % 10 === 0 ? 8 : i % 5 === 0 ? 5 : 2.5;
        return <line key={i} x1={r1(300 + Math.cos(a) * 286)} y1={r1(300 + Math.sin(a) * 286)} x2={r1(300 + Math.cos(a) * (286 - l))} y2={r1(300 + Math.sin(a) * (286 - l))} stroke="var(--color-gold)" strokeWidth="0.4" opacity="0.45" />;
      })}
      {NUMERALS.map((n, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return (
          <text key={n} x={r1(300 + Math.cos(a) * 268)} y={r1(300 + Math.sin(a) * 268 + 3.5)} textAnchor="middle" fontSize="9.5" fill="var(--color-gold)" opacity="0.5" fontFamily="var(--font-display)">
            {n}
          </text>
        );
      })}
      <g fill="none" stroke="var(--color-faded)" strokeWidth="0.45" opacity="0.5">
        <circle cx="300" cy="300" r="200" strokeDasharray="1 5" />
        <ellipse cx="300" cy="300" rx="240" ry="70" transform={`rotate(${tilt} 300 300)`} />
        <ellipse cx="300" cy="300" rx="150" ry="236" strokeDasharray="2 6" transform={`rotate(${tilt + 30} 300 300)`} />
        <line x1="300" y1="22" x2="300" y2="40" />
        <line x1="300" y1="560" x2="300" y2="578" />
      </g>
      <text x="300" y="586" textAnchor="middle" fontSize="9" letterSpacing="3" fill="var(--color-faded)" opacity="0.6" fontFamily="var(--font-display)">
        FIG. {constellation.theme.latin?.toUpperCase() ?? constellation.theme.name.toUpperCase()}
      </text>

      {/* unlabelled stars of the surrounding sky */}
      {field.map((f, i) => <circle key={"f" + i} cx={f.x} cy={f.y} r={f.r} fill="var(--color-gold-soft)" opacity={f.o} />)}

      {/* the figure */}
      {g.edges.map(([a, b], i) => (
        <line key={i} x1={g.stars[a].x} y1={g.stars[a].y} x2={g.stars[b].x} y2={g.stars[b].y} stroke="var(--color-gold)" strokeWidth="0.6" opacity="0.7" />
      ))}
      {g.stars.map((s, i) => {
        const book = s.book ? bySlug.get(s.book) : undefined;
        if (!book) return <circle key={s.id} cx={s.x} cy={s.y} r="2" fill="var(--color-gold)" opacity="0.55" className="twinkle" style={{ ["--d" as string]: `${i}s`, ["--o" as string]: 0.55 }} />;
        const r = 5 + s.magnitude * 1.8;
        const below = s.y > 300;
        const greek = GREEK[letter++ % GREEK.length];
        return (
          <Link key={s.id} href={`/books/${book.slug}`}>
            <circle cx={s.x} cy={s.y} r={r1(r * 3)} fill="url(#cc-halo)" />
            <path d={`M${s.x} ${r1(s.y - r)}l${r1(r * 0.2)} ${r1(r * 0.8)} ${r1(r * 0.8)} ${r1(r * 0.2)}-${r1(r * 0.8)} ${r1(r * 0.2)}-${r1(r * 0.2)} ${r1(r * 0.8)}-${r1(r * 0.2)}-${r1(r * 0.8)}-${r1(r * 0.8)}-${r1(r * 0.2)} ${r1(r * 0.8)}-${r1(r * 0.2)}z`} fill="var(--color-gold-soft)" />
            <text x={r1(s.x + r + 3)} y={r1(s.y - r + 1)} fontSize="11" fontStyle="italic" fill="var(--color-faded)" fontFamily="var(--font-display)">
              {greek}
            </text>
            <text x={s.x} y={r1(s.y + (below ? r + 30 : -r - 20))} textAnchor="middle" fontSize="17" fontStyle="italic" fill="var(--color-parchment)" fontFamily="var(--font-display)">
              {book.title}
            </text>
          </Link>
        );
      })}
    </svg>
  );
}
