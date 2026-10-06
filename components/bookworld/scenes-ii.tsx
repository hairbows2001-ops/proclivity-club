/**
 * ART-DIRECTED SCENES · II
 * ────────────────────────
 * Hand-composed worlds for books from the first batch. Same conventions as
 * scenes.tsx: a 1200 × 780 plate, layers tagged far / mid / near, and a
 * medallion centre around each book's focal point.
 *
 *   alpine-enclosure   The Wall
 *   crossing-threads   This Is How You Lose the Time War
 *   carpathian-pass    Dracula
 *   winter-plain       War and Peace
 *   veld-farmhouse     The Grass Is Singing
 */

import type { CSSProperties, ReactNode } from "react";
import type { Rng } from "@/lib/rng";
import { r1 } from "@/lib/rng";
import { Ink } from "./Ink";
import { Building, Smoke, Win } from "./architecture";
import { Figure, Grass, Tree } from "./nature";
import { CelestialMark, Luminary, Stars, sparkle } from "./sky";
import { MountainRange } from "./terrain";
import { AirLines, Flowers, OrbitMark, Rocks, Steps, Temple, TinyStars } from "./extras";
import { arc, circle, ellipse, line, poly, rect, ridge, seg, smooth, underside, yAt, type Pt } from "./geometry";
import { FadingConstellation, KeyStar, n } from "./scene-kit";
import type { ComposedScene, SceneContext } from "./scenes";

const W = 1200, H = 780;

/* ── Small primitives used only here ──────────────────────────────────── */

/** A cow, side on, very small. */
function Cow({ x, y, s = 1, dir = 1 }: { x: number; y: number; s?: number; dir?: 1 | -1 }) {
  const X = (v: number) => x + v * s * dir;
  const body = smooth([[X(-10), y - 6 * s], [X(-11), y - 11 * s], [X(-4), y - 13 * s], [X(6), y - 13 * s], [X(10), y - 11 * s], [X(10), y - 6 * s]]) + `L${r1(X(-10))} ${r1(y - 6 * s)}Z`;
  return (
    <g>
      <Ink c="s1" d={seg(X(-8), y - 6 * s, X(-8.5), y) + seg(X(-5), y - 6 * s, X(-5), y) + seg(X(5), y - 6 * s, X(5), y) + seg(X(8), y - 6 * s, X(8.5), y)} />
      <Ink c="s1 occlude" d={body} />
      <Ink c="s1 occlude" d={poly([[X(9), y - 12 * s], [X(15), y - 11 * s], [X(15), y - 7 * s], [X(10), y - 8 * s]])} />
      <Ink c="s0" d={seg(X(11), y - 12 * s, X(12), y - 14 * s) + seg(X(-10), y - 10 * s, X(-12), y - 5 * s) + circle(X(0), y - 10 * s, 2 * s)} />
    </g>
  );
}

/** A forest edge: overlapping pines along a slope, back rows smaller and fainter. */
function PineBand({ rng, pts, rows = 3, s = 1, gap = 14 }: { rng: Rng; pts: Pt[]; rows?: number; s?: number; gap?: number }) {
  const els: ReactNode[] = [];
  const x0 = pts[0][0], x1 = pts[pts.length - 1][0];
  for (let row = rows - 1; row >= 0; row--) {
    const k = 1 - row * 0.18;
    for (let x = Math.min(x0, x1); x < Math.max(x0, x1); x += gap * k * rng.range(0.7, 1.2)) {
      const y = yAt(pts, x) - row * 10 * s + rng.range(-2, 3);
      els.push(<Tree key={`${row}-${r1(x)}`} kind="pine" x={x} y={y} s={s * k * rng.range(0.75, 1.15)} rng={rng} />);
    }
  }
  return <g>{els}</g>;
}

/** A castle on a crag: towers with steep conical roofs, curtain walls. */
function Castle({ x, y, s = 1, rng }: { x: number; y: number; s?: number; rng: Rng }) {
  const els: ReactNode[] = [];
  const tower = (tx: number, w: number, h: number, key: string, lit = false) => {
    const top = y - h * s;
    els.push(<Ink key={key + "b"} c="s1 occlude" d={rect(tx - (w / 2) * s, top, w * s, h * s)} />);
    els.push(<Ink key={key + "r"} c="s1 occlude" d={poly([[tx - (w / 2 + 2) * s, top], [tx, top - w * 1.6 * s], [tx + (w / 2 + 2) * s, top]])} />);
    els.push(<Ink key={key + "f"} c="s0" d={seg(tx, top - w * 1.6 * s, tx, top - w * 1.6 * s - 6 * s)} />);
    for (let hy = top + 2; hy < y; hy += 2.6 * s) els.push(<Ink key={key + "h" + hy} c="s0" d={seg(tx + w * 0.15 * s, hy, tx + (w / 2) * s, hy)} />);
    els.push(<Win key={key + "w"} x={tx - 1.5 * s} y={top + 8 * s} w={3 * s} h={6 * s} rng={rng} arched bars={0} litChance={lit ? 1 : 0} />);
  };
  // curtain wall with crenels
  const wl = x - 46 * s, wr = x + 40 * s, wt = y - 26 * s;
  const cren: Pt[] = [[wl, y], [wl, wt]];
  for (let cx = wl; cx < wr; cx += 6 * s) cren.push([cx, wt], [cx, wt - 4 * s], [cx + 3 * s, wt - 4 * s], [cx + 3 * s, wt]);
  cren.push([wr, wt], [wr, y]);
  els.push(<Ink key="wall" c="s1 occlude" d={poly(cren)} />);
  tower(x - 30 * s, 14, 70, "t1");
  tower(x + 8 * s, 18, 104, "t2", true);
  tower(x + 34 * s, 12, 56, "t3");
  tower(x - 52 * s, 10, 44, "t4");
  return <g>{els}</g>;
}

