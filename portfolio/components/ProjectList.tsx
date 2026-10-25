import Link from "next/link";
import type { Project } from "@/content/projects";
import { ImageRow } from "./ImageRow";

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ol className="archive">
      {projects.map((p, i) => (
        <li key={p.slug} className="entry">
          <div className="entry-meta">
            <p className="entry-num">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="entry-title">
              <Link href={p.href}>{p.title}</Link>
            </h3>
            <ul className="entry-disciplines">
              {p.disciplines.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            {p.year && <p className="entry-year">{p.year}</p>}
            <p className="entry-note">Concept project</p>
          </div>
          <div className="entry-body">
            {/* Duplicate of the title link for mouse and touch; kept out of the tab order. */}
            <Link href={p.href} tabIndex={-1} aria-hidden="true" className="entry-image-link">
              <ImageRow images={p.cover} eager={i === 0} stackOnMobile={false} />
            </Link>
            <p className="entry-summary">{p.summary}</p>
            <p className="entry-more">
              <Link href={p.href} tabIndex={-1} aria-hidden="true">
                View project →
              </Link>
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
