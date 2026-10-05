"use client";

/**
 * The opening of the homepage. A constellation is drawn around the title;
 * as the visitor scrolls, its lines fade and the same points become the tops
 * of towers, a lighthouse lantern and the crown of an oak — a whole literary
 * landscape inking itself in, layer by layer, in fine gold line.
 */

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { site } from "@/content/site";
import type { Pt } from "@/components/bookworld/geometry";
import { createRng, r1 } from "@/lib/rng";
import { sparkle } from "@/components/bookworld/sky";
import { StarMark } from "@/components/ui/Ornament";

const W = 1600, H = 900;

/* The constellation's main stars sit exactly where the landscape's high points will be. */
const STARS: Pt[] = [
  [200, 424], //   0 lighthouse lantern
  [318, 262], //   1
  [478, 146], //   2
  [742, 98], //    3
  [918, 176], //   4
  [1196, 122], //  5
  [1372, 262], //  6
  [1528, 348], //  7
  [1420, 574], //  8 crown of the oak
  [1066, 366], //  9 clock-tower spire
  [560, 554], //  10 campanile cross
  [704, 604], //  11 temple columns
];

/* "fade" lines thin away into the dark before reaching their star. */
const EDGES: { a: number; b: number; fade?: boolean }[] = [
  { a: 0, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 4 }, { a: 4, b: 5, fade: true },
  { a: 5, b: 6 }, { a: 6, b: 7 }, { a: 7, b: 8, fade: true }, { a: 4, b: 9 }, { a: 0, b: 10, fade: true }, { a: 3, b: 11, fade: true },
];

/* Tiny secondary stars and marginal marks, scattered irregularly. */
const MINOR = (() => {
  const rng = createRng("hero-minor-stars");
  // a few more gathered in the centre, which is all a phone sees
  return Array.from({ length: 100 }, (_, i) => ({
    x: r1(i < 70 ? rng.range(80, 1540) : rng.range(600, 1000)),
    y: r1(rng.range(40, 520)),
    r: r1(rng.range(0.6, 1.6)),
    o: r1(rng.range(0.35, 0.85)),
    spark: rng.chance(0.14),
    d: r1(rng.range(0, 9)),
  })).filter((s) => !(s.x > 380 && s.x < 1220 && s.y > 300 && s.y < 470)); // keep the title clear
})();

function partial(a: Pt, b: Pt, t: number): Pt {
  return [r1(a[0] + (b[0] - a[0]) * t), r1(a[1] + (b[1] - a[1]) * t)];
}