/** A tiny carriage with a single lamp. */
function Carriage({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <Ink c="s1 occlude" d={rect(x - 5 * s, y - 9 * s, 9 * s, 6 * s)} />
      <Ink c="s0" d={circle(x - 3 * s, y - 1.5 * s, 1.6 * s) + circle(x + 2.5 * s, y - 1.5 * s, 1.6 * s)} />
      <Ink c="s0" d={seg(x + 4 * s, y - 5 * s, x + 12 * s, y - 4 * s) + seg(x + 12 * s, y - 4 * s, x + 12 * s, y)} />
      <Ink c="s0" d={seg(x + 15 * s, y - 4 * s, x + 15 * s, y) + seg(x + 12 * s, y - 4 * s, x + 18 * s, y - 5 * s)} />
      <circle cx={r1(x - 6.5 * s)} cy={r1(y - 7 * s)} r={1.3 * s} className="fill-soft" />
    </g>
  );
}

function Bat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <Ink c="s0" d={`M${r1(x - 6 * s)} ${r1(y - 1 * s)}q${r1(2 * s)} ${r1(2 * s)} ${r1(3 * s)} 0q1 ${r1(1.5 * s)} ${r1(3 * s)} ${r1(1 * s)}q${r1(2 * s)} ${r1(0.5 * s)} ${r1(3 * s)} ${r1(-1 * s)}q1 ${r1(2 * s)} ${r1(3 * s)} 0`} />;
}

/** Onion domes: a distant Russian church, flat and faint. */
function DomedChurch({ x, y, s = 1, rng }: { x: number; y: number; s?: number; rng: Rng }) {
  const els: ReactNode[] = [];
  const dome = (dx: number, w: number, base: number, key: string) => {
    const cx = x + dx * s, by = y - base * s, r = (w / 2) * s;
    els.push(<Ink key={key + "d"} c="s1 occlude" d={rect(cx - r * 0.8, by, r * 1.6, base * s)} />);
    els.push(<Ink key={key + "o"} c="s1 occlude" d={`M${r1(cx - r * 0.8)} ${r1(by)}C${r1(cx - r * 1.3)} ${r1(by - r * 1.1)} ${r1(cx - r * 0.2)} ${r1(by - r * 1.3)} ${r1(cx)} ${r1(by - r * 2.2)}C${r1(cx + r * 0.2)} ${r1(by - r * 1.3)} ${r1(cx + r * 1.3)} ${r1(by - r * 1.1)} ${r1(cx + r * 0.8)} ${r1(by)}Z`} />);
    els.push(<Ink key={key + "c"} c="s0" d={seg(cx, by - r * 2.2, cx, by - r * 2.2 - 6 * s) + seg(cx - 2 * s, by - r * 2.2 - 4 * s, cx + 2 * s, by - r * 2.2 - 4 * s)} />);
    els.push(<Win key={key + "w"} x={cx - 1 * s} y={by + 3 * s} w={2 * s} h={4 * s} rng={rng} bars={0} litChance={0.5} />);
  };
  els.push(<Ink key="nave" c="s1 occlude" d={rect(x - 22 * s, y - 16 * s, 44 * s, 16 * s)} />);
  dome(-16, 9, 22, "a");
  dome(16, 9, 22, "b");
  dome(0, 14, 34, "c");
  return <g>{els}</g>;
}

/** A flat-crowned acacia, thorn-tree of the veld. */
function Acacia({ x, y, s = 1, rng }: { x: number; y: number; s?: number; rng: Rng }) {
  const top = y - 34 * s;
  const branches = [seg(x, y, x - 2 * s, top + 8 * s), seg(x - 2 * s, top + 8 * s, x - 22 * s, top), seg(x - 1 * s, top + 10 * s, x + 20 * s, top - 1 * s), seg(x - 2 * s, top + 8 * s, x + 3 * s, top - 3 * s)];
  const crown: string[] = [];
  for (let i = 0; i < 24; i++) {
    const cx = x + rng.range(-30, 30) * s, cy = top - rng.range(0, 7) * s;
    crown.push(`M${r1(cx - 4 * s)} ${r1(cy)}q${r1(4 * s)} ${r1(-3 * s)} ${r1(8 * s)} 0`);
  }
  return (
    <g>
      <Ink c="s1" d={branches.join("")} />
      <Ink c="s1 occlude" d={`M${r1(x - 34 * s)} ${r1(top + 1 * s)}Q${r1(x)} ${r1(top - 14 * s)} ${r1(x + 34 * s)} ${r1(top + 1 * s)}Z`} />
      <Ink c="s0" d={crown.join("") + seg(x - 30 * s, top + 1 * s, x + 30 * s, top + 1 * s)} />
    </g>
  );
}

/** A small brick house with a corrugated tin roof and a verandah. */
function TinHouse({ x, y, s = 1, rng }: { x: number; y: number; s?: number; rng: Rng }) {
  const W2 = 40 * s, Hh = 18 * s;
  const els: ReactNode[] = [];
  els.push(<Ink key="body" c="s1 occlude" d={rect(x - W2, y - Hh, W2 * 2, Hh)} />);
  els.push(<Ink key="roof" c="s1 occlude" d={poly([[x - W2 - 10 * s, y - Hh + 2 * s], [x - W2 + 6 * s, y - Hh - 14 * s], [x + W2 - 6 * s, y - Hh - 14 * s], [x + W2 + 10 * s, y - Hh + 2 * s]])} />);
  for (let t = 0; t <= 1.001; t += 1 / 22) els.push(<Ink key={"c" + t} c="s0" d={seg(x - W2 + 6 * s + t * (W2 * 2 - 12 * s), y - Hh - 13 * s, x - W2 - 9 * s + t * (W2 * 2 + 18 * s), y - Hh + 1 * s)} />);
  for (let k = 0; k < 6; k++) els.push(<Ink key={"p" + k} c="s0" d={seg(x - W2 - 6 * s + k * ((W2 * 2 + 12 * s) / 5), y - Hh + 2 * s, x - W2 - 6 * s + k * ((W2 * 2 + 12 * s) / 5), y)} />);
  els.push(<Win key="w1" x={x - 26 * s} y={y - 13 * s} w={7 * s} h={8 * s} rng={rng} litChance={0} />);
  els.push(<Ink key="door" c="s0" d={rect(x - 4 * s, y - 14 * s, 8 * s, 14 * s)} />);
  els.push(<Win key="w2" x={x + 18 * s} y={y - 13 * s} w={7 * s} h={8 * s} rng={rng} litChance={0} />);
  els.push(<Ink key="tank" c="s1 occlude" d={rect(x + W2 + 14 * s, y - 22 * s, 10 * s, 14 * s) + seg(x + W2 + 15 * s, y - 8 * s, x + W2 + 15 * s, y) + seg(x + W2 + 23 * s, y - 8 * s, x + W2 + 23 * s, y)} />);
  return <g>{els}</g>;
}

