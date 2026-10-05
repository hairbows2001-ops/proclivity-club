/**
 * Additional engraving primitives used by the art-directed scenes and the
 * homepage panorama: hill towns, temples, quays, steps, jetties, flowers,
 * frost, reflections, distant skylines and other small marks that reward
 * looking closely.
 */

import type { CSSProperties, ReactNode } from "react";
import type { Rng } from "@/lib/rng";
import { r1 } from "@/lib/rng";
import { Ink } from "./Ink";
import { Win, Smoke } from "./architecture";
import { circle, ellipse, line, poly, rect, seg, smooth, type Pt } from "./geometry";
import { sparkle } from "./sky";

/* ── A town climbing a hillside, houses overlapping ────────────────────── */

export function HillTown({ rng, x0, x1, yOf, rows = 5, s = 1, smoke = false, litChance = 0.3 }: {
  rng: Rng; x0: number; x1: number; yOf: (x: number) => number; rows?: number; s?: number; smoke?: boolean; litChance?: number;
}) {
  const els: ReactNode[] = [];
  // back rows first (higher up the hill, smaller), front rows last
  for (let row = rows - 1; row >= 0; row--) {
    const k = 1 - row * 0.1;
    let x = x0 + rng.range(-10, 20);
    while (x < x1) {
      const w = rng.range(22, 40) * s * k, h = rng.range(18, 36) * s * k;
      const ground = yOf(x + w / 2) - row * 16 * s + rng.range(-3, 3);
      const kind = rng.next();
      const L = x;
      if (kind < 0.45) {
        // pitched roof
        const ph = rng.range(8, 14) * s * k;
        els.push(<Ink key={`r${row}-${x}`} c="s1 occlude" d={poly([[L - 2 * s, ground - h], [L + w / 2, ground - h - ph], [L + w + 2 * s, ground - h]])} />);
        for (let t = 0.2; t < 0.9; t += 0.18) els.push(<Ink key={`rt${row}-${x}-${t}`} c="s0" d={seg(L + w * t, ground - h - ph * (1 - Math.abs(t - 0.5) * 2) + 1.5, L + w * t, ground - h - 1)} />);
      } else if (kind < 0.7) {
        // flat roof with a parapet
        els.push(<Ink key={`p${row}-${x}`} c="s0" d={seg(L - 1, ground - h - 3 * s, L + w + 1, ground - h - 3 * s)} />);
      }
      els.push(<Ink key={`b${row}-${x}`} c="s1 occlude" d={rect(L, ground - h, w, h)} />);
      const cols = Math.max(1, Math.floor(w / (11 * s)));
      for (let c = 0; c < cols; c++) {
        const wx = L + (c + 0.5) * (w / cols) - 2.5 * s * k;
        els.push(<Win key={`w${row}-${x}-${c}`} x={wx} y={ground - h + 5 * s * k} w={5 * s * k} h={7 * s * k} rng={rng} bars={1} litChance={litChance} />);
        if (h > 26 * s * k) els.push(<Win key={`v${row}-${x}-${c}`} x={wx} y={ground - h + 17 * s * k} w={5 * s * k} h={7 * s * k} rng={rng} bars={0} litChance={litChance * 0.7} />);
      }
      if (rng.chance(0.3)) {
        const cx = L + w * rng.range(0.2, 0.7);
        els.push(<Ink key={`c${row}-${x}`} c="s1 occlude" d={rect(cx, ground - h - 10 * s * k, 4 * s, 10 * s * k)} />);
        if (smoke && rng.chance(0.3)) els.push(<Smoke key={`sm${row}-${x}`} x={cx + 2 * s} y={ground - h - 11 * s * k} s={s * 0.6} rng={rng} />);
      }
      // shadow side
      for (let hy = ground - h + 2; hy < ground - 1; hy += 3 * s) els.push(<Ink key={`sh${row}-${x}-${hy}`} c="s0" d={seg(L + w - 3 * s * k, hy, L + w - 0.5, hy)} />);
      x += w + rng.range(-6, 6) * s;
    }
  }
  return <g>{els}</g>;
}

/* ── A classical temple on its platform ────────────────────────────────── */

