import Link from "next/link";
import type { Project } from "@/content/projects";
import { ImageRow } from "./ImageRow";

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ol className="archive">
      {projects.map((p, i) => (
        <li key={p.slug} className="entry">
          <div className="entry-meta" data-reveal="fade">
            <p className="entry-num">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="entry-title">
              <Link prefetch={false} href={p.href}>{p.title}</Link>
            </h3>
            <p className="entry-industry">{p.industry}</p>
            <ul className="entry-capabilities" aria-label="Capabilities">
              {p.capabilities.slice(0, p.homeCapabilities).map((c) => (
                <li key={c}>{c}</li>
              ))}
              {p.capabilities.length > p.homeCapabilities && (
                <li className="entry-capabilities-more">+ {p.capabilities.length - p.homeCapabilities} more</li>
              )}
            </ul>
            {p.year && <p className="entry-year">{p.year}</p>}
            <p className="entry-note">Concept project</p>
          </div>
          <div className="entry-body">
            {/* Duplicate of the title link for mouse and touch; kept out of the tab order. */}
            <Link prefetch={false} href={p.href} tabIndex={-1} aria-hidden="true" className="entry-image-link">
              <ImageRow images={p.cover} eager={i === 0} stackOnMobile={false} />
            </Link>
            <p className="entry-summary" data-reveal="fade" style={{ "--d": "220ms" } as React.CSSProperties}>
              {p.summary}
            </p>
            <p className="entry-more" data-reveal="fade" style={{ "--d": "280ms" } as React.CSSProperties}>
              <Link prefetch={false} href={p.href} tabIndex={-1} aria-hidden="true">
                View project →
              </Link>
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