export function HomeHero({ landscape }: { landscape: React.ReactNode[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const titleOpacity = useTransform(p, [0, 0.16], [1, 0]);
  const titleY = useTransform(p, [0, 0.2], [0, -40]);
  const linesOpacity = useTransform(p, [0.08, 0.42], [1, 0.12]);
  const skyY = useTransform(p, [0, 1], [0, -24]);
  const landY = useTransform(p, [0, 1], [26, 0]);
  const layers = [
    useTransform(p, [0.1, 0.38], [0, 1]),
    useTransform(p, [0.2, 0.5], [0, 1]),
    useTransform(p, [0.28, 0.6], [0, 1]),
    useTransform(p, [0.42, 0.72], [0, 1]),
  ];
  const endOpacity = useTransform(p, [0.74, 0.88], [0, 1]);
  const cueOpacity = useTransform(p, [0, 0.06], [1, 0]);

  return (
    <section ref={ref} aria-label="Proclivity Club" className="relative h-[320svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className="etching absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <radialGradient id="hero-halo">
              <stop offset="0" stopColor="var(--color-gold-soft)" stopOpacity="0.45" />
              <stop offset="1" stopColor="var(--color-gold-soft)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hero-glow" cx="0.5" cy="1" r="0.7">
              <stop offset="0" stopColor="#c5a36a" stopOpacity="0.12" />
              <stop offset="1" stopColor="#111a38" stopOpacity="0" />
            </radialGradient>
            {/* lighthouse gradients, referenced by the landmark */}
            <linearGradient id="hero-beamL" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="var(--color-gold-soft)" stopOpacity="0.5" />
              <stop offset="1" stopColor="var(--color-gold-soft)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="hero-beamR" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="var(--color-gold-soft)" stopOpacity="0.5" />
              <stop offset="1" stopColor="var(--color-gold-soft)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <motion.rect x="0" y="500" width={W} height="400" fill="url(#hero-glow)" style={{ opacity: layers[1] }} />
          <motion.g style={{ y: landY }}>
            {landscape.map((layer, i) => (
              <DrawLayer key={i} draw={layers[Math.min(i, layers.length - 1)]}>
                {layer}
              </DrawLayer>
            ))}
          </motion.g>

          <motion.g style={{ y: skyY }}>
            {/* minor stars and marginalia */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 3, delay: 1.5 }}>
              {MINOR.map((m, i) =>
                m.spark ? (
                  <path key={i} d={sparkle(m.x, m.y, 4 + m.r * 2)} fill="var(--color-gold-soft)" className="twinkle" style={{ ["--d" as string]: `${m.d}s`, ["--o" as string]: m.o }} />
                ) : (
                  <circle key={i} cx={m.x} cy={m.y} r={m.r} fill="var(--color-gold-soft)" opacity={m.o} />
                ),
              )}
              {/* a fragment of an orbit, a small ringed planet, a tiny crescent, survey crosses */}
              <path d="M1250 70A380 380 0 0 1 1560 260" fill="none" stroke="var(--color-faded)" strokeWidth="0.6" strokeDasharray="1 6" />
              <circle cx="1408" cy="128" r="3.2" fill="none" stroke="var(--color-gold)" strokeWidth="0.6" />
              <ellipse cx="1408" cy="128" rx="8" ry="2.2" fill="none" stroke="var(--color-gold)" strokeWidth="0.5" transform="rotate(-18 1408 128)" />
              <path d="M262 92a9 9 0 1 0 9 13a7 7 0 1 1 -9 -13z" fill="var(--color-gold-soft)" opacity="0.8" />
              <path d="M640 210h8M644 206v8M1290 420h6M1293 417v6M140 300h6M143 297v6" stroke="var(--color-gold)" strokeWidth="0.6" opacity="0.7" />
              <text x="752" y="88" fontSize="10" fill="var(--color-gold)" opacity="0.6" fontStyle="italic" fontFamily="var(--font-display)">α</text>
              <text x="1206" y="112" fontSize="10" fill="var(--color-gold)" opacity="0.6" fontStyle="italic" fontFamily="var(--font-display)">β</text>
              <text x="328" y="254" fontSize="10" fill="var(--color-gold)" opacity="0.6" fontStyle="italic" fontFamily="var(--font-display)">γ</text>
            </motion.g>

            <motion.g style={{ opacity: linesOpacity }}>
              {EDGES.map(({ a, b, fade }, i) => {
                const end = fade ? partial(STARS[a], STARS[b], 0.58) : STARS[b];
                const tail = fade ? partial(STARS[a], STARS[b], 0.8) : null;
                return (
                  <g key={i}>
                    <motion.line
                      x1={STARS[a][0]} y1={STARS[a][1]} x2={end[0]} y2={end[1]}
                      stroke="var(--color-gold)" strokeWidth="0.8" strokeOpacity={fade ? 0.45 : 0.6}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 2.2, delay: 0.6 + i * 0.34, ease: [0.22, 0.61, 0.36, 1] }}
                    />
                    {tail && <line x1={end[0]} y1={end[1]} x2={tail[0]} y2={tail[1]} stroke="var(--color-gold)" strokeWidth="0.6" strokeOpacity="0.3" strokeDasharray="1 5" />}
                  </g>
                );
              })}
            </motion.g>
            {STARS.map(([x, y], i) => (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6, delay: 0.3 + i * 0.22 }}>
                <circle cx={x} cy={y} r={i % 4 === 0 ? 24 : 16} fill="url(#hero-halo)" />
                <path d={sparkle(x, y, i % 4 === 0 ? 11 : i % 3 === 0 ? 8 : 6)} fill="var(--color-gold-soft)" className="twinkle" style={{ ["--d" as string]: `${i * 0.7}s`, ["--t" as string]: "6s", ["--o" as string]: 1 }} />
              </motion.g>
            ))}
          </motion.g>
        </svg>

        {/* Title */}
        <motion.div style={{ opacity: titleOpacity, y: titleY }} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, letterSpacing: "0.32em" }}
            animate={{ opacity: 1, letterSpacing: "0.2em" }}
            transition={{ duration: 2.4, ease: [0.22, 0.61, 0.36, 1] }}
            className="display pl-[0.2em] text-[clamp(2.4rem,8.5vw,7rem)] text-gold-soft uppercase"
          >
            {site.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 1.2 }} className="mt-5 text-[clamp(1.1rem,2.4vw,1.5rem)] text-parchment/85 italic">
            {site.tagline}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 2.4 }} className="mt-12">
            <Link href="/atlas" className="label group inline-flex items-center gap-4 border-y border-[var(--rule-strong)] px-2 py-3 text-gold transition-colors duration-700 hover:text-gold-soft">
              <StarMark className="h-2.5 w-2.5 transition-transform duration-700 group-hover:rotate-45" />
              Enter the Atlas
              <StarMark className="h-2.5 w-2.5 transition-transform duration-700 group-hover:-rotate-45" />
            </Link>
          </motion.div>
        </motion.div>

        {/* After the landscape has drawn itself */}
        <motion.div style={{ opacity: endOpacity }} className="pointer-events-none absolute inset-x-0 top-[18%] px-6 text-center">
          <p className="display text-[clamp(2rem,5vw,3.75rem)] text-parchment italic">{site.motto}</p>
          <div className="pointer-events-auto mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
            <Link href="/atlas" className="label text-gold hover:text-gold-soft">Enter the Atlas</Link>
            <Link href="/library" className="label text-mist hover:text-gold-soft">Browse the Library</Link>
          </div>
        </motion.div>

        <motion.div style={{ opacity: cueOpacity }} className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 text-mist" aria-hidden>
          <span className="label text-[0.65rem]">Scroll</span>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

function DrawLayer({ draw, children }: { draw: MotionValue<number>; children: React.ReactNode }) {
  return (
    <motion.g className="draw-by-scroll" style={{ ["--draw" as string]: draw }}>
      {children}
    </motion.g>
  );
}
