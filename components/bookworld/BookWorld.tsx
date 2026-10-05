/**
 * BOOKWORLD
 * ─────────
 * A procedural engraving. Give it a book's `world` settings and it composes
 * sky, land, water, buildings, a landmark and small details into a single
 * SVG plate in fine antique-gold line. Everything is generated from the
 * book's slug, so each world is unique and always drawn the same way.
 *
 *   <BookWorld book={book} />                       full plate with border
 *   <BookWorld book={book} variant="vignette" />    round medallion for cards
 *   <BookWorld book={book} animate />               lines ink themselves in
 */

import { Fragment } from "react";
import { createRng, hash, r1, type Rng } from "@/lib/rng";
import type { Book, BookWorldConfig } from "@/lib/types";
import { Ink, Layer } from "./Ink";
import { Building } from "./architecture";
import { LandmarkShape } from "./landmarks";
import { Aeroplane, Birds, Boat, Figure, Tree } from "./nature";
import { CelestialMark, Luminary, SkyConstellation, Stars, sparkle } from "./sky";
import { H, HZ, W, Water, buildScene } from "./terrain";
import { circle, seg, smooth, type Pt } from "./geometry";
import { SCENES } from "./scenes";

const DENSITY = { sparse: 0.6, medium: 1, "medium-high": 1.3, dense: 1.6 } as const;

type Variant = "plate" | "vignette" | "banner";

export interface BookWorldProps {
  book: Pick<Book, "slug" | "title" | "world" | "themes">;
  variant?: Variant;
  animate?: boolean;
  className?: string;
  /** Adds an accessible description. Decorative copies (cards) leave it out. */
  label?: string;
}

const VIEWBOX: Record<Variant, string> = {
  plate: `0 0 ${W} ${H}`,
  banner: `0 120 ${W} ${H - 120}`,
  vignette: "", // set per book, around its focal point
};

