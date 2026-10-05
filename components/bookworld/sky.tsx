import type { CSSProperties } from "react";
import type { Rng } from "@/lib/rng";
import { r1 } from "@/lib/rng";
import { constellationEdges } from "@/lib/sky";
import type { CelestialSymbol, Sky } from "@/lib/types";
import { Ink } from "./Ink";
import { arc, circle, ellipse, line, poly, seg, type Pt } from "./geometry";

/* ── Stars ─────────────────────────────────────────────────────────────── */

export function Stars({ rng, count, x0, x1, y0, y1, twinkle = true }: {
  rng: Rng; count: number; x0: number; x1: number; y0: number; y1: number; twinkle?: boolean;
}) {
  const stars = Array.from({ length: count }, () => {
    // denser towards the top of the sky
    const t = Math.pow(rng.next(), 1.6);
    return { x: rng.range(x0, x1), y: y0 + t * (y1 - y0), m: rng.next(), tw: rng.chance(0.35), d: rng.range(0, 8), dur: rng.range(3, 9) };
  });
  return (
    <g aria-hidden>
      {stars.map((s, i) => {
        const style = twinkle && s.tw ? ({ "--d": `${r1(s.d)}s`, "--t": `${r1(s.dur)}s`, "--o": s.m > 0.9 ? 1 : 0.75 } as CSSProperties) : undefined;
        const cls = twinkle && s.tw ? "twinkle" : undefined;
        if (s.m > 0.94) {
          const r = 4 + s.m * 3;
          return (
            <g key={i} className={cls} style={style}>
              <path className="fill-soft" d={sparkle(s.x, s.y, r)} />
            </g>
          );
        }
        return <circle key={i} className={`fill-soft ${cls ?? ""}`} cx={r1(s.x)} cy={r1(s.y)} r={r1(0.5 + s.m * 1.1)} style={{ opacity: 0.35 + s.m * 0.5, ...style }} />;
      })}
    </g>
  );
}

/** Four-pointed engraved star. */
export function sparkle(x: number, y: number, r: number): string {
  const w = r * 0.16;
  return poly([[x, y - r], [x + w, y - w], [x + r, y], [x + w, y + w], [x, y + r], [x - w, y + w], [x - r, y], [x - w, y - w]]);
}

/* ── A small constellation drawn into the sky of each world ────────────── */

export function SkyConstellation({ rng, x, y, w, h, label }: { rng: Rng; x: number; y: number; w: number; h: number; label?: string }) {
  const n = rng.int(5, 7);
  const pts = Array.from({ length: n }, () => ({ x: x + rng.range(0, w), y: y + rng.range(0, h) }));
  const edges = constellationEdges(pts, rng.int(0, 9));
  const top = pts.reduce((a, b) => (b.y < a.y ? b : a));
  return (
    <g aria-hidden>
      {edges.map(([a, b], i) => (
        <Ink key={i} c="s0" d={seg(pts[a].x, pts[a].y, pts[b].x, pts[b].y)} />
      ))}
      {pts.map((p, i) => (
        <g key={i}>
          <circle className="fill-soft" cx={r1(p.x)} cy={r1(p.y)} r={i === 0 ? 2.6 : 1.8} />
          <Ink c="s0" d={circle(p.x, p.y, i === 0 ? 6 : 4.5)} />
        </g>
      ))}
      {label && (
        <text x={r1(top.x + 10)} y={r1(top.y - 10)} fontSize="13" fontStyle="italic" letterSpacing="1.5" opacity="0.8">
          {label}
        </text>
      )}
    </g>
  );
}

/* ── Moon, sun and other luminaries ────────────────────────────────────── */