export function Temple({ x, y, s = 1, columns = 8, ruined = false }: { x: number; y: number; s?: number; columns?: number; ruined?: boolean }) {
  const W = 200 * s, H = 70 * s;
  const L = x - W / 2;
  const els: ReactNode[] = [];
  for (let i = 0; i < 3; i++) els.push(<Ink key={"st" + i} c="s1 occlude" d={rect(L - (3 - i) * 5 * s, y - (i + 1) * 4 * s, W + (3 - i) * 10 * s, 4 * s)} />);
  const top = y - 12 * s - H;
  const step = W / (columns - 1);
  for (let i = 0; i < columns; i++) {
    const cx = L + i * step;
    const broken = ruined && (i === 2 || i === 5);
    const ch = broken ? H * (i === 2 ? 0.55 : 0.75) : H;
    els.push(<Ink key={"c" + i} c="s1 occlude" d={rect(cx - 4 * s, y - 12 * s - ch, 8 * s, ch)} />);
    els.push(<Ink key={"f" + i} c="s0" d={seg(cx - 1.4 * s, y - 13 * s - ch + 3 * s, cx - 1.4 * s, y - 13 * s) + seg(cx + 1.4 * s, y - 13 * s - ch + 3 * s, cx + 1.4 * s, y - 13 * s)} />);
    if (!broken) els.push(<Ink key={"cap" + i} c="s0" d={rect(cx - 6 * s, top - 3 * s, 12 * s, 3 * s)} />);
  }
  if (!ruined) {
    els.push(<Ink key="arch" c="s1 occlude" d={rect(L - 8 * s, top - 14 * s, W + 16 * s, 11 * s)} />);
    for (let tx = L - 4 * s; tx < L + W + 6 * s; tx += 7 * s) els.push(<Ink key={"tri" + tx} c="s0" d={seg(tx, top - 12 * s, tx, top - 6 * s)} />);
    els.push(<Ink key="ped" c="s1 occlude" d={poly([[L - 10 * s, top - 14 * s], [x, top - 40 * s], [L + W + 10 * s, top - 14 * s]])} />);
    els.push(<Ink key="ped2" c="s0" d={poly([[L + 2 * s, top - 17 * s], [x, top - 34 * s], [L + W - 2 * s, top - 17 * s]])} />);
  } else {
    els.push(<Ink key="arch" c="s1 occlude" d={rect(L - 8 * s, top - 14 * s, W * 0.45, 11 * s)} />);
    els.push(<Ink key="arch2" c="s1 occlude" d={rect(L + W * 0.62, top - 14 * s, W * 0.38 + 8 * s, 11 * s)} />);
  }
  return <g>{els}</g>;
}

/* ── Distant architecture, faint and flat ──────────────────────────────── */

export function DistantSkyline({ rng, x0, x1, y, h = 60 }: { rng: Rng; x0: number; x1: number; y: number; h?: number }) {
  const els: ReactNode[] = [];
  for (let x = x0; x < x1; ) {
    const w = rng.range(14, 46), hh = rng.range(0.25, 1) * h;
    const r = rng.next();
    if (r < 0.08) {
      els.push(<Ink key={"d" + x} c="sf occlude" d={`M${r1(x)} ${r1(y)}V${r1(y - hh)}H${r1(x + w)}V${r1(y)}Z`} />);
      els.push(<Ink key={"dd" + x} c="sf occlude" d={`M${r1(x + 2)} ${r1(y - hh)}A${r1(w / 2 - 2)} ${r1(w / 2)} 0 0 1 ${r1(x + w - 2)} ${r1(y - hh)}Z`} />);
    } else if (r < 0.16) {
      els.push(<Ink key={"s" + x} c="sf occlude" d={line([[x, y], [x, y - hh], [x + w / 2, y - hh - h * 0.7], [x + w, y - hh], [x + w, y]])} />);
    } else {
      els.push(<Ink key={"b" + x} c="sf occlude" d={`M${r1(x)} ${r1(y)}V${r1(y - hh)}H${r1(x + w)}V${r1(y)}`} />);
      if (rng.chance(0.4)) els.push(<circle key={"l" + x} cx={r1(x + w / 2)} cy={r1(y - hh * 0.5)} r="0.9" className="fill-soft window-lit" style={{ "--d": `${r1(rng.range(0, 9))}s` } as CSSProperties} />);
    }
    x += w + rng.range(-4, 6);
  }
  return <g opacity="0.85">{els}</g>;
}

