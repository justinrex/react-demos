export default function LazyInsightsPanel({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <article className="lazy-loaded-card">
      <p className="demo-kicker">Lazy module ready</p>
      <h4>{title}</h4>
      <p className="demo-copy">
        {detail} This card stands in for code you do not need in the initial
        bundle.
      </p>
      <ul className="guidance-list">
        <li>Keep route shells and common controls eagerly available.</li>
        <li>Lazy load infrequent panels, charts, editors, and heavy inspectors.</li>
      </ul>
    </article>
  );
}
