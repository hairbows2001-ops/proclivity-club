import type { CSSProperties, ReactNode } from "react";
import type { Rng } from "@/lib/rng";
import { r1 } from "@/lib/rng";
import type { Architecture } from "@/lib/types";
import { Ink } from "./Ink";
import { circle, line, poly, rect, seg } from "./geometry";

/* All buildings are drawn from a centre point x, standing on ground line y, at scale s. */

export interface BuildingProps {
  x: number;
  y: number;
  s: number;
  rng: Rng;
  smoke?: boolean;
  /** Chance (0–1) that each window is lit. Leave out for the default mix. */
  lit?: number;
}

/* ── Windows ───────────────────────────────────────────────────────────── */

export function Win({ x, y, w, h, rng, litChance = 0.35, arched = false, bars = 2 }: {
  x: number; y: number; w: number; h: number; rng: Rng; litChance?: number; arched?: boolean; bars?: number;
}) {
  const lit = rng.chance(litChance);
  const style = { "--d": `${r1(rng.range(0, 10))}s`, "--t": `${r1(rng.range(7, 16))}s` } as CSSProperties;
  const outline = arched
    ? `M${r1(x)} ${r1(y + h)}V${r1(y + w / 2)}A${r1(w / 2)} ${r1(w / 2)} 0 0 1 ${r1(x + w)} ${r1(y + w / 2)}V${r1(y + h)}Z`
    : rect(x, y, w, h);
  return (
    <g>
      {lit && <path d={outline} className="fill-soft window-lit" style={style} />}
      <Ink c="s0" d={outline} />
      {bars >= 1 && <Ink c="s0" d={seg(x + w / 2, y + (arched ? w / 2 : 0), x + w / 2, y + h)} />}
      {bars >= 2 && <Ink c="s0" d={seg(x, y + h * 0.5, x + w, y + h * 0.5)} />}
    </g>
  );
}

/* ── Chimney smoke ─────────────────────────────────────────────────────── */

export function Smoke({ x, y, s, rng }: { x: number; y: number; s: number; rng: Rng }) {
  const drift = rng.chance(0.5) ? 1 : -1;
  const paths = [0, 1, 2].map((k) => {
    let d = `M${r1(x + k * 1.5 * s)} ${r1(y)}`;
    let cx = x + k * 1.5 * s, cy = y;
    for (let i = 0; i < 5; i++) {
      const nx = cx + drift * (8 + i * 4) * s, ny = cy - (12 + i * 3) * s;
      d += `Q${r1(cx + drift * (i % 2 ? -6 : 10) * s)} ${r1((cy + ny) / 2)} ${r1(nx)} ${r1(ny)}`;
      cx = nx; cy = ny;
    }
    return d;
  });
  return <g opacity="0.7">{paths.map((d, i) => <Ink key={i} c="s0" d={d} />)}</g>;
}

/* ── Georgian country house ────────────────────────────────────────────── */

