import Link from "next/link";
import { projects, projectIndex } from "@/content/projects";

// Building blocks shared by the three case-study pages.

export function CaseIntro({
  slug,
  subtitle,
  children,
}: {
  slug: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const i = projectIndex(slug);
  const project = projects[i];
  return (
    <header className="case-intro wrap">
      <p className="case-crumb" data-reveal="fade">
        <Link prefetch={false} href="/#work">Work</Link> <span aria-hidden="true">/</span> {String(i + 1).padStart(2, "0")}
      </p>
      <div className="case-intro-grid">
        <div>
          <h1 className="case-title" data-reveal="mask" style={{ "--d": "80ms" } as React.CSSProperties}>
            <span className="mask-line">{project.title}</span>
          </h1>
          <p className="case-subtitle" data-reveal="fade" style={{ "--d": "260ms" } as React.CSSProperties}>
            {subtitle}
          </p>
        </div>
        <div className="case-desc" data-reveal="fade" style={{ "--d": "380ms" } as React.CSSProperties}>
          {children}
        </div>
        <dl className="case-meta" data-reveal="fade" style={{ "--d": "440ms" } as React.CSSProperties}>
          <div>
            <dt>Industry</dt>
            <dd>{project.industry}</dd>
          </div>
          <div>
            <dt>Capabilities</dt>
            <dd>
              <ul className="dot-list">
                {project.capabilities.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </dd>
          </div>
          {project.year && (
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
          )}
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
      <div className="case-section-grid" data-reveal="section">
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

// Opens each case study: Maha's contribution in one paragraph.
export function WhatIDid({ slug }: { slug: string }) {
  return (
    <CaseSection label="What I did">
      <p className="what-i-did">{projects[projectIndex(slug)].whatIDid}</p>
    </CaseSection>
  );
}

// Closes each case study ("My role"): a scannable list of the areas Maha owned or contributed to. `title` and `aside` are optional extras.
export function Demonstrates({
  slug,
  title,
  aside,
}: {
  slug: string;
  title?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  const list = (
    <ul className="rule-list cols-2-list demonstrates" data-stagger="">
      {projects[projectIndex(slug)].demonstrates.map((d) => (
        <li key={d}>{d}</li>
      ))}
    </ul>
  );
  return (
    <CaseSection label="My role" title={title}>
      {aside ? (
        <div className="note">
          {list}
          {aside}
        </div>
      ) : (
        list
      )}
    </CaseSection>
  );
}

export function NextProject({ slug }: { slug: string }) {
  const next = projects[(projectIndex(slug) + 1) % projects.length];
  return (
    <nav className="next-project wrap" aria-label="Next project" data-reveal="fade">
      <p className="case-label">Next project</p>
      <Link prefetch={false} href={next.href} className="next-link">
        {next.title} <span aria-hidden="true">→</span>
      </Link>
    </nav>
  );
}
