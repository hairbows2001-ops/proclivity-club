import type { ReactNode } from "react";
import type { Rng } from "@/lib/rng";
import { r1 } from "@/lib/rng";
import type { BookWorldConfig } from "@/lib/types";
import { Ink } from "./Ink";
import { Grass } from "./nature";
import { ellipse, line, ridge, rolling, seg, smooth, underside, yAt, type Pt } from "./geometry";

export const W = 1200;
export const H = 780;
export const HZ = 470;

export interface Anchor { x: number; y: number; s: number }

export interface Scene {
  back: ReactNode;
  water?: { x0: number; x1: number; y0: number; y1: number };
  front: ReactNode;
  arch: Anchor;
  mark: Anchor;
  trees: Anchor[];
  figures: Anchor[];
  boat?: Anchor;
  path?: Pt[];
  /** Drawn last of all, in front of buildings — e.g. a near shore. */
  foreground?: ReactNode;
}

/* ── Reusable land forms ───────────────────────────────────────────────── */

/** A mountain range: hidden fill, ridge line, slope hatching and spurs. */
export function MountainRange({ rng, x0, x1, base, amp, faint = false, bottom = H }: {
  rng: Rng; x0: number; x1: number; base: number; amp: number; faint?: boolean; bottom?: number;
}) {
  const pts = ridge(rng, x0, x1, base, amp, 7, 0.52);
  const hatch: ReactNode[] = [];
  for (let i = 1; i < pts.length - 1; i += faint ? 3 : 1) {
    const [px, py] = pts[i];
    const [nx, ny] = pts[i + 1];
    if (ny > py) {
      // shadowed slope: engraved strokes falling away from the ridge
      const len = Math.min((base - py) * rng.range(0.35, 0.7), 70);
      if (len > 6) hatch.push(<Ink key={i} c="s0" d={seg(px, py + 2, px - len * 0.35, py + len)} />);
    }
  }
  // spurs from the highest peaks
  const peaks = pts.map((p, i) => ({ p, i })).filter(({ i }) => i > 0 && i < pts.length - 1 && pts[i][1] < pts[i - 1][1] && pts[i][1] < pts[i + 1][1]);
  peaks.sort((a, b) => a.p[1] - b.p[1]);
  const spurs = peaks.slice(0, faint ? 3 : 7).map(({ p }, k) => {
    const [px, py] = p;
    const drop = (base - py) * rng.range(0.5, 0.85);
    return <Ink key={"sp" + k} c="s0" d={smooth([[px, py], [px + rng.range(-12, 12), py + drop * 0.4], [px + rng.range(-25, 25), py + drop]])} />;
  });
  // snow-line flecks near the summits
  const snow = faint ? null : peaks.slice(0, 5).map(({ p }, k) => (
    <Ink key={"sn" + k} c="s0" d={seg(p[0] - 10, p[1] + 14, p[0] - 3, p[1] + 9) + seg(p[0] + 4, p[1] + 10, p[0] + 12, p[1] + 16)} />
  ));
  return (
    <g>
      <Ink c={`${faint ? "sf" : "s1"} occlude`} d={underside(pts, bottom)} />
      {!faint && hatch}
      {faint && hatch.filter((_, i) => i % 2 === 0)}
      {spurs}
      {snow}
    </g>
  );
}

/** A rolling hill with optional ploughed furrows and a hedgerow along its crest. */
export function Hill({ rng, pts, cls = "s1", furrows = 0, hedge = false, bottom = H }: { rng: Rng; pts: Pt[]; cls?: string; furrows?: number; hedge?: boolean; bottom?: number }) {
  const lines: ReactNode[] = [];
  for (let f = 0; f < furrows; f++) {
    const xa = rng.range(pts[0][0], pts[pts.length - 1][0] - 220);
    const xb = xa + rng.range(120, 260);
    const n = rng.int(5, 9);
    const sp = rng.range(4, 7);
    for (let k = 1; k <= n; k++) {
      const seg: Pt[] = pts.filter(([x]) => x >= xa && x <= xb).map(([x, y]) => [x, y + k * sp + (x - xa) * 0.02 * (f % 2 ? 1 : -1)]);
      if (seg.length > 1) lines.push(<Ink key={`f${f}-${k}`} c="s0" d={smooth(seg)} />);
    }
    lines.push(<Ink key={`fb${f}`} c="s0" d={seg(xa, yAt(pts, xa), xa, yAt(pts, xa) + n * sp + 4)} />);
  }
  const dots: ReactNode[] = [];
  if (hedge) {
    for (let x = pts[0][0]; x < pts[pts.length - 1][0]; x += rng.range(7, 13)) {
      if (rng.chance(0.45)) continue;
      dots.push(<Ink key={"h" + x} c="s0" d={ellipse(x, yAt(pts, x) - 1.8, rng.range(1.6, 2.6), rng.range(1.2, 1.8))} />);
    }
  }
  return (
    <g>
      <Ink c={`${cls} occlude`} d={underside(pts, bottom)} />
      {lines}
      {dots}
    </g>
  );
}