export function Luminary({ kind, x, y, r, uid, rng, rings: showRings = true }: { kind: Sky; x: number; y: number; r: number; uid: string; rng: Rng; rings?: boolean }) {
  if (kind === "starfield") return <MilkyWay rng={rng} />;

  const rings = !showRings ? null : (
    <g>
      <Ink c="s0" d={circle(x, y, r * 1.9)} />
      <Ink c="sf" d={circle(x, y, r * 2.7)} />
      {Array.from({ length: 72 }, (_, i) => {
        const a = (i / 72) * Math.PI * 2;
        const l = i % 6 === 0 ? 9 : 4;
        const R = r * 2.7;
        return <Ink key={i} c="sf" d={seg(x + Math.cos(a) * R, y + Math.sin(a) * R, x + Math.cos(a) * (R + l), y + Math.sin(a) * (R + l))} />;
      })}
      <Ink c="s0" d={ellipse(x, y, r * 4.2, r * 1.2)} transform={`rotate(-18 ${r1(x)} ${r1(y)})`} />
    </g>
  );

  const halo = <circle cx={x} cy={y} r={r * 3.2} fill={`url(#${uid}-halo)`} />;

  if (kind === "crescent") {
    return (
      <g>
        {halo}
        {rings}
        <mask id={`${uid}-crescent`}>
          <circle cx={x} cy={y} r={r} fill="white" />
          <circle cx={x + r * 0.42} cy={y - r * 0.18} r={r * 0.92} fill="black" />
        </mask>
        <Ink c="sf" d={circle(x, y, r)} />
        <g mask={`url(#${uid}-crescent)`}>
          <circle cx={x} cy={y} r={r} className="fill-soft" opacity="0.92" />
        </g>
        <Ink c="s0" d={circle(x, y, r)} />
      </g>
    );
  }

  if (kind === "full-moon" || kind === "new-moon") {
    const full = kind === "full-moon";
    return (
      <g>
        {full && halo}
        {rings}
        <clipPath id={`${uid}-disc`}>
          <circle cx={x} cy={y} r={r} />
        </clipPath>
        <circle cx={x} cy={y} r={r} className={full ? "fill-soft" : "occlude"} opacity={full ? 0.16 : 1} />
        <g clipPath={`url(#${uid}-disc)`}>
          {Array.from({ length: Math.floor(r / 2.4) }, (_, i) => {
            const yy = y - r + i * 4.8;
            return <Ink key={i} c="s0" d={seg(x + r * 0.15 + Math.sin(i) * 3, yy, x + r * 1.2, yy + r * 0.25)} />;
          })}
          {full && Array.from({ length: 9 }, (_, i) => {
            const a = rng.range(0, 6.28), d = rng.range(0, r * 0.7);
            return <Ink key={"c" + i} c="s0" d={circle(x + Math.cos(a) * d, y + Math.sin(a) * d, rng.range(2, r * 0.18))} />;
          })}
        </g>
        <Ink c={full ? "s1" : "sf"} d={circle(x, y, r)} />
      </g>
    );
  }

  if (kind === "eclipse") {
    return (
      <g>
        {halo}
        {rings}
        {Array.from({ length: 96 }, (_, i) => {
          const a = (i / 96) * Math.PI * 2;
          const l = r * (0.25 + rng.next() * (i % 4 === 0 ? 1.1 : 0.45));
          return <Ink key={i} c="s0" d={seg(x + Math.cos(a) * (r + 2), y + Math.sin(a) * (r + 2), x + Math.cos(a) * (r + l), y + Math.sin(a) * (r + l))} />;
        })}
        <circle cx={x} cy={y} r={r} className="occlude" />
        <Ink c="s1" d={circle(x, y, r)} />
      </g>
    );
  }

  if (kind === "sun") {
    return (
      <g>
        {halo}
        {rings}
        {Array.from({ length: 48 }, (_, i) => {
          const a = (i / 48) * Math.PI * 2;
          const l = i % 2 === 0 ? r * 0.9 : r * 0.45;
          return <Ink key={i} c="s0" d={seg(x + Math.cos(a) * (r + 6), y + Math.sin(a) * (r + 6), x + Math.cos(a) * (r + 6 + l), y + Math.sin(a) * (r + 6 + l))} />;
        })}
        <circle cx={x} cy={y} r={r} className="fill-soft" opacity="0.28" />
        <Ink c="s1" d={circle(x, y, r)} />
        <Ink c="s0" d={circle(x, y, r * 0.78)} />
      </g>
    );
  }

  // comet
  return (
    <g>
      {halo}
      {Array.from({ length: 9 }, (_, i) => {
        const spread = (i - 4) * 5;
        return <Ink key={i} c={i === 4 ? "s1" : "s0"} d={`M${x} ${y}Q${r1(x + 160)} ${r1(y - 30 + spread)} ${r1(x + 320 + Math.abs(spread) * 3)} ${r1(y - 90 + spread * 3)}`} />;
      })}
      <circle cx={x} cy={y} r={r * 0.28} className="fill-soft" />
      <Ink c="s0" d={circle(x, y, r * 0.55)} />
    </g>
  );
}

function MilkyWay({ rng }: { rng: Rng }) {
  const dots = Array.from({ length: 260 }, () => {
    const t = rng.next();
    const x = t * 1200;
    const cy = 90 + t * 260 + Math.sin(t * 5) * 30;
    const off = (rng.next() + rng.next() + rng.next() - 1.5) * 70;
    return { x, y: cy + off, r: rng.range(0.3, 1.1) };
  });
  return (
    <g aria-hidden opacity="0.55">
      {dots.map((d, i) => (
        <circle key={i} className="fill-soft" cx={r1(d.x)} cy={r1(d.y)} r={r1(d.r)} />
      ))}
    </g>
  );
}

/* ── Engraved celestial symbols ────────────────────────────────────────── */