export function CountryHouse({ x, y, s, rng, smoke, lit }: BuildingProps) {
  const W = 250 * s, H = 86 * s;
  const L = x - W / 2;
  const roofH = 32 * s;
  const pw = W * 0.3;
  const els: ReactNode[] = [];
  const chimneys = [x - W * 0.33, x + W * 0.33];

  // chimneys and roof
  chimneys.forEach((cx, i) => els.push(<Ink key={"ch" + i} c="s1 occlude" d={rect(cx - 6 * s, y - H - roofH - 14 * s, 12 * s, 24 * s)} />));
  els.push(<Ink key="roof" c="s1 occlude" d={poly([[L + 6 * s, y - H], [L + 34 * s, y - H - roofH], [L + W - 34 * s, y - H - roofH], [L + W - 6 * s, y - H]])} />);
  for (let rx = L + 40 * s; rx < L + W - 40 * s; rx += 5 * s) {
    els.push(<Ink key={"rh" + rx} c="s0" d={seg(rx, y - H - roofH + 2 * s, rx, y - H - 2 * s)} />);
  }
  // body
  els.push(<Ink key="body" c="s1 occlude" d={rect(L, y - H, W, H)} />);
  els.push(<Ink key="cornice" c="s0" d={seg(L - 4 * s, y - H + 4 * s, L + W + 4 * s, y - H + 4 * s)} />);
  els.push(<Ink key="string" c="s0" d={seg(L, y - H * 0.48, L + W, y - H * 0.48)} />);
  els.push(<Ink key="plinth" c="s0" d={seg(L - 3 * s, y - 6 * s, L + W + 3 * s, y - 6 * s)} />);
  // central pavilion with pediment
  els.push(<Ink key="pav" c="s1 occlude" d={rect(x - pw / 2, y - H - 8 * s, pw, H + 8 * s)} />);
  els.push(<Ink key="ped" c="s1 occlude" d={poly([[x - pw / 2 - 5 * s, y - H - 8 * s], [x, y - H - 34 * s], [x + pw / 2 + 5 * s, y - H - 8 * s]])} />);
  els.push(<Ink key="oc" c="s0" d={circle(x, y - H - 18 * s, 5 * s)} />);
  for (let i = 0; i < 4; i++) {
    const px = x - pw / 2 + 6 * s + i * ((pw - 12 * s) / 3);
    els.push(<Ink key={"pil" + i} c="s0" d={seg(px, y - H - 4 * s, px, y - 6 * s)} />);
  }
  // windows
  const ww = 11 * s;
  const wingCols = 4;
  [-1, 1].forEach((side) => {
    for (let c = 0; c < wingCols; c++) {
      const span = (W - pw) / 2;
      const wx = side < 0 ? L + 12 * s + c * (span - 24 * s) / (wingCols - 1) - ww / 2 + 4 * s : x + pw / 2 + 12 * s + c * (span - 24 * s) / (wingCols - 1) - ww / 2 - 4 * s;
      els.push(<Win key={`u${side}${c}`} x={wx} y={y - H + 12 * s} w={ww} h={16 * s} rng={rng} litChance={lit} />);
      els.push(<Win key={`l${side}${c}`} x={wx} y={y - H * 0.48 + 7 * s} w={ww} h={21 * s} rng={rng} litChance={lit} />);
    }
  });
  els.push(<Win key="pu" x={x - ww / 2} y={y - H + 12 * s} w={ww} h={16 * s} rng={rng} litChance={lit ?? 0.6} />);
  // door and steps
  els.push(<Win key="door" x={x - 8 * s} y={y - 34 * s} w={16 * s} h={28 * s} rng={rng} arched bars={1} litChance={lit ?? 0.7} />);
  for (let i = 0; i < 3; i++) els.push(<Ink key={"st" + i} c="s0" d={seg(x - (12 + i * 4) * s, y - 4 * s + i * 2 * s, x + (12 + i * 4) * s, y - 4 * s + i * 2 * s)} />);
  if (smoke) els.push(<Smoke key="smoke" x={chimneys[1]} y={y - H - roofH - 16 * s} s={s} rng={rng} />);
  return <g>{els}</g>;
}

/* ── Jacobean manor: a long range of gables with a gatehouse ───────────── */

