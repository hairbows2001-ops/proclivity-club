/**
 * The homepage panorama, drawn on the server in four layers that the
 * HomeHero then inks in as the visitor scrolls. Its high points (lantern,
 * spire, campanile, oak) sit where the opening constellation's stars are.
 */
import type { ReactNode } from "react";
import { createRng } from "@/lib/rng";
import { Ink } from "@/components/bookworld/Ink";
import { Building } from "@/components/bookworld/architecture";
import { LandmarkShape } from "@/components/bookworld/landmarks";
import { Birds, Boat, Figure, Grass, Tree } from "@/components/bookworld/nature";
import { Hill, MountainRange, Water } from "@/components/bookworld/terrain";
import { rolling, smooth, type Pt } from "@/components/bookworld/geometry";

const W = 1600, H = 900;

export function heroLandscape(): ReactNode[] {
  const rng = createRng("homepage-panorama");
  const shore: Pt[] = [[430, 910], [470, 800], [520, 742], [560, 724], ...rolling(rng, 600, W + 20, 722, 6, 40)];
  const near = rolling(rng, -20, W + 20, 818, 12, 30);
  const yNear = (x: number) => {
    for (let i = 0; i < near.length - 1; i++) if (x >= near[i][0] && x <= near[i + 1][0]) return near[i][1] + ((x - near[i][0]) / (near[i + 1][0] - near[i][0])) * (near[i + 1][1] - near[i][1]);
    return 818;
  };
  return [
    <g key="sea">
      {/* I — far mountains, the sea and the shore */}

        <MountainRange rng={rng} x0={380} x1={W + 20} base={640} amp={240} faint bottom={700} />
        <MountainRange rng={rng} x0={520} x1={W + 20} base={660} amp={120} bottom={720} />
        <Ink c="sf" d={`M-10 612H${W + 10}`} />
        <Water rng={rng} x0={-10} x1={560} y0={612} y1={H} glints={[{ x: 200, w: 30 }]} />
        <Hill rng={rng} pts={shore} bottom={H + 40} />
    </g>,
    <g key="town">
      {/* II — the town */}
        <Building kind="townhouses" x={770} y={726} s={0.82} rng={rng} />
        <Building kind="cottage" x={1500} y={760} s={0.8} rng={rng} smoke />
    </g>,
    <g key="landmarks">
      {/* III — the landmarks, whose summits were the stars */}
        <LandmarkShape kind="lighthouse" x={200} y={680} s={1.1} rng={rng} uid="hero" />
        <LandmarkShape kind="church" x={600} y={730} s={0.97} rng={rng} uid="hero" />
        <LandmarkShape kind="clocktower" x={1000} y={732} s={0.82} rng={rng} uid="hero" />
    </g>,
    <g key="near">
      {/* IV — the near ground, trees, boats, statues and people */}
        <Boat x={400} y={770} s={1.3} rng={rng} kind="sail" />
        <Boat x={120} y={850} s={1.1} rng={rng} kind="row" />
        <Hill rng={rng} bottom={H + 40} pts={near.map(([x, y]) => [x, x < 520 ? y + (520 - x) * 0.9 : y])} />
        <LandmarkShape kind="oak" x={1380} y={845} s={1.05} rng={rng} uid="hero" />
        <LandmarkShape kind="statue" x={1150} y={835} s={0.55} rng={rng} uid="hero" />
        {[470, 1120, 1590].map((x) => <Tree key={x} kind="cypress" x={x} y={730} s={1.1} rng={rng} />)}
        {[690, 880, 1300].map((x) => <Tree key={x} kind="round" x={x} y={yNear(x) + 6} s={1.1} rng={rng} />)}
        {[760, 778, 960, 1060, 1240].map((x, i) => <Figure key={x} x={x} y={yNear(x) + 24 + (i % 2)} s={1.6} rng={rng} />)}
        <Grass rng={rng} x0={520} x1={W} yOf={yNear} n={70} />
        <Grass rng={rng} x0={460} x1={W} yOf={(x) => yNear(x) + 40} n={90} />
        <Birds rng={rng} x={760} y={300} n={6} />
        <Ink c="s0" d={smooth([[880, 910], [900, 860], [960, 830], [1020, 800]])} />
        <Ink c="s0" d={smooth([[940, 910], [950, 860], [985, 830], [1032, 801]])} />
    </g>,
  ];
}