export function BookWorld({ book, variant = "plate", animate = false, className = "", label }: BookWorldProps) {
  const cfg: Required<Omit<BookWorldConfig, "seed" | "landmarkSide" | "art">> & BookWorldConfig = {
    landmark: "none",
    architecture: "none",
    sky: "crescent",
    atmosphere: "clear",
    water: book.world.landscape === "coast" ? "sea" : book.world.landscape === "lake" ? "lake" : "none",
    trees: "round",
    details: [],
    symbol: "none",
    ...book.world,
  };
  const seedBase = `${book.slug}:${cfg.seed ?? 0}`;
  const rng = createRng(seedBase);
  const side = cfg.landmarkSide ?? (hash(seedBase) % 2 ? "left" : "right");
  const uid = `bw-${book.slug}-${variant}`.replace(/[^a-z0-9-]/gi, "");
  const scene = buildScene(cfg, createRng(seedBase + ":land"), side, uid);
  const has = (d: string) => cfg.details.includes(d as never);

  const moon = { x: side === "left" ? 770 : 430, y: 196, r: 26 };
  const glints = [
    ...(cfg.sky === "starfield" ? [] : [{ x: moon.x, w: 60 }]),
    ...(cfg.landmark === "lighthouse" ? [{ x: scene.mark.x, w: 26 }] : []),
  ];
  const d = (t: number) => (animate ? t : 0);
  const vignette = variant === "vignette";
  const density = DENSITY[cfg.art?.density ?? "medium"];
  const sceneFn = cfg.art?.scene ? SCENES[cfg.art.scene] : undefined;
  const composed = sceneFn?.({
    rng: createRng(seedBase + ":scene"),
    uid,
    vignette,
    density,
    label: book.themes[hash(book.slug) % book.themes.length],
  });
  const med = composed?.medallion ?? { cx: 600, cy: 430 };
  const viewBox = vignette ? `${med.cx - 350} ${med.cy - 350} 700 700` : VIEWBOX[variant];

  const pathEdges = scene.path && has("path") ? roadEdges(scene.path) : null;

  return (
    <svg
      viewBox={viewBox}
      className={`etching ${animate ? "ink-in" : ""} ${className}`}
      style={vignette ? ({ ["--hair" as string]: 1.5 }) : undefined}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1430" />
          <stop offset="0.45" stopColor="#131d3e" />
          <stop offset={HZ / H} stopColor="#1a294d" />
          <stop offset="0.8" stopColor="#131d3e" />
          <stop offset="1" stopColor="#0f1735" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`}>
          <stop offset="0" stopColor="#c5a36a" stopOpacity="0.16" />
          <stop offset="0.6" stopColor="#7f8f5a" stopOpacity="0.05" />
          <stop offset="1" stopColor="#111a38" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-halo`}>
          <stop offset="0" stopColor="var(--color-gold-soft)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--color-gold-soft)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-beamL`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="var(--color-gold-soft)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--color-gold-soft)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-beamR`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-gold-soft)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--color-gold-soft)" stopOpacity="0" />
        </linearGradient>
        <filter id={`${uid}-blur`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <clipPath id={`${uid}-clip`}>
          {vignette ? <circle cx={med.cx} cy={med.cy} r="330" /> : <rect x="0" y="0" width={W} height={H} />}
        </clipPath>
      </defs>

      <g clipPath={`url(#${uid}-clip)`}>
        <rect x="0" y="0" width={W} height={H} fill={`url(#${uid}-sky)`} />

        {composed ? (
          composed.layers.map((layer, i) => (
            <Fragment key={i}>
              <Layer delay={d(layer.delay)} className={layer.depth ? `depth-${layer.depth}` : undefined}>
                {layer.node}
              </Layer>
              {/* after the sky: a faint engraved band of air above the horizon */}
              {i === 0 && composed.horizon && (
                <Layer delay={d(0.3)}>
                  <AirBand rng={createRng(seedBase + ":air")} horizon={composed.horizon} density={density} />
                </Layer>
              )}
            </Fragment>
          ))
        ) : (
          <>
        {/* ── Sky ── */}
        <Layer delay={d(0)}>
          <Stars rng={rng} count={Math.round((vignette ? 90 : 170) * density)} x0={0} x1={W} y0={20} y1={HZ - 30} />
          <Luminary kind={cfg.sky} x={moon.x} y={moon.y} r={moon.r} uid={uid} rng={rng} />
          <SkyConstellation
            rng={rng}
            x={side === "left" ? 470 : 560}
            y={92}
            w={170}
            h={80}
            label={vignette ? undefined : book.themes[hash(book.slug) % book.themes.length]}
          />
          {!vignette && <CelestialMark kind={cfg.symbol} x={side === "left" ? 1090 : 110} y={110} s={0.9} />}
          {has("birds") && <Birds rng={rng} x={side === "left" ? 620 : 580} y={300} n={6} />}
          {has("aeroplane") && <Aeroplane x={side === "left" ? 980 : 470} y={330} s={1.2} />}
          {!vignette && <ShootingStar x={side === "left" ? 1000 : 300} y={70} />}
        </Layer>

        {/* warm glow rising behind the buildings, as in old night-city prints */}
        {cfg.architecture !== "none" && <ellipse cx={scene.arch.x} cy={scene.arch.y - 30} rx={340} ry={190} fill={`url(#${uid}-glow)`} />}

        <Layer delay={d(0.3)}>
          <AirBand rng={createRng(seedBase + ":air")} horizon={HZ} density={density} />
        </Layer>

        {/* ── Distant land ── */}
        <Layer delay={d(0.5)} className="depth-far">{scene.back}</Layer>

        {/* ── Water ── */}
        {scene.water && (
          <Layer delay={d(0.8)}>
            <Water rng={rng} {...scene.water} glints={glints} />
          </Layer>
        )}

        {/* ── Middle ground ── */}
        <Layer delay={d(1)} className="depth-mid">{scene.front}</Layer>

        {/* ── Architecture ── */}
        {cfg.architecture !== "none" && (
          <Layer delay={d(1.5)}>
            <Building kind={cfg.architecture} {...scene.arch} rng={rng} smoke={has("smoke")} />
          </Layer>
        )}

        {/* ── Near ground ── */}
        {scene.foreground && <Layer delay={d(1.7)} className="depth-near">{scene.foreground}</Layer>}

        {/* ── Landmark ── */}
        {cfg.landmark !== "none" && (
          <Layer delay={d(1.9)}>
            <LandmarkShape kind={cfg.landmark} {...scene.mark} rng={rng} uid={uid} />
          </Layer>
        )}

        {/* ── Trees, figures, boats ── */}
        <Layer delay={d(2.4)}>
          {cfg.trees !== "none" &&
            scene.trees
              .filter((t) => Math.abs(t.x - scene.mark.x) > 70 || cfg.landmark === "none")
              .map((t, i) => <Tree key={i} kind={cfg.trees} {...t} rng={rng} />)}
          {pathEdges && (
            <g>
              <Ink c="s0" d={smooth(pathEdges.left)} />
              <Ink c="s0" d={smooth(pathEdges.right)} />
            </g>
          )}
          {has("figures") && scene.figures.map((f, i) => <Figure key={i} {...f} rng={rng} />)}
          {has("boat") && scene.boat && (scene.water || cfg.water !== "none") && (
            <Boat {...scene.boat} rng={rng} kind={cfg.landscape === "lake" || cfg.landscape === "city" ? "row" : "sail"} umbrella={cfg.atmosphere === "rain"} />
          )}
        </Layer>

          </>
        )}

        {/* ── Weather ── */}
        <Atmosphere kind={cfg.atmosphere} uid={uid} seed={seedBase} />
      </g>

      {vignette && !composed && cfg.architecture !== "none" && <Orbit x={scene.arch.x} y={scene.arch.y - 50} />}
      {vignette && composed?.orbit && <Orbit {...composed.orbit} />}
      {variant === "plate" && <PlateFrame />}
      {vignette && <MedallionFrame cx={med.cx} cy={med.cy} />}
    </svg>
  );
}