export function Manor({ x, y, s, rng, smoke, lit }: BuildingProps) {
  const W = 400 * s, H = 58 * s;
  const L = x - W / 2;
  const els: ReactNode[] = [];
  // the far range of the courtyard, faint behind
  els.push(<Ink key="far" c="sf" d={line([[L + 30 * s, y - H - 10 * s], ...Array.from({ length: 9 }, (_, i) => {
    const gx = L + 30 * s + (i + 0.5) * ((W - 60 * s) / 9);
    return [[gx - 12 * s, y - H - 10 * s], [gx, y - H - 32 * s], [gx + 12 * s, y - H - 10 * s]] as [number, number][];
  }).flat(), [L + W - 30 * s, y - H - 10 * s]])} />);
  // chimney stacks
  for (let i = 0; i < 5; i++) {
    const cx = L + 50 * s + i * 75 * s + rng.range(-8, 8) * s;
    els.push(<Ink key={"cs" + i} c="s1 occlude" d={rect(cx - 7 * s, y - H - 40 * s, 14 * s, 40 * s)} />);
    els.push(<Ink key={"csl" + i} c="s0" d={seg(cx, y - H - 40 * s, cx, y - H)} />);
    if (smoke && i === 3) els.push(<Smoke key="smoke" x={cx} y={y - H - 42 * s} s={s} rng={rng} />);
  }
  // main range with gables
  const gables = 8;
  const gw = W / gables;
  const top: [number, number][] = [[L, y]];
  for (let i = 0; i < gables; i++) {
    const gx = L + i * gw;
    top.push([gx, y - H], [gx + gw / 2, y - H - 24 * s], [gx + gw, y - H]);
  }
  top.push([L + W, y]);
  els.push(<Ink key="range" c="s1 occlude" d={poly(top)} />);
  for (let i = 0; i < gables; i++) {
    const gx = L + i * gw;
    els.push(<Ink key={"fin" + i} c="s0" d={seg(gx + gw / 2, y - H - 24 * s, gx + gw / 2, y - H - 31 * s)} />);
    els.push(<Win key={"gw" + i} x={gx + gw / 2 - 5 * s} y={y - H - 12 * s} w={10 * s} h={9 * s} rng={rng} bars={1} litChance={lit ?? 0.2} />);
    // mullioned windows on two floors
    [y - H + 10 * s, y - H + 32 * s].forEach((wy, k) => {
      if (i === 3 || i === 4) return;
      els.push(<Win key={`mw${i}${k}`} x={gx + gw / 2 - 11 * s} y={wy} w={22 * s} h={14 * s} rng={rng} bars={2} litChance={lit} />);
    });
  }
  els.push(<Ink key="string" c="s0" d={seg(L, y - H + 27 * s, L + W, y - H + 27 * s)} />);
  // gatehouse towers
  [x - 30 * s, x + 30 * s].forEach((tx, i) => {
    const th = H + 54 * s;
    const crenels: [number, number][] = [[tx - 15 * s, y]];
    crenels.push([tx - 15 * s, y - th]);
    for (let k = 0; k < 5; k++) {
      const cx0 = tx - 15 * s + k * 6 * s;
      crenels.push([cx0, y - th - (k % 2 ? 0 : 6 * s)], [cx0 + 6 * s, y - th - (k % 2 ? 0 : 6 * s)]);
    }
    crenels.push([tx + 15 * s, y - th], [tx + 15 * s, y]);
    els.push(<Ink key={"tw" + i} c="s1 occlude" d={poly(crenels)} />);
    for (let k = 0; k < 3; k++) els.push(<Win key={`tww${i}${k}`} x={tx - 4 * s} y={y - th + 14 * s + k * 26 * s} w={8 * s} h={14 * s} rng={rng} bars={1} litChance={lit} />);
  });
  els.push(<Ink key="gate" c="s1 occlude" d={rect(x - 15 * s, y - 70 * s, 30 * s, 70 * s)} />);
  els.push(<Win key="arch" x={x - 10 * s} y={y - 34 * s} w={20 * s} h={34 * s} rng={rng} arched bars={1} litChance={lit ?? 0.8} />);
  els.push(<Win key="oriel" x={x - 9 * s} y={y - 62 * s} w={18 * s} h={18 * s} rng={rng} bars={2} litChance={lit ?? 0.8} />);
  return <g>{els}</g>;
}

/* ── A terrace of tall city houses ─────────────────────────────────────── */

