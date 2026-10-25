import { formatDate, type Article } from "@/content/writing";

// Archive of Substack articles. Each entry links out to the article on Substack.
// `compact` (homepage) shows title, date and topic only.
export function WritingList({ articles, compact = false }: { articles: Article[]; compact?: boolean }) {
  return (
    <ol className={`writing-list${compact ? " is-compact" : ""}`}>
      {articles.map((a, i) => (
        <li key={a.url} className="writing-entry">
          <p className="entry-num">{String(i + 1).padStart(2, "0")}</p>
          <div className="writing-main">
            <h3 className="writing-title">
              <a href={a.url} target="_blank" rel="noopener noreferrer">
                {a.title}
                <span className="visually-hidden"> (opens Substack in a new tab)</span>
              </a>
            </h3>
            {!compact && <p className="writing-dek">{a.dek}</p>}
          </div>
          <div className="writing-meta">
            <p>
              <time dateTime={a.date}>{formatDate(a.date)}</time>
            </p>
            {a.topics && a.topics.length > 0 && <p className="writing-topics">{a.topics.join(" · ")}</p>}
          </div>
          <p className="writing-arrow" aria-hidden="true">
            {compact ? "↗" : "Read article ↗"}
          </p>
        </li>
      ))}
    </ol>
  );
}
