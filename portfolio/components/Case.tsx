import Link from "next/link";
import { projects, projectIndex } from "@/content/projects";

// Building blocks shared by the three case-study pages.

export function CaseIntro({
  slug,
  subtitle,
  children,
  meta,
}: {
  slug: string;
  subtitle: string;
  children: React.ReactNode;
  meta: { label: string; value: string }[];
}) {
  const i = projectIndex(slug);
  const project = projects[i];
  return (
    <header className="case-intro wrap">
      <p className="case-crumb">
        <Link href="/#work">Work</Link> <span aria-hidden="true">/</span> {String(i + 1).padStart(2, "0")}
      </p>
      <div className="case-intro-grid">
        <div>
          <h1 className="case-title">{project.title}</h1>
          <p className="case-subtitle">{subtitle}</p>
        </div>
        <div className="case-desc">{children}</div>
        <dl className="case-meta">
          {meta.map((m) => (
            <div key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
          <div>
            <dt>Year</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>Concept project</dd>
          </div>
        </dl>
      </div>
    </header>
  );
}

// A section of a case study: small label and heading on the left, content on the right.
export function CaseSection({
  label,
  title,
  children,
  wide,
}: {
  label: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  wide?: React.ReactNode;
}) {
  return (
    <section className="case-section wrap">
      <div className="case-section-grid">
        <div className="case-section-head">
          <h2 className="case-label">{label}</h2>
        </div>
        <div className="case-section-body">
          {title && <p className="case-heading">{title}</p>}
          {children}
        </div>
      </div>
      {wide && <div className="case-wide">{wide}</div>}
    </section>
  );
}

export function NextProject({ slug }: { slug: string }) {
  const next = projects[(projectIndex(slug) + 1) % projects.length];
  return (
    <nav className="next-project wrap" aria-label="Next project">
      <p className="case-label">Next project</p>
      <Link href={next.href} className="next-link">
        {next.title} <span aria-hidden="true">→</span>
      </Link>
    </nav>
  );
}
