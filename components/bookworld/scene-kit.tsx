/** Small helpers shared by the hand-composed scenes. */

import type { CSSProperties } from "react";
import { r1 } from "@/lib/rng";
import type { SceneContext } from "./scenes";
import { sparkle } from "./sky";
import { seg, type Pt } from "./geometry";

/** Scale a count of fine marks by the scene's density. */
export const n = (base: number, ctx: SceneContext) => Math.round(base * ctx.density);

/** A bright four-pointed star with a halo — the "one star" of a composition. */
export function KeyStar({ x, y, r = 9, uid }: { x: number; y: number; r?: number; uid: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 3.2} fill={`url(#${uid}-halo)`} />
      <path d={sparkle(x, y, r)} className="fill-soft twinkle" style={{ "--t": "8s", "--o": 1 } as CSSProperties} />
      <path d={sparkle(x, y, r * 0.55)} className="fill-soft" transform={`rotate(45 ${x} ${y})`} opacity="0.6" />
    </g>
  );
}

/** A constellation whose lines thin away into the dark. */
export function FadingConstellation({ pts, label }: { pts: Pt[]; uid?: string; label?: string }) {
  return (
    <g>
      {pts.slice(1).map(([x, y], i) => {
        const [px, py] = pts[i];
        return <path key={i} d={seg(px, py, x, y)} stroke="var(--color-gold)" style={{ strokeWidth: "calc(var(--hair) * 0.6)" }} opacity={r1(0.75 - i * 0.14)} strokeDasharray={i >= pts.length - 3 ? "2 4" : undefined} />;
      })}
      {pts.map(([x, y], i) => (
        <circle key={"s" + i} cx={x} cy={y} r={i === 0 ? 2.4 : 1.6} className="fill-soft" opacity={r1(1 - i * 0.1)} />
      ))}
      {label && (
        <text x={pts[0][0] + 10} y={pts[0][1] - 9} fontSize="12" fontStyle="italic" letterSpacing="1.5" opacity="0.7">
          {label}
        </text>
      )}
    </g>
  );
}