/** A ruined round arch on two piers. */
function Arch({ x, y, w, h, s = 1, broken = false }: { x: number; y: number; w: number; h: number; s?: number; broken?: boolean }) {
  const pw = 9 * s, r = w / 2;
  const d: string[] = [rect(x - r - pw, y - h, pw, h), rect(x + r, y - h, pw, h * (broken ? 0.62 : 1))];
  const outer = broken ? arc(x, y - h, r + pw, Math.PI, Math.PI * 1.62) : arc(x, y - h, r + pw, Math.PI, Math.PI * 2);
  const inner = broken ? arc(x, y - h, r, Math.PI, Math.PI * 1.58) : arc(x, y - h, r, Math.PI, Math.PI * 2);
  const vous: string[] = [];
  for (let k = 0; k <= (broken ? 7 : 12); k++) {
    const a = Math.PI + (k / 12) * Math.PI;
    vous.push(seg(x + Math.cos(a) * r, y - h + Math.sin(a) * r, x + Math.cos(a) * (r + pw), y - h + Math.sin(a) * (r + pw)));
  }
  return (
    <g>
      <Ink c="s1 occlude" d={d.join("")} />
      <Ink c="s1" d={outer + inner} />
      <Ink c="s0" d={vous.join("")} />
    </g>
  );
}

/** A folded letter, sealed. */
function Letter({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <g transform={`rotate(${rot} ${r1(x)} ${r1(y)})`}>
      <Ink c="s1 occlude" d={rect(x - 9 * s, y - 6 * s, 18 * s, 12 * s)} />
      <Ink c="s0" d={line([[x - 9 * s, y - 6 * s], [x, y + 1 * s], [x + 9 * s, y - 6 * s]])} />
      <circle cx={x} cy={r1(y + 1 * s)} r={1.6 * s} className="fill-soft" />
    </g>
  );
}

/** Rings of a felled tree, where one of the letters was hidden. */
function TreeRings({ x, y, r, rng }: { x: number; y: number; r: number; rng: Rng }) {
  const d: string[] = [];
  for (let k = 1; k <= 9; k++) {
    const rr = (k / 9) * r;
    const pts: Pt[] = Array.from({ length: 18 }, (_, i) => {
      const a = (i / 18) * Math.PI * 2, j = rr * rng.range(0.94, 1.04);
      return [x + Math.cos(a) * j, y + Math.sin(a) * j * 0.55];
    });
    d.push(smooth([...pts, pts[0], pts[1]]));
  }
  return <Ink c="s0" d={d.join("") + seg(x, y, x + r * 0.8, y - r * 0.2)} />;
}

/** A botanical sprig: a curved stem with paired leaves. */
function Sprig({ x, y, len, a, s = 1 }: { x: number; y: number; len: number; a: number; s?: number }) {
  const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len;
  const d: string[] = [`M${r1(x)} ${r1(y)}Q${r1((x + ex) / 2 + 6 * s)} ${r1((y + ey) / 2)} ${r1(ex)} ${r1(ey)}`];
  for (let t = 0.2; t < 1; t += 0.16) {
    const px = x + (ex - x) * t, py = y + (ey - y) * t, l = (1 - t) * 9 * s + 3 * s;
    for (const side of [-1, 1]) {
      const la = a + side * 0.9;
      d.push(`M${r1(px)} ${r1(py)}q${r1(Math.cos(la) * l * 0.4)} ${r1(Math.sin(la) * l * 0.4 - 2)} ${r1(Math.cos(la) * l)} ${r1(Math.sin(la) * l)}`);
    }
  }
  return <Ink c="s0" d={d.join("")} />;
}

/** Points along a cubic Bézier. */
function bezierPts(p0: Pt, p1: Pt, p2: Pt, p3: Pt, steps = 40): Pt[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps, u = 1 - t;
    return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
  });
}

/* ═════════════════════════════════════════════════════════════════════════
 *  THE WALL — "alpine-enclosure"
 *  A valley closed on every side. The lodge, small and far in; one star
 *  above it; the forest pressing down both slopes. Halfway up the valley the
 *  meadow simply stops, as though against glass.
 * ═════════════════════════════════════════════════════════════════════════ */

