import { formatDate, type Article } from "@/content/writing";

// Archive of Substack articles. Each entry links out to the article on Substack.
// `compact` (homepage) leaves out the description. Fields an entry doesn't have are left out.
// `level` keeps the heading outline intact: h2 under the page title, h3 under a section heading.
export function WritingList({
  articles,
  compact = false,
  level = 3,
}: {
  articles: Article[];
  compact?: boolean;
  level?: 2 | 3;
}) {
  const Title = level === 2 ? "h2" : "h3";
  return (
    <ol className={`writing-list${compact ? " is-compact" : ""}`}>
      {articles.map((a, i) => (
        <li key={a.url} className="writing-entry">
          <p className="entry-num">{String(i + 1).padStart(2, "0")}</p>
          <div className="writing-main">
            <Title className="writing-title">
              <a href={a.url} target="_blank" rel="noopener noreferrer">
                {a.title}
                <span className="visually-hidden"> (opens Substack in a new tab)</span>
              </a>
            </Title>
            {!compact && a.description && <p className="writing-dek">{a.description}</p>}
          </div>
          <div className="writing-meta">
            {a.publication && <p className="writing-publication">{a.publication}</p>}
            {a.date && (
              <p>
                <time dateTime={a.date}>{formatDate(a.date)}</time>
              </p>
            )}
            {a.topic && <p className="writing-topics">{a.topic}</p>}
          </div>
          <p className="writing-arrow" aria-hidden="true">
            {compact ? "↗" : "Read article ↗"}
          </p>
        </li>
      ))}
    </ol>
  );
}
