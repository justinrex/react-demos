import { useEffect, useRef, useState } from "react";
import { PageIntro } from "../components/PageIntro";

const products = [
  "Apple slices",
  "Banana chips",
  "Cheese crackers",
  "Greek yogurt",
  "Peanut butter toast",
  "Trail mix",
];

type LogEntry = {
  id: number;
  text: string;
};

export function EffectsPage() {
  return (
    <section className="page effects-page">
      <PageIntro
        eyebrow="Effects"
        title="Use effects to synchronize, not to hold ordinary app logic."
        subtitle="Each section compares an effect-heavy pattern against a cleaner version so you can see when an effect is necessary, what it truly depends on, and when cleanup matters."
      />

      <section className="effects-hero" aria-label="Effects mental model">
        <div className="effects-hero-copy">
          <p className="demo-kicker">Mental model</p>
          <h3>Ask whether React is syncing with something outside itself.</h3>
          <p className="demo-copy">
            Requests, timers, subscriptions, browser APIs, and DOM integration
            usually need effects. Filtering data, combining props, and handling
            a click usually do not.
          </p>
        </div>

        <div className="effects-hero-grid">
          <article className="effects-prompt-card">
            <p className="effects-prompt-label">Before writing the effect</p>
            <p className="effects-prompt-value">What external thing changes here?</p>
          </article>
          <article className="effects-prompt-card">
            <p className="effects-prompt-label">Before choosing dependencies</p>
            <p className="effects-prompt-value">Which values truly define the sync?</p>
          </article>
          <article className="effects-prompt-card">
            <p className="effects-prompt-label">Before shipping it</p>
            <p className="effects-prompt-value">What stale work needs cleanup?</p>
          </article>
        </div>
      </section>

      <section className="guide-grid" aria-label="Effects guidance">
        <article className="guide-card">
          <p className="demo-kicker">Question 1</p>
          <h3>Is there an external system to synchronize with?</h3>
          <p className="demo-copy">
            If the work is just filtering, sorting, combining values, or
            responding to a click, it usually belongs in render logic or the
            event handler instead of an effect.
          </p>
        </article>

        <article className="guide-card">
          <p className="demo-kicker">Question 2</p>
          <h3>What values does the synchronization actually depend on?</h3>
          <p className="demo-copy">
            Dependency arrays are not optimization knobs. They describe which
            values the synchronization reads so React can rerun cleanup and
            setup at the right time.
          </p>
        </article>

        <article className="guide-card">
          <p className="demo-kicker">Question 3</p>
          <h3>What has to be cleaned up when the render changes?</h3>
          <p className="demo-copy">
            Timers, requests, subscriptions, and listeners can outlive the
            render that created them. If that work can become stale, teardown is
            part of the effect contract.
          </p>
        </article>
      </section>

      <section className="callout-card">
        <p className="demo-kicker">Rule of thumb</p>
        <h3>Start by trying to remove the effect.</h3>
        <ul className="guidance-list">
          <li>Compute derived values during render instead of mirroring them into state.</li>
          <li>Keep event-specific logic inside the event handler that caused it.</li>
          <li>Use effects for requests, timers, subscriptions, and DOM or browser synchronization.</li>
          <li>Extract a reusable hook only after the underlying effect pattern is already correct.</li>
        </ul>
      </section>

      <DerivedStateDemo />
      <StaleClosureDemo />
      <FetchRaceDemo />
      <DependencyChurnDemo />

      <section className="callout-card">
        <p className="demo-kicker">Reusable hooks</p>
        <h3>Package a correct synchronization pattern. Do not hide a bad one.</h3>
        <p className="demo-copy">
          A custom hook is useful when you have a real synchronization concern
          like a timer, event listener, or abortable request that repeats across
          components. It does not make a derived-state effect or unstable
          dependency graph more correct. Get the effect model right first, then
          extract the repeated setup and cleanup into a hook boundary.
        </p>
      </section>
    </section>
  );
}