function alpineEnclosure(ctx: SceneContext): ComposedScene {
  const { rng, uid } = ctx;
  const FLOOR = 600;
  const LX = 640, LY = 596;
  const leftSlope: Pt[] = [[-20, 240], [60, 262], [120, 318], [190, 372], [250, 452], [320, 528], [400, 588], [470, 612]];
  const rightSlope: Pt[] = [[1220, 226], [1150, 262], [1090, 330], [1030, 388], [960, 466], [890, 546], [830, 598], [770, 616]];
  const back = ridge(rng, 280, 980, 470, 230, 7, 0.52);
  const floor: Pt[] = [[380, 616], [520, 610], [640, 602], [760, 610], [900, 620]];
  const WALL = 880; // where the valley quietly stops

  const sky = (
    <g>
      <Stars rng={rng} count={n(210, ctx)} x0={0} x1={W} y0={20} y1={420} />
      <TinyStars rng={rng} n={n(50, ctx)} x0={300} x1={900} y0={40} y1={260} bright={0.06} />
      <KeyStar x={LX + 4} y={150} r={8} uid={uid} />
      <FadingConstellation pts={[[180, 90], [228, 128], [214, 180], [262, 214]]} label={ctx.vignette ? undefined : ctx.label} />
      {!ctx.vignette && <CelestialMark kind="eye" x={1090} y={100} s={0.8} />}
    </g>
  );

  const far = (
    <g>
      <MountainRange rng={rng} x0={180} x1={1060} base={500} amp={320} faint bottom={520} />
      <Ink c="s1 occlude" d={underside(back, 640)} />
      {back.map(([x, y], i) => (i % 3 === 0 && i > 0 && back[i + 1] && back[i + 1][1] > y ? <Ink key={i} c="s0" d={seg(x, y + 2, x - 10, y + Math.min(70, 470 - y))} /> : null))}
    </g>
  );

  const slopes = (
    <g>
      <path className="occlude" d={line(leftSlope) + `L470 ${H + 20}L-20 ${H + 20}Z`} />
      <path className="occlude" d={line(rightSlope) + `L770 ${H + 20}L1220 ${H + 20}Z`} />
      <Ink c="s1" d={smooth(leftSlope)} />
      <Ink c="s1" d={smooth(rightSlope)} />
      {/* spurs running down the slopes */}
      {[60, 150, 1080, 1150].map((x, i) => {
        const left = x < 600, sl = left ? leftSlope : rightSlope, y = yAt(sl, x);
        return <Ink key={"sp" + i} c="s0" d={smooth([[x, y], [x + (left ? 30 : -30), y + 60], [x + (left ? 50 : -50), y + 140]])} />;
      })}
      {/* rock bands and hatching on the upper slopes */}
      {Array.from({ length: n(40, ctx) }, (_, i) => {
        const left = i % 2 === 0, x = left ? rng.range(0, 260) : rng.range(960, 1200);
        const y = (left ? yAt(leftSlope, x) : yAt(rightSlope, x)) + rng.range(8, 40);
        return <Ink key={"rh" + i} c="s0" d={seg(x, y, x + (left ? 9 : -9), y + 12)} />;
      })}
      <path className="occlude" d={line(floor) + `L900 ${H + 20}L380 ${H + 20}Z`} />
      <Ink c="s1" d={smooth(floor)} />
      <PineBand rng={rng} pts={leftSlope.slice(2).map(([x, y]) => [x, y + 14])} rows={3} s={0.9} gap={13} />
      <PineBand rng={rng} pts={rightSlope.slice(2).map(([x, y]) => [x, y + 14])} rows={3} s={0.9} gap={13} />
    </g>
  );

  const meadow = (
    <g>
      {/* meadow grass, which stops in a straight line at the wall */}
      {Array.from({ length: n(120, ctx) }, (_, i) => {
        const x = rng.range(420, WALL - 4), y = yAt(floor, x) + rng.range(4, 150);
        return <Ink key={"g" + i} c="s0" d={seg(x, y, x - 1, y - 4) + seg(x + 2, y, x + 3, y - 3)} />;
      })}
      {/* the wall: no line, only a faint seam where the marks end and the air goes still */}
      <g opacity="0.32">
        {Array.from({ length: 26 }, (_, i) => <path key={"w" + i} d={seg(WALL + Math.sin(i) * 0.6, 618 - i * 13, WALL + Math.sin(i + 1) * 0.6, 612 - i * 13)} stroke="var(--color-faded)" style={{ strokeWidth: "calc(var(--hair) * 0.6)" }} />)}
      </g>
      <Building kind="cottage" x={LX} y={LY} s={0.62} rng={rng} lit={0} smoke />
      <rect x={LX - 20.5} y={LY - 15.4} width="7.4" height="6.6" className="fill-soft" />
      <circle cx={LX - 17} cy={LY - 12} r={16} fill={`url(#${uid}-halo)`} />
      <Ink c="s0" d={smooth([[560, H + 10], [590, 700], [620, 640], [LX - 2, LY + 2]])} />
      <Ink c="s0" d={smooth([[600, H + 10], [616, 702], [634, 642], [LX + 4, LY + 2]])} />
      <Cow x={740} y={642} s={1.05} />
      <Figure x={706} y={660} s={1.1} rng={rng} dress />
      <Ink c="s0" d={`M${716} 660q4 -5 9 -3l2 -3 1 4q2 1 2 3h-14z`} />
      {/* on the far side, the path goes on unworn */}
      <Ink c="sf" d={smooth([[WALL + 4, 640], [960, 626], [1020, 618]])} />
    </g>
  );

  const near = (
    <g>
      {/* great pines framing the left edge, and rocks */}
      {[[40, 790, 2.6], [104, 800, 2.1], [1160, 800, 2.4]].map(([x, y, s2], i) => <Tree key={"np" + i} kind="pine" x={x} y={y} s={s2} rng={rng} />)}
      <Rocks rng={rng} x={250} y={770} n={6} s={1.2} />
      <Rocks rng={rng} x={1010} y={772} n={4} s={1} />
      <Flowers rng={rng} x0={440} x1={860} yOf={() => 700} n={n(16, ctx)} />
    </g>
  );

  return {
    layers: [
      { delay: 0, node: sky },
      { delay: 0.5, node: far, depth: "far" },
      { delay: 1, node: slopes, depth: "mid" },
      { delay: 1.5, node: meadow, depth: "mid" },
      { delay: 2, node: near, depth: "near" },
    ],
    horizon: 470,
    medallion: { cx: 650, cy: 450 },
  };
}

/* ═════════════════════════════════════════════════════════════════════════
 *  THIS IS HOW YOU LOSE THE TIME WAR — "crossing-threads"
 *  No landscape. Two threads cross the plate from opposite corners, passing
 *  through fragments of different centuries, carrying letters. They curve
 *  towards each other and almost touch — the only gold is in the gap.
 * ═════════════════════════════════════════════════════════════════════════ */

