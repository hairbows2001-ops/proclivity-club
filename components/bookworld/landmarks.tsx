import type { CSSProperties, ReactNode } from "react";
import type { Rng } from "@/lib/rng";
import { r1 } from "@/lib/rng";
import type { Landmark } from "@/lib/types";
import { Ink } from "./Ink";
import { Win } from "./architecture";
import { scallopCrown } from "./nature";
import { arc, circle, ellipse, line, poly, rect, seg, smooth, type Pt } from "./geometry";

export interface LandmarkProps {
  x: number;
  y: number;
  s: number;
  rng: Rng;
  uid: string;
}

/* ── Lighthouse ────────────────────────────────────────────────────────── */

export function Lighthouse({ x, y, s, rng, uid }: LandmarkProps) {
  const H = 200 * s, bw = 17 * s, tw = 10 * s;
  const at = (t: number) => ({ y: y - H * t, w: bw + (tw - bw) * t });
  const els: ReactNode[] = [];
  const lanternY = y - H - 30 * s;
  // the beam, faintly sweeping
  els.push(
    <g key="beam" className="beam">
      <path d={poly([[x, lanternY], [x - 520 * s, lanternY - 70 * s], [x - 520 * s, lanternY + 40 * s]])} fill={`url(#${uid}-beamL)`} />
      <path d={poly([[x, lanternY], [x + 420 * s, lanternY - 50 * s], [x + 420 * s, lanternY + 30 * s]])} fill={`url(#${uid}-beamR)`} />
    </g>,
  );
  // rocks
  for (let i = 0; i < 7; i++) {
    const rx = x + rng.range(-60, 60) * s, rw = rng.range(14, 34) * s, rh = rng.range(6, 16) * s;
    els.push(<Ink key={"rock" + i} c="s1 occlude" d={smooth([[rx - rw, y + 6 * s], [rx - rw * 0.6, y + 6 * s - rh], [rx + rw * 0.2, y + 6 * s - rh * 1.2], [rx + rw, y + 6 * s]])} />);
    for (let k = 0; k < 3; k++) els.push(<Ink key={`rh${i}${k}`} c="s0" d={seg(rx + rw * (0.2 + k * 0.2), y + 4 * s - rh * 0.6, rx + rw * (0.35 + k * 0.2), y + 4 * s)} />);
  }
  // tower
  els.push(<Ink key="tower" c="s2 occlude" d={poly([[x - bw, y], [x - tw, y - H], [x + tw, y - H], [x + bw, y]])} />);
  // painted bands, hatched
  [[0.12, 0.3], [0.48, 0.66]].forEach(([a, b], i) => {
    const A = at(a), B = at(b);
    els.push(<Ink key={"bl" + i} c="s0" d={seg(x - A.w, A.y, x + A.w, A.y)} />);
    els.push(<Ink key={"bu" + i} c="s0" d={seg(x - B.w, B.y, x + B.w, B.y)} />);
    for (let t = a; t < b; t += 0.012) {
      const P = at(t), Q = at(t + 0.03);
      els.push(<Ink key={`bh${i}${t}`} c="s0" d={seg(x - P.w, P.y, x + Q.w * 0.9, Q.y)} />);
    }
  });
  // shading on the dark side
  for (let t = 0.02; t < 0.98; t += 0.03) {
    const P = at(t);
    els.push(<Ink key={"sh" + t} c="s0" d={seg(x + P.w * 0.55, P.y, x + P.w * 0.95, P.y)} />);
  }
  // little windows
  [0.38, 0.76].forEach((t, i) => els.push(<Win key={"tw" + i} x={x - 2.5 * s} y={at(t).y} w={5 * s} h={8 * s} rng={rng} bars={0} litChance={0.8} />));
  els.push(<Win key="door" x={x - 4 * s} y={y - 13 * s} w={8 * s} h={13 * s} rng={rng} arched bars={0} litChance={0.2} />);
  // gallery
  els.push(<Ink key="gal" c="s1 occlude" d={rect(x - tw - 7 * s, y - H - 4 * s, (tw + 7 * s) * 2, 4 * s)} />);
  for (let k = 0; k <= 8; k++) {
    const gx = x - tw - 6 * s + k * ((tw + 6 * s) * 2) / 8;
    els.push(<Ink key={"rl" + k} c="s0" d={seg(gx, y - H - 4 * s, gx, y - H - 10 * s)} />);
  }
  els.push(<Ink key="rail" c="s0" d={seg(x - tw - 6 * s, y - H - 10 * s, x + tw + 6 * s, y - H - 10 * s)} />);
  // lantern
  const lw = 8 * s;
  els.push(<rect key="glow" x={x - lw} y={y - H - 26 * s} width={lw * 2} height={20 * s} className="fill-soft window-lit" style={{ "--t": "6s" } as CSSProperties} />);
  els.push(<circle key="halo" cx={x} cy={lanternY + 14 * s} r={34 * s} fill={`url(#${uid}-halo)`} />);
  els.push(<Ink key="lan" c="s1" d={rect(x - lw, y - H - 26 * s, lw * 2, 20 * s)} />);
  els.push(<Ink key="lb1" c="s0" d={seg(x - lw / 3, y - H - 26 * s, x - lw / 3, y - H - 6 * s)} />);
  els.push(<Ink key="lb2" c="s0" d={seg(x + lw / 3, y - H - 26 * s, x + lw / 3, y - H - 6 * s)} />);
  els.push(<Ink key="dome" c="s1 occlude" d={`M${r1(x - lw - 2 * s)} ${r1(y - H - 26 * s)}A${r1(lw + 2 * s)} ${r1(lw)} 0 0 1 ${r1(x + lw + 2 * s)} ${r1(y - H - 26 * s)}Z`} />);
  els.push(<Ink key="fin" c="s1" d={seg(x, y - H - 26 * s - lw, x, y - H - 26 * s - lw - 10 * s)} />);
  els.push(<circle key="ball" cx={x} cy={y - H - 26 * s - lw - 11 * s} r={1.8 * s} className="fill-ink" />);
  return <g>{els}</g>;
}