/** Horizontal wave lines with perspective, and glints under each light. */
export function Water({ rng, x0, x1, y0, y1, glints }: { rng: Rng; x0: number; x1: number; y0: number; y1: number; glints: { x: number; w: number }[] }) {
  const rows: ReactNode[] = [];
  const n = 30;
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const y = y0 + (y1 - y0) * Math.pow(t, 1.65);
    let x = x0 + rng.range(-30, 10);
    while (x < x1) {
      const len = rng.range(10, 30 + t * 70);
      const glint = glints.find((g) => Math.abs(x + len / 2 - g.x) < g.w * (0.3 + t));
      if (glint && rng.chance(0.85)) {
        rows.push(<Ink key={`${i}-${x}`} c="s1" d={seg(x, y, Math.min(x + len * 0.6, x1), y)} style={{ stroke: "var(--ink-soft)" }} />);
      } else if (rng.chance(0.78)) {
        rows.push(<Ink key={`${i}-${x}`} c={t < 0.3 ? "sf" : "s0"} d={seg(x, y, Math.min(x + len, x1), y)} />);
      }
      x += len + rng.range(6, 26 - t * 10);
    }
  }
  return <g>{rows}</g>;
}

/** A winding river from the foreground to the horizon. */
function River({ rng, cx, uid }: { rng: Rng; cx: number; uid: string }) {
  const steps = 10;
  const left: Pt[] = [], right: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = HZ + 6 + (H - HZ) * Math.pow(t, 1.4);
    const x = cx + Math.sin(t * 5 + rng.range(0, 0.3)) * 90 * t;
    const half = 4 + t * 120;
    left.push([x - half, y]);
    right.push([x + half, y]);
  }
  const outline = smooth(left) + "L" + right.slice().reverse().map(([x, y]) => `${r1(x)} ${r1(y)}`).join("L") + "Z";
  return (
    <g>
      <clipPath id={`${uid}-river`}><path d={outline} /></clipPath>
      <path d={outline} className="occlude" />
      <g clipPath={`url(#${uid}-river)`}>
        <Water rng={rng} x0={0} x1={W} y0={HZ} y1={H} glints={[]} />
      </g>
      <Ink c="s1" d={smooth(left)} />
      <Ink c="s1" d={smooth(right)} />
    </g>
  );
}

/* ── Landscapes ────────────────────────────────────────────────────────── */

