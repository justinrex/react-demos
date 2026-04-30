import { Link } from "react-router-dom";
import { demoPages } from "../routes";

export function HomePage() {
  return (
    <section className="page">
      <div className="hero-card">
        <p className="eyebrow">Overview</p>
        <h2>Build one-off experiments without one-off repos.</h2>
        <p className="hero-copy">
          Add a new page under <code>src/pages</code>, register it in
          <code>src/routes.tsx</code>, and it becomes part of the demo index.
        </p>
      </div>

      <div className="demo-grid">
        {demoPages.map((page) => (
          <article key={page.slug} className="demo-card">
            <p className="demo-title">{page.title}</p>
            <p className="demo-description">{page.description}</p>
            <Link className="demo-link" to={`/${page.slug}`}>
              Open page
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