function crossingThreads(ctx: SceneContext): ComposedScene {
  const { rng, uid } = ctx;
  const MX = 600, MY = 392; // where the threads almost meet
  // Red rises from the lower corners, Blue descends from the upper ones; at the centre they come within a hair's breadth
  const red = bezierPts([-40, 700], [300, 690], [400, MY + 11], [MX, MY + 11]).concat(bezierPts([MX, MY + 11], [800, MY + 11], [900, 690], [1240, 700]).slice(1));
  const blue = bezierPts([-40, 70], [300, 90], [400, MY - 11], [MX, MY - 11]).concat(bezierPts([MX, MY - 11], [800, MY - 11], [900, 90], [1240, 70]).slice(1));
  const thread = (pts: Pt[], key: string) => (
    <g key={key}>
      <Ink c="s1" d={smooth(pts)} />
      <Ink c="s0" d={smooth(pts.map(([x, y], i) => [x + Math.sin(i * 0.7) * 3, y + Math.cos(i * 0.7) * 3]))} />
      {pts.filter((_, i) => i % 7 === 3).map(([x, y], i) => <circle key={i} cx={r1(x)} cy={r1(y)} r="1.6" className="fill-ink" />)}
    </g>
  );

  const far = (
    <g>
      <Stars rng={rng} count={n(150, ctx)} x0={0} x1={W} y0={0} y1={H} />
      {/* a great celestial diagram centred on the meeting point */}
      {[90, 150, 230, 330].map((r, i) => <Ink key={"o" + i} c={i % 2 ? "sf" : "s0"} d={circle(MX, MY, r)} />)}
      <Ink c="sf" d={Array.from({ length: 120 }, (_, i) => {
        const a = (i / 120) * Math.PI * 2, r0 = 330, l = i % 10 === 0 ? 12 : 5;
        return seg(MX + Math.cos(a) * r0, MY + Math.sin(a) * r0, MX + Math.cos(a) * (r0 + l), MY + Math.sin(a) * (r0 + l));
      }).join("")} />
      <Ink c="s0" d={ellipse(MX, MY, 420, 120)} transform={`rotate(-24 ${MX} ${MY})`} />
      <Ink c="s0" d={ellipse(MX, MY, 420, 120)} transform={`rotate(24 ${MX} ${MY})`} />
      {["I", "III", "VI", "IX"].map((t, i) => {
        const a = -Math.PI / 2 + (i * Math.PI) / 2;
        return <text key={t} x={r1(MX + Math.cos(a) * 352)} y={r1(MY + Math.sin(a) * 352 + 4)} fontSize="11" textAnchor="middle" opacity="0.6">{t}</text>;
      })}
      {!ctx.vignette && <CelestialMark kind="hourglass" x={1110} y={680} s={0.8} />}
      {!ctx.vignette && <OrbitMark x={110} y={690} r={14} />}
    </g>
  );

  // fragments of different eras, floating along each route
  const fragments = (
    <g>
      {/* ancient: a ruined arch and a broken colonnade, low left on Red's road */}
      <Ink c="s1 occlude" d={rect(150, 640, 150, 12)} />
      <Arch x={226} y={640} w={66} h={60} broken />
      <Temple x={120} y={520} s={0.32} columns={6} ruined />
      <Ink c="s1 occlude" d={rect(70, 520, 104, 8)} />
      {/* gothic: a lancet window standing alone, top left on Blue's road */}
      <Ink c="s1 occlude" d={`M246 236V176Q266 132 286 176V236Z`} />
      <Ink c="s0" d={`M256 236V182Q266 154 276 182V236` + seg(266, 168, 266, 236) + circle(266, 190, 6)} />
      <Ink c="s1 occlude" d={rect(236, 236, 60, 8)} />
      {/* clockwork: a clock face with no tower, high right on Blue's road */}
      <Ink c="s1 occlude" d={circle(930, 240, 34)} />
      <Ink c="s0" d={circle(930, 240, 27) + Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return seg(930 + Math.cos(a) * 27, 240 + Math.sin(a) * 27, 930 + Math.cos(a) * 31, 240 + Math.sin(a) * 31);
      }).join("") + seg(930, 240, 944, 232) + seg(930, 240, 926, 218)} />
      {/* future: a stair that climbs into nothing, low right on Red's road */}
      <Steps x={940} y={600} w={46} n={9} dx={6} dy={9} />
      <Ink c="s0" d={seg(940, 600, 940, 620) + seg(986, 600, 986, 620) + seg(940, 620, 986, 620)} />
      {/* tree rings, a seed sprig, a heron's feather */}
      <TreeRings x={420} y={660} r={34} rng={rng} />
      <Sprig x={780} y={250} len={70} a={-0.6} />
      <Sprig x={360} y={170} len={56} a={2.4} />
      <Sprig x={860} y={560} len={48} a={-2.2} />
      {/* lines of writing drifting off the letters */}
      {[[480, 560], [700, 240], [140, 330], [1010, 440]].map(([x, y], i) => (
        <Ink key={"script" + i} c="sf" d={Array.from({ length: 4 }, (_, k) => {
          let d = `M${x} ${y + k * 8}`;
          for (let t = 0; t < 10; t++) d += `q2 ${t % 2 ? 3 : -3} 5 0`;
          return d;
        }).join("")} />
      ))}
    </g>
  );

  const threads = (
    <g>
      {thread(red, "red")}
      {thread(blue, "blue")}
      {/* letters carried along each route */}
      {[[red, [10, 26, 50, 66]], [blue, [12, 30, 52, 70]]].flatMap(([pts, idx], k) =>
        (idx as number[]).map((i) => {
          const p = (pts as Pt[])[Math.min(i, (pts as Pt[]).length - 1)];
          return <Letter key={`${k}-${i}`} x={p[0]} y={p[1]} s={0.9} rot={k ? -18 + i : 14 - i / 2} />;
        }),
      )}
      {/* the gap */}
      <circle cx={MX} cy={MY} r={60} fill={`url(#${uid}-halo)`} />
      <circle cx={MX} cy={MY} r={26} fill={`url(#${uid}-halo)`} />
      <circle cx={MX} cy={MY - 11} r="2.4" className="fill-soft" />
      <circle cx={MX} cy={MY + 11} r="2.4" className="fill-soft" />
      <path d={sparkle(MX, MY - 26, 5)} className="fill-soft twinkle" style={{ "--t": "6s", "--o": 1 } as CSSProperties} />
    </g>
  );

  return {
    layers: [
      { delay: 0, node: far, depth: "far" },
      { delay: 0.8, node: fragments, depth: "mid" },
      { delay: 1.4, node: threads, depth: "near" },
    ],
    medallion: { cx: MX, cy: MY + 10 },
  };
}

/* ═════════════════════════════════════════════════════════════════════════
 *  DRACULA — "carpathian-pass"
 *  A deep gorge. The castle sits high on its crag, far off and small; the
 *  road climbs towards it in switchbacks; one carriage lamp on the road.
 *  The moon hangs clear of every ridge.
 * ═════════════════════════════════════════════════════════════════════════ */

