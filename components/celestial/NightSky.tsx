import { createRng, r1 } from "@/lib/rng";

/**
 * The faint fixed sky behind every page: scattered stars, a few flickering,
 * and a rare shooting star. Generated once, identical on every visit.
 */
export function NightSky() {
  const rng = createRng("night-sky");
  const stars = Array.from({ length: 140 }, () => ({
    x: rng.range(0, 1600),
    y: rng.range(0, 1000),
    r: rng.range(0.4, 1.3),
    o: rng.range(0.15, 0.55),
    tw: rng.chance(0.3),
    d: rng.range(0, 10),
    t: rng.range(4, 10),
  }));
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <svg className="h-full w-full" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="night-glow" cx="0.5" cy="1.1" r="0.9">
            <stop offset="0" stopColor="#1d2c55" stopOpacity="0.55" />
            <stop offset="1" stopColor="#111a38" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1600" height="1000" fill="url(#night-glow)" />
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={r1(s.x)}
            cy={r1(s.y)}
            r={r1(s.r)}
            fill="#e1c58c"
            className={s.tw ? "twinkle" : undefined}
            style={{ opacity: s.o, ["--o" as string]: s.o, ["--d" as string]: `${r1(s.d)}s`, ["--t" as string]: `${r1(s.t)}s` }}
          />
        ))}
        <g className="shooting-star" style={{ ["--t" as string]: "31s", ["--d" as string]: "9s" }}>
          <line x1="1250" y1="120" x2="1340" y2="75" stroke="#e1c58c" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}