/* ── Clock tower ───────────────────────────────────────────────────────── */

export function ClockTower({ x, y, s, rng }: LandmarkProps) {
  const sw = 22 * s;
  const shaftTop = y - 250 * s;
  const els: ReactNode[] = [];
  els.push(<Ink key="shaft" c="s2 occlude" d={rect(x - sw, shaftTop, sw * 2, 250 * s)} />);
  [-0.5, 0, 0.5].forEach((k, i) => els.push(<Ink key={"pv" + i} c="s0" d={seg(x + k * sw * 1.4, shaftTop + 4 * s, x + k * sw * 1.4, y - 4 * s)} />));
  for (let by = shaftTop + 28 * s; by < y - 10 * s; by += 30 * s) {
    els.push(<Ink key={"band" + by} c="s0" d={seg(x - sw, by, x + sw, by)} />);
    [-0.75, -0.25, 0.25, 0.75].forEach((k) => els.push(<Win key={`lw${by}${k}`} x={x + k * sw - 2.5 * s} y={by - 21 * s} w={5 * s} h={15 * s} rng={rng} arched bars={0} litChance={0.15} />));
  }
  // dark-side shading
  for (let hy = shaftTop + 2 * s; hy < y; hy += 3.2 * s) els.push(<Ink key={"sh" + hy} c="s0" d={seg(x + sw * 0.55, hy, x + sw, hy)} />);
  // clock stage
  const cw = 28 * s, cTop = shaftTop - 56 * s;
  els.push(<Ink key="stage" c="s2 occlude" d={rect(x - cw, cTop, cw * 2, 56 * s)} />);
  const cx = x, cy = cTop + 28 * s, cr = 20 * s;
  els.push(<circle key="face" cx={cx} cy={cy} r={cr} className="fill-soft window-lit" style={{ "--t": "12s" } as CSSProperties} opacity="0.4" />);
  els.push(<Ink key="ring" c="s1" d={circle(cx, cy, cr)} />);
  els.push(<Ink key="ring2" c="s0" d={circle(cx, cy, cr * 0.8)} />);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    els.push(<Ink key={"tick" + i} c="s0" d={seg(cx + Math.cos(a) * cr * 0.8, cy + Math.sin(a) * cr * 0.8, cx + Math.cos(a) * cr * 0.95, cy + Math.sin(a) * cr * 0.95)} />);
  }
  const origin = { transformOrigin: `${r1(cx)}px ${r1(cy)}px` };
  els.push(<g key="hour" className="clock-hand" style={{ ...origin, "--t": "2400s" } as CSSProperties}><Ink c="s1" d={seg(cx, cy, cx + cr * 0.4, cy - cr * 0.3)} /></g>);
  els.push(<g key="min" className="clock-hand" style={{ ...origin, "--t": "200s" } as CSSProperties}><Ink c="s1" d={seg(cx, cy, cx - cr * 0.1, cy - cr * 0.7)} /></g>);
  // belfry
  const bTop = cTop - 34 * s;
  els.push(<Ink key="bel" c="s1 occlude" d={rect(x - cw + 4 * s, bTop, (cw - 4 * s) * 2, 34 * s)} />);
  [-1, 0, 1].forEach((k) => els.push(<Win key={"bw" + k} x={x + k * 14 * s - 4 * s} y={bTop + 6 * s} w={8 * s} h={24 * s} rng={rng} arched bars={1} litChance={0.1} />));
  // spire with pinnacles
  const tip = bTop - 110 * s;
  els.push(<Ink key="spire" c="s2 occlude" d={poly([[x - cw + 2 * s, bTop], [x, tip], [x + cw - 2 * s, bTop]])} />);
  for (let k = 1; k < 9; k++) {
    const t = k / 9;
    const yy = bTop + (tip - bTop) * t, hw = (cw - 2 * s) * (1 - t);
    els.push(<Ink key={"sp" + k} c="s0" d={seg(x - hw, yy, x + hw, yy)} />);
  }
  els.push(<Ink key="spc" c="s0" d={seg(x, bTop, x, tip)} />);
  [-1, 1].forEach((k) => {
    const px = x + k * (cw + 1 * s);
    els.push(<Ink key={"pin" + k} c="s1 occlude" d={poly([[px - 4 * s, cTop], [px, cTop - 30 * s], [px + 4 * s, cTop]])} />);
    els.push(<Ink key={"pinb" + k} c="s1 occlude" d={poly([[px - 3 * s, bTop], [px, bTop - 22 * s], [px + 3 * s, bTop]])} />);
  });
  els.push(<Ink key="fin" c="s1" d={seg(x, tip, x, tip - 14 * s)} />);
  els.push(<Ink key="cross" c="s1" d={seg(x - 4 * s, tip - 10 * s, x + 4 * s, tip - 10 * s)} />);
  return <g>{els}</g>;
}