export function Townhouses({ x, y, s, rng, smoke, lit }: BuildingProps) {
  const count = 7;
  const widths = Array.from({ length: count }, () => rng.range(50, 66) * s);
  const total = widths.reduce((a, b) => a + b, 0);
  let cx = x - total / 2;
  const els: ReactNode[] = [];
  widths.forEach((w, i) => {
    const h = rng.range(150, 190) * s;
    const L = cx;
    // chimney stack
    const chx = L + (rng.chance(0.5) ? 8 * s : w - 22 * s);
    els.push(<Ink key={"ch" + i} c="s1 occlude" d={rect(chx, y - h - 16 * s, 14 * s, 18 * s)} />);
    for (let p = 0; p < 3; p++) els.push(<Ink key={`pot${i}${p}`} c="s0" d={rect(chx + 1.5 * s + p * 4 * s, y - h - 21 * s, 3 * s, 5 * s)} />);
    if (smoke && i === 2) els.push(<Smoke key="smoke" x={chx + 7 * s} y={y - h - 22 * s} s={s} rng={rng} />);
    // facade
    els.push(<Ink key={"f" + i} c="s1 occlude" d={rect(L, y - h, w, h)} />);
    els.push(<Ink key={"par" + i} c="s0" d={seg(L, y - h + 6 * s, L + w, y - h + 6 * s)} />);
    els.push(<Ink key={"cor" + i} c="s0" d={seg(L - 2 * s, y - h + 9 * s, L + w + 2 * s, y - h + 9 * s)} />);
    els.push(<Ink key={"rust" + i} c="s0" d={seg(L, y - 42 * s, L + w, y - 42 * s)} />);
    // windows: three or two bays
    const bays = w > 58 * s ? 3 : 2;
    const ww = 9 * s;
    const gap = (w - bays * ww) / (bays + 1);
    const floors = [{ y: y - h + 18 * s, h: 16 * s }, { y: y - h + 46 * s, h: 22 * s }, { y: y - h + 80 * s, h: 30 * s }];
    floors.forEach((f, k) => {
      if (f.y + f.h > y - 48 * s) return;
      for (let b = 0; b < bays; b++) {
        els.push(<Win key={`w${i}${k}${b}`} x={L + gap + b * (ww + gap)} y={f.y} w={ww} h={f.h} rng={rng} litChance={lit ?? 0.32} />);
      }
      if (k === 2) els.push(<Ink key={"bal" + i} c="s0" d={line([[L + gap - 3 * s, f.y + f.h + 3 * s], [L + w - gap + 3 * s, f.y + f.h + 3 * s]])} />);
    });
    // door with fanlight, ground-floor window
    const doorLeft = i % 2 === 0;
    const dx = doorLeft ? L + gap : L + w - gap - 12 * s;
    els.push(<Ink key={"door" + i} c="s0" d={rect(dx, y - 30 * s, 12 * s, 24 * s)} />);
    els.push(<Win key={"fan" + i} x={dx} y={y - 38 * s} w={12 * s} h={8 * s} rng={rng} arched bars={0} litChance={lit ?? 0.45} />);
    els.push(<Win key={"gw" + i} x={doorLeft ? L + w - gap - 16 * s : L + gap} y={y - 34 * s} w={16 * s} h={22 * s} rng={rng} litChance={lit ?? 0.4} />);
    for (let k = 0; k < 2; k++) els.push(<Ink key={`step${i}${k}`} c="s0" d={seg(dx - 2 * s - k * 2 * s, y - 6 * s + k * 3 * s, dx + 14 * s + k * 2 * s, y - 6 * s + k * 3 * s)} />);
    cx += w;
  });
  // area railings
  const L0 = x - total / 2;
  els.push(<Ink key="rail" c="s0" d={seg(L0, y + 4 * s, L0 + total, y + 4 * s)} />);
  for (let rx = L0; rx <= L0 + total; rx += 4 * s) els.push(<Ink key={"r" + rx} c="s0" d={seg(rx, y + 4 * s, rx, y + 13 * s)} />);
  return <g>{els}</g>;
}

/* ── Cottage ───────────────────────────────────────────────────────────── */

