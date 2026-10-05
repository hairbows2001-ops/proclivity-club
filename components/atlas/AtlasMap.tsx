"use client";

/**
 * THE ATLAS
 * ─────────
 * A planisphere of reading. Each constellation is a theme; each star a book.
 * A book in several constellations appears as several stars, joined by a
 * faint thread when you hover it. Everything is laid out automatically by
 * lib/sky.ts from the themes in content/books.ts.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { SkyConstellation, SkyStar } from "@/lib/sky";
import { ATLAS_W as W, ATLAS_H as H } from "@/lib/sky";
import { createRng, r1 } from "@/lib/rng";
import { CelestialMark, sparkle } from "@/components/bookworld/sky";

export interface AtlasBook {
  title: string;
  author: string;
  year: number;
}

const CX = W / 2, CY = H / 2, RX = 760, RY = 470;

function starPath(x: number, y: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.42 : r;
    pts.push(`${r1(x + Math.cos(a) * rr)} ${r1(y + Math.sin(a) * rr)}`);
  }
  return "M" + pts.join("L") + "Z";
}

export function AtlasMap({ constellations, books }: { constellations: SkyConstellation[]; books: Record<string, AtlasBook> }) {
  const router = useRouter();
  const [hover, setHover] = useState<{ book: string; star: SkyStar } | null>(null);
  const [theme, setTheme] = useState<string | null>(null);
  const lastPointer = useRef<string>("mouse");
  const scroller = useRef<HTMLDivElement>(null);

  // On narrow screens the chart pans sideways; start at its centre.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);

  const starsByBook = useMemo(() => {
    const map: Record<string, SkyStar[]> = {};
    constellations.forEach((c) => c.stars.forEach((s) => s.book && (map[s.book] ??= []).push(s)));
    return map;
  }, [constellations]);

  const open = (slug: string, star: SkyStar) => (e: React.MouseEvent) => {
    e.preventDefault();
    // On touch screens the first tap reveals the name; the second enters the book.
    if (lastPointer.current === "touch" && hover?.star.id !== star.id) {
      setHover({ book: slug, star });
      return;
    }
    router.push(`/books/${slug}`);
  };

  const active = hover?.book;
  const thread = active ? starsByBook[active] : [];

  return (
    <div className="relative">
      <div ref={scroller} className="overflow-x-auto overscroll-x-contain [scrollbar-width:none]" onPointerDown={(e) => (lastPointer.current = e.pointerType)}>
        <div className="relative mx-auto min-w-[880px] max-w-[1500px]">
          <svg viewBox={`0 0 ${W} ${H}`} className="etching" role="group" aria-label="Star chart of constellations and books">
            <ChartFurniture />

            {/* constellation figures */}
            {constellations.map((c, ci) => {
              const dim = (theme && theme !== c.theme.slug) || (active && !c.stars.some((s) => s.book === active));
              const bottom = Math.max(...c.stars.map((s) => s.y));
              return (
                <g key={c.theme.slug} style={{ opacity: dim ? 0.32 : 1, transition: "opacity 0.8s" }}>
                  {c.edges.map(([a, b], i) => (
                    <motion.line
                      key={i}
                      x1={c.stars[a].x} y1={c.stars[a].y} x2={c.stars[b].x} y2={c.stars[b].y}
                      stroke="var(--color-gold)" strokeWidth="0.9" strokeOpacity="0.75"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 1.6, delay: 0.4 + ci * 0.18 + i * 0.12, ease: [0.22, 0.61, 0.36, 1] }}
                    />
                  ))}
                  <Link
                    href={`/constellations/${c.theme.slug}`}
                    onMouseEnter={() => setTheme(c.theme.slug)}
                    onMouseLeave={() => setTheme(null)}
                    onFocus={() => setTheme(c.theme.slug)}
                    onBlur={() => setTheme(null)}
                    aria-label={`${c.theme.name} constellation`}
                  >
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4, delay: 1 + ci * 0.15 }}>
                      <rect x={c.cx - 70} y={bottom + 12} width="140" height="44" fill="transparent" />
                      <text x={c.cx} y={bottom + 32} textAnchor="middle" fontSize="17" letterSpacing="4" fill="var(--color-gold-soft)">
                        {c.theme.name.toUpperCase()}
                      </text>
                      {c.theme.latin && (
                        <text x={c.cx} y={bottom + 50} textAnchor="middle" fontSize="14" fontStyle="italic" fill="var(--color-faded)">
                          {c.theme.latin}
                        </text>
                      )}
                    </motion.g>
                  </Link>
                </g>
              );
            })}

            {/* a thread joining every appearance of the hovered book */}
            {thread.length > 1 &&
              thread.slice(1).map((s, i) => (
                <motion.line key={s.id} x1={thread[i].x} y1={thread[i].y} x2={s.x} y2={s.y} stroke="var(--color-gold-soft)" strokeWidth="0.7" strokeDasharray="2 5"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.8 }} transition={{ duration: 0.9 }} />
              ))}

            {/* stars */}
            {constellations.flatMap((c) =>
              c.stars.map((s, i) => {
                if (!s.book) {
                  return <circle key={s.id} cx={s.x} cy={s.y} r="1.8" fill="var(--color-gold)" opacity="0.55" className="twinkle" style={{ ["--d" as string]: `${i * 1.3}s`, ["--o" as string]: 0.55 }} />;
                }
                const b = books[s.book];
                const on = active === s.book;
                const r = 5 + s.magnitude * 2.2;
                return (
                  <a
                    key={s.id}
                    href={`/books/${s.book}`}
                    onClick={open(s.book, s)}
                    onMouseEnter={() => setHover({ book: s.book!, star: s })}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover({ book: s.book!, star: s })}
                    onBlur={() => setHover(null)}
                    aria-label={`${b.title}, ${b.author}, ${b.year} — in ${c.theme.name}`}
                    className="cursor-pointer outline-none"
                  >
                    <circle cx={s.x} cy={s.y} r="22" fill="transparent" />
                    <circle cx={s.x} cy={s.y} r={r1(r * 2.6)} fill="url(#atlas-halo)" opacity={on ? 1 : 0.45} style={{ transition: "opacity 0.6s" }} />
                    <path d={starPath(s.x, s.y, r)} fill="var(--color-gold-soft)" className="twinkle" style={{ ["--d" as string]: `${(i * 2.1) % 7}s`, ["--t" as string]: "7s", ["--o" as string]: 1 }} />
                    {on && <circle cx={s.x} cy={s.y} r={r1(r + 8)} fill="none" stroke="var(--color-gold-soft)" strokeWidth="0.8" />}
                  </a>
                );
              }),
            )}
          </svg>

          {hover && (
            <div
              className="pointer-events-none absolute z-10 w-max max-w-[16rem] -translate-x-1/2 -translate-y-[calc(100%+22px)] border border-[var(--rule-strong)] bg-midnight/95 px-5 py-3 text-center"
              style={{ left: `${(hover.star.x / W) * 100}%`, top: `${(hover.star.y / H) * 100}%` }}
              role="status"
            >
              <p className="display text-2xl leading-tight text-gold-soft">{books[hover.book].title}</p>
              <p className="mt-1 text-sm text-mist italic">
                {books[hover.book].author}, {books[hover.book].year}
              </p>
              {lastPointer.current === "touch" && <p className="label mt-2 text-[0.65rem] text-gold">Tap again to enter</p>}
            </div>
          )}
        </div>
      </div>
      <p className="label mt-4 text-center text-[0.7rem] text-mist md:hidden">Drag sideways to explore the chart</p>
    </div>
  );
}