/* ── A road that widens as it comes towards us ─────────────────────────── */

function roadEdges(path: Pt[]) {
  const left: Pt[] = [], right: Pt[] = [];
  path.forEach(([x, y]) => {
    const w = 2 + ((y - HZ) / (H - HZ)) * 26;
    left.push([x - w, y]);
    right.push([x + w, y]);
  });
  return { left, right };
}

/* ── Engraved air ──────────────────────────────────────────────────────
 * Old engravers shaded the sky near the horizon with fine horizontal lines,
 * closer together as they approach it; a few motes hang higher up.
 */
function AirBand({ rng, horizon, density }: { rng: Rng; horizon: number; density: number }) {
  const lines: string[] = [];
  for (let k = 0; k < 16; k++) {
    const t = k / 15;
    const y = horizon - 150 * Math.pow(1 - t, 1.7) - 2;
    let x = rng.range(-40, 60);
    while (x < W) {
      const len = rng.range(30, 160) * (0.6 + t);
      if (rng.chance(0.35 + t * 0.45)) lines.push(seg(x, y, Math.min(x + len, W), y));
      x += len + rng.range(18, 90) * (1.3 - t);
    }
  }
  const motes = Array.from({ length: Math.round(26 * density) }, () => {
    const x = rng.range(0, W), y = rng.range(40, horizon - 160), r = rng.range(1.2, 2.4);
    return seg(x - r, y, x + r, y) + seg(x, y - r, x, y + r);
  });
  return (
    <g aria-hidden>
      <g opacity="0.45">
        <Ink c="sf" d={lines.join("")} />
      </g>
      <g opacity="0.5">
        <Ink c="s0" d={motes.join("")} />
      </g>
    </g>
  );
}

/* ── Weather ───────────────────────────────────────────────────────────── */