/* ── Quays, steps, jetties, walls ──────────────────────────────────────── */

export function Steps({ x, y, w, n = 6, dx = 4, dy = 4, s = 1 }: { x: number; y: number; w: number; n?: number; dx?: number; dy?: number; s?: number }) {
  const d: string[] = [];
  for (let i = 0; i < n; i++) d.push(seg(x + i * dx * s, y - i * dy * s, x + w + i * dx * s, y - i * dy * s));
  d.push(seg(x, y, x + (n - 1) * dx * s, y - (n - 1) * dy * s));
  d.push(seg(x + w, y, x + w + (n - 1) * dx * s, y - (n - 1) * dy * s));
  return <Ink c="s0" d={d.join("")} />;
}

export function Quay({ x0, x1, y, h = 22, rng }: { x0: number; x1: number; y: number; h?: number; rng: Rng }) {
  const els: ReactNode[] = [<Ink key="wall" c="s1 occlude" d={rect(x0, y, x1 - x0, h)} />];
  for (let row = 1; row < 4; row++) {
    const yy = y + (row * h) / 4;
    els.push(<Ink key={"c" + row} c="s0" d={seg(x0, yy, x1, yy)} />);
    for (let x = x0 + (row % 2) * 9; x < x1; x += 18) els.push(<Ink key={`j${row}-${x}`} c="s0" d={seg(x, yy - h / 4, x, yy)} />);
  }
  for (let x = x0 + 30; x < x1 - 10; x += rng.range(60, 120)) {
    els.push(<Ink key={"bol" + x} c="s1" d={`M${r1(x - 2)} ${r1(y)}v-5q2 -2 4 0v5`} />);
  }
  return <g>{els}</g>;
}

export function Jetty({ x, y, len, s = 1, dir = 1 }: { x: number; y: number; len: number; s?: number; dir?: 1 | -1 }) {
  const d: string[] = [seg(x, y, x + len * dir, y - len * 0.08), seg(x, y + 3 * s, x + len * dir, y + 3 * s - len * 0.08)];
  for (let t = 0; t <= len; t += 9 * s) {
    const yy = y - t * 0.08;
    d.push(seg(x + t * dir, yy - 4 * s, x + t * dir, yy + 9 * s));
  }
  return <Ink c="s0" d={d.join("")} />;
}

export function Wall({ pts }: { pts: Pt[] }) {
  // a dry-stone field wall: a line with small irregular stones along it
  return <Ink c="s0" d={smooth(pts) + smooth(pts.map(([x, y]) => [x, y - 3]))} />;
}

/* ── Tiny marks: flowers, frost, reflections, rocks, easel ─────────────── */

export function Flowers({ rng, x0, x1, yOf, n }: { rng: Rng; x0: number; x1: number; yOf: (x: number) => number; n: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = rng.range(x0, x1), y = yOf(x) + rng.range(4, 50), h = rng.range(6, 14);
        return (
          <g key={i}>
            <Ink c="s0" d={`M${r1(x)} ${r1(y)}q${r1(rng.range(-2, 2))} ${r1(-h / 2)} 0 ${r1(-h)}`} />
            <circle cx={r1(x)} cy={r1(y - h - 1.2)} r={r1(rng.range(0.9, 1.6))} className="fill-soft" opacity="0.85" />
          </g>
        );
      })}
    </g>
  );
}

export function Frost({ rng, x0, x1, yOf, n }: { rng: Rng; x0: number; x1: number; yOf: (x: number) => number; n: number }) {
  const d: string[] = [];
  for (let i = 0; i < n; i++) {
    const x = rng.range(x0, x1), y = yOf(x) + rng.range(4, 120), r = rng.range(1.2, 2.6);
    d.push(seg(x - r, y, x + r, y), seg(x, y - r, x, y + r));
  }
  return <Ink c="sf" d={d.join("")} />;
}

