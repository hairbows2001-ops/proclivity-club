import { constellationGlyph, type SkyConstellation } from "@/lib/sky";

/** The small figure that stands for a constellation — the same shape it has on the Atlas. */
export function ConstellationGlyph({ constellation, className = "h-16 w-16" }: { constellation: SkyConstellation; className?: string }) {
  const g = constellationGlyph(constellation, 100, 14);
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="50" r="48" fill="none" stroke="var(--rule)" strokeWidth="0.5" />
      {g.edges.map(([a, b], i) => (
        <line key={i} x1={g.stars[a].x} y1={g.stars[a].y} x2={g.stars[b].x} y2={g.stars[b].y} stroke="var(--color-gold)" strokeWidth="0.6" opacity="0.7" />
      ))}
      {g.stars.map((s) => (
        <circle key={s.id} cx={s.x} cy={s.y} r={s.book ? 1.6 + s.magnitude * 0.6 : 1.1} fill={s.book ? "var(--color-gold-soft)" : "var(--color-gold)"} opacity={s.book ? 1 : 0.6} />
      ))}
    </svg>
  );
}