export function buildScene(cfg: BookWorldConfig, rng: Rng, side: "left" | "right", uid: string): Scene {
  const Lx = side === "left" ? 400 : 800;
  const Ax = side === "left" ? 830 : 370;
  /** mirror a distance measured from the architecture-side edge */
  const fromA = (u: number) => (side === "left" ? W - u : u);
  const river = cfg.water === "river";

  switch (cfg.landscape) {
    case "coast": {
      const profileU: [number, number][] = [[-10, 418], [90, 410], [170, 416], [250, 412], [330, 421], [390, 430], [440, 448], [480, 480], [510, 506], [545, 522]];
      const profile: Pt[] = profileU.map(([u, y]) => [fromA(u), y + rng.range(-3, 3)]);
      const cliffFoot: Pt = [fromA(660), H + 10];
      const mass = line(profile) + `L${r1(cliffFoot[0])} ${r1(cliffFoot[1])}L${r1(fromA(-10))} ${H + 10}Z`;
      const cliffHatch: ReactNode[] = [];
      for (let t = 0; t < 1; t += 0.018) {
        const x = fromA(545 + t * 115), y = 522 + t * (H - 522);
        const len = rng.range(8, 26);
        cliffHatch.push(<Ink key={"ch" + t} c="s0" d={seg(x, y, x + (side === "left" ? len : -len), y + 3)} />);
      }
      const contours = [50, 120, 200].map((dy, k) => {
        const pts: Pt[] = profileU.filter(([u]) => u < 470 + dy * 0.5).map(([u, y]) => [fromA(u), y + dy + Math.sin(u * 0.02 + k) * 6]);
        return <Ink key={"ct" + k} c="s0" d={smooth(pts)} />;
      });
      const shore = rolling(rng, -10, W + 10, 712, 10);
      const foreground = (
        <g>
          <Hill rng={rng} pts={shore} />
          <Grass rng={rng} x0={0} x1={W} yOf={(x) => yAt(shore, x)} n={60} />
          {Array.from({ length: 6 }, (_, i) => {
            const px = rng.range(80, W - 80), py = yAt(shore, px) + rng.range(-4, 2);
            return <Ink key={"pb" + i} c="s0" d={ellipse(px, py, rng.range(4, 9), rng.range(2, 3.5))} />;
          })}
        </g>
      );
      return {
        back: <MountainRange rng={rng} x0={fromA(1300)} x1={fromA(700)} base={HZ} amp={26} faint bottom={HZ} />,
        water: { x0: 0, x1: W, y0: HZ, y1: H },
        front: (
          <g>
            <Ink c="s1 occlude" d={mass} />
            {cliffHatch}
            {contours}
            <Grass rng={rng} x0={Math.min(fromA(0), fromA(480))} x1={Math.max(fromA(0), fromA(480))} yOf={(x) => yAt(profile.slice().sort((a, b) => a[0] - b[0]), x)} n={50} />
          </g>
        ),
        arch: { x: fromA(210), y: 418, s: 0.72 },
        mark: { x: Lx, y: 536, s: 0.95 },
        trees: [{ x: fromA(70), y: 418, s: 0.85 }, { x: fromA(345), y: 425, s: 0.8 }, { x: fromA(390), y: 432, s: 0.65 }],
        figures: [{ x: W / 2 - 40, y: 716, s: 1.5 }, { x: W / 2 - 20, y: 717, s: 1.4 }],
        boat: { x: side === "left" ? 510 : 690, y: 610, s: 1.1 },
        path: [[fromA(300), H], [fromA(290), 650], [fromA(250), 540], [fromA(215), 432]],
        foreground,
      };
    }

    case "countryside": {
      const hills = [478, 540, 612, 700].map((b, i) => rolling(rng, -10, W + 10, b, [10, 18, 22, 18][i]));
      return {
        back: <MountainRange rng={rng} x0={-10} x1={W + 10} base={HZ + 4} amp={30} faint bottom={HZ + 10} />,
        front: (
          <g>
            <Hill rng={rng} pts={hills[0]} cls="sf" hedge />
            <Hill rng={rng} pts={hills[1]} furrows={3} hedge />
            {river && <River rng={rng} cx={W / 2} uid={uid} />}
            <Hill rng={rng} pts={hills[2]} furrows={2} hedge />
          </g>
        ),
        foreground: (
          <g>
            <Hill rng={rng} pts={hills[3]} />
            <Grass rng={rng} x0={0} x1={W} yOf={(x) => yAt(hills[3], x)} n={70} />
          </g>
        ),
        arch: { x: Ax, y: yAt(hills[1], Ax) + 6, s: 0.62 },
        mark: { x: Lx, y: yAt(hills[3], Lx) + 14, s: 1.2 },
        trees: [140, 300, 620, 1060, 980].map((x) => ({ x, y: yAt(hills[2], x) + 6, s: rng.range(0.7, 0.95) })),
        figures: [{ x: W / 2 + 30, y: yAt(hills[3], W / 2 + 30) + 30, s: 1.5 }, { x: W / 2 + 48, y: yAt(hills[3], W / 2 + 48) + 31, s: 1.45 }],
        path: [[W / 2 + 20, H], [W / 2 + 60, 690], [Ax - 60, 600], [Ax, yAt(hills[1], Ax) + 8]],
      };
    }

    case "city": {
      const G = 586;
      const skyline: ReactNode[] = [];
      for (let x = -10; x < W; ) {
        const w = rng.range(30, 70), h = rng.range(30, 80);
        if (rng.chance(0.12)) {
          // a distant dome
          skyline.push(<Ink key={"d" + x} c="sf occlude" d={`M${r1(x)} ${G}V${r1(G - h)}H${r1(x + w)}V${G}Z`} />);
          skyline.push(<Ink key={"dd" + x} c="sf occlude" d={`M${r1(x + 4)} ${r1(G - h)}A${r1(w / 2 - 4)} ${r1(w / 2)} 0 0 1 ${r1(x + w - 4)} ${r1(G - h)}Z`} />);
          skyline.push(<Ink key={"dl" + x} c="sf" d={seg(x + w / 2, G - h - w / 2, x + w / 2, G - h - w / 2 - 14)} />);
        } else if (rng.chance(0.15)) {
          skyline.push(<Ink key={"s" + x} c="sf occlude" d={line([[x, G], [x, G - h], [x + w / 2, G - h - 50], [x + w, G - h], [x + w, G]])} />);
        } else {
          skyline.push(<Ink key={"b" + x} c="sf occlude" d={`M${r1(x)} ${G}V${r1(G - h)}H${r1(x + w)}V${G}`} />);
        }
        x += w + rng.range(-6, 8);
      }
      const lamps: ReactNode[] = [];
      for (let x = 60; x < W; x += 150) {
        lamps.push(
          <g key={"lamp" + x}>
            <Ink c="s1" d={seg(x, G + 20, x, G - 40)} />
            <Ink c="s1" d={`M${x - 5} ${G - 40}h10l-2 -9h-6z`} />
            <circle cx={x} cy={G - 44} r={2.2} className="fill-soft window-lit" style={{ ["--t" as string]: "10s" }} />
          </g>,
        );
      }
      return {
        back: <g>{skyline}</g>,
        water: { x0: 0, x1: W, y0: G + 26, y1: H },
        front: (
          <g>
            <Ink c="s1 occlude" d={`M-10 ${G}H${W + 10}V${G + 26}H-10Z`} />
            <Ink c="s0" d={seg(-10, G + 8, W + 10, G + 8)} />
            {Array.from({ length: 120 }, (_, i) => <Ink key={i} c="s0" d={seg(i * 10 + 3, G + 8, i * 10 + 3, G + 26)} />)}
            {lamps}
          </g>
        ),
        arch: { x: Ax, y: G, s: 1 },
        mark: { x: Lx, y: G, s: 0.92 },
        trees: [{ x: Ax + (side === "left" ? -255 : 255), y: G, s: 1.1 }, { x: side === "left" ? 1150 : 50, y: G, s: 1 }],
        figures: [Ax - 120, Ax - 104, Ax + 60, Lx + (side === "left" ? 90 : -90)].map((x) => ({ x, y: G - 1, s: 1.25 })),
        boat: { x: W / 2, y: 700, s: 1 },
      };
    }

    case "lake": {
      const shore = rolling(rng, -10, W + 10, 690, 12);
      return {
        back: (
          <g>
            <MountainRange rng={rng} x0={-10} x1={W + 10} base={HZ} amp={210} faint bottom={HZ} />
            <MountainRange rng={rng} x0={-10} x1={W + 10} base={HZ} amp={120} bottom={HZ} />
          </g>
        ),
        water: { x0: 0, x1: W, y0: HZ, y1: 700 },
        front: <Ink c="s1" d={seg(-10, HZ, W + 10, HZ)} />,
        foreground: (
          <g>
            <Hill rng={rng} pts={shore} />
            <Grass rng={rng} x0={0} x1={W} yOf={(x) => yAt(shore, x)} n={60} />
          </g>
        ),
        arch: { x: Ax, y: HZ + 6, s: 0.62 },
        mark: { x: Lx, y: HZ + 8, s: 0.85 },
        trees: [60, 130, 1070, 1140, Lx + (side === "left" ? -250 : 250)].map((x) => ({ x, y: yAt(shore, x) + 18, s: rng.range(1.1, 1.5) })),
        figures: [{ x: W / 2 + 140, y: yAt(shore, W / 2 + 140) + 28, s: 1.5 }],
        boat: { x: side === "left" ? 620 : 580, y: 600, s: 1.3 },
      };
    }

    case "mountains": {
      const valley = [560, 640, 720].map((b, i) => rolling(rng, -10, W + 10, b, [14, 18, 16][i]));
      return {
        back: (
          <g>
            <MountainRange rng={rng} x0={-10} x1={W + 10} base={520} amp={300} faint bottom={540} />
            <MountainRange rng={rng} x0={-10} x1={W + 10} base={550} amp={170} bottom={560} />
          </g>
        ),
        front: (
          <g>
            <Hill rng={rng} pts={valley[0]} hedge />
            {river && <River rng={rng} cx={W / 2} uid={uid} />}
            <Hill rng={rng} pts={valley[1]} furrows={2} />
          </g>
        ),
        foreground: (
          <g>
            <Hill rng={rng} pts={valley[2]} />
            <Grass rng={rng} x0={0} x1={W} yOf={(x) => yAt(valley[2], x)} n={60} />
          </g>
        ),
        arch: { x: Ax, y: yAt(valley[0], Ax) + 4, s: 0.7 },
        mark: { x: Lx, y: yAt(valley[1], Lx) + 8, s: 0.9 },
        trees: [100, 250, 950, 1100, 600].map((x) => ({ x, y: yAt(valley[1], x) + 10, s: rng.range(0.8, 1.1) })),
        figures: [{ x: W / 2, y: yAt(valley[2], W / 2) + 30, s: 1.5 }],
        path: [[W / 2 - 30, H], [W / 2, 700], [Ax, yAt(valley[0], Ax) + 10]],
      };
    }

    case "river": {
      const hills = [482, 560, 690].map((b, i) => rolling(rng, -10, W + 10, b, [12, 18, 14][i]));
      const bridgeAt = { x: W / 2 + Math.sin(0.62 * 5) * 90 * 0.62, y: HZ + 6 + (H - HZ) * Math.pow(0.62, 1.4) };
      return {
        back: <MountainRange rng={rng} x0={-10} x1={W + 10} base={HZ + 4} amp={60} faint bottom={HZ + 10} />,
        front: (
          <g>
            <Hill rng={rng} pts={hills[0]} cls="sf" hedge />
            <Hill rng={rng} pts={hills[1]} furrows={2} hedge />
            <River rng={rng} cx={W / 2} uid={uid} />
          </g>
        ),
        foreground: (
          <g>
            <Grass rng={rng} x0={0} x1={W} yOf={(x) => yAt(hills[2], x)} n={50} />
          </g>
        ),
        arch: { x: Ax, y: yAt(hills[1], Ax) + 4, s: 0.65 },
        mark: cfg.landmark === "bridge" ? { x: bridgeAt.x, y: bridgeAt.y, s: 0.85 } : { x: Lx, y: yAt(hills[1], Lx) + 40, s: 1 },
        trees: [120, 260, 980, 1100].map((x) => ({ x, y: yAt(hills[1], x) + 8, s: rng.range(0.8, 1) })),
        figures: [{ x: Ax - 80, y: yAt(hills[1], Ax) + 60, s: 1.4 }],
      };
    }

    case "moor":
    default: {
      const ridges = [474, 560, 690].map((b, i) => rolling(rng, -10, W + 10, b, [16, 12, 10][i], 30));
      const stones = Array.from({ length: 14 }, (_, i) => {
        const x = rng.range(20, W - 20), y = yAt(ridges[1], x) + rng.range(10, 110);
        return <Ink key={"st" + i} c="s0" d={ellipse(x, y, rng.range(4, 10), rng.range(2, 4))} />;
      });
      return {
        back: <MountainRange rng={rng} x0={-10} x1={W + 10} base={HZ + 2} amp={22} faint bottom={HZ + 6} />,
        front: (
          <g>
            <Hill rng={rng} pts={ridges[0]} cls="sf" />
            <Hill rng={rng} pts={ridges[1]} />
            {river && <River rng={rng} cx={W / 2} uid={uid} />}
            {stones}
            <Grass rng={rng} x0={0} x1={W} yOf={(x) => yAt(ridges[1], x)} n={90} />
          </g>
        ),
        foreground: (
          <g>
            <Hill rng={rng} pts={ridges[2]} />
            <Grass rng={rng} x0={0} x1={W} yOf={(x) => yAt(ridges[2], x)} n={60} />
          </g>
        ),
        arch: { x: Ax, y: yAt(ridges[1], Ax) + 6, s: 0.66 },
        mark: { x: Lx, y: yAt(ridges[2], Lx) + 26, s: 1.15 },
        trees: [90, 210, 560, 1000, 1130].map((x) => ({ x, y: yAt(ridges[1], x) + rng.range(8, 30), s: rng.range(1.1, 1.5) })),
        figures: [{ x: W / 2 + 10, y: yAt(ridges[2], W / 2) + 40, s: 1.5 }, { x: W / 2 + 28, y: yAt(ridges[2], W / 2) + 41, s: 1.45 }],
        path: [[W / 2, H], [W / 2 + 10, 700], [Ax - 80, 600], [Ax, yAt(ridges[1], Ax) + 8]],
      };
    }
  }
}
