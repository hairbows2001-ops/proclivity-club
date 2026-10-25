import Link from "next/link";
import type { Project } from "@/content/projects";
import { Picture } from "./Picture";

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ol className="project-list">
      {projects.map((p, i) => (
        <li key={p.slug}>
          <article className={`project${p.href ? " is-linked" : ""}`}>
            <div className="project-meta">
              <span className="project-num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="project-title">
                {p.href ? <Link href={p.href}>{p.title}</Link> : p.title}
              </h3>
              <p className="project-discipline">{p.discipline}</p>
              <p className="project-type">Concept project</p>
            </div>
            <div className={`project-media count-${p.cover.length}`}>
              {p.cover.map((img, j) => (
                <figure key={img.src}>
                  <Picture img={img} eager={i === 0 && j === 0} />
                </figure>
              ))}
            </div>
            <div className="project-body">
              <p className="project-summary">{p.summary}</p>
              <ul className="tags" aria-label="Disciplines">
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {p.href && (
                <p className="project-cta" aria-hidden="true">
                  View case study →
                </p>
              )}
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
