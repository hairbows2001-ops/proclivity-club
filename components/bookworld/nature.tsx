import type { ReactNode } from "react";
import type { Rng } from "@/lib/rng";
import { r1 } from "@/lib/rng";
import type { Trees } from "@/lib/types";
import { Ink } from "./Ink";
import { circle, line, poly, seg, smooth, type Pt } from "./geometry";

/* ── Foliage ───────────────────────────────────────────────────────────
 * An engraver's crown: a broken, irregular leafy edge, then parallel
 * hatching gathered on the side away from the light, and a few flicks of
 * leaf along the lit edge. No cloud outlines.
 */
export function scallopCrown(cx: number, cy: number, r: number, rng: Rng, s = 1): ReactNode {
  const n = Math.max(10, Math.round((Math.PI * 2 * r) / (5.5 * s)));
  const squash = 0.86;
  const pts: Pt[] = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const rr = r * rng.range(0.84, 1.08);
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * squash];
  });
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 1; i <= n; i++) {
    const [px, py] = pts[i % n];
    const [qx, qy] = pts[i - 1];
    const br = (Math.hypot(px - qx, py - qy) / 2) * rng.range(1.02, 1.4);
    d += `A${r1(br)} ${r1(br)} 0 0 1 ${r1(px)} ${r1(py)}`;
  }
  // hatching on the shadowed (lower right) side, clipped to the crown by geometry
  const ux = 0.8, uy = -0.6, nx = 0.6, ny = 0.8;
  const R = r * 0.84;
  const hatch: ReactNode[] = [];
  for (let t = R * 0.05; t < R * 0.92; t += 2.6 * s) {
    const half = Math.sqrt(Math.max(0, R * R - t * t));
    const mx = cx + nx * t, my = cy + ny * t * squash;
    const a0 = half * rng.range(0.35, 0.95), a1 = half * rng.range(0.55, 1);
    hatch.push(<Ink key={"h" + t} c="s0" d={seg(mx - ux * a0, my - uy * a0 * squash, mx + ux * a1, my + uy * a1 * squash)} />);
  }
  // leaf flicks on the lit edge
  const flicks = Array.from({ length: Math.round(r / (5 * s)) }, (_, k) => {
    const a = rng.range(Math.PI * 1.05, Math.PI * 1.7);
    const fx = cx + Math.cos(a) * r * 0.78, fy = cy + Math.sin(a) * r * 0.78 * squash;
    return <Ink key={"f" + k} c="s0" d={`M${r1(fx)} ${r1(fy)}q${r1(2 * s)} ${r1(-2 * s)} ${r1(4 * s)} 0`} />;
  });
  return (
    <>
      <Ink c="s1 occlude" d={d + "Z"} />
      {hatch}
      {flicks}
    </>
  );
}

/* ── Trees ─────────────────────────────────────────────────────────────── */

