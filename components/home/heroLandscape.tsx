/**
 * The homepage panorama — an illustrated city plate drawn on the server in
 * four layers that HomeHero inks in as the visitor scrolls.
 *
 * Reading left to right: a lighthouse on its rocks in open sea; a hill town
 * climbing to a ruined temple above a harbour; a clock-tower quarter with
 * terraces; then the quiet countryside with an oak, a cottage and a statue.
 * Density varies on purpose — intricate in the town, quiet in the fields.
 *
 * The high points (lantern, campanile, temple, spire, oak) sit where the
 * opening constellation's stars are; see STARS in HomeHero.tsx.
 */
import type { ReactNode } from "react";
import { createRng, r1 } from "@/lib/rng";
import { Ink } from "@/components/bookworld/Ink";
import { Building } from "@/components/bookworld/architecture";
import { LandmarkShape } from "@/components/bookworld/landmarks";
import { Birds, Boat, Figure, Grass, Tree } from "@/components/bookworld/nature";
import { MountainRange, Water } from "@/components/bookworld/terrain";
import { AirLines, DistantSkyline, Flowers, HillTown, Jetty, OrbitMark, Quay, Reflection, Rocks, Steps, Temple } from "@/components/bookworld/extras";
import { line, ridge, rolling, seg, smooth, underside, yAt, type Pt } from "@/components/bookworld/geometry";

const W = 1600, H = 900;
const SEA = 612;