/* ── The great oak ─────────────────────────────────────────────────────── */

export function Oak({ x, y, s, rng }: LandmarkProps) {
  const els: ReactNode[] = [];
  const trunkTop = y - 95 * s;
  // roots and trunk
  els.push(<Ink key="trunk" c="s2 occlude" d={`M${r1(x - 30 * s)} ${r1(y)}C${r1(x - 12 * s)} ${r1(y - 6 * s)} ${r1(x - 7 * s)} ${r1(y - 30 * s)} ${r1(x - 9 * s)} ${r1(y - 60 * s)}C${r1(x - 11 * s)} ${r1(y - 80 * s)} ${r1(x - 16 * s)} ${r1(trunkTop + 6 * s)} ${r1(x - 20 * s)} ${r1(trunkTop)}L${r1(x + 18 * s)} ${r1(trunkTop)}C${r1(x + 13 * s)} ${r1(trunkTop + 8 * s)} ${r1(x + 9 * s)} ${r1(y - 70 * s)} ${r1(x + 9 * s)} ${r1(y - 50 * s)}C${r1(x + 9 * s)} ${r1(y - 26 * s)} ${r1(x + 14 * s)} ${r1(y - 6 * s)} ${r1(x + 34 * s)} ${r1(y)}Z`} />);
  for (let k = 0; k < 7; k++) {
    const bx = x - 6 * s + k * 2.2 * s;
    els.push(<Ink key={"bark" + k} c="s0" d={`M${r1(bx + (k - 3) * 1.6 * s)} ${r1(trunkTop + 6 * s)}Q${r1(bx + rng.range(-3, 3) * s)} ${r1(y - 50 * s)} ${r1(bx + (k - 3) * 3 * s)} ${r1(y - 2 * s)}`} />);
  }
  // branches
  const tips: Pt[] = [];
  const branch = (bx: number, by: number, ang: number, len: number, w: number, depth: number) => {
    const ex = bx + Math.cos(ang) * len, ey = by + Math.sin(ang) * len;
    const mx = (bx + ex) / 2 + rng.range(-10, 10) * s, my = (by + ey) / 2 + rng.range(-8, 4) * s;
    els.push(<Ink key={`br${els.length}`} c={depth > 2 ? "s2" : depth > 1 ? "s1" : "s0"} d={`M${r1(bx)} ${r1(by)}Q${r1(mx)} ${r1(my)} ${r1(ex)} ${r1(ey)}`} />);
    if (depth === 0) { tips.push([ex, ey]); return; }
    const n = depth > 2 ? 3 : 2;
    for (let i = 0; i < n; i++) branch(ex, ey, ang + rng.range(-0.75, 0.75), len * rng.range(0.6, 0.78), w * 0.7, depth - 1);
  };
  [-2.6, -1.95, -1.2, -0.55].forEach((a) => branch(x + Math.cos(a) * 6 * s, trunkTop + 6 * s, a + rng.range(-0.1, 0.1), 56 * s, 6 * s, 2));
  // foliage — a domed crown of overlapping scalloped clusters, drawn top to bottom
  // the crown leans and spreads unevenly, heavier on one side, as old oaks do
  const crownX = x + rng.range(4, 16) * s, crownY = trunkTop - 60 * s;
  const lean = rng.range(0.2, 0.7);
  const clusters = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2 + rng.range(-0.35, 0.35);
    const d = i < 15 ? rng.range(0.7, 1.05) : rng.range(0.1, 0.6);
    const reach = 1 + 0.28 * Math.cos(a - lean); // longer limbs on the leaning side
    const lift = Math.sin(a) < 0 ? rng.range(0.85, 1.15) : 1;
    return { x: crownX + Math.cos(a) * 108 * s * d * reach, y: crownY + Math.sin(a) * 64 * s * d * lift, r: rng.range(22, 38) * s };
  }).filter((c) => c.y < trunkTop + 6 * s);
  // one limb reaching out low, carrying its own small cluster
  clusters.push({ x: crownX + 150 * s, y: trunkTop - 4 * s, r: 20 * s });
  els.push(<Ink key="limb" c="s1" d={`M${r1(x + 8 * s)} ${r1(trunkTop + 4 * s)}Q${r1(x + 80 * s)} ${r1(trunkTop - 18 * s)} ${r1(crownX + 140 * s)} ${r1(trunkTop - 4 * s)}`} />);
  clusters.sort((p, q) => p.y - q.y);
  clusters.forEach((c, i) => els.push(<g key={"leaf" + i}>{scallopCrown(c.x, c.y, c.r, rng, s)}</g>));
  void tips;
  return <g>{els}</g>;
}

