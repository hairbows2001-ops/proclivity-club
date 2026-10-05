/**
 * ART-DIRECTED SCENES
 * ───────────────────
 * Each scene is a deliberate composition, built from the shared line-art
 * primitives. A book chooses one with `world.art.scene` in content/books.ts.
 * Books without a scene are composed automatically by BookWorld.
 *
 * Coordinates are on a 1200 × 780 plate. Each scene also says where its
 * round medallion (used on Library cards) should be centred, so every
 * medallion is cropped around that book's own focal point.
 *
 * To add a scene: write a function here, add its name to SceneName in
 * lib/types.ts, and register it in SCENES at the bottom of this file.
 */

import type { CSSProperties, ReactNode } from "react";
import type { Rng } from "@/lib/rng";
import { r1 } from "@/lib/rng";
import type { SceneName } from "@/lib/types";
import { Ink } from "./Ink";
import { Building, Win } from "./architecture";
import { LandmarkShape, Sculpture } from "./landmarks";
import { Aeroplane, Birds, Boat, Figure, Grass, Tree } from "./nature";
import { CelestialMark, Luminary, SkyConstellation, Stars, sparkle } from "./sky";
import { Hill, MountainRange, Water } from "./terrain";
import { AirLines, DistantSkyline, Easel, Flowers, Frost, Jetty, Quay, Reflection, Rocks, TinyStars } from "./extras";
import { line, rect, ridge, rolling, seg, smooth, underside, yAt, type Pt } from "./geometry";

export interface SceneContext {
  rng: Rng;
  uid: string;
  vignette: boolean;
  /** 0.6 sparse … 1.6 dense */
  density: number;
  label?: string;
}

export interface SceneLayer {
  delay: number;
  node: ReactNode;
}

export interface ComposedScene {
  layers: SceneLayer[];
  /** Centre of the round medallion crop. */
  medallion: { cx: number; cy: number };
  /** Optional orbit swept around the focal point in the medallion. */
  orbit?: { x: number; y: number };
}

const W = 1200, H = 780;
const n = (base: number, ctx: SceneContext) => Math.round(base * ctx.density);

/** A bright four-pointed star with a halo — the "one star" of a composition. */
function KeyStar({ x, y, r = 9, uid }: { x: number; y: number; r?: number; uid: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 3.2} fill={`url(#${uid}-halo)`} />
      <path d={sparkle(x, y, r)} className="fill-soft twinkle" style={{ "--t": "8s", "--o": 1 } as CSSProperties} />
      <path d={sparkle(x, y, r * 0.55)} className="fill-soft" transform={`rotate(45 ${x} ${y})`} opacity="0.6" />
    </g>
  );
}