export function heroLandscape(): ReactNode[] {
  const rng = createRng("homepage-panorama-ii");

  // the acropolis hill that the town climbs
  const acro: Pt[] = [[440, 790], [480, 742], [530, 706], [590, 682], [650, 660], [700, 654], [760, 660], [830, 678], [890, 708], [930, 740], [960, 790]];
  const acroY = (x: number) => yAt(acro, x);
  // the right-hand land: city ground, then the fields
  const cityGround: Pt[] = [[940, 742], [1000, 738], [1100, 736], [1200, 740], [1260, 744]];
  const fields = rolling(rng, 1180, W + 20, 760, 10, 30);
  const near = rolling(rng, 380, W + 20, 838, 8, 30);
  const nearY = (x: number) => yAt(near, x);

  const farHills = ridge(rng, 300, W + 20, SEA, 50, 6, 0.5);

  /* ── I · sea, sky marginalia and everything far away ── */
  const far = (
    <g key="far">
      <AirLines rng={rng} y0={300} y1={560} n={7} x0={0} x1={W} />
      <OrbitMark x={1330} y={150} r={10} />
      <OrbitMark x={420} y={110} r={6} ticks={16} />
      <MountainRange rng={rng} x0={980} x1={W + 20} base={SEA + 40} amp={230} faint bottom={SEA + 60} />
      <Ink c="sf occlude" d={underside(farHills, SEA + 30)} />
      <DistantSkyline rng={rng} x0={900} x1={1340} y={SEA + 60} h={56} />
      <Ink c="sf" d={`M-10 ${SEA}H${W + 10}`} />
      <Water rng={rng} x0={-10} x1={980} y0={SEA} y1={H} glints={[{ x: 200, w: 30 }]} />
      <Reflection x={200} y0={SEA + 70} y1={H - 10} w={22} rng={rng} />
      <Boat x={300} y={648} s={0.4} rng={rng} kind="sail" />
      <Boat x={470} y={660} s={0.32} rng={rng} kind="sail" />
    </g>
  );

  /* ── II · the town: hill town, temple, quay, terraces ── */
  const town = (
    <g key="town">
      <path className="occlude" d={line(acro) + `L960 ${H + 30}L440 ${H + 30}Z`} />
      <Ink c="s1" d={smooth(acro)} />
      <Temple x={704} y={656} s={0.62} ruined />
      {/* terraces and retaining walls under the temple */}
      {[0, 1, 2, 3, 4].map((k) => (
        <Ink key={"terr" + k} c="s0" d={smooth([[606 - k * 18, 690 + k * 20], [650, 684 + k * 22], [704, 680 + k * 22], [760, 686 + k * 22], [800 + k * 16, 694 + k * 20]])} />
      ))}
      <HillTown rng={rng} x0={462} x1={666} yOf={(x) => Math.min(acroY(x) + 104, 786)} rows={8} s={0.9} smoke />
      <HillTown rng={rng} x0={742} x1={936} yOf={(x) => Math.min(acroY(x) + 104, 786)} rows={8} s={0.9} />
      <HillTown rng={rng} x0={640} x1={770} yOf={() => 790} rows={3} s={0.85} />
      <Steps x={694} y={742} w={16} n={8} dx={0} dy={8} />
      {[612, 628, 788, 806].map((x) => <Tree key={"hc" + x} kind="cypress" x={x} y={acroY(x) + 18} s={0.55} rng={rng} />)}
      {/* the fields beyond, then the city ground and the clock-tower quarter */}
      <path className="occlude" d={line(fields) + `L${W + 20} ${H + 30}L1180 ${H + 30}Z`} />
      <Ink c="s1" d={smooth(fields)} />
      <path className="occlude" d={line(cityGround) + `L1300 ${H + 30}L940 ${H + 30}Z`} />
      <Ink c="s1" d={line(cityGround)} />
      <Building kind="townhouses" x={1180} y={742} s={0.66} rng={rng} lit={0.38} />
      <Building kind="townhouses" x={980} y={744} s={0.5} rng={rng} lit={0.3} smoke />
      <Building kind="cottage" x={1520} y={yAt(fields, 1520) + 4} s={0.8} rng={rng} smoke lit={0.7} />
      {/* the harbour wall along the water */}
      <Quay x0={430} x1={1000} y={792} h={20} rng={rng} />
      <Water rng={rng} x0={420} x1={1010} y0={812} y1={H} glints={[]} />
    </g>
  );

  /* ── III · landmarks ── */
  const landmarks = (
    <g key="landmarks">
      <Rocks rng={rng} x={200} y={688} n={7} s={1.1} />
      <LandmarkShape kind="lighthouse" x={200} y={680} s={1.1} rng={rng} uid="hero" />
      <LandmarkShape kind="church" x={560} y={acroY(560) + 26} s={0.72} rng={rng} uid="hero" />
      <LandmarkShape kind="clocktower" x={1066} y={738} s={0.8} rng={rng} uid="hero" />
      <LandmarkShape kind="oak" x={1420} y={834} s={1} rng={rng} uid="hero" />
      <LandmarkShape kind="statue" x={1296} y={836} s={0.5} rng={rng} uid="hero" />
    </g>
  );

  /* ── IV · near things: boats, promenade, trees, people ── */
  const lamps: ReactNode[] = [];
  for (let x = 1000; x < W; x += 110) {
    const y = nearY(x);
    lamps.push(<Ink key={"lp" + x} c="s1" d={seg(x, y, x, y - 34) + `M${x - 3} ${r1(y - 34)}h6l-1 -6h-4z`} />);
    lamps.push(<circle key={"lg" + x} cx={x} cy={r1(y - 38)} r="2" className="fill-soft window-lit" style={{ ["--d" as string]: `${(x % 7) + 1}s` }} />);
  }
  const nearThings = (
    <g key="near">
      <Boat x={400} y={770} s={1.3} rng={rng} kind="sail" />
      <Boat x={120} y={850} s={1.1} rng={rng} kind="row" />
      <Boat x={560} y={846} s={0.9} rng={rng} kind="row" />
      <Boat x={760} y={862} s={1} rng={rng} kind="sail" />
      <Jetty x={430} y={806} len={70} dir={-1} />
      {/* the promenade, rising out of the harbour on the right */}
      <path className="occlude" d={`M1000 ${H + 30}L1000 ${r1(nearY(1000))}` + line(near.filter(([x]) => x >= 1000)).replace("M", "L") + `L${W + 20} ${H + 30}Z`} />
      <Ink c="s1" d={smooth(near.filter(([x]) => x >= 990))} />
      <Ink c="s0" d={smooth(near.filter(([x]) => x >= 1000).map(([x, y]) => [x, y + 10]))} />
      <Steps x={1004} y={nearY(1004) + 40} w={30} n={5} dx={0} dy={8} />
      {lamps}
      {[1110, 1222, 1356, 1560].map((x) => <Tree key={"r" + x} kind="round" x={x} y={nearY(x) + 4} s={1.05} rng={rng} />)}
      {[1470, 1500, 1588].map((x) => <Tree key={"c" + x} kind="cypress" x={x} y={yAt(fields, x) + 18} s={1.1} rng={rng} />)}
      {[1150, 1170, 1268, 1390, 1530].map((x, i) => <Figure key={"f" + x} x={x} y={nearY(x) + 26 + (i % 2)} s={1.5} rng={rng} />)}
      {[520, 610, 846, 870].map((x, i) => <Figure key={"q" + x} x={x} y={791} s={1.1} rng={rng} dress={i % 2 === 0} />)}
      <Grass rng={rng} x0={1010} x1={W} yOf={nearY} n={90} />
      <Flowers rng={rng} x0={1260} x1={1600} yOf={nearY} n={22} />
      <Grass rng={rng} x0={1190} x1={W} yOf={(x) => yAt(fields, x)} n={50} />
      <Birds rng={rng} x={820} y={430} n={7} />
      <Birds rng={rng} x={330} y={560} n={4} />
    </g>
  );

  return [far, town, landmarks, nearThings];
}
