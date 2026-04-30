import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageIntro } from "../components/PageIntro";

const snackIdeas = [
  "Apple slices",
  "Trail mix",
  "Greek yogurt",
  "Cheese crackers",
  "Peanut butter toast",
  "Banana chips"
];

const perfDataset = Array.from({ length: 180 }, (_, index) => ({
  id: index,
  label: `Component pattern ${index + 1}`,
  group: index % 3 === 0 ? "render" : index % 3 === 1 ? "props" : "effects"
}));

const DemoTile = memo(function DemoTile({
  title,
  details,
  onSelect
}: {
  title: string;
  details: { emphasis: string; note: string };
  onSelect: () => void;
}) {
  const renderCount = useRenderCount();

  return (
    <article className="memo-child-card">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Memoized child</p>
          <h4>{title}</h4>
        </div>
        <span className="stat-chip">renders: {renderCount}</span>
      </div>
      <p className="demo-copy">
        <strong>{details.emphasis}</strong> {details.note}
      </p>
      <button className="secondary-button" onClick={onSelect}>
        Fire callback
      </button>
    </article>
  );
});

export function MemoizationPage() {
  return (
    <section className="page">
      <PageIntro
        eyebrow="Memoization"
        title="Understanding when to memoize and when not to."
        subtitle="Use this page to compare derived values, prop stability, and re-renders so you can see when memoization helps and when it only adds noise."
      />

      <section className="guide-grid" aria-label="Memoization guidance">
        <article className="guide-card">
          <p className="demo-kicker">React.memo</p>
          <h3>Skip child renders when props stay the same.</h3>
          <p className="demo-copy">
            Reach for <code>React.memo</code> when a child is expensive and often receives
            identical props. It does nothing if the parent creates fresh objects or functions
            on every render.
          </p>
        </article>

        <article className="guide-card">
          <p className="demo-kicker">useMemo</p>
          <h3>Cache expensive derived values, not every calculation.</h3>
          <p className="demo-copy">
            Use <code>useMemo</code> for expensive work or when referential stability matters to
            another memoized consumer. Avoid wrapping cheap filters, string concatenation, or
            basic math just because they run during render.
          </p>
        </article>

        <article className="guide-card">
          <p className="demo-kicker">useCallback</p>
          <h3>Stabilize handlers only when identity matters.</h3>
          <p className="demo-copy">
            <code>useCallback</code> is useful when a memoized child receives a callback prop or a
            hook depends on the callback identity. If nothing observes that identity, it usually
            adds ceremony without improving behavior.
          </p>
        </article>
      </section>

      <section className="callout-card">
        <p className="demo-kicker">Rule of thumb</p>
        <h3>Do not memoize by default.</h3>
        <ul className="guidance-list">
          <li>Memoize when you can point to repeated expensive work or a memoized child that needs stable props.</li>
          <li>Prefer simple code until a render bottleneck or unstable reference is actually visible.</li>
          <li>Measure with render counts and recomputation counts instead of relying on intuition.</li>
        </ul>
      </section>

      <section className="guide-stack" aria-label="When memoization matters">
        <article className="guide-card">
          <p className="demo-kicker">React.memo</p>
          <h3>Useful when a child keeps getting the same props.</h3>
          <p className="demo-copy">
            <code>React.memo</code> helps when a child re-renders often with the same props and
            skipping that render actually matters. If the child is cheap, or its props are new on
            every render, it usually does not buy you much.
          </p>
        </article>

        <article className="guide-card">
          <p className="demo-kicker">useMemo</p>
          <h3>Useful for expensive work or stable derived values.</h3>
          <p className="demo-copy">
            <code>useMemo</code> is for expensive derived values or for keeping a value stable when
            that stability matters somewhere else. If the work is cheap, memoizing it usually adds
            more complexity than value.
          </p>
        </article>

        <article className="guide-card">
          <p className="demo-kicker">useCallback</p>
          <h3>Useful when function identity is part of the problem.</h3>
          <p className="demo-copy">
            <code>useCallback</code> mainly helps when a callback is passed to a memoized child or
            used in identity-sensitive hook logic. If nothing cares whether the function is the
            same one, it is usually unnecessary.
          </p>
        </article>
      </section>

      <section className="callout-card">
        <p className="demo-kicker">Decision checklist</p>
        <h3>Ask these questions before adding memoization.</h3>
        <ul className="guidance-list">
          <li>Is the work actually expensive enough that repeated renders are a problem?</li>
          <li>Is some child, hook, or library code observing object or function identity?</li>
          <li>Would simpler code be easier to maintain with no noticeable performance cost?</li>
          <li>Did profiling or render counts show a real bottleneck instead of a guessed one?</li>
        </ul>
      </section>

      <section className="callout-card">
        <p className="demo-kicker">Profiling mindset</p>
        <h3>Measure the render problem before you optimize it.</h3>
        <p className="demo-copy">
          Use React DevTools Profiler to confirm that a component is re-rendering more than expected
          or doing work that is expensive enough to matter. Memoization is easiest to justify when
          you can see a repeated render or recomputation pattern instead of guessing one exists.
        </p>
        <ol className="guidance-list guidance-list-numbered">
          <li>Open React DevTools and switch to the Profiler tab.</li>
          <li>Start recording, then trigger the interaction you care about on this page.</li>
          <li>Check which components re-rendered and whether those renders were actually slow.</li>
          <li>Look for props, callbacks, or derived values changing identity during unrelated updates.</li>
          <li>Add memoization only where it removes real work, then profile again to confirm the difference.</li>
        </ol>
      </section>

      <section className="guide-stack" aria-label="When memoization is overkill">
        <article className="guide-card">
          <p className="demo-kicker">When it is overkill</p>
          <h3>Do not add memoization just because something runs during render.</h3>
          <p className="demo-copy">
            Cheap calculations, simple event handlers, and short-lived objects are usually not worth
            memoizing on their own. If there is no expensive work and no identity-sensitive consumer,
            the extra hooks make the code harder to read without changing behavior in a meaningful way.
          </p>
          <ul className="guidance-list">
            <li><code>useMemo(() =&gt; items.length, [items])</code> is usually unnecessary.</li>
            <li><code>useCallback(() =&gt; setOpen(true), [])</code> is usually just noise.</li>
            <li>A fresh object only matters when something downstream depends on it being stable.</li>
          </ul>
        </article>
      </section>

      <CheapComputationDemo />
      <ExpensiveComputationDemo />
      <StablePropsDemo />
      <EffectDependencyDemo />
    </section>
  );
}