/** A column of broken gold strokes on water beneath a light. */
export function Reflection({ x, y0, y1, w, rng }: { x: number; y0: number; y1: number; w: number; rng: Rng }) {
  const els: ReactNode[] = [];
  for (let y = y0; y < y1; y += rng.range(4, 9) * (1 + (y - y0) / (y1 - y0))) {
    const t = (y - y0) / (y1 - y0);
    const half = w * (0.3 + t) * rng.range(0.3, 1);
    const off = rng.range(-w, w) * 0.4 * t;
    els.push(<path key={y} d={seg(x - half + off, y, x + half + off, y)} stroke="var(--color-gold-soft)" style={{ strokeWidth: "calc(var(--hair) * 0.9)" }} opacity={r1(0.9 - t * 0.55)} />);
  }
  return (
    <g className="reflect">
      <g className="twinkle" style={{ "--t": "9s", "--o": 1 } as CSSProperties}>{els}</g>
    </g>
  );
}

export function Rocks({ rng, x, y, n = 5, s = 1 }: { rng: Rng; x: number; y: number; n?: number; s?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const rx = x + rng.range(-40, 40) * s, rw = rng.range(8, 22) * s, rh = rng.range(4, 11) * s;
        return (
          <g key={i}>
            <Ink c="s1 occlude" d={smooth([[rx - rw, y], [rx - rw * 0.5, y - rh], [rx + rw * 0.3, y - rh * 1.1], [rx + rw, y]]) + "Z"} />
            <Ink c="s0" d={seg(rx + rw * 0.2, y - rh * 0.7, rx + rw * 0.6, y - 1) + seg(rx + rw * 0.45, y - rh * 0.6, rx + rw * 0.8, y - 1)} />
          </g>
        );
      })}
    </g>
  );
}

export function Easel({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <Ink c="s0" d={seg(x, y, x + 5 * s, y - 20 * s) + seg(x + 10 * s, y, x + 5 * s, y - 20 * s) + seg(x + 5 * s, y, x + 5 * s, y - 14 * s)} />
      <Ink c="s1 occlude" d={rect(x - 1 * s, y - 19 * s, 12 * s, 9 * s)} />
      <Ink c="s0" d={seg(x + 5 * s, y - 18 * s, x + 5 * s, y - 11 * s)} />
    </g>
  );
}

/** Long, broken, nearly invisible horizontal lines of air. */
export function AirLines({ rng, y0, y1, n, x0 = 0, x1 = 1200 }: { rng: Rng; y0: number; y1: number; n: number; x0?: number; x1?: number }) {
  const d: string[] = [];
  for (let i = 0; i < n; i++) {
    const y = rng.range(y0, y1);
    let x = x0 + rng.range(0, 200);
    while (x < x1) {
      const len = rng.range(40, 220);
      if (rng.chance(0.6)) d.push(seg(x, y, Math.min(x + len, x1), y + rng.range(-1, 1)));
      x += len + rng.range(30, 160);
    }
  }
  return <Ink c="sf" d={d.join("")} />;
}

/* ── Celestial marginalia ─────────────────────────────────────────────── */

export function TinyStars({ rng, n, x0, x1, y0, y1, bright = 0.12 }: { rng: Rng; n: number; x0: number; x1: number; y0: number; y1: number; bright?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = rng.range(x0, x1), y = rng.range(y0, y1);
        if (rng.chance(bright)) return <path key={i} d={sparkle(x, y, rng.range(3, 6))} className="fill-soft twinkle" style={{ "--d": `${r1(rng.range(0, 8))}s`, "--o": 0.9 } as CSSProperties} />;
        return <circle key={i} cx={r1(x)} cy={r1(y)} r={r1(rng.range(0.4, 1.1))} className="fill-soft" opacity={r1(rng.range(0.3, 0.8))} />;
      })}
    </g>
  );
}

/** A small engraved ring with ticks — the kind of mark that floats in the margins of old star charts. */
export function OrbitMark({ x, y, r, ticks = 24 }: { x: number; y: number; r: number; ticks?: number }) {
  const d: string[] = [circle(x, y, r)];
  for (let i = 0; i < ticks; i++) {
    const a = (i / ticks) * Math.PI * 2;
    d.push(seg(x + Math.cos(a) * r, y + Math.sin(a) * r, x + Math.cos(a) * (r + (i % 6 ? 2 : 5)), y + Math.sin(a) * (r + (i % 6 ? 2 : 5))));
  }
  return <Ink c="sf" d={d.join("") + ellipse(x, y, r * 1.8, r * 0.45)} />;
}