function carpathianPass(ctx: SceneContext): ComposedScene {
  const { rng, uid } = ctx;
  const CX = 868, CY = 252; // the castle
  const crag: Pt[] = [[744, 660], [770, 600], [784, 540], [806, 500], [812, 440], [830, 390], [828, 340], [846, 300], [CX - 34, CY + 8], [CX - 20, CY + 4], [CX + 42, CY + 4], [CX + 50, CY + 12], [916, 300], [912, 350], [934, 400], [948, 460], [976, 520], [990, 580], [1030, 630], [1060, 670]];
  const leftWall: Pt[] = [[-20, 300], [60, 340], [150, 420], [230, 520], [300, 620], [350, 700], [380, 800]];
  const road: Pt[] = [[420, 790], [520, 730], [380, 676], [560, 620], [450, 574], [640, 530], [560, 492], [740, 452], [800, 380], [CX - 10, CY + 6]];
  const carriage = { x: 596, y: 607 };

  const sky = (
    <g>
      <Stars rng={rng} count={n(140, ctx)} x0={0} x1={W} y0={20} y1={300} />
      <Luminary kind="full-moon" x={560} y={140} r={34} uid={uid} rng={rng} />
      <circle cx={560} cy={140} r={110} fill={`url(#${uid}-halo)`} />
      {[[644, 196, 0.9], [676, 176, 0.7], [700, 214, 0.6]].map(([x, y, s2], i) => <Bat key={i} x={x} y={y} s={s2} />)}
      {!ctx.vignette && <CelestialMark kind="eye" x={110} y={100} s={0.8} />}
    </g>
  );

  const far = (
    <g>
      <MountainRange rng={rng} x0={-20} x1={W + 20} base={460} amp={250} faint bottom={480} />
      <MountainRange rng={rng} x0={-20} x1={W + 20} base={540} amp={160} bottom={560} />
    </g>
  );

  const gorge = (
    <g>
      {/* the castle crag: a tall, hatched spur of rock */}
      <path className="occlude" d={smooth(crag, 0.35) + `L1060 ${H + 20}L744 ${H + 20}Z`} />
      <Ink c="s2" d={smooth(crag, 0.35)} />
      {Array.from({ length: n(60, ctx) }, (_, i) => {
        const y = rng.range(CY + 30, 640), xr = yAt(crag.slice(10).map(([x, yy]) => [yy, x]) as Pt[], y);
        return <Ink key={"ch" + i} c="s0" d={seg(xr - rng.range(4, 30), y, xr - 2, y + 6)} />;
      })}
      {Array.from({ length: 6 }, (_, i) => <Ink key={"st" + i} c="s0" d={smooth([[800 + i * 30, 646 - i * 4], [818 + i * 20, 540], [838 + i * 10, 420], [850 + i * 6, 320]])} />)}
      {Array.from({ length: 9 }, (_, i) => <Ink key={"ledge" + i} c="s0" d={seg(820 + rng.range(0, 30), 330 + i * 34, 860 + rng.range(10, 60), 334 + i * 34)} />)}
      <Castle x={CX} y={CY + 6} s={0.82} rng={rng} />
      <circle cx={CX + 7} cy={CY - 60} r={14} fill={`url(#${uid}-halo)`} />
      {/* the left wall of the gorge, steep and close */}
      <Ink c="s1 occlude" d={line(leftWall) + `L-20 ${H + 20}Z`} />
      {Array.from({ length: n(50, ctx) }, (_, i) => {
        const y = rng.range(330, 760), x = yAt(leftWall.map(([a, b]) => [b, a]) as Pt[], y);
        return <Ink key={"lh" + i} c="s0" d={seg(x - 2, y, x - rng.range(10, 40), y + 8)} />;
      })}
      {/* sparse pines clinging to the slopes */}
      {[[120, 380], [70, 352], [200, 470], [250, 540], [960, 500], [1010, 590], [1080, 640]].map(([x, y], i) => <Tree key={"p" + i} kind="pine" x={x} y={y} s={0.7} rng={rng} />)}
    </g>
  );

  const pass = (
    <g>
      {/* mist pooled in the gorge */}
      <g opacity="0.5">
        <AirLines rng={rng} y0={480} y1={640} n={n(14, ctx)} x0={300} x1={1000} />
      </g>
      {/* the road: switchbacks narrowing towards the castle */}
      <Ink c="s0" d={smooth(road, 0.3)} />
      <Ink c="s0" d={smooth(road.map(([x, y], i) => [x + 9 - i * 0.9, y + 5 - i * 0.4]), 0.3)} />
      {road.slice(0, -1).map(([x, y], i) => <Ink key={"post" + i} c="s0" d={seg(x, y, x, y - 5 + i * 0.3)} />)}
      <Carriage x={carriage.x} y={carriage.y} s={1.1} />
      <circle cx={carriage.x - 7} cy={carriage.y - 8} r={18} fill={`url(#${uid}-halo)`} />
    </g>
  );

  const near = (
    <g>
      {/* two dead trees in the foreground, and boulders */}
      <Tree kind="bare" x={1110} y={800} s={3.2} rng={rng} />
      <Tree kind="bare" x={250} y={810} s={2.4} rng={rng} />
      <Rocks rng={rng} x={560} y={776} n={6} s={1.4} />
      <Grass rng={rng} x0={420} x1={760} yOf={() => 740} n={n(40, ctx)} />
    </g>
  );

  return {
    layers: [
      { delay: 0, node: sky },
      { delay: 0.5, node: far, depth: "far" },
      { delay: 1, node: gorge, depth: "mid" },
      { delay: 1.5, node: pass, depth: "mid" },
      { delay: 2, node: near, depth: "near" },
    ],
    horizon: 460,
    medallion: { cx: 690, cy: 380 },
  };
}

/* ═════════════════════════════════════════════════════════════════════════
 *  WAR AND PEACE — "winter-plain"
 *  The widest view. Snowfields to a pale horizon; Moscow's domes on its rim,
 *  catching the last light; a column of soldiers so small it reads as a
 *  line of ink, crossing the plain. The estate, birches, a small comet.
 * ═════════════════════════════════════════════════════════════════════════ */