function CheapComputationDemo() {
  const [query, setQuery] = useState("");
  const [unrelatedCount, setUnrelatedCount] = useState(0);
  const renderCount = useRenderCount();
  const computationCount = useRef(0);

  computationCount.current += 1;

  const visibleSnacks = snackIdeas.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 1</p>
          <h3>Cheap derived values usually do not need memoization.</h3>
        </div>
        <div className="stats-row">
          <span className="stat-chip">renders: {renderCount}</span>
          <span className="stat-chip">computations: {computationCount.current}</span>
        </div>
      </div>

      <p className="demo-copy">
        This filter runs on every render, including when the unrelated counter changes. That is
        fine because the work is tiny and the unmemoized version is easier to read than adding
        <code>useMemo</code> around it.
      </p>

      <div className="control-row">
        <label className="field">
          Search snack ideas
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <button className="secondary-button" onClick={() => setUnrelatedCount((count) => count + 1)}>
          Unrelated parent update: {unrelatedCount}
        </button>
      </div>

      <ul className="list">
        {visibleSnacks.map((item) => (
          <li key={item} className="list-item">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExpensiveComputationDemo() {
  const [query, setQuery] = useState("pattern 1");
  const [sortByGroup, setSortByGroup] = useState(false);
  const [unrelatedCount, setUnrelatedCount] = useState(0);
  const renderCount = useRenderCount();
  const plainRuns = useRef(0);
  const memoRuns = useRef(0);

  const plainMatches = buildExpensiveMatches(query, sortByGroup, plainRuns);
  const memoMatches = useMemo(
    () => buildExpensiveMatches(query, sortByGroup, memoRuns),
    [query, sortByGroup],
  );

  return (
    <section className="demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 2</p>
          <h3>Expensive derived work is where <code>useMemo</code> helps.</h3>
        </div>
        <div className="stats-row">
          <span className="stat-chip">renders: {renderCount}</span>
          <span className="stat-chip">parent updates: {unrelatedCount}</span>
        </div>
      </div>

      <p className="demo-copy">
        Both panels depend on the same query, but only the memoized version skips recomputing when
        the unrelated button updates parent state. This is the kind of case where caching the value
        reduces real work instead of just adding abstraction.
      </p>

      <div className="control-row">
        <label className="field">
          Query
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={sortByGroup}
            onChange={() => setSortByGroup((value) => !value)}
          />
          Sort by group
        </label>
        <button className="secondary-button" onClick={() => setUnrelatedCount((count) => count + 1)}>
          Unrelated parent update
        </button>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card">
          <div className="demo-section-header">
            <h4>Without useMemo</h4>
            <span className="stat-chip">recomputations: {plainRuns.current}</span>
          </div>
          <p className="demo-copy">Every parent render repeats the expensive search.</p>
          <p className="demo-summary">{plainMatches.length} matching rows</p>
        </article>

        <article className="comparison-card">
          <div className="demo-section-header">
            <h4>With useMemo</h4>
            <span className="stat-chip">recomputations: {memoRuns.current}</span>
          </div>
          <p className="demo-copy">The search reruns only when the query or sort flag changes.</p>
          <p className="demo-summary">{memoMatches.length} matching rows</p>
        </article>
      </div>
    </section>
  );
}

function StablePropsDemo() {
  const [draft, setDraft] = useState("Stable props");
  const [themeTick, setThemeTick] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const renderCount = useRenderCount();

  const unstableDetails = {
    emphasis: "Fresh object prop.",
    note: "Even with React.memo, this child keeps re-rendering because the parent creates a new object each time."
  };

  const stableDetails = useMemo(
    () => ({
      emphasis: "Stable object prop.",
      note: "This child can skip unrelated parent updates because the object prop is reused until the draft changes."
    }),
    [draft],
  );

  const unstableSelect = () => {
    setClickCount((count) => count + 1);
  };

  const stableSelect = useCallback(() => {
    setClickCount((count) => count + 1);
  }, []);

  return (
    <section className="demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 3</p>
          <h3><code>React.memo</code> only pays off when props are stable.</h3>
        </div>
        <div className="stats-row">
          <span className="stat-chip">parent renders: {renderCount}</span>
          <span className="stat-chip">callbacks fired: {clickCount}</span>
        </div>
      </div>

      <p className="demo-copy">
        Both children are wrapped in <code>React.memo</code>. The first still re-renders because it
        receives a new object and a new function every time. The second uses <code>useMemo</code>
        and <code>useCallback</code> so its props stay shallow-equal during unrelated updates.
      </p>

      <div className="control-row">
        <label className="field">
          Shared label
          <input value={draft} onChange={(event) => setDraft(event.target.value)} />
        </label>
        <button className="secondary-button" onClick={() => setThemeTick((count) => count + 1)}>
          Unrelated parent update: {themeTick}
        </button>
      </div>

      <div className="comparison-grid">
        <DemoTile title={draft || "Untitled"} details={unstableDetails} onSelect={unstableSelect} />
        <DemoTile title={draft || "Untitled"} details={stableDetails} onSelect={stableSelect} />
      </div>
    </section>
  );
}

function EffectDependencyDemo() {
  const [roomId, setRoomId] = useState("design-review");
  const [theme, setTheme] = useState("light");
  const renderCount = useRenderCount();
  const unstableEffectRuns = useRef(0);
  const stableEffectRuns = useRef(0);

  const unstableCreateOptions = () => ({
    roomId,
    reconnect: true
  });

  const stableCreateOptions = useCallback(
    () => ({
      roomId,
      reconnect: true
    }),
    [roomId],
  );

  useEffect(() => {
    unstableEffectRuns.current += 1;
  }, [theme, unstableCreateOptions]);

  useEffect(() => {
    stableEffectRuns.current += 1;
  }, [theme, stableCreateOptions]);

  return (
    <section className="demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 4</p>
          <h3><code>useCallback</code> can matter when an effect depends on a function.</h3>
        </div>
        <div className="stats-row">
          <span className="stat-chip">parent renders: {renderCount}</span>
          <span className="stat-chip">theme: {theme}</span>
        </div>
      </div>

      <p className="demo-copy">
        A callback recreated on every render also looks new to an effect dependency array. In that
        case, <code>useCallback</code> is not about a memoized child. It is about stopping unrelated
        effect churn when the function identity should only change with the data it closes over.
      </p>

      <div className="control-row">
        <label className="field">
          Room ID
          <input value={roomId} onChange={(event) => setRoomId(event.target.value)} />
        </label>
        <button
          className="secondary-button"
          onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
        >
          Toggle unrelated theme
        </button>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card">
          <div className="demo-section-header">
            <h4>Without useCallback</h4>
            <span className="stat-chip">effect runs: {unstableEffectRuns.current}</span>
          </div>
          <p className="demo-copy">
            The dependency changes on every render, so unrelated theme updates keep retriggering work.
          </p>
        </article>

        <article className="comparison-card">
          <div className="demo-section-header">
            <h4>With useCallback</h4>
            <span className="stat-chip">effect runs: {stableEffectRuns.current}</span>
          </div>
          <p className="demo-copy">
            The dependency stays stable until <code>roomId</code> changes, so unrelated renders do not
            force extra effect work.
          </p>
        </article>
      </div>
    </section>
  );
}

function useRenderCount() {
  const renderCount = useRef(0);
  renderCount.current += 1;
  return renderCount.current;
}

function buildExpensiveMatches(
  query: string,
  sortByGroup: boolean,
  runs: { current: number },
) {
  runs.current += 1;

  const normalizedQuery = query.trim().toLowerCase();

  const matches = perfDataset.filter((item) => {
    let score = 0;

    for (let index = 0; index < 9000; index += 1) {
      score += (index * 7) % 13;
    }

    if (!normalizedQuery) {
      return score >= 0;
    }

    return (
      item.label.toLowerCase().includes(normalizedQuery) ||
      item.group.toLowerCase().includes(normalizedQuery)
    );
  });

  return [...matches].sort((left, right) => {
    if (sortByGroup) {
      return left.group.localeCompare(right.group) || left.label.localeCompare(right.label);
    }

    return left.label.localeCompare(right.label);
  });
}
