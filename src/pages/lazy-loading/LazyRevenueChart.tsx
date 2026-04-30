export default function LazyRevenueChart() {
  return (
    <article className="lazy-loaded-card">
      <p className="demo-kicker">Deferred chart code</p>
      <h4>Regional revenue view</h4>
      <div className="chart-bars" aria-hidden="true">
        <span className="chart-bar chart-bar-short" />
        <span className="chart-bar chart-bar-mid" />
        <span className="chart-bar chart-bar-tall" />
        <span className="chart-bar chart-bar-mid" />
      </div>
      <p className="demo-copy">
        This could be a charting library, a markdown editor, or any other
        dependency you only need after the user asks for it.
      </p>
    </article>
  );
}