/** A constellation whose lines thin away into the dark. */
function FadingConstellation({ pts, label }: { pts: Pt[]; uid?: string; label?: string }) {
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

/* ═════════════════════════════════════════════════════════════════════════
 *  TO THE LIGHTHOUSE — "lighthouse-bay"
 *  Focal point: the lamp, across still water. The coast enters from the
 *  lower left; water fills the lower half; the house is barely there.
 * ═════════════════════════════════════════════════════════════════════════ */

function lighthouseBay(ctx: SceneContext): ComposedScene {
  const { rng, uid } = ctx;
  const HZ = 432;
  const LX = 708, LY = 520, LS = 0.74;
  const lampY = LY - (200 + 30) * LS;
  const bank: Pt[] = [[-20, 548], [60, 552], [140, 566], [220, 590], [290, 622], [350, 662], [400, 706], [440, 752], [462, 800]];
  const bankY = (x: number) => yAt(bank, x);
  const farLeft = ridge(rng, -20, 460, HZ, 26, 6, 0.5);
  const farRight = ridge(rng, 900, 1220, HZ, 16, 5, 0.5);

  const sky = (
    <g>
      <Stars rng={rng} count={n(150, ctx)} x0={0} x1={W} y0={20} y1={HZ - 40} />
      <TinyStars rng={rng} n={n(40, ctx)} x0={560} x1={1000} y0={60} y1={300} />
      <AirLines rng={rng} y0={240} y1={HZ - 20} n={n(5, ctx)} />
      <Luminary kind="crescent" x={330} y={150} r={18} uid={uid} rng={rng} />
      <FadingConstellation pts={[[858, 92], [902, 128], [960, 118], [1010, 160], [1052, 148], [1098, 196]]} uid={uid} label={ctx.vignette ? undefined : ctx.label} />
      <KeyStar x={760} y={182} uid={uid} />
      {!ctx.vignette && <CelestialMark kind="compass" x={110} y={110} s={0.85} />}
      <Birds rng={rng} x={560} y={300} n={4} />
    </g>
  );

  const distance = (
    <g>
      <Ink c="sf occlude" d={underside(farLeft, HZ + 2)} />
      <Ink c="sf occlude" d={underside(farRight, HZ + 2)} />
      {/* the house, barely visible on the far shore */}
      <Building kind="country-house" x={250} y={HZ - 2} s={0.2} rng={rng} lit={0.5} />
      <Tree kind="round" x={196} y={HZ - 1} s={0.32} rng={rng} />
      <Tree kind="round" x={302} y={HZ - 1} s={0.28} rng={rng} />
      <Ink c="s0" d={seg(-10, HZ, W + 10, HZ)} />
    </g>
  );

  const water = (
    <g>
      <Water rng={rng} x0={-10} x1={W + 10} y0={HZ} y1={H} glints={[{ x: 330, w: 18 }]} />
      <Reflection x={LX} y0={LY + 6} y1={H} w={26} rng={rng} />
      {/* heavier foreground water marks, lower right */}
      <Ink c="s1" d={Array.from({ length: n(40, ctx) }, () => {
        const x = rng.range(480, W), y = rng.range(690, 775), l = rng.range(10, 46);
        return seg(x, y, x + l, y + rng.range(-1, 1));
      }).join("")} />
    </g>
  );

  const middle = (
    <g>
      <Rocks rng={rng} x={LX} y={LY + 6} n={7} s={0.9} />
      <LandmarkShape kind="lighthouse" x={LX} y={LY} s={LS} rng={rng} uid={uid} />
      <circle cx={LX} cy={lampY + 10} r={60} fill={`url(#${uid}-halo)`} />
      <Boat x={520} y={575} s={0.72} rng={rng} kind="sail" />
      <Boat x={960} y={462} s={0.34} rng={rng} kind="sail" />
    </g>
  );

  const coast = (
    <g>
      <Ink c="s1 occlude" d={line(bank) + `L-20 ${H + 20}Z`} />
      {/* the tide line, a little apart from the bank */}
      <Ink c="s0" d={smooth(bank.map(([x, y]) => [x + 14, y + 6]))} />
      <Grass rng={rng} x0={-10} x1={420} yOf={bankY} n={n(110, ctx)} />
      <Flowers rng={rng} x0={20} x1={330} yOf={bankY} n={n(26, ctx)} />
      {/* the footpath, narrowing down to the jetty */}
      <Ink c="s0" d={smooth([[120, H + 10], [150, 712], [196, 664], [252, 630], [300, 644]])} />
      <Ink c="s0" d={smooth([[150, H + 10], [170, 716], [208, 672], [258, 640], [302, 650]])} />
      {/* hatching along the slope of the bank */}
      {Array.from({ length: n(70, ctx) }, (_, i) => {
        const x = rng.range(0, 430), y = bankY(x) + rng.range(6, 120);
        return <Ink key={"bh" + i} c="s0" d={seg(x, y, x + 7, y - 4)} />;
      })}
      {/* shrubs along the bank */}
      {[[230, 0.42], [262, 0.36], [96, 0.5], [12, 0.6]].map(([x, s2], i) => <Tree key={"sh" + i} kind="round" x={x} y={bankY(x) + 6} s={s2} rng={rng} />)}
      <Rocks rng={rng} x={370} y={bankY(370) + 18} n={4} s={0.7} />
      {Array.from({ length: 8 }, (_, i) => {
        const x = 40 + i * 24, y = bankY(x) + 10;
        return <Ink key={"fp" + i} c="s0" d={seg(x, y, x, y - 12) + (i ? seg(x - 24, bankY(x - 24) + 2, x, y - 8) : "")} />;
      })}
      <Jetty x={300} y={646} len={90} s={0.9} />
      <Figure x={372} y={640} s={1.25} rng={rng} />
      <Easel x={150} y={590} s={1.2} />
      <Figure x={140} y={590} s={1.25} rng={rng} dress />
      <Tree kind="round" x={40} y={556} s={0.9} rng={rng} />
    </g>
  );

  return {
    layers: [
      { delay: 0, node: sky },
      { delay: 0.5, node: distance },
      { delay: 0.8, node: water },
      { delay: 1.3, node: middle },
      { delay: 1.9, node: coast },
    ],
    medallion: { cx: 560, cy: 470 },
  };
}

/* ═════════════════════════════════════════════════════════════════════════
 *  ORLANDO — "oak-and-great-house"
 *  Focal point: the oak on the hill, enormous, with the great house small
 *  in the valley beneath its branches. Centuries in the sky.
 * ═════════════════════════════════════════════════════════════════════════ */

function oakAndGreatHouse(ctx: SceneContext): ComposedScene {
  const { rng, uid } = ctx;
  const HZ = 470;
  const downs = [478, 520, 568].map((b, i) => rolling(rng, -20, W + 20, b, [10, 16, 18][i], 24));
  const crest: Pt[] = [[-20, 640], [120, 610], [260, 596], [420, 600], [560, 622], [700, 662], [860, 712], [1000, 760], [1220, 800]];
  const crestY = (x: number) => yAt(crest, x);

  const sky = (
    <g>
      <Stars rng={rng} count={n(150, ctx)} x0={0} x1={W} y0={20} y1={HZ - 40} />
      <Luminary kind="full-moon" x={900} y={168} r={30} uid={uid} rng={rng} />
      <SkyConstellation rng={rng} x={590} y={96} w={170} h={70} label={ctx.vignette ? undefined : ctx.label} />
      <AirLines rng={rng} y0={300} y1={HZ - 10} n={n(4, ctx)} />
      {!ctx.vignette && <CelestialMark kind="hourglass" x={1090} y={110} s={0.9} />}
      <Birds rng={rng} x={760} y={320} n={5} />
    </g>
  );

  // an avenue of small trees leading to the house, receding
  const avenue: ReactNode[] = [];
  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    const x = 680 + t * 150, y = 640 - t * 108, s = 0.75 - t * 0.48;
    avenue.push(<Tree key={"a" + i} kind="round" x={x} y={y} s={s} rng={rng} />);
    avenue.push(<Tree key={"b" + i} kind="round" x={x + 70 - t * 50} y={y + 6 - t * 4} s={s} rng={rng} />);
  }

  const land = (
    <g>
      <MountainRange rng={rng} x0={-20} x1={W + 20} base={HZ + 4} amp={26} faint bottom={HZ + 10} />
      <Hill rng={rng} pts={downs[0]} cls="sf" hedge />
      <Building kind="manor" x={880} y={yAt(downs[0], 880) + 18} s={0.42} rng={rng} smoke lit={0.45} />
      <Hill rng={rng} pts={downs[1]} furrows={1} hedge />
      <Hill rng={rng} pts={downs[2]} furrows={1} hedge />
      {avenue}
      <Ink c="s0" d={smooth([[700, 660], [760, 600], [820, 556], [858, 534]])} />
      <Ink c="s0" d={smooth([[760, 668], [810, 608], [856, 560], [884, 536]])} />
    </g>
  );

  const hill = (
    <g>
      <Ink c="s1 occlude" d={line(crest) + `L1220 ${H + 20}L-20 ${H + 20}Z`} />
      {[24, 60, 104].map((dy, k) => <Ink key={k} c="s0" d={smooth(crest.slice(0, 6 - k).map(([x, y]) => [x, y + dy]))} />)}
      <Grass rng={rng} x0={-10} x1={W} yOf={crestY} n={n(120, ctx)} />
      <Flowers rng={rng} x0={80} x1={560} yOf={crestY} n={n(18, ctx)} />
    </g>
  );

  const oak = (
    <g>
      <LandmarkShape kind="oak" x={330} y={612} s={1.55} rng={rng} uid={uid} />
      {/* the poet under the tree, and a dog */}
      <Figure x={436} y={618} s={1.3} rng={rng} />
      <Ink c="s0" d={`M454 618q4 -6 10 -4l3 -3 1 4q2 1 2 3h-16z`} />
    </g>
  );

  return {
    layers: [
      { delay: 0, node: sky },
      { delay: 0.6, node: land },
      { delay: 1.2, node: hill },
      { delay: 1.6, node: oak },
    ],
    medallion: { cx: 520, cy: 440 },
  };
}

