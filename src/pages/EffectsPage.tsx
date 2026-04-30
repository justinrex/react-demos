import { useEffect, useRef, useState } from "react";
import { PageIntro } from "../components/PageIntro";
import { LessonHero } from "../components/LessonHero";
import { GuidanceGrid } from "../components/GuidanceGrid";
import { RuleCallout } from "../components/RuleCallout";
import { DemoSectionHeader } from "../components/DemoSectionHeader";
import { ComparisonCardHeader } from "../components/ComparisonCardHeader";

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

      <LessonHero
        ariaLabel="Effects mental model"
        tone="effects"
        title="Ask whether React is syncing with something outside itself."
        copy="Requests, timers, subscriptions, browser APIs, and DOM integration usually need effects. Filtering data, combining props, and handling a click usually do not."
        prompts={[
          {
            label: "Before writing the effect",
            value: "What external thing changes here?",
          },
          {
            label: "Before choosing dependencies",
            value: "Which values truly define the sync?",
          },
          {
            label: "Before shipping it",
            value: "What stale work needs cleanup?",
          },
        ]}
      />

      <GuidanceGrid
        ariaLabel="Effects guidance"
        items={[
          {
            question: "Is there an external system to synchronize with?",
            answer:
              "If the work is just filtering, sorting, combining values, or responding to a click, it usually belongs in render logic or the event handler instead of an effect.",
          },
          {
            question: "What values does the synchronization actually depend on?",
            answer:
              "Dependency arrays are not optimization knobs. They describe which values the synchronization reads so React can rerun cleanup and setup at the right time.",
          },
          {
            question: "What has to be cleaned up when the render changes?",
            answer:
              "Timers, requests, subscriptions, and listeners can outlive the render that created them. If that work can become stale, teardown is part of the effect contract.",
          },
        ]}
      />

      <RuleCallout
        title="Start by trying to remove the effect."
        bullets={[
          "Compute derived values during render instead of mirroring them into state.",
          "Keep event-specific logic inside the event handler that caused it.",
          "Use effects for requests, timers, subscriptions, and DOM or browser synchronization.",
          "Extract a reusable hook only after the underlying effect pattern is already correct.",
        ]}
      />

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
      <DemoSectionHeader
        eyebrow="Example 1"
        title="Do not mirror derived values into state with an effect."
        note="If there is no external system, there is usually no synchronization problem to solve."
        aside={
          <div className="stats-row">
            <span className="stat-chip">renders: {renderCount}</span>
            <span className="stat-chip">effect syncs: {badRuns.current}</span>
          </div>
        }
      />

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
          <ComparisonCardHeader
            label="Extra effect"
            tone="caution"
            title="Effect + mirrored state"
            aside={<span className="stat-chip">items: {mirroredItems.length}</span>}
          />
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
          <ComparisonCardHeader
            label="Better fit"
            tone="success"
            title="Derived during render"
            aside={<span className="stat-chip">items: {derivedItems.length}</span>}
          />
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
      <DemoSectionHeader
        eyebrow="Example 2"
        title="Effects and timers can capture stale values."
        note="Async callbacks do not automatically see the latest render."
        aside={
          <div className="stats-row">
            <span className="stat-chip">renders: {renderCount}</span>
            <span className="stat-chip">count: {count}</span>
          </div>
        }
      />

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
          <ComparisonCardHeader
            label="Buggy path"
            tone="caution"
            title="Captured value"
            aside={
              <span className="stat-chip">
                last result: {badValue === null ? "none" : badValue}
              </span>
            }
          />
          <LogList entries={badLog.entries} emptyLabel="No timeout scheduled yet." />
        </article>

        <article className="comparison-card comparison-card-success">
          <ComparisonCardHeader
            label="Safer path"
            tone="success"
            title="Latest value"
            aside={
              <span className="stat-chip">
                last result: {goodValue === null ? "none" : goodValue}
              </span>
            }
          />
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
      <DemoSectionHeader
        eyebrow="Example 3"
        title="Async effects need cleanup when newer work can replace older work."
        note="The cleanup decides whether an older request is still allowed to update the UI."
        aside={
          <div className="stats-row">
            <span className="stat-chip">renders: {renderCount}</span>
            <span className="stat-chip">term: {term}</span>
          </div>
        }
      />

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
          <ComparisonCardHeader
            label="Race risk"
            tone="caution"
            title="No cleanup"
            aside={
              <span className="stat-chip">
                {badLoading ? "loading..." : "settled"}
              </span>
            }
          />
          <p className="demo-summary">{badResult}</p>
          <LogList entries={badLog.entries} emptyLabel="No requests yet." />
        </article>

        <article className="comparison-card comparison-card-success">
          <ComparisonCardHeader
            label="Preferred"
            tone="success"
            title="Cleanup guards stale responses"
            aside={
              <span className="stat-chip">
                {goodLoading ? "loading..." : "settled"}
              </span>
            }
          />
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
      <DemoSectionHeader
        eyebrow="Example 4"
        title="Unstable objects and unrelated values can churn an effect."
        note="The best dependency fix is often to redraw the effect boundary around the actual synchronization concern."
        aside={
          <div className="stats-row">
            <span className="stat-chip">renders: {renderCount}</span>
            <span className="stat-chip">theme: {theme}</span>
          </div>
        }
      />

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
          <ComparisonCardHeader
            label="Too broad"
            tone="caution"
            title="Churned dependency graph"
            aside={
              <span className="stat-chip">
                connections: {badConnections.current}
              </span>
            }
          />
          <LogList entries={badLog.entries} emptyLabel="No connections yet." />
        </article>

        <article className="comparison-card comparison-card-success">
          <ComparisonCardHeader
            label="Scoped better"
            tone="success"
            title="Scoped to the real dependency"
            aside={
              <span className="stat-chip">
                connections: {goodConnections.current}
              </span>
            }
          />
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