/* ── Stone bridge ──────────────────────────────────────────────────────── */

export function Bridge({ x, y, s }: LandmarkProps) {
  const W = 380 * s, deck = 56 * s;
  const x0 = x - W / 2, x1 = x + W / 2;
  const n = 4, pier = 16 * s;
  const span = (W - pier * (n + 1)) / n;
  let d = `M${r1(x0)} ${r1(y - deck)}L${r1(x1)} ${r1(y - deck)}L${r1(x1)} ${r1(y)}`;
  const arches: { a: number; b: number }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const a = x0 + pier + i * (span + pier), b = a + span;
    arches.push({ a, b });
    d += `L${r1(b)} ${r1(y)}A${r1(span / 2)} ${r1(Math.min(span / 2, deck - 12 * s))} 0 0 0 ${r1(a)} ${r1(y)}`;
  }
  d += `L${r1(x0)} ${r1(y)}Z`;
  const els: ReactNode[] = [<Ink key="body" c="s2 occlude" d={d} />];
  els.push(<Ink key="par" c="s1" d={seg(x0 - 6 * s, y - deck - 8 * s, x1 + 6 * s, y - deck - 8 * s)} />);
  els.push(<Ink key="par2" c="s0" d={seg(x0 - 6 * s, y - deck - 8 * s, x0 - 6 * s, y - deck)} />);
  els.push(<Ink key="string" c="s0" d={seg(x0, y - deck + 5 * s, x1, y - deck + 5 * s)} />);
  for (let bx = x0; bx <= x1; bx += 9 * s) els.push(<Ink key={"bal" + bx} c="s0" d={seg(bx, y - deck - 8 * s, bx, y - deck)} />);
  arches.forEach(({ a, b }, i) => {
    const cx = (a + b) / 2, rx = span / 2, ry = Math.min(span / 2, deck - 12 * s);
    for (let k = 0; k <= 12; k++) {
      const t = Math.PI + (k / 12) * Math.PI;
      els.push(<Ink key={`v${i}${k}`} c="s0" d={seg(cx + Math.cos(t) * rx, y + Math.sin(t) * ry, cx + Math.cos(t) * (rx + 7 * s), y + Math.sin(t) * (ry + 7 * s))} />);
    }
    // reflection
    els.push(<Ink key={"ref" + i} c="sf" d={`M${r1(a)} ${r1(y + 2 * s)}A${r1(rx)} ${r1(ry * 0.7)} 0 0 0 ${r1(b)} ${r1(y + 2 * s)}`} />);
    // cutwater
    els.push(<Ink key={"cw" + i} c="s0" d={poly([[a - pier, y], [a - pier / 2, y - 14 * s], [a, y]])} />);
  });
  return <g>{els}</g>;
}