/* ═════════════════════════════════════════════════════════════════════════
 *  MRS DALLOWAY — "westminster-morning"
 *  Focal point: the clock tower across the river. A bridge enters from the
 *  left; the city crowds the far bank; an aeroplane writes in the sky.
 * ═════════════════════════════════════════════════════════════════════════ */

function westminster(ctx: SceneContext): ComposedScene {
  const { rng, uid } = ctx;
  const BANK = 556;
  const TX = 790;

  // the long gothic range beside the tower
  const range: ReactNode[] = [];
  const RL = 470, RR = TX - 30, RH = 62;
  range.push(<Ink key="body" c="s1 occlude" d={rect(RL, BANK - RH, RR - RL, RH)} />);
  for (let x = RL; x <= RR; x += 16) {
    range.push(<Ink key={"p" + x} c="s0" d={seg(x, BANK - RH - 8, x, BANK)} />);
    range.push(<Ink key={"pt" + x} c="s0" d={line([[x - 2, BANK - RH - 6], [x, BANK - RH - 13], [x + 2, BANK - RH - 6]])} />);
  }
  for (let x = RL + 4; x < RR - 6; x += 16) {
    range.push(<Win key={"u" + x} x={x + 2} y={BANK - RH + 10} w={4} h={14} rng={rng} arched bars={0} litChance={0.4} />);
    range.push(<Win key={"l" + x} x={x + 2} y={BANK - RH + 34} w={4} h={16} rng={rng} arched bars={0} litChance={0.3} />);
  }
  range.push(<Ink key="tower2" c="s1 occlude" d={rect(RL - 26, BANK - RH - 70, 34, RH + 70)} />);
  range.push(<Ink key="tower2r" c="s0" d={line([[RL - 26, BANK - RH - 70], [RL - 9, BANK - RH - 96], [RL + 8, BANK - RH - 70]])} />);
  for (let y = BANK - RH - 60; y < BANK; y += 20) range.push(<Win key={"t2" + y} x={RL - 14} y={y} w={10} h={12} rng={rng} arched bars={1} litChance={0.3} />);

  const sky = (
    <g>
      <Stars rng={rng} count={n(120, ctx)} x0={0} x1={W} y0={20} y1={BANK - 140} />
      <Luminary kind="full-moon" x={300} y={170} r={22} uid={uid} rng={rng} />
      <FadingConstellation pts={[[560, 80], [610, 112], [668, 104], [720, 140], [770, 132]]} uid={uid} label={ctx.vignette ? undefined : ctx.label} />
      <Aeroplane x={1030} y={250} s={1.3} />
      <Birds rng={rng} x={520} y={300} n={7} />
      {!ctx.vignette && <CelestialMark kind="orbit" x={1090} y={110} s={0.9} />}
    </g>
  );

  const city = (
    <g>
      <DistantSkyline rng={rng} x0={-10} x1={W + 10} y={BANK} h={70} />
      {/* St Paul's, far off */}
      <Ink c="sf occlude" d={`M1000 ${BANK}V${BANK - 70}H1060V${BANK}Z`} />
      <Ink c="sf occlude" d={`M1004 ${BANK - 70}A26 30 0 0 1 1056 ${BANK - 70}Z`} />
      <Ink c="sf" d={seg(1030, BANK - 100, 1030, BANK - 118)} />
      <Building kind="townhouses" x={1010} y={BANK} s={0.62} rng={rng} lit={0.4} />
      {range}
      <LandmarkShape kind="clocktower" x={TX} y={BANK} s={0.9} rng={rng} uid={uid} />
      <Tree kind="round" x={930} y={BANK} s={0.8} rng={rng} />
      <Tree kind="round" x={380} y={BANK} s={0.8} rng={rng} />
    </g>
  );

  const river = (
    <g>
      <Quay x0={-10} x1={W + 10} y={BANK} h={18} rng={rng} />
      <Water rng={rng} x0={-10} x1={W + 10} y0={BANK + 18} y1={H} glints={[{ x: 300, w: 30 }]} />
      <Reflection x={TX} y0={BANK + 22} y1={H - 30} w={16} rng={rng} />
      <Boat x={880} y={680} s={1.1} rng={rng} kind="row" />
      <Boat x={640} y={612} s={0.6} rng={rng} kind="row" />
    </g>
  );

  // Westminster Bridge, entering from the left in perspective
  const bridgeTop = (x: number) => 600 - (x / 520) * 54;
  const bridge: ReactNode[] = [];
  let bd = `M-20 ${r1(bridgeTop(-20))}L520 ${r1(bridgeTop(520))}L520 ${r1(bridgeTop(520) + 24)}`;
  const arches = [[400, 500], [270, 380], [120, 250], [-40, 100]];
  arches.forEach(([a, b]) => {
    const base = bridgeTop((a + b) / 2) + 40 + (520 - b) * 0.12;
    bd += `L${b} ${r1(base)}A${(b - a) / 2} ${r1(((b - a) / 2) * 0.55)} 0 0 1 ${a} ${r1(base)}`;
  });
  bd += `L-20 ${H}Z`;
  bridge.push(<Ink key="b" c="s2 occlude" d={bd} />);
  bridge.push(<Ink key="par" c="s1" d={seg(-20, bridgeTop(-20) - 10, 520, bridgeTop(520) - 6)} />);
  for (let x = -10; x < 520; x += 8) bridge.push(<Ink key={"bal" + x} c="s0" d={seg(x, bridgeTop(x) - 10 + x * 0.008, x, bridgeTop(x))} />);
  for (let x = 40; x < 520; x += 120) {
    bridge.push(<Ink key={"lamp" + x} c="s1" d={seg(x, bridgeTop(x) - 10, x, bridgeTop(x) - 46)} />);
    bridge.push(<circle key={"lg" + x} cx={x} cy={r1(bridgeTop(x) - 50)} r="3" className="fill-soft window-lit" />);
  }
  [60, 84, 210, 330, 352].forEach((x, i) => bridge.push(<Figure key={"f" + i} x={x} y={bridgeTop(x) - 1} s={1.5 - x / 900} rng={rng} />));

  return {
    layers: [
      { delay: 0, node: sky },
      { delay: 0.5, node: city },
      { delay: 1, node: river },
      { delay: 1.5, node: <g>{bridge}</g> },
    ],
    medallion: { cx: 680, cy: 420 },
  };
}