export function Cottage({ x, y, s, rng, smoke, lit }: BuildingProps) {
  const W = 80 * s, H = 34 * s;
  const L = x - W / 2;
  const els: ReactNode[] = [];
  els.push(<Ink key="ch" c="s1 occlude" d={rect(L + W - 22 * s, y - H - 34 * s, 10 * s, 22 * s)} />);
  if (smoke) els.push(<Smoke key="sm" x={L + W - 17 * s} y={y - H - 36 * s} s={s} rng={rng} />);
  els.push(<Ink key="roof" c="s1 occlude" d={poly([[L - 6 * s, y - H], [L + 14 * s, y - H - 30 * s], [L + W - 14 * s, y - H - 30 * s], [L + W + 6 * s, y - H]])} />);
  for (let i = 0; i < 16; i++) {
    const t = i / 15;
    els.push(<Ink key={"th" + i} c="s0" d={seg(L + 14 * s + t * (W - 28 * s), y - H - 28 * s, L - 4 * s + t * (W + 8 * s), y - H - 2 * s)} />);
  }
  els.push(<Ink key="body" c="s1 occlude" d={rect(L, y - H, W, H)} />);
  els.push(<Win key="w1" x={L + 10 * s} y={y - H + 9 * s} w={14 * s} h={12 * s} rng={rng} litChance={lit ?? 0.7} />);
  els.push(<Win key="w2" x={L + W - 24 * s} y={y - H + 9 * s} w={14 * s} h={12 * s} rng={rng} litChance={lit ?? 0.7} />);
  els.push(<Ink key="door" c="s0" d={rect(x - 6 * s, y - 24 * s, 12 * s, 24 * s)} />);
  return <g>{els}</g>;
}

/* ── A cluster of low Mediterranean houses ─────────────────────────────── */

export function Village({ x, y, s, rng, smoke, lit }: BuildingProps) {
  const houses = Array.from({ length: 9 }, (_, i) => ({
    dx: rng.range(-160, 160) * s,
    depth: i < 4 ? 1 : 0,
    w: rng.range(34, 58) * s,
    h: rng.range(26, 46) * s,
  })).sort((a, b) => b.depth - a.depth);
  const els: ReactNode[] = [];
  houses.forEach((hs, i) => {
    const k = hs.depth ? 0.8 : 1;
    const w = hs.w * k, h = hs.h * k;
    const L = x + hs.dx - w / 2;
    const base = y - hs.depth * 14 * s;
    const pitch = 9 * s * k;
    els.push(<Ink key={"r" + i} c="s1 occlude" d={poly([[L - 3 * s, base - h], [L + w / 2, base - h - pitch], [L + w + 3 * s, base - h]])} />);
    for (let t = 1; t < 6; t++) els.push(<Ink key={`t${i}${t}`} c="s0" d={seg(L + (t / 6) * w, base - h - pitch * (1 - Math.abs(t / 6 - 0.5) * 2) + 1, L + (t / 6) * w, base - h - 1)} />);
    els.push(<Ink key={"b" + i} c="s1 occlude" d={rect(L, base - h, w, h)} />);
    const cols = Math.max(1, Math.floor(w / (14 * s)));
    for (let c = 0; c < cols; c++) {
      const wx = L + (c + 0.5) * (w / cols) - 3 * s;
      els.push(<Win key={`w${i}${c}`} x={wx} y={base - h + 7 * s} w={6 * s} h={8 * s} rng={rng} bars={1} litChance={lit ?? 0.45} />);
      if (h > 34 * s) els.push(<Win key={`v${i}${c}`} x={wx} y={base - h + 22 * s} w={6 * s} h={9 * s} rng={rng} bars={1} litChance={lit ?? 0.35} arched />);
    }
    if (smoke && i === houses.length - 2) els.push(<Smoke key="sm" x={L + w * 0.7} y={base - h - pitch} s={s * 0.8} rng={rng} />);
  });
  return <g>{els}</g>;
}

export function Building({ kind, ...props }: BuildingProps & { kind: Architecture }) {
  switch (kind) {
    case "country-house": return <CountryHouse {...props} />;
    case "manor": return <Manor {...props} />;
    case "townhouses": return <Townhouses {...props} />;
    case "cottage": return <Cottage {...props} />;
    case "village": return <Village {...props} />;
    default: return null;
  }
}

