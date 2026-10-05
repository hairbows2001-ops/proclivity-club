import { r1, type Rng } from "@/lib/rng";

export type Pt = [number, number];

/** Straight polyline. */
export function line(points: Pt[]): string {
  return points.map(([x, y], i) => `${i ? "L" : "M"}${r1(x)} ${r1(y)}`).join("");
}

export function seg(x1: number, y1: number, x2: number, y2: number): string {
  return `M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}`;
}

/** Closed polygon. */
export function poly(points: Pt[]): string {
  return line(points) + "Z";
}

/** Smooth curve through points (Catmull–Rom converted to cubic Béziers). */
export function smooth(points: Pt[], tension = 0.5): string {
  if (points.length < 3) return line(points);
  let d = `M${r1(points[0][0])} ${r1(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const t = tension / 3;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
    d += `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d;
}

export function circle(cx: number, cy: number, r: number): string {
  return `M${r1(cx - r)} ${r1(cy)}a${r1(r)} ${r1(r)} 0 1 0 ${r1(r * 2)} 0a${r1(r)} ${r1(r)} 0 1 0 ${r1(-r * 2)} 0`;
}

export function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  return `M${r1(cx - rx)} ${r1(cy)}a${r1(rx)} ${r1(ry)} 0 1 0 ${r1(rx * 2)} 0a${r1(rx)} ${r1(ry)} 0 1 0 ${r1(-rx * 2)} 0`;
}

export function arc(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  return `M${r1(x0)} ${r1(y0)}A${r1(r)} ${r1(r)} 0 ${large} 1 ${r1(x1)} ${r1(y1)}`;
}

/** A jagged mountain ridge by midpoint displacement. */
export function ridge(rng: Rng, x0: number, x1: number, base: number, amp: number, depth = 6, rough = 0.55): Pt[] {
  let pts: Pt[] = [[x0, base - rng.range(0.2, 0.6) * amp], [x1, base - rng.range(0.2, 0.6) * amp]];
  let disp = amp;
  for (let k = 0; k < depth; k++) {
    const next: Pt[] = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
      const mid: Pt = [(ax + bx) / 2 + rng.range(-0.1, 0.1) * (bx - ax), (ay + by) / 2 + rng.range(-1, 1) * disp];
      mid[1] = Math.min(base - 2, Math.max(base - amp * 1.4, mid[1]));
      next.push(mid, pts[i + 1]);
    }
    pts = next;
    disp *= rough;
  }
  return pts;
}

/** A gently rolling contour made from layered sine waves. */
export function rolling(rng: Rng, x0: number, x1: number, base: number, amp: number, step = 20): Pt[] {
  const f1 = rng.range(0.004, 0.008), f2 = rng.range(0.011, 0.02);
  const p1 = rng.range(0, 6.28), p2 = rng.range(0, 6.28);
  const pts: Pt[] = [];
  for (let x = x0; x <= x1 + 0.1; x += step) {
    pts.push([x, base - amp * (0.6 * Math.sin(x * f1 + p1) + 0.4 * Math.sin(x * f2 + p2))]);
  }
  return pts;
}

/** Height of a polyline at x (linear interpolation). */
export function yAt(points: Pt[], x: number): number {
  for (let i = 0; i < points.length - 1; i++) {
    const [ax, ay] = points[i], [bx, by] = points[i + 1];
    if (x >= Math.min(ax, bx) && x <= Math.max(ax, bx)) {
      const t = bx === ax ? 0 : (x - ax) / (bx - ax);
      return ay + (by - ay) * t;
    }
  }
  return points[x < points[0][0] ? 0 : points.length - 1][1];
}

/** Region below a profile, closed to the bottom of the plate — used to hide what lies behind hills. */
export function underside(points: Pt[], bottom: number): string {
  const first = points[0], last = points[points.length - 1];
  return line(points) + `L${r1(last[0])} ${bottom}L${r1(first[0])} ${bottom}Z`;
}

export function rect(x: number, y: number, w: number, h: number): string {
  return `M${r1(x)} ${r1(y)}h${r1(w)}v${r1(h)}h${r1(-w)}Z`;
}