/* ═════════════════════════════════════════════════════════════════════════
 *  WINTER — "winter-house"
 *  Focal point: one lit window in a cold house, far away. A great deal of
 *  deliberate emptiness; branches, frost, a strange pale sun.
 * ═════════════════════════════════════════════════════════════════════════ */

function winterHouse(ctx: SceneContext): ComposedScene {
  const { rng, uid } = ctx;
  const HZ = 512;
  const far = rolling(rng, -20, W + 20, HZ, 8, 30);
  const mid = rolling(rng, -20, W + 20, 590, 12, 30);
  const near = rolling(rng, -20, W + 20, 708, 14, 30);
  const HX = 690;

  // one big bare tree, branching densely into the sky (right foreground)
  const branches: string[] = [];
  const grow = (x: number, y: number, a: number, len: number, depth: number) => {
    const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len;
    branches.push(`M${r1(x)} ${r1(y)}Q${r1((x + ex) / 2 + rng.range(-5, 5))} ${r1((y + ey) / 2 + rng.range(-4, 2))} ${r1(ex)} ${r1(ey)}`);
    if (depth === 0) return;
    const k = depth > 4 ? 3 : 2;
    for (let i = 0; i < k; i++) grow(ex, ey, a + rng.range(-0.62, 0.62), len * rng.range(0.6, 0.8), depth - 1);
  };
  grow(844, 560, -Math.PI / 2 - 0.35, 58, 6);
  grow(852, 560, -Math.PI / 2 + 0.4, 54, 6);
  grow(848, 558, -Math.PI / 2, 46, 5);
  grow(842, 600, -Math.PI / 2 - 1.05, 40, 4);

  const sky = (
    <g>
      <Stars rng={rng} count={n(170, ctx)} x0={0} x1={W} y0={20} y1={HZ - 60} />
      <AirLines rng={rng} y0={140} y1={HZ - 30} n={n(9, ctx)} />
      {/* a pale, ringed winter sun that gives no warmth */}
      <g opacity="0.75"><Luminary kind="eclipse" x={430} y={190} r={20} uid={uid} rng={rng} rings={false} /></g>
      <FadingConstellation pts={[[210, 96], [262, 140], [318, 126], [366, 170]]} uid={uid} label={ctx.vignette ? undefined : ctx.label} />
      {!ctx.vignette && <CelestialMark kind="eye" x={1090} y={110} s={0.9} />}
    </g>
  );

  const land = (
    <g>
      <Ink c="sf occlude" d={underside(far, H + 20)} />
      {/* poplars, bare, behind the house */}
      {[600, 618, 760, 778, 800].map((x, i) => <Tree key={i} kind="bare" x={x} y={yAt(far, x) + 4} s={0.95 + (i % 2) * 0.2} rng={rng} />)}
      <Building kind="country-house" x={HX} y={yAt(far, HX) + 6} s={0.4} rng={rng} lit={0} smoke />
      <Ink c="sf" d={seg(-20, HZ + 26, W + 20, HZ + 22)} />
      <Hill rng={rng} pts={mid} />
      {/* a line of fence posts walking away towards the house */}
      {Array.from({ length: 16 }, (_, i) => {
        const t = i / 15, x = 20 + t * 540, y = 690 - t * 92, h = 16 - t * 11;
        return <Ink key={"post" + i} c="s0" d={seg(x, y, x, y - h) + (i ? seg(x - 36, y + 6.1 - h * 0.6, x, y - h * 0.6) : "")} />;
      })}
      <Ink c="s0" d={smooth([[612, yAt(mid, 612) + 4], [646, 560], [676, yAt(far, HX) + 8]])} />
      <Frost rng={rng} x0={0} x1={W} yOf={(x) => yAt(mid, x)} n={n(90, ctx)} />
      <Sculpture x={340} y={yAt(mid, 340) + 30} s={0.62} rng={rng} uid={uid} />
      <Figure x={590} y={yAt(mid, 590) + 6} s={1} rng={rng} />
    </g>
  );

  // the one lit window, placed on the house's upper floor
  const lamp = (
    <g>
      <circle cx={HX + 38} cy={yAt(far, HX) - 23} r={34} fill={`url(#${uid}-halo)`} />
      <circle cx={HX + 38} cy={yAt(far, HX) - 23} r={12} fill={`url(#${uid}-halo)`} />
      <rect x={HX + 35.6} y={yAt(far, HX) - 27} width="5" height="7.4" className="fill-soft" />
    </g>
  );

  const fore = (
    <g>
      <Hill rng={rng} pts={near} />
      <Ink c="s0" d={smooth(near.map(([x, y]) => [x, y + 26]))} />
      <Ink c="s0" d={smooth(near.filter(([x]) => x < 700).map(([x, y]) => [x, y + 58]))} />
      <Frost rng={rng} x0={0} x1={W} yOf={(x) => yAt(near, x)} n={n(60, ctx)} />
      <Ink c="s2 occlude" d={`M806 756C830 746 834 712 835 670C836 628 838 590 840 556L856 556C857 592 860 630 863 670C866 712 874 746 898 756Z`} />
      {Array.from({ length: 6 }, (_, k) => <Ink key={"bk" + k} c="s0" d={smooth([[842 + k * 2.4, 562], [840 + k * 3.2, 670], [824 + k * 12, 752]])} />)}
      <Ink c="s2" d={branches.slice(0, 3).join("")} />
      <Ink c="s1" d={branches.slice(3, 40).join("")} />
      <Ink c="s0" d={branches.slice(40).join("")} />
    </g>
  );

  return {
    layers: [
      { delay: 0, node: sky },
      { delay: 0.6, node: land },
      { delay: 1.2, node: lamp },
      { delay: 1.4, node: fore },
    ],
    medallion: { cx: 570, cy: 450 },
  };
}

