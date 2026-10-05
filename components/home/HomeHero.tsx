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
import { sparkle } from "@/components/bookworld/sky";
import { StarMark } from "@/components/ui/Ornament";

const W = 1600, H = 900;

/* The constellation's stars sit exactly where the landscape's high points will be. */
const STARS: Pt[] = [
  [200, 416], //  0 lighthouse lantern
  [330, 210], //  1
  [560, 132], //  2
  [800, 96], //   3
  [1110, 150], // 4
  [1400, 236], // 5
  [1500, 420], // 6
  [1380, 532], // 7 crown of the oak
  [1000, 352], // 8 clock-tower spire
  [600, 506], //  9 campanile cross
];
const EDGES: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [4, 8], [0, 9]];

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
            <motion.g style={{ opacity: linesOpacity }}>
              {EDGES.map(([a, b], i) => (
                <motion.line
                  key={i}
                  x1={STARS[a][0]} y1={STARS[a][1]} x2={STARS[b][0]} y2={STARS[b][1]}
                  stroke="var(--color-gold)" strokeWidth="1" strokeOpacity="0.7"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, delay: 0.6 + i * 0.32, ease: [0.22, 0.61, 0.36, 1] }}
                />
              ))}
            </motion.g>
            {STARS.map(([x, y], i) => (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6, delay: 0.3 + i * 0.25 }}>
                <circle cx={x} cy={y} r="22" fill="url(#hero-halo)" />
                <path d={sparkle(x, y, i % 3 === 0 ? 11 : 8)} fill="var(--color-gold-soft)" className="twinkle" style={{ ["--d" as string]: `${i * 0.7}s`, ["--t" as string]: "6s", ["--o" as string]: 1 }} />
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
