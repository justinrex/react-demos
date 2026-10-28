export function RouteFallback() {
  return (
    <section className="page">
      <header className="page-intro">
        <p className="eyebrow">Loading demo</p>
        <h2>Preparing the page...</h2>
        <p className="page-intro-copy">
          This route is being lazy loaded so the app shell can stay lighter up front.
        </p>
      </header>
    </section>
  );
}