function DerivedStateDemo() {
  const [query, setQuery] = useState("");
  const [showShortNames, setShowShortNames] = useState(false);
  const [unrelatedCount, setUnrelatedCount] = useState(0);
  const [mirroredItems, setMirroredItems] = useState<string[]>([]);
  const renderCount = useRenderCount();
  const badRuns = useRef(0);

  useEffect(() => {
    badRuns.current += 1;

    const nextItems = products
      .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
      .filter((item) => !showShortNames || item.length <= 12);

    setMirroredItems(nextItems);
  }, [query, showShortNames]);

  const derivedItems = products
    .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
    .filter((item) => !showShortNames || item.length <= 12);

  return (
    <section className="demo-section effects-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 1</p>
          <h3>Do not mirror derived values into state with an effect.</h3>
          <p className="demo-copy demo-section-note">
            If there is no external system, there is usually no synchronization
            problem to solve.
          </p>
        </div>
        <div className="stats-row">
          <span className="stat-chip">renders: {renderCount}</span>
          <span className="stat-chip">effect syncs: {badRuns.current}</span>
        </div>
      </div>

      <p className="demo-copy">
        Both panels show the same filtered list. The first one uses an effect
        and extra state just to copy a value React could derive during render.
        The second does the same work directly with less ceremony.
      </p>

      <div className="control-row">
        <label className="field">
          Search snacks
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={showShortNames}
            onChange={() => setShowShortNames((value) => !value)}
          />
          Only show shorter names
        </label>
        <button
          className="secondary-button"
          onClick={() => setUnrelatedCount((count) => count + 1)}
        >
          Unrelated update: {unrelatedCount}
        </button>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-caution">
          <div className="demo-section-header">
            <div>
              <p className="comparison-label comparison-label-caution">Extra effect</p>
              <h4>Effect + mirrored state</h4>
            </div>
            <span className="stat-chip">items: {mirroredItems.length}</span>
          </div>
          <p className="demo-copy">
            The effect exists only to recalculate and store something already
            implied by existing state.
          </p>
          <ul className="list">
            {mirroredItems.map((item) => (
              <li key={item} className="list-item">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="comparison-card comparison-card-success">
          <div className="demo-section-header">
            <div>
              <p className="comparison-label comparison-label-success">Better fit</p>
              <h4>Derived during render</h4>
            </div>
            <span className="stat-chip">items: {derivedItems.length}</span>
          </div>
          <p className="demo-copy">
            This version removes the synchronization step because there is no
            external system involved.
          </p>
          <ul className="list">
            {derivedItems.map((item) => (
              <li key={item} className="list-item">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

function StaleClosureDemo() {
  const [count, setCount] = useState(0);
  const [badValue, setBadValue] = useState<number | null>(null);
  const [goodValue, setGoodValue] = useState<number | null>(null);
  const renderCount = useRenderCount();
  const badLog = useEventLog();
  const goodLog = useEventLog();
  const latestCount = useRef(count);

  useEffect(() => {
    latestCount.current = count;
  }, [count]);

  const scheduleBadAlert = () => {
    const capturedCount = count;
    badLog.push(`scheduled timeout with count ${capturedCount}`);

    window.setTimeout(() => {
      setBadValue(capturedCount);
      badLog.push(`timeout read stale count ${capturedCount}`);
    }, 1200);
  };

  const scheduleGoodAlert = () => {
    goodLog.push(`scheduled timeout with count ${count}`);

    window.setTimeout(() => {
      const nextValue = latestCount.current;
      setGoodValue(nextValue);
      goodLog.push(`timeout read latest count ${nextValue}`);
    }, 1200);
  };

  return (
    <section className="demo-section effects-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 2</p>
          <h3>Effects and timers can capture stale values.</h3>
          <p className="demo-copy demo-section-note">
            Async callbacks do not automatically see the latest render.
          </p>
        </div>
        <div className="stats-row">
          <span className="stat-chip">renders: {renderCount}</span>
          <span className="stat-chip">count: {count}</span>
        </div>
      </div>

      <p className="demo-copy">
        Schedule a timeout, then increment the counter before it fires. The bad
        path captures the old value. The safer path reads the latest value from
        a ref at the moment the async callback runs.
      </p>

      <div className="control-row">
        <button
          className="secondary-button"
          onClick={() => setCount((value) => value + 1)}
        >
          Increment count
        </button>
        <button className="secondary-button" onClick={scheduleBadAlert}>
          Schedule stale timeout
        </button>
        <button className="secondary-button" onClick={scheduleGoodAlert}>
          Schedule latest timeout
        </button>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-caution">
          <div className="demo-section-header">
            <div>
              <p className="comparison-label comparison-label-caution">Buggy path</p>
              <h4>Captured value</h4>
            </div>
            <span className="stat-chip">
              last result: {badValue === null ? "none" : badValue}
            </span>
          </div>
          <LogList entries={badLog.entries} emptyLabel="No timeout scheduled yet." />
        </article>

        <article className="comparison-card comparison-card-success">
          <div className="demo-section-header">
            <div>
              <p className="comparison-label comparison-label-success">Safer path</p>
              <h4>Latest value</h4>
            </div>
            <span className="stat-chip">
              last result: {goodValue === null ? "none" : goodValue}
            </span>
          </div>
          <LogList
            entries={goodLog.entries}
            emptyLabel="No timeout scheduled yet."
          />
        </article>
      </div>
    </section>
  );
}

function FetchRaceDemo() {
  const [term, setTerm] = useState("slow tickets");
  const [badResult, setBadResult] = useState("nothing fetched yet");
  const [goodResult, setGoodResult] = useState("nothing fetched yet");
  const [badLoading, setBadLoading] = useState(false);
  const [goodLoading, setGoodLoading] = useState(false);
  const renderCount = useRenderCount();
  const badLog = useEventLog();
  const goodLog = useEventLog();

  useEffect(() => {
    setBadLoading(true);
    badLog.push(`request started for "${term}"`);

    fakeSearch(term).then((result) => {
      setBadLoading(false);
      setBadResult(result);
      badLog.push(`response committed for "${term}"`);
    });
  }, [term]);

  useEffect(() => {
    let ignore = false;

    setGoodLoading(true);
    goodLog.push(`request started for "${term}"`);

    fakeSearch(term).then((result) => {
      if (ignore) {
        goodLog.push(`response ignored for "${term}"`);
        return;
      }

      setGoodLoading(false);
      setGoodResult(result);
      goodLog.push(`response committed for "${term}"`);
    });

    return () => {
      ignore = true;
      goodLog.push(`cleanup ran for "${term}"`);
    };
  }, [term]);

  const runRace = () => {
    setTerm("slow tickets");
    window.setTimeout(() => {
      setTerm("fast meetup");
    }, 180);
  };

  return (
    <section className="demo-section effects-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 3</p>
          <h3>Async effects need cleanup when newer work can replace older work.</h3>
          <p className="demo-copy demo-section-note">
            The cleanup decides whether an older request is still allowed to
            update the UI.
          </p>
        </div>
        <div className="stats-row">
          <span className="stat-chip">renders: {renderCount}</span>
          <span className="stat-chip">term: {term}</span>
        </div>
      </div>

      <p className="demo-copy">
        The button triggers a slow request and then a faster one. Without
        cleanup, the slower response can land last and overwrite newer UI.
      </p>

      <div className="control-row">
        <button className="secondary-button" onClick={runRace}>
          Run slow-then-fast search
        </button>
        <button
          className="secondary-button"
          onClick={() => setTerm("slow tickets")}
        >
          Search slow query
        </button>
        <button
          className="secondary-button"
          onClick={() => setTerm("fast meetup")}
        >
          Search fast query
        </button>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-caution">
          <div className="demo-section-header">
            <div>
              <p className="comparison-label comparison-label-caution">Race risk</p>
              <h4>No cleanup</h4>
            </div>
            <span className="stat-chip">
              {badLoading ? "loading..." : "settled"}
            </span>
          </div>
          <p className="demo-summary">{badResult}</p>
          <LogList entries={badLog.entries} emptyLabel="No requests yet." />
        </article>

        <article className="comparison-card comparison-card-success">
          <div className="demo-section-header">
            <div>
              <p className="comparison-label comparison-label-success">Preferred</p>
              <h4>Cleanup guards stale responses</h4>
            </div>
            <span className="stat-chip">
              {goodLoading ? "loading..." : "settled"}
            </span>
          </div>
          <p className="demo-summary">{goodResult}</p>
          <LogList entries={goodLog.entries} emptyLabel="No requests yet." />
        </article>
      </div>
    </section>
  );
}

function DependencyChurnDemo() {
  const [roomId, setRoomId] = useState("design-review");
  const [theme, setTheme] = useState("sand");
  const renderCount = useRenderCount();
  const badLog = useEventLog();
  const goodLog = useEventLog();
  const badConnections = useRef(0);
  const goodConnections = useRef(0);

  useEffect(() => {
    badConnections.current += 1;
    badLog.push(`connect ${badConnections.current} with theme ${theme}`);

    return () => {
      badLog.push(`disconnect room ${roomId}`);
    };
  }, [theme, roomId]);

  useEffect(() => {
    goodConnections.current += 1;
    const connectionOptions = {
      roomId,
      reconnect: true,
    };

    goodLog.push(
      `connect ${goodConnections.current} for ${connectionOptions.roomId}`,
    );

    return () => {
      goodLog.push(`disconnect room ${connectionOptions.roomId}`);
    };
  }, [roomId]);

  return (
    <section className="demo-section effects-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 4</p>
          <h3>Unstable objects and unrelated values can churn an effect.</h3>
          <p className="demo-copy demo-section-note">
            The best dependency fix is often to redraw the effect boundary
            around the actual synchronization concern.
          </p>
        </div>
        <div className="stats-row">
          <span className="stat-chip">renders: {renderCount}</span>
          <span className="stat-chip">theme: {theme}</span>
        </div>
      </div>

      <p className="demo-copy">
        The first effect treats theme as part of the connection contract, so a
        visual-only change reconnects the room. This is the same class of bug
        you get from unstable inline objects or functions in the dependency
        list. The second keeps connection setup scoped to the value that
        actually defines the external subscription.
      </p>

      <div className="control-row">
        <label className="field">
          Room id
          <input
            value={roomId}
            onChange={(event) => setRoomId(event.target.value)}
          />
        </label>
        <button
          className="secondary-button"
          onClick={() =>
            setTheme((value) => (value === "sand" ? "night" : "sand"))
          }
        >
          Toggle theme
        </button>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-caution">
          <div className="demo-section-header">
            <div>
              <p className="comparison-label comparison-label-caution">Too broad</p>
              <h4>Churned dependency graph</h4>
            </div>
            <span className="stat-chip">
              connections: {badConnections.current}
            </span>
          </div>
          <LogList entries={badLog.entries} emptyLabel="No connections yet." />
        </article>

        <article className="comparison-card comparison-card-success">
          <div className="demo-section-header">
            <div>
              <p className="comparison-label comparison-label-success">Scoped better</p>
              <h4>Scoped to the real dependency</h4>
            </div>
            <span className="stat-chip">
              connections: {goodConnections.current}
            </span>
          </div>
          <LogList entries={goodLog.entries} emptyLabel="No connections yet." />
        </article>
      </div>
    </section>
  );
}

function LogList({
  entries,
  emptyLabel,
}: {
  entries: LogEntry[];
  emptyLabel: string;
}) {
  if (entries.length === 0) {
    return <p className="demo-copy">{emptyLabel}</p>;
  }

  return (
    <ol className="log-list">
      {entries.map((entry) => (
        <li key={entry.id} className="log-item">
          {entry.text}
        </li>
      ))}
    </ol>
  );
}

function fakeSearch(term: string) {
  const wait = term.includes("slow") ? 900 : 250;

  return new Promise<string>((resolve) => {
    window.setTimeout(() => {
      resolve(`${term} results ready after ${wait}ms`);
    }, wait);
  });
}

function useRenderCount() {
  const renderCount = useRef(0);
  renderCount.current += 1;
  return renderCount.current;
}

function useEventLog() {
  const nextId = useRef(0);
  const [entries, setEntries] = useState<LogEntry[]>([]);

  return {
    entries,
    push(text: string) {
      nextId.current += 1;

      setEntries((current) => [
        { id: nextId.current, text },
        ...current.slice(0, 4),
      ]);
    },
  };
}