/* ── Classical statue on a plinth ──────────────────────────────────────── */

export function Statue({ x, y, s }: LandmarkProps) {
  const els: ReactNode[] = [];
  els.push(<Ink key="b1" c="s1 occlude" d={rect(x - 30 * s, y - 10 * s, 60 * s, 10 * s)} />);
  els.push(<Ink key="b2" c="s1 occlude" d={rect(x - 22 * s, y - 78 * s, 44 * s, 68 * s)} />);
  els.push(<Ink key="b3" c="s1 occlude" d={rect(x - 26 * s, y - 86 * s, 52 * s, 8 * s)} />);
  els.push(<Ink key="panel" c="s0" d={rect(x - 14 * s, y - 66 * s, 28 * s, 44 * s)} />);
  for (let hy = y - 76 * s; hy < y - 12 * s; hy += 3 * s) els.push(<Ink key={"h" + hy} c="s0" d={seg(x + 12 * s, hy, x + 22 * s, hy)} />);
  const f = (px: number, py: number): Pt => [x + px * s, y - 86 * s - py * s];
  const body = smooth([f(-8, 0), f(-10, 30), f(-7, 62), f(-12, 84), f(-8, 98), f(-3, 104), f(4, 104), f(9, 96), f(11, 82), f(18, 66), f(8, 60), f(9, 30), f(10, 0)]);
  els.push(<Ink key="fig" c="s1 occlude" d={body + "Z"} />);
  els.push(<Ink key="head" c="s1 occlude" d={circle(x + 0.5 * s, y - 86 * s - 112 * s, 7 * s)} />);
  els.push(<Ink key="arm" c="s1" d={smooth([f(9, 92), f(20, 104), f(26, 122), f(24, 130)])} />);
  for (let k = 0; k < 7; k++) els.push(<Ink key={"drape" + k} c="s0" d={smooth([f(-6 + k * 2, 4), f(-4 + k * 2.2, 30), f(-2 + k * 1.5, 58)])} />);
  return <g>{els}</g>;
}

/* ── Pierced abstract sculpture (after Hepworth) ───────────────────────── */

