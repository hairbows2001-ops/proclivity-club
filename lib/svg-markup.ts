/**
 * A tiny server-side serializer for the engraving components.
 *
 * Next.js does not allow react-dom/server inside route handlers, and the
 * BookWorld components are pure SVG — intrinsic elements, function
 * components and fragments, no hooks or state — so turning them into
 * markup needs only this.
 */

import { Fragment, isValidElement, type ReactNode } from "react";

/** React's camelCase SVG props that are written hyphenated in markup. */
const HYPHENATED = new Set([
  "strokeWidth", "strokeLinecap", "strokeLinejoin", "strokeDasharray", "strokeDashoffset", "strokeOpacity", "strokeMiterlimit",
  "stopColor", "stopOpacity", "fillOpacity", "fillRule", "clipPath", "clipRule", "textAnchor", "fontSize", "fontStyle",
  "fontWeight", "fontFamily", "letterSpacing", "pointerEvents", "dominantBaseline", "vectorEffect", "colorInterpolationFilters",
]);

const escapeText = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeAttr = (s: string) => escapeText(s).replace(/"/g, "&quot;");
const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());

function styleString(style: Record<string, unknown>): string {
  return Object.entries(style)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k.startsWith("--") ? k : kebab(k)}:${v}`)
    .join(";");
}

export function renderSvg(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return escapeText(String(node));
  if (Array.isArray(node)) return node.map(renderSvg).join("");
  if (!isValidElement(node)) return "";

  const { type } = node;
  const props = node.props as Record<string, unknown> & { children?: ReactNode };
  if (type === Fragment) return renderSvg(props.children);
  if (typeof type === "function") return renderSvg((type as (p: unknown) => ReactNode)(props));
  if (typeof type !== "string") return "";

  let attrs = "";
  for (const [key, value] of Object.entries(props)) {
    if (key === "children" || key === "key" || value === undefined || value === null || value === false) continue;
    const name = key === "className" ? "class" : HYPHENATED.has(key) ? kebab(key) : key;
    const v = key === "style" && typeof value === "object" ? styleString(value as Record<string, unknown>) : value === true ? "true" : String(value);
    attrs += ` ${name}="${escapeAttr(v)}"`;
  }
  const inner = renderSvg(props.children);
  return inner ? `<${type}${attrs}>${inner}</${type}>` : `<${type}${attrs}/>`;
}