export function Tree({ kind, x, y, s, rng }: { kind: Trees; x: number; y: number; s: number; rng: Rng }) {
  switch (kind) {
    case "round": {
      const th = 26 * s;
      return (
        <g>
          <Ink c="s1" d={`M${r1(x - 3 * s)} ${r1(y)}Q${r1(x - 1 * s)} ${r1(y - th * 0.5)} ${r1(x - 2.5 * s)} ${r1(y - th)}M${r1(x + 3 * s)} ${r1(y)}Q${r1(x + 1 * s)} ${r1(y - th * 0.5)} ${r1(x + 2 * s)} ${r1(y - th)}`} />
          <Ink c="s0" d={seg(x, y - th * 0.7, x + 7 * s, y - th - 4 * s) + seg(x - 1 * s, y - th * 0.8, x - 8 * s, y - th - 2 * s)} />
          {scallopCrown(x - 9 * s, y - th - 6 * s, 11 * s, rng, s)}
          {scallopCrown(x + 9 * s, y - th - 8 * s, 10.5 * s, rng, s)}
          {scallopCrown(x - 2 * s, y - th - 19 * s, 13 * s, rng, s)}
          {scallopCrown(x + 5 * s, y - th - 30 * s, 9 * s, rng, s)}
        </g>
      );
    }
    case "cypress": {
      const h = rng.range(70, 95) * s, w = rng.range(8, 11) * s;
      const outline = smooth([[x - 1.5 * s, y], [x - w, y - h * 0.25], [x - w * 0.9, y - h * 0.6], [x - w * 0.3, y - h * 0.9], [x, y - h], [x + w * 0.35, y - h * 0.88], [x + w, y - h * 0.58], [x + w * 1.05, y - h * 0.25], [x + 1.5 * s, y]]);
      return (
        <g>
          <Ink c="s1 occlude" d={outline + "Z"} />
          {Array.from({ length: 16 }, (_, k) => {
            const t = 0.08 + k * 0.052;
            const ww = w * Math.sin(Math.PI * Math.min(0.98, t + 0.15)) * 0.9;
            return <Ink key={k} c="s0" d={seg(x + ww * 0.05, y - h * t, x + ww * 0.85, y - h * t - 4 * s)} />;
          })}
        </g>
      );
    }
    case "pine": {
      const h = rng.range(60, 80) * s;
      return (
        <g>
          <Ink c="s1" d={seg(x, y, x, y - h)} />
          {Array.from({ length: 7 }, (_, k) => {
            const t = k / 7;
            const yy = y - h * 0.18 - t * h * 0.8, w = (1 - t) * 22 * s + 4 * s;
            return <Ink key={k} c="s1 occlude" d={`M${r1(x - w)} ${r1(yy + 6 * s)}Q${r1(x - w * 0.4)} ${r1(yy - 2 * s)} ${r1(x)} ${r1(yy - 9 * s)}Q${r1(x + w * 0.4)} ${r1(yy - 2 * s)} ${r1(x + w)} ${r1(yy + 6 * s)}Z`} />;
          })}
        </g>
      );
    }
    case "poplar": {
      const h = rng.range(80, 100) * s, w = 12 * s;
      const outline = smooth([[x - 2 * s, y - 10 * s], [x - w, y - h * 0.4], [x - w * 0.6, y - h * 0.85], [x, y - h], [x + w * 0.6, y - h * 0.85], [x + w, y - h * 0.4], [x + 2 * s, y - 10 * s]]);
      return (
        <g>
          <Ink c="s1" d={seg(x, y, x, y - 12 * s)} />
          <Ink c="s1 occlude" d={outline + "Z"} />
          {Array.from({ length: 5 }, (_, k) => <Ink key={k} c="s0" d={seg(x - w * 0.5 + k * w * 0.28, y - h * 0.2, x - w * 0.3 + k * w * 0.16, y - h * 0.82)} />)}
        </g>
      );
    }
    case "bare": {
      const lines: string[] = [];
      const grow = (bx: number, by: number, a: number, len: number, depth: number) => {
        const ex = bx + Math.cos(a) * len, ey = by + Math.sin(a) * len;
        lines.push(`M${r1(bx)} ${r1(by)}Q${r1((bx + ex) / 2 + rng.range(-3, 3) * s)} ${r1((by + ey) / 2)} ${r1(ex)} ${r1(ey)}`);
        if (depth <= 0) return;
        grow(ex, ey, a - rng.range(0.25, 0.6), len * rng.range(0.62, 0.78), depth - 1);
        grow(ex, ey, a + rng.range(0.25, 0.6), len * rng.range(0.62, 0.78), depth - 1);
      };
      grow(x, y, -Math.PI / 2 + rng.range(-0.08, 0.08), 26 * s, 5);
      return <g>{lines.map((d, i) => <Ink key={i} c={i < 3 ? "s1" : "s0"} d={d} />)}</g>;
    }
    default:
      return null;
  }
}

/* ── Boats ─────────────────────────────────────────────────────────────── */

export function Boat({ x, y, s, rng, kind, umbrella }: { x: number; y: number; s: number; rng: Rng; kind: "sail" | "row"; umbrella?: boolean }) {
  const els: ReactNode[] = [];
  if (kind === "sail") {
    els.push(<Ink key="hull" c="s1 occlude" d={`M${r1(x - 24 * s)} ${r1(y - 7 * s)}Q${r1(x - 18 * s)} ${r1(y + 2 * s)} ${r1(x)} ${r1(y + 2 * s)}Q${r1(x + 18 * s)} ${r1(y + 2 * s)} ${r1(x + 26 * s)} ${r1(y - 8 * s)}Z`} />);
    els.push(<Ink key="mast" c="s1" d={seg(x, y - 7 * s, x, y - 58 * s)} />);
    els.push(<Ink key="sail" c="s1 occlude" d={`M${r1(x + 1.5 * s)} ${r1(y - 56 * s)}Q${r1(x + 18 * s)} ${r1(y - 34 * s)} ${r1(x + 20 * s)} ${r1(y - 11 * s)}L${r1(x + 1.5 * s)} ${r1(y - 11 * s)}Z`} />);
    els.push(<Ink key="jib" c="s1 occlude" d={poly([[x - 1.5 * s, y - 50 * s], [x - 1.5 * s, y - 12 * s], [x - 16 * s, y - 12 * s]])} />);
    for (let k = 1; k < 7; k++) els.push(<Ink key={"sh" + k} c="s0" d={seg(x + 1.5 * s, y - 11 * s - k * 6 * s, x + 6 * s + k * 1.6 * s, y - 11 * s - k * 6 * s + 4 * s)} />);
    els.push(<Ink key="pen" c="s0" d={line([[x, y - 58 * s], [x - 7 * s, y - 60 * s], [x, y - 62 * s]])} />);
    els.push(<Figure key="fig" x={x + 12 * s} y={y - 6 * s} s={s * 0.55} rng={rng} />);
  } else {
    els.push(<Ink key="hull" c="s1 occlude" d={`M${r1(x - 20 * s)} ${r1(y - 5 * s)}Q${r1(x - 14 * s)} ${r1(y + 2 * s)} ${r1(x)} ${r1(y + 2 * s)}Q${r1(x + 14 * s)} ${r1(y + 2 * s)} ${r1(x + 20 * s)} ${r1(y - 6 * s)}Z`} />);
    els.push(<Ink key="oarL" c="s0" d={seg(x - 4 * s, y - 9 * s, x - 30 * s, y + 4 * s)} />);
    els.push(<Ink key="oarR" c="s0" d={seg(x - 2 * s, y - 9 * s, x + 22 * s, y + 5 * s)} />);
    els.push(<Figure key="rower" x={x - 3 * s} y={y - 5 * s} s={s * 0.5} rng={rng} />);
    els.push(<Figure key="pass" x={x + 11 * s} y={y - 5 * s} s={s * 0.45} rng={rng} dress />);
    if (umbrella) {
      els.push(<Ink key="ush" c="s0" d={seg(x + 12 * s, y - 10 * s, x + 14 * s, y - 24 * s)} />);
      els.push(<Ink key="u" c="s1 occlude" d={`M${r1(x + 2 * s)} ${r1(y - 22 * s)}Q${r1(x + 14 * s)} ${r1(y - 36 * s)} ${r1(x + 26 * s)} ${r1(y - 25 * s)}Q${r1(x + 14 * s)} ${r1(y - 27 * s)} ${r1(x + 2 * s)} ${r1(y - 22 * s)}Z`} />);
    }
  }
  // reflections
  for (let k = 0; k < 4; k++) els.push(<Ink key={"ref" + k} c="s0" d={seg(x - (18 - k * 3) * s + rng.range(-3, 3), y + (5 + k * 3) * s, x + (16 - k * 4) * s, y + (5 + k * 3) * s)} />);
  return <g>{els}</g>;
}