export function Sculpture({ x, y, s, uid }: LandmarkProps) {
  const els: ReactNode[] = [];
  const f = (px: number, py: number): Pt => [x + px * s, y - 14 * s - py * s];
  els.push(<Ink key="plinth" c="s1 occlude" d={rect(x - 40 * s, y - 14 * s, 80 * s, 14 * s)} />);
  const outline = smooth([f(-30, 0), f(-40, 50), f(-36, 112), f(-24, 160), f(-14, 178), f(10, 182), f(22, 170), f(30, 130), f(40, 66), f(30, 0)], 0.55) + "Z";
  els.push(<Ink key="stone" c="s2 occlude" d={outline} />);
  const hx = x + 2 * s, hy = y - 14 * s - 104 * s;
  els.push(<circle key="void" cx={hx} cy={hy} r={20 * s} fill={`url(#${uid}-halo)`} />);
  els.push(<Ink key="hole" c="s1" d={ellipse(hx, hy, 15 * s, 21 * s)} />);
  els.push(<Ink key="hole2" c="s0" d={ellipse(hx + 2.5 * s, hy + 1.5 * s, 11 * s, 17 * s)} />);
  // strings across the void
  for (let k = -3; k <= 3; k++) els.push(<Ink key={"str" + k} c="s0" d={seg(hx + k * 3.4 * s, hy - 19 * s, hx + k * 1.2 * s, hy + 19 * s)} />);
  // a second, smaller piercing
  els.push(<Ink key="hole3" c="s0" d={circle(x - 12 * s, y - 14 * s - 40 * s, 6 * s)} />);
  // tooling marks on the shadowed side
  for (let k = 0; k < 34; k++) {
    const t = k / 34;
    const edge = 30 + Math.sin(t * Math.PI) * 8 - t * 12;
    els.push(<Ink key={"tm" + k} c="s0" d={seg(x + (edge - 14) * s, y - 18 * s - t * 160 * s, x + edge * s, y - 20 * s - t * 160 * s)} />);
  }
  return <g>{els}</g>;
}

/* ── Obelisk ───────────────────────────────────────────────────────────── */

export function Obelisk({ x, y, s }: LandmarkProps) {
  const els: ReactNode[] = [];
  els.push(<Ink key="s1" c="s1 occlude" d={rect(x - 30 * s, y - 8 * s, 60 * s, 8 * s)} />);
  els.push(<Ink key="s2" c="s1 occlude" d={rect(x - 22 * s, y - 22 * s, 44 * s, 14 * s)} />);
  els.push(<Ink key="shaft" c="s2 occlude" d={poly([[x - 13 * s, y - 22 * s], [x - 8 * s, y - 230 * s], [x, y - 252 * s], [x + 8 * s, y - 230 * s], [x + 13 * s, y - 22 * s]])} />);
  for (let k = 0; k < 14; k++) {
    const yy = y - 40 * s - k * 13 * s;
    els.push(<Ink key={"g" + k} c="s0" d={seg(x - 3 * s, yy, x + 3 * s, yy)} />);
  }
  for (let hy = y - 226 * s; hy < y - 24 * s; hy += 3 * s) els.push(<Ink key={"h" + hy} c="s0" d={seg(x + 5 * s, hy, x + 11 * s, hy)} />);
  return <g>{els}</g>;
}

/* ── Campanile and chapel ──────────────────────────────────────────────── */