function winterPlain(ctx: SceneContext): ComposedScene {
  const { rng, uid } = ctx;
  const HZ = 500;
  const bank: Pt[] = [[-20, 724], [140, 712], [300, 704], [460, 714], [640, 732], [820, 722], [1000, 706], [1220, 710]];

  const sky = (
    <g>
      <Stars rng={rng} count={n(150, ctx)} x0={0} x1={W} y0={20} y1={HZ - 60} />
      <Luminary kind="comet" x={300} y={150} r={14} uid={uid} rng={rng} />
      <AirLines rng={rng} y0={HZ - 140} y1={HZ - 6} n={n(10, ctx)} />
      {/* a pale band of light along the horizon */}
      <rect x="0" y={HZ - 40} width={W} height="40" fill={`url(#${uid}-glow)`} opacity="0.9" />
      {!ctx.vignette && <CelestialMark kind="armillary" x={1090} y={110} s={0.8} />}
    </g>
  );

  const far = (
    <g>
      <Ink c="s0" d={seg(-10, HZ, W + 10, HZ)} />
      {/* the city on the rim of the world */}
      {[[760, 0.6], [806, 0.8], [852, 0.56], [892, 0.46], [716, 0.42]].map(([x, s2], i) => <DomedChurch key={i} x={x} y={HZ} s={s2} rng={rng} />)}
      {Array.from({ length: 30 }, (_, i) => {
        const x = 640 + i * 12 + rng.range(-3, 3), h = rng.range(3, 12);
        return <Ink key={"r" + i} c="s0 occlude" d={rect(x, HZ - h, rng.range(5, 10), h)} />;
      })}
      <circle cx={800} cy={HZ - 14} r={70} fill={`url(#${uid}-halo)`} />
      <Smoke x={890} y={HZ - 10} s={1.6} rng={rng} />
      {/* faint distant woods */}
      {Array.from({ length: 40 }, (_, i) => {
        const x = 40 + i * 14 + rng.range(-4, 4);
        return <Ink key={"wd" + i} c="sf" d={seg(x, HZ, x, HZ - rng.range(4, 9))} />;
      })}
    </g>
  );

  // a column of troops, microscopic, receding towards the city
  const column: ReactNode[] = [];
  const path = bezierPts([120, 690], [420, 620], [520, 540], [700, HZ + 4], 160);
  path.forEach(([x, y], i) => {
    if (i % 2) return;
    const t = (y - HZ) / (690 - HZ), h = 2 + t * 6;
    column.push(<Ink key={"m" + i} c="s0" d={seg(x, y, x, y - h) + (i % 18 === 0 ? seg(x - h * 0.4, y - h * 0.8, x + h * 0.5, y - h * 0.8) : "")} />);
  });
  for (let k = 0; k < 4; k++) {
    const [x, y] = path[30 + k * 22];
    column.push(<Ink key={"rider" + k} c="s0" d={`M${r1(x + 6)} ${r1(y)}l2 -4h6l2 4M${r1(x + 9)} ${r1(y - 4)}v-4`} />);
  }

  const mid = (
    <g>
      {/* a belt of woods across the middle distance */}
      {Array.from({ length: 70 }, (_, i) => {
        const x = 380 + i * 11 + rng.range(-4, 4), y = 556 + Math.sin(i * 0.3) * 4;
        return <g key={"belt" + i} opacity="0.55"><Tree kind="bare" x={x} y={y} s={rng.range(0.26, 0.4)} rng={rng} /></g>;
      })}
      {/* fields: long furrows under snow, converging */}
      {Array.from({ length: n(26, ctx) }, (_, i) => {
        const t = i / 26, y = HZ + 8 + Math.pow(t, 1.6) * 200;
        return <Ink key={"f" + i} c={t < 0.3 ? "sf" : "s0"} d={seg(rng.range(-20, 200), y, rng.range(900, 1220), y + rng.range(-2, 2))} />;
      })}
      {/* the estate at the edge of its park */}
      <Building kind="manor" x={250} y={572} s={0.4} rng={rng} lit={0.25} smoke />
      {Array.from({ length: 12 }, (_, i) => <Tree key={"av" + i} kind="poplar" x={150 + i * 18 + (i > 5 ? 40 : 0)} y={582 + (i % 2)} s={0.32} rng={rng} />)}
      {column}
      <Ink c="s0" d={smooth(path.filter((_, i) => i % 10 === 0).map(([x, y]) => [x + 14, y + 6]))} />
    </g>
  );

  const near = (
    <g>
      <path className="occlude" d={line(bank) + `L1220 ${H + 20}L-20 ${H + 20}Z`} />
      <Ink c="s1" d={smooth(bank)} />
      {Array.from({ length: n(70, ctx) }, (_, i) => {
        const x = rng.range(0, W), y = yAt(bank, x) + rng.range(6, 60);
        return <Ink key={"s" + i} c="s0" d={seg(x, y, x + rng.range(10, 30), y + rng.range(-1, 1))} />;
      })}
      {/* birches at the right edge, bare and white */}
      {[[1040, 712, 2.6], [1100, 716, 3.2], [1160, 704, 2.2], [980, 712, 1.8]].map(([x, y, s2], i) => <Tree key={"b" + i} kind="bare" x={x} y={y} s={s2} rng={rng} />)}
      {[[1043], [1104]].map(([x], i) => <Ink key={"bm" + i} c="s0" d={seg(x - 2, 690, x + 1, 690) + seg(x - 2, 670, x + 2, 670) + seg(x - 1, 650, x + 2, 650)} />)}
      {/* a road with ruts, and one rider far smaller than the trees */}
      <Ink c="s0" d={smooth([[120, H + 10], [180, 740], [260, 716]])} />
      <Ink c="s0" d={smooth([[170, H + 10], [214, 744], [280, 718]])} />
    </g>
  );

  return {
    layers: [
      { delay: 0, node: sky },
      { delay: 0.5, node: far, depth: "far" },
      { delay: 1, node: mid, depth: "mid" },
      { delay: 1.6, node: near, depth: "near" },
    ],
    horizon: HZ,
    medallion: { cx: 640, cy: 470 },
  };
}