/* ── Tiny human figures ────────────────────────────────────────────────── */

export function Figure({ x, y, s, rng, dress }: { x: number; y: number; s: number; rng: Rng; dress?: boolean }) {
  const isDress = dress ?? rng.chance(0.5);
  const lean = rng.range(-1, 1) * s;
  const body = isDress
    ? poly([[x - 2 * s + lean, y - 13 * s], [x + 2 * s + lean, y - 13 * s], [x + 5 * s, y], [x - 5 * s, y]])
    : poly([[x - 2.4 * s + lean, y - 13 * s], [x + 2.4 * s + lean, y - 13 * s], [x + 3 * s, y - 5 * s], [x - 3 * s, y - 5 * s]]);
  return (
    <g>
      {!isDress && <Ink c="s1" d={seg(x - 1.4 * s, y - 5 * s, x - 1.8 * s, y) + seg(x + 1.4 * s, y - 5 * s, x + 2 * s, y)} />}
      <Ink c="s1 occlude" d={body} />
      <Ink c="s1 occlude" d={circle(x + lean, y - 15.5 * s, 2.1 * s)} />
    </g>
  );
}

/* ── Birds, aeroplane, grass ───────────────────────────────────────────── */

export function Birds({ rng, x, y, n = 5 }: { rng: Rng; x: number; y: number; n?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const bx = x + rng.range(-60, 60), by = y + rng.range(-25, 25), w = rng.range(3.5, 6);
        return <Ink key={i} c="s0" d={`M${r1(bx - w)} ${r1(by)}Q${r1(bx - w / 2)} ${r1(by - w * 0.7)} ${r1(bx)} ${r1(by)}Q${r1(bx + w / 2)} ${r1(by - w * 0.7)} ${r1(bx + w)} ${r1(by)}`} />;
      })}
    </g>
  );
}

export function Aeroplane({ x, y, s }: { x: number; y: number; s: number }) {
  // trailing loops of skywriting smoke
  let d = `M${r1(x - 14 * s)} ${r1(y)}`;
  for (let i = 0; i < 9; i++) {
    const bx = x - 30 * s - i * 26 * s;
    d += `C${r1(bx + 10 * s)} ${r1(y - 22 * s)} ${r1(bx - 14 * s)} ${r1(y - 22 * s)} ${r1(bx - 4 * s)} ${r1(y + (i % 2 ? 6 : -2) * s)}`;
  }
  return (
    <g>
      <g opacity="0.75"><Ink c="s0" d={d} /></g>
      <Ink c="s1" d={seg(x - 12 * s, y, x + 10 * s, y)} />
      <Ink c="s1" d={seg(x - 2 * s, y - 6 * s, x + 4 * s, y - 6 * s) + seg(x - 3 * s, y + 3 * s, x + 5 * s, y + 3 * s)} />
      <Ink c="s0" d={seg(x, y - 6 * s, x, y + 3 * s) + seg(x + 3 * s, y - 6 * s, x + 3 * s, y + 3 * s)} />
      <Ink c="s1" d={seg(x - 12 * s, y, x - 14 * s, y - 5 * s)} />
    </g>
  );
}

export function Grass({ rng, x0, x1, yOf, n }: { rng: Rng; x0: number; x1: number; yOf: (x: number) => number; n: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const gx = rng.range(x0, x1), gy = yOf(gx) + rng.range(2, 40);
        const h = rng.range(3, 8);
        return <Ink key={i} c="s0" d={seg(gx, gy, gx - 1.5, gy - h) + seg(gx + 2, gy, gx + 3, gy - h * 0.8)} />;
      })}
    </g>
  );
}