export function Church({ x, y, s, rng }: LandmarkProps) {
  const els: ReactNode[] = [];
  const tw = 16 * s, th = 180 * s;
  // nave
  const nx = x + 24 * s;
  els.push(<Ink key="nave" c="s1 occlude" d={poly([[nx, y], [nx, y - 50 * s], [nx + 40 * s, y - 74 * s], [nx + 80 * s, y - 50 * s], [nx + 80 * s, y]])} />);
  els.push(<Ink key="rose" c="s0" d={circle(nx + 40 * s, y - 52 * s, 8 * s)} />);
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    els.push(<Ink key={"rs" + k} c="s0" d={seg(nx + 40 * s, y - 52 * s, nx + 40 * s + Math.cos(a) * 8 * s, y - 52 * s + Math.sin(a) * 8 * s)} />);
  }
  els.push(<Win key="door" x={nx + 33 * s} y={y - 26 * s} w={14 * s} h={26 * s} rng={rng} arched bars={1} litChance={0.6} />);
  // tower
  els.push(<Ink key="tower" c="s2 occlude" d={rect(x - tw, y - th, tw * 2, th)} />);
  for (let by = y - th + 40 * s; by < y; by += 34 * s) els.push(<Ink key={"b" + by} c="s0" d={seg(x - tw, by, x + tw, by)} />);
  for (let hy = y - th; hy < y; hy += 3.2 * s) els.push(<Ink key={"h" + hy} c="s0" d={seg(x + tw * 0.5, hy, x + tw, hy)} />);
  [-1, 1].forEach((k) => els.push(<Win key={"bw" + k} x={x + k * 7 * s - 4 * s} y={y - th + 8 * s} w={8 * s} h={22 * s} rng={rng} arched bars={0} litChance={0.15} />));
  [0.45, 0.7].forEach((t, i) => els.push(<Win key={"tw" + i} x={x - 2.5 * s} y={y - th * t} w={5 * s} h={10 * s} rng={rng} arched bars={0} litChance={0.4} />));
  els.push(<Ink key="cap" c="s1 occlude" d={rect(x - tw - 3 * s, y - th - 5 * s, (tw + 3 * s) * 2, 5 * s)} />);
  els.push(<Ink key="roof" c="s1 occlude" d={poly([[x - tw - 2 * s, y - th - 5 * s], [x, y - th - 34 * s], [x + tw + 2 * s, y - th - 5 * s]])} />);
  els.push(<Ink key="cross" c="s1" d={seg(x, y - th - 34 * s, x, y - th - 50 * s) + seg(x - 5 * s, y - th - 44 * s, x + 5 * s, y - th - 44 * s)} />);
  return <g>{els}</g>;
}

/* ── Observatory ───────────────────────────────────────────────────────── */

export function Observatory({ x, y, s, rng }: LandmarkProps) {
  const els: ReactNode[] = [];
  const W = 60 * s, H = 50 * s;
  els.push(<Ink key="tele" c="s1 occlude" d={poly([[x - 4 * s, y - H - 30 * s], [x + 56 * s, y - H - 92 * s], [x + 62 * s, y - H - 86 * s], [x + 4 * s, y - H - 24 * s]])} />);
  els.push(<Ink key="body" c="s1 occlude" d={rect(x - W, y - H, W * 2, H)} />);
  els.push(<Ink key="dome" c="s2 occlude" d={`${arc(x, y - H, W - 4 * s, Math.PI, 2 * Math.PI)}Z`} />);
  for (let k = 1; k < 6; k++) {
    const rx = (W - 4 * s) * (k / 6), ry = W - 4 * s;
    els.push(<Ink key={"rib" + k} c="s0" d={`M${r1(x - rx)} ${r1(y - H)}A${r1(rx)} ${r1(ry)} 0 0 1 ${r1(x + rx)} ${r1(y - H)}`} />);
  }
  els.push(<Ink key="slit" c="s1" d={rect(x - 4 * s, y - H - W + 6 * s, 8 * s, W - 8 * s)} />);
  for (let k = 0; k < 4; k++) els.push(<Win key={"w" + k} x={x - W + 10 * s + k * 28 * s} y={y - H + 14 * s} w={8 * s} h={18 * s} rng={rng} arched bars={1} />);
  els.push(<Ink key="line" c="s0" d={line([[x - W - 4 * s, y - H], [x + W + 4 * s, y - H]])} />);
  return <g>{els}</g>;
}

export function LandmarkShape({ kind, ...props }: LandmarkProps & { kind: Landmark }) {
  switch (kind) {
    case "lighthouse": return <Lighthouse {...props} />;
    case "clocktower": return <ClockTower {...props} />;
    case "oak": return <Oak {...props} />;
    case "bridge": return <Bridge {...props} />;
    case "statue": return <Statue {...props} />;
    case "sculpture": return <Sculpture {...props} />;
    case "obelisk": return <Obelisk {...props} />;
    case "church": return <Church {...props} />;
    case "observatory": return <Observatory {...props} />;
    default: return null;
  }
}