/* ═════════════════════════════════════════════════════════════════════════
 *  THE GRASS IS SINGING — "veld-farmhouse"
 *  An enormous horizon and almost nothing on it. A small tin-roofed house,
 *  fenced in. The rim of a sun sinking at the edge of the world. Heat is
 *  drawn as line: shimmer crowding the horizon, cracks in the ground.
 * ═════════════════════════════════════════════════════════════════════════ */

function veldFarmhouse(ctx: SceneContext): ComposedScene {
  const { rng, uid } = ctx;
  const HZ = 520;
  const HX = 690, HY = 566;

  const sky = (
    <g>
      <Stars rng={rng} count={n(90, ctx)} x0={0} x1={W} y0={20} y1={300} />
      {/* the sun's upper rim at the horizon, with long rays */}
      <clipPath id={`${uid}-above`}><rect x="0" y="0" width={W} height={HZ} /></clipPath>
      <circle cx={260} cy={HZ} r={130} fill={`url(#${uid}-halo)`} opacity="0.7" clipPath={`url(#${uid}-above)`} />
      <Ink c="s1" d={arc(260, HZ + 30, 56, Math.PI * 1.13, Math.PI * 1.87)} />
      <Ink c="s0" d={arc(260, HZ + 30, 46, Math.PI * 1.08, Math.PI * 1.92)} />
      <Ink c="s0" d={Array.from({ length: 23 }, (_, i) => {
        const a = Math.PI * 1.08 + (i / 22) * Math.PI * 0.84, l = i % 2 ? 26 : 60;
        return seg(260 + Math.cos(a) * 64, HZ + 30 + Math.sin(a) * 64, 260 + Math.cos(a) * (64 + l), HZ + 30 + Math.sin(a) * (64 + l));
      }).join("")} />
      {/* heat: shimmering lines crowding down onto the horizon */}
      <Ink c="sf" d={Array.from({ length: n(26, ctx) }, (_, k) => {
        const t = k / 26, y = HZ - 6 - Math.pow(1 - t, 2) * 170;
        let d = `M${r1(rng.range(-20, 80))} ${r1(y)}`;
        for (let x = 0; x < W + 40; x += 30) d += `q15 ${t > 0.6 ? 1.6 : 0.8} 30 0`;
        return d;
      }).join("")} />
      {!ctx.vignette && <CelestialMark kind="eye" x={1090} y={100} s={0.8} />}
    </g>
  );

  const far = (
    <g>
      <Ink c="s1" d={seg(-10, HZ, W + 10, HZ)} />
      {/* a low kopje far off, and specks of thorn trees on the rim */}
      <Ink c="s1 occlude" d={smooth([[900, HZ], [940, HZ - 18], [990, HZ - 26], [1040, HZ - 14], [1080, HZ]]) + "Z"} />
      <Rocks rng={rng} x={990} y={HZ} n={4} s={0.5} />
      {[540, 610, 1130, 820].map((x, i) => <Acacia key={i} x={x} y={HZ + 1} s={0.35} rng={rng} />)}
    </g>
  );

  const mid = (
    <g>
      {/* the farm: house, water tank, and a fence that closes it in */}
      <TinHouse x={HX} y={HY} s={1} rng={rng} />
      <rect x={HX + 18.6} y={HY - 12.4} width="5.8" height="6.8" className="fill-soft" />
      <circle cx={HX + 21.5} cy={HY - 9} r={14} fill={`url(#${uid}-halo)`} />
      {Array.from({ length: 30 }, (_, i) => {
        const a = (i / 30) * Math.PI * 2, x = HX + 20 + Math.cos(a) * 150, y = HY - 4 + Math.sin(a) * 26;
        if (y < HY - 12 && Math.abs(x - HX - 10) < 70) return null; // behind the house
        const h = 6 + (y - (HY - 30)) * 0.12;
        return <Ink key={"post" + i} c="s0" d={seg(x, y, x, y - h)} />;
      })}
      <Ink c="s0" d={ellipse(HX + 20, HY - 9, 150, 26)} />
      <Acacia x={HX - 120} y={HY - 6} s={1.1} rng={rng} />
      {/* the straight track, the only line out */}
      <Ink c="s0" d={line([[HX - 10, HY + 4], [470, H + 10]])} />
      <Ink c="s0" d={line([[HX + 6, HY + 4], [560, H + 10]])} />
    </g>
  );

  const near = (
    <g>
      {/* cracked, dry ground */}
      <Ink c="s0" d={Array.from({ length: n(70, ctx) }, () => {
        const x = rng.range(0, W), y = rng.range(640, 780);
        if (x > 440 && x < 600) return "";
        const pts: Pt[] = [[x, y]];
        for (let k = 0; k < 3; k++) { const [px, py] = pts[pts.length - 1]; pts.push([px + rng.range(-26, 26), py + rng.range(-6, 10)]); }
        return line(pts);
      }).join("")} />
      <Grass rng={rng} x0={0} x1={W} yOf={() => 600} n={n(30, ctx)} />
      {/* an anthill, a dead stump */}
      <Ink c="s1 occlude" d={smooth([[966, 742], [976, 728], [984, 714], [992, 708], [1000, 714], [1008, 728], [1018, 742]]) + "Z"} />
      <Ink c="s0" d={seg(982, 732, 1004, 730) + seg(986, 722, 999, 721) + seg(1001, 716, 1006, 738)} />
      <Tree kind="bare" x={120} y={790} s={1.6} rng={rng} />
    </g>
  );

  return {
    layers: [
      { delay: 0, node: sky },
      { delay: 0.5, node: far, depth: "far" },
      { delay: 1, node: mid, depth: "mid" },
      { delay: 1.5, node: near, depth: "near" },
    ],
    horizon: HZ,
    medallion: { cx: 500, cy: 470 },
  };
}

export const SCENES_II = {
  "alpine-enclosure": alpineEnclosure,
  "crossing-threads": crossingThreads,
  "carpathian-pass": carpathianPass,
  "winter-plain": winterPlain,
  "veld-farmhouse": veldFarmhouse,
} as const;