export function CelestialMark({ kind, x, y, s = 1 }: { kind: CelestialSymbol; x: number; y: number; s?: number }) {
  if (kind === "none") return null;
  const R = 34 * s;
  const tr = (a: number) => `rotate(${a} ${r1(x)} ${r1(y)})`;
  switch (kind) {
    case "armillary":
      return (
        <g>
          <Ink c="s0" d={circle(x, y, R)} />
          <Ink c="s0" d={ellipse(x, y, R, R * 0.3)} transform={tr(-23)} />
          <Ink c="s0" d={ellipse(x, y, R * 0.3, R)} />
          <Ink c="s0" d={ellipse(x, y, R, R * 0.55)} transform={tr(40)} />
          <Ink c="s0" d={seg(x - R * 0.5, y + R * 1.2, x + R * 0.5, y - R * 1.2)} />
          <Ink c="s0" d={line([[x - R * 0.5, y + R * 1.5], [x, y + R * 1.15], [x + R * 0.5, y + R * 1.5]])} />
          <circle cx={x} cy={y} r={2.5 * s} className="fill-ink" />
        </g>
      );
    case "hourglass": {
      const w = R * 0.62, h = R * 1.1;
      return (
        <g>
          <Ink c="s0" d={seg(x - w - 6, y - h, x + w + 6, y - h)} />
          <Ink c="s0" d={seg(x - w - 6, y + h, x + w + 6, y + h)} />
          <Ink c="s0" d={seg(x - w - 2, y - h, x - w - 2, y + h)} />
          <Ink c="s0" d={seg(x + w + 2, y - h, x + w + 2, y + h)} />
          <Ink c="s0" d={`M${r1(x - w)} ${r1(y - h)}C${r1(x - w)} ${r1(y - 8)} ${r1(x - 3)} ${r1(y - 6)} ${r1(x - 2)} ${r1(y)}C${r1(x - 3)} ${r1(y + 6)} ${r1(x - w)} ${r1(y + 8)} ${r1(x - w)} ${r1(y + h)}`} />
          <Ink c="s0" d={`M${r1(x + w)} ${r1(y - h)}C${r1(x + w)} ${r1(y - 8)} ${r1(x + 3)} ${r1(y - 6)} ${r1(x + 2)} ${r1(y)}C${r1(x + 3)} ${r1(y + 6)} ${r1(x + w)} ${r1(y + 8)} ${r1(x + w)} ${r1(y + h)}`} />
          <Ink c="s0" d={`M${r1(x - w * 0.8)} ${r1(y + h)}Q${x} ${r1(y + h * 0.45)} ${r1(x + w * 0.8)} ${r1(y + h)}`} />
          <Ink c="s0" d={seg(x, y, x, y + h * 0.6)} />
        </g>
      );
    }
    case "compass": {
      const pts: Pt[] = [];
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
        const rr = i % 4 === 0 ? R * 1.25 : i % 2 === 0 ? R * 0.75 : R * 0.28;
        pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
      }
      return (
        <g>
          <Ink c="s0" d={circle(x, y, R * 0.92)} />
          <Ink c="s0" d={circle(x, y, R * 0.98)} />
          <Ink c="s0" d={poly(pts)} />
          {[0, 4, 8, 12].map((i) => <Ink key={i} c="s0" d={seg(x, y, pts[i][0], pts[i][1])} />)}
          <text x={x} y={r1(y - R * 1.4)} fontSize={11 * s} textAnchor="middle" letterSpacing="1">N</text>
        </g>
      );
    }
    case "eye":
      return (
        <g>
          <Ink c="s0" d={`M${r1(x - R)} ${y}Q${x} ${r1(y - R * 0.8)} ${r1(x + R)} ${y}Q${x} ${r1(y + R * 0.8)} ${r1(x - R)} ${y}Z`} />
          <Ink c="s0" d={circle(x, y, R * 0.34)} />
          <circle cx={x} cy={y} r={R * 0.14} className="fill-ink" />
          {Array.from({ length: 11 }, (_, i) => {
            const a = Math.PI + (i / 10) * Math.PI;
            return <Ink key={i} c="s0" d={seg(x + Math.cos(a) * R * 0.62, y + Math.sin(a) * R * 0.62, x + Math.cos(a) * R * 0.95, y + Math.sin(a) * R * 0.95 - 4)} />;
          })}
        </g>
      );
    case "key":
      return (
        <g transform={tr(-30)}>
          <Ink c="s0" d={circle(x - R * 0.7, y, R * 0.32)} />
          <Ink c="s0" d={circle(x - R * 0.7, y, R * 0.18)} />
          <Ink c="s0" d={seg(x - R * 0.38, y, x + R, y)} />
          <Ink c="s0" d={line([[x + R * 0.55, y], [x + R * 0.55, y + R * 0.3], [x + R * 0.72, y + R * 0.3], [x + R * 0.72, y + R * 0.18], [x + R, y + R * 0.18], [x + R, y]])} />
        </g>
      );
    case "orbit":
      return (
        <g>
          <circle cx={x} cy={y} r={3 * s} className="fill-ink" />
          {[0.45, 0.75, 1.05].map((k, i) => (
            <g key={i}>
              <Ink c="s0" d={ellipse(x, y, R * k * 1.5, R * k * 0.55)} transform={tr(-12)} />
            </g>
          ))}
          <circle cx={r1(x + R * 0.66)} cy={r1(y - R * 0.12)} r={1.8 * s} className="fill-soft" />
          <circle cx={r1(x - R * 1.4)} cy={r1(y + R * 0.4)} r={2.4 * s} className="fill-soft" />
          <Ink c="s0" d={arc(x, y, R * 1.75, -2.6, -0.6)} />
        </g>
      );
  }
}