/* ═════════════════════════════════════════════════════════════════════════
 *  A FAREWELL TO ARMS — "lake-crossing"
 *  Focal point: a small boat rowing north through rain, the lights of the
 *  shore behind it, mountains closing in.
 * ═════════════════════════════════════════════════════════════════════════ */

function lakeCrossing(ctx: SceneContext): ComposedScene {
  const { rng, uid } = ctx;
  const HZ = 470;
  const shore = rolling(rng, -20, W + 20, 708, 10, 30);

  const sky = (
    <g>
      <Stars rng={rng} count={n(90, ctx)} x0={0} x1={W} y0={20} y1={260} />
      <Luminary kind="crescent" x={920} y={130} r={20} uid={uid} rng={rng} />
      <FadingConstellation pts={[[180, 90], [236, 70], [300, 104], [350, 92], [404, 128]]} uid={uid} label={ctx.vignette ? undefined : ctx.label} />
      {!ctx.vignette && <CelestialMark kind="key" x={1090} y={110} s={0.9} />}
    </g>
  );

  const mountains = (
    <g>
      <MountainRange rng={rng} x0={-20} x1={W + 20} base={HZ} amp={290} faint bottom={HZ} />
      <MountainRange rng={rng} x0={-20} x1={W + 20} base={HZ} amp={190} bottom={HZ} />
      <MountainRange rng={rng} x0={500} x1={W + 20} base={HZ} amp={90} bottom={HZ} />
    </g>
  );

  const village = (
    <g>
      <Ink c="s1" d={seg(-20, HZ, W + 20, HZ)} />
      <Building kind="village" x={860} y={HZ + 4} s={0.55} rng={rng} lit={0.6} />
      <LandmarkShape kind="church" x={740} y={HZ + 4} s={0.7} rng={rng} uid={uid} />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={r1(80 + i * 46 + rng.range(-8, 8))} cy={HZ - 2} r="1" className="fill-soft window-lit" style={{ "--d": `${i}s` } as CSSProperties} />)}
    </g>
  );

  const lake = (
    <g>
      <Water rng={rng} x0={-10} x1={W + 10} y0={HZ} y1={712} glints={[{ x: 920, w: 30 }]} />
      {[820, 870, 900, 760].map((x, i) => <Reflection key={i} x={x} y0={HZ + 4} y1={HZ + 90 + i * 14} w={6} rng={rng} />)}
      <Boat x={470} y={612} s={2.1} rng={rng} kind="row" umbrella />
    </g>
  );

  const fore = (
    <g>
      <Hill rng={rng} pts={shore} />
      <Grass rng={rng} x0={0} x1={W} yOf={(x) => yAt(shore, x)} n={n(70, ctx)} />
      {[40, 84, 120, 172].map((x, i) => <Tree key={i} kind="cypress" x={x} y={yAt(shore, x) + 30} s={1.5 + (i % 2) * 0.4} rng={rng} />)}
      <Tree kind="cypress" x={1150} y={yAt(shore, 1150) + 30} s={1.6} rng={rng} />
      <Figure x={300} y={yAt(shore, 300) + 34} s={1.6} rng={rng} />
    </g>
  );

  return {
    layers: [
      { delay: 0, node: sky },
      { delay: 0.4, node: mountains },
      { delay: 0.9, node: village },
      { delay: 1.2, node: lake },
      { delay: 1.6, node: fore },
    ],
    medallion: { cx: 600, cy: 440 },
  };
}

export const SCENES: Record<SceneName, (ctx: SceneContext) => ComposedScene> = {
  "lighthouse-bay": lighthouseBay,
  "oak-and-great-house": oakAndGreatHouse,
  "westminster-morning": westminster,
  "winter-house": winterHouse,
  "lake-crossing": lakeCrossing,
};