/* ── The engraved furniture of an old star chart ───────────────────────── */

function ChartFurniture() {
  const rng = createRng("planisphere");
  const ticks: string[] = [];
  for (let i = 0; i < 360; i += 2) {
    const a = (i * Math.PI) / 180;
    const len = i % 30 === 0 ? 1 : i % 10 === 0 ? 0.55 : 0.3;
    const x0 = CX + Math.cos(a) * (RX - 24), y0 = CY + Math.sin(a) * (RY - 24);
    const x1 = CX + Math.cos(a) * (RX - 24 + 18 * len), y1 = CY + Math.sin(a) * (RY - 24 + 18 * len);
    ticks.push(`M${r1(x0)} ${r1(y0)}L${r1(x1)} ${r1(y1)}`);
  }
  const numerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
  const milky = Array.from({ length: 900 }, () => {
    const t = rng.next();
    const x = CX - RX + t * RX * 2;
    const y = CY + Math.sin(t * Math.PI * 2.2 + 0.6) * 120 - (t - 0.5) * 80;
    const off = (rng.next() + rng.next() + rng.next() - 1.5) * 46;
    return { x, y: y + off, r: rng.range(0.3, 1.2) };
  }).filter((d) => ((d.x - CX) / (RX - 30)) ** 2 + ((d.y - CY) / (RY - 30)) ** 2 < 1);
  const background = Array.from({ length: 260 }, () => {
    const a = rng.range(0, Math.PI * 2), d = Math.sqrt(rng.next()) * 0.95;
    return { x: CX + Math.cos(a) * RX * d, y: CY + Math.sin(a) * RY * d, r: rng.range(0.4, 1.3) };
  });
  const eclipticPath = Array.from({ length: 61 }, (_, i) => {
    const t = i / 60;
    const x = CX - RX + 30 + t * (RX * 2 - 60);
    const y = CY + Math.sin(t * Math.PI * 2.2 + 0.6) * 120 - (t - 0.5) * 80;
    return `${i ? "L" : "M"}${r1(x)} ${r1(y)}`;
  }).join("");

  return (
    <g aria-hidden>
      <defs>
        <radialGradient id="atlas-halo">
          <stop offset="0" stopColor="var(--color-gold-soft)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--color-gold-soft)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="atlas-sky" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#1a2850" />
          <stop offset="1" stopColor="#0d1430" />
        </radialGradient>
        <filter id="atlas-blur"><feGaussianBlur stdDeviation="14" /></filter>
      </defs>

      {/* the sky inside the oval */}
      <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="url(#atlas-sky)" />

      {/* grid of meridians and parallels */}
      <g fill="none" stroke="var(--color-faded)" strokeWidth="0.5" opacity="0.4">
        {[0.25, 0.5, 0.75].map((k) => <ellipse key={"m" + k} cx={CX} cy={CY} rx={(RX - 24) * k} ry={RY - 24} />)}
        {[0.33, 0.66].map((k) => <ellipse key={"p" + k} cx={CX} cy={CY} rx={(RX - 24) * k} ry={(RY - 24) * k} />)}
        <line x1={CX} y1={CY - RY + 24} x2={CX} y2={CY + RY - 24} />
        <line x1={CX - RX + 24} y1={CY} x2={CX + RX - 24} y2={CY} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6 + Math.PI / 12;
          return <line key={i} x1={CX} y1={CY} x2={r1(CX + Math.cos(a) * (RX - 24))} y2={r1(CY + Math.sin(a) * (RY - 24))} strokeDasharray="2 6" />;
        })}
        <circle cx={CX} cy={CY} r="46" />
      </g>

      {/* the milky way */}
      <path d={eclipticPath} stroke="#a9b3c9" strokeWidth="56" opacity="0.06" fill="none" filter="url(#atlas-blur)" />
      {milky.map((d, i) => <circle key={"mw" + i} cx={r1(d.x)} cy={r1(d.y)} r={r1(d.r)} fill="#d9dbe6" opacity="0.4" />)}
      {background.map((d, i) => <circle key={"bg" + i} cx={r1(d.x)} cy={r1(d.y)} r={r1(d.r)} fill="var(--color-gold-soft)" opacity="0.35" />)}

      {/* the ecliptic */}
      <path d={eclipticPath} stroke="var(--color-gold)" strokeWidth="0.6" fill="none" strokeDasharray="1 4" opacity="0.8" />
      <text x={CX + 420} y={CY - 48} fontSize="15" letterSpacing="5" fill="var(--color-gold)" transform={`rotate(-9 ${CX + 420} ${CY - 48})`}>
        ECLIPTIC
      </text>

      {/* rings, graduations and hours */}
      <g fill="none" stroke="var(--color-gold)">
        <ellipse cx={CX} cy={CY} rx={RX} ry={RY} strokeWidth="1.4" />
        <ellipse cx={CX} cy={CY} rx={RX - 6} ry={RY - 6} strokeWidth="0.5" />
        <ellipse cx={CX} cy={CY} rx={RX - 24} ry={RY - 24} strokeWidth="0.8" />
        <path d={ticks.join("")} strokeWidth="0.5" />
      </g>
      {numerals.map((n, i) => {
        if (i % 6 === 0) return null; // XII and VI sit under the cartouche and compass
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return (
          <text key={n} x={r1(CX + Math.cos(a) * (RX + 26))} y={r1(CY + Math.sin(a) * (RY + 24) + 6)} textAnchor="middle" fontSize="18" fill="var(--color-gold)">
            {n}
          </text>
        );
      })}
      {[["NORTH", CX, CY - RY + 50], ["SOUTH", CX, CY + RY - 38], ["EAST", CX - RX + 64, CY + 6], ["WEST", CX + RX - 64, CY + 6]].map(([t, x, y]) => (
        <text key={t as string} x={x as number} y={y as number} textAnchor="middle" fontSize="13" letterSpacing="4" fill="var(--color-gold)" opacity="0.85">
          {t}
        </text>
      ))}

      {/* corner furniture: the title cartouche, the scale of magnitudes, instruments */}
      <g>
        <path d={`M${CX - 220} 6H${CX + 220}l18 28-18 28H${CX - 220}l-18-28z`} fill="var(--color-midnight)" stroke="var(--color-gold)" strokeWidth="1" />
        <path d={`M${CX - 212} 12H${CX + 212}l14 22-14 22H${CX - 212}l-14-22z`} fill="none" stroke="var(--color-gold)" strokeWidth="0.4" />
        <text x={CX} y="34" textAnchor="middle" fontSize="22" letterSpacing="7" fill="var(--color-gold-soft)">PLANISPHERE OF READING</text>
        <text x={CX} y="52" textAnchor="middle" fontSize="12.5" letterSpacing="3" fill="var(--color-gold)" fontStyle="italic">a general chart of books, for every latitude</text>
      </g>
      <g transform="translate(1440 70)">
        <text textAnchor="middle" fontSize="12" letterSpacing="3" fill="var(--color-gold)">SCALE OF MAGNITUDES</text>
        {[3, 2, 1].map((m, i) => (
          <g key={m}>
            <path d={starPath(-50 + i * 50, 26, 5 + m * 2.2)} fill="var(--color-gold-soft)" />
            <text x={-50 + i * 50} y="56" textAnchor="middle" fontSize="12" fontStyle="italic" fill="var(--color-faded)">
              {["brilliant", "bright", "faint"][i]}
            </text>
          </g>
        ))}
      </g>
      <g transform="translate(160 64)">
        <text textAnchor="middle" fontSize="12" letterSpacing="3" fill="var(--color-gold)">PROCLIVITY CLUB</text>
        <text y="22" textAnchor="middle" fontSize="13" fontStyle="italic" fill="var(--color-faded)">drawn one book at a time</text>
      </g>
      <CelestialMark kind="armillary" x={80} y={880} s={1.3} />
      <CelestialMark kind="orbit" x={1520} y={890} s={1.1} />
      <g transform={`translate(${CX} ${H - 30})`}>
        <circle r="34" fill="var(--color-midnight)" stroke="var(--color-gold)" strokeWidth="0.8" />
        <path d={sparkle(0, 0, 28)} fill="var(--color-gold)" opacity="0.85" />
        <path d={sparkle(0, 0, 18)} fill="var(--color-midnight)" transform="rotate(45)" />
        <path d={sparkle(0, 0, 16)} fill="var(--color-gold-soft)" transform="rotate(45)" opacity="0.7" />
      </g>
    </g>
  );
}