function Atmosphere({ kind, uid, seed }: { kind: BookWorldConfig["atmosphere"]; uid: string; seed: string }) {
  const rng = createRng(seed + ":weather");
  if (kind === "mist") {
    return (
      <g aria-hidden filter={`url(#${uid}-blur)`} className="drift">
        {[HZ - 10, HZ + 60, 640].map((y, i) => (
          <ellipse key={i} cx={rng.range(300, 900)} cy={y} rx={rng.range(380, 560)} ry={rng.range(16, 30)} className="fill-faint" opacity={0.16} />
        ))}
      </g>
    );
  }
  if (kind === "snow") {
    const flakes = Array.from({ length: 140 }, () => ({ x: rng.range(0, W), y: rng.range(0, H), r: rng.range(0.6, 1.8) }));
    return (
      <g aria-hidden className="fall" style={{ ["--t" as string]: "70s" }}>
        {flakes.flatMap((f, i) => [
          <circle key={i} cx={r1(f.x)} cy={r1(f.y)} r={r1(f.r)} fill="var(--color-parchment)" opacity="0.6" />,
          <circle key={"b" + i} cx={r1(f.x)} cy={r1(f.y - H)} r={r1(f.r)} fill="var(--color-parchment)" opacity="0.6" />,
        ])}
      </g>
    );
  }
  if (kind === "rain") {
    const drops = Array.from({ length: 120 }, () => ({ x: rng.range(0, W + 160), y: rng.range(0, H), l: rng.range(10, 22) }));
    const d = drops.map((p) => seg(p.x, p.y, p.x - p.l * 0.2, p.y + p.l) + seg(p.x + 160, p.y - H, p.x + 160 - p.l * 0.2, p.y - H + p.l)).join("");
    return (
      <g aria-hidden className="rain" style={{ ["--t" as string]: "7s" }}>
        <path d={d} stroke="var(--color-faded)" strokeWidth="0.6" opacity="0.55" fill="none" />
      </g>
    );
  }
  return null;
}

function ShootingStar({ x, y }: { x: number; y: number }) {
  return (
    <g className="shooting-star" style={{ ["--d" as string]: "6s", ["--t" as string]: "23s" }} aria-hidden>
      <path d={seg(x, y, x + 70, y - 35)} stroke="var(--color-gold-soft)" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
      <circle cx={x} cy={y} r="1.4" fill="var(--color-gold-soft)" />
    </g>
  );
}

/* An orbital ellipse swept around the building, like a planet's path. */
function Orbit({ x, y }: { x: number; y: number }) {
  return (
    <g aria-hidden transform={`rotate(-14 ${r1(x)} ${r1(y)})`} opacity="0.75">
      <Ink c="s0" d={`M${r1(x - 230)} ${r1(y)}A230 70 0 1 1 ${r1(x + 230)} ${r1(y)}`} />
      <Ink c="s0" d={`M${r1(x + 230)} ${r1(y)}A230 70 0 0 1 ${r1(x - 160)} ${r1(y + 50)}`} />
      <circle cx={r1(x + 230)} cy={r1(y)} r="3" className="fill-soft" />
    </g>
  );
}

/* ── Frames ────────────────────────────────────────────────────────────── */

function PlateFrame() {
  const ticks: string[] = [];
  for (let x = 30; x <= W - 30; x += 12) {
    const long = (x - 30) % 120 === 0;
    ticks.push(seg(x, 10, x, long ? 22 : 16), seg(x, H - 10, x, H - (long ? 22 : 16)));
  }
  for (let y = 30; y <= H - 30; y += 12) {
    const long = (y - 30) % 120 === 0;
    ticks.push(seg(10, y, long ? 22 : 16, y), seg(W - 10, y, W - (long ? 22 : 16), y));
  }
  return (
    <g aria-hidden>
      <Ink c="s1" d={`M0.5 0.5H${W - 0.5}V${H - 0.5}H0.5Z`} />
      <Ink c="s0" d={`M10 10H${W - 10}V${H - 10}H10Z`} />
      <Ink c="s0" d={`M24 24H${W - 24}V${H - 24}H24Z`} />
      <Ink c="s0" d={ticks.join("")} />
      {[[10, 10], [W - 10, 10], [10, H - 10], [W - 10, H - 10]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 10} y={y - 10} width="20" height="20" className="occlude" />
          <path d={sparkle(x, y, 9)} className="fill-ink" />
          <Ink c="s0" d={circle(x, y, 5)} />
        </g>
      ))}
    </g>
  );
}

function MedallionFrame({ cx, cy }: { cx: number; cy: number }) {
  const ticks: string[] = [];
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    const r0 = 334, r1_ = i % 10 === 0 ? 346 : 340;
    ticks.push(seg(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * r1_, cy + Math.sin(a) * r1_));
  }
  return (
    <g aria-hidden>
      <Ink c="s1" d={circle(cx, cy, 330)} />
      <Ink c="s0" d={circle(cx, cy, 334)} />
      <Ink c="s0" d={ticks.join("")} />
    </g>
  );
}
