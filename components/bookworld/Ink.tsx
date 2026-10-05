import type { SVGProps } from "react";

/**
 * Every engraved line goes through <Ink>. The class sets the stroke weight:
 *   s0  finest hatching       s1  standard line
 *   s2  emphasised outline    sf  faded-blue sky line
 * Add "occlude" to fill the shape with the background, hiding lines behind it.
 * pathLength=1 lets lines "ink themselves in" with one shared animation.
 */
export function Ink({ d, c = "s1", ...rest }: { d: string; c?: string } & Omit<SVGProps<SVGPathElement>, "d">) {
  return <path d={d} className={c} pathLength={1} {...rest} />;
}

/** A group of lines that ink in together, after an optional delay (seconds). */
export function Layer({ delay = 0, children, style, ...rest }: { delay?: number } & SVGProps<SVGGElement>) {
  return (
    <g style={{ ["--ld" as string]: `${delay}s`, ...style }} {...rest}>
      {children}
    </g>
  );
}
