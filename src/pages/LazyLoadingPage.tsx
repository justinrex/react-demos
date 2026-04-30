import { Suspense, lazy, useState } from "react";
import { PageIntro } from "../components/PageIntro";
import { LessonHero } from "../components/LessonHero";
import { GuidanceGrid } from "../components/GuidanceGrid";
import { RuleCallout } from "../components/RuleCallout";
import { ComparisonCardHeader } from "../components/ComparisonCardHeader";

const galleryItems = [
  {
    id: "poster-1",
    title: "Keynote stage",
    color: "#d88855",
    loading: "eager" as const,
  },
  {
    id: "poster-2",
    title: "Design workshop",
    color: "#7fb38d",
    loading: "eager" as const,
  },
  {
    id: "poster-3",
    title: "Late-night set",
    color: "#7fa9d6",
    loading: "lazy" as const,
  },
  {
    id: "poster-4",
    title: "Vendor row",
    color: "#c691c8",
    loading: "lazy" as const,
  },
  {
    id: "poster-5",
    title: "Community meetup",
    color: "#d5b45f",
    loading: "lazy" as const,
  },
  {
    id: "poster-6",
    title: "Closing session",
    color: "#6ab7b0",
    loading: "lazy" as const,
  },
];

const virtualRows = Array.from({ length: 2000 }, (_, index) => ({
  id: index,
  label: `Attendee row ${index + 1}`,
  detail:
    index % 3 === 0
      ? "Checked in recently"
      : index % 3 === 1
        ? "Waiting for badge print"
        : "Favorited two sessions",
}));

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

let insightsPromise:
  | Promise<typeof import("./lazy-loading/LazyInsightsPanel")>
  | undefined;
let coarseChartPromise:
  | Promise<typeof import("./lazy-loading/LazyRevenueChart")>
  | undefined;
let scopedChartPromise:
  | Promise<typeof import("./lazy-loading/LazyRevenueChart")>
  | undefined;
let preloadedInspectorPromise:
  | Promise<typeof import("./lazy-loading/LazyInsightsPanel")>
  | undefined;

function loadInsightsPanel() {
  if (!insightsPromise) {
    insightsPromise = import("./lazy-loading/LazyInsightsPanel").then(
      async (module) => {
        await wait(900);
        return module;
      },
    );
  }

  return insightsPromise;
}

function loadCoarseChart() {
  if (!coarseChartPromise) {
    coarseChartPromise = import("./lazy-loading/LazyRevenueChart").then(
      async (module) => {
        await wait(1100);
        return module;
      },
    );
  }

  return coarseChartPromise;
}

function loadScopedChart() {
  if (!scopedChartPromise) {
    scopedChartPromise = import("./lazy-loading/LazyRevenueChart").then(
      async (module) => {
        await wait(1100);
        return module;
      },
    );
  }

  return scopedChartPromise;
}

function loadPreloadedInspector() {
  if (!preloadedInspectorPromise) {
    preloadedInspectorPromise = import("./lazy-loading/LazyInsightsPanel").then(
      async (module) => {
        await wait(1200);
        return module;
      },
    );
  }

  return preloadedInspectorPromise;
}

const LazyInsightsPanel = lazy(loadInsightsPanel);
const LazyCoarseChart = lazy(loadCoarseChart);
const LazyScopedChart = lazy(loadScopedChart);
const LazyPreloadedInspector = lazy(loadPreloadedInspector);

export function LazyLoadingPage() {
  return (
    <section className="page lazy-page">
      <PageIntro
        eyebrow="Lazy Loading"
        title="Lazy load code, media, and long lists only when they are needed."
        subtitle="This page covers several flavors of deferred loading: code splitting, Suspense boundaries, browser image lazy loading, list virtualization, and preloading on visible intent."
      />

      <LessonHero
        ariaLabel="Lazy loading mental model"
        tone="lazy"
        title="Ship the first screen fast, then load secondary code on demand."
        copy="Lazy loading works best for routes, drawers, inspectors, charts, editors, offscreen media, and large collections that do not need to render all at once. It is a deferral tool, not a default for everything."
        prompts={[
          {
            label: "Good lazy targets",
            value: "Rarely opened panels, offscreen media, and huge collections",
          },
          {
            label: "Bad lazy targets",
            value: "Core page shell and above-the-fold essentials",
          },
          {
            label: "Boundary rule",
            value: "Suspend the smallest region that can honestly wait",
          },
        ]}
      />

      <GuidanceGrid
        ariaLabel="Lazy loading guidance"
        items={[
          {
            question: "Does the user need this code for the initial screen?",
            answer:
              "If the answer is yes, do not lazy load it. Delaying required UI only replaces one performance problem with another.",
          },
          {
            question: "Can the loading state stay local instead of blanking the page?",
            answer:
              "Suspense boundaries are UX boundaries. Place them close to the code that can appear later so the rest of the page remains usable.",
          },
          {
            question: "Can the browser or viewport decide what to defer?",
            answer:
              "Images can lazy load when offscreen, and long lists can render only the visible window. Not every deferral needs a manual click.",
          },
        ]}
      />

      <OnDemandPanelDemo />
      <BoundaryPlacementDemo />
      <ImageLazyLoadingDemo />
      <VirtualizedListDemo />
      <PreloadIntentDemo />

      <RuleCallout
        title="Lazy loading is only a win if the loading boundary feels intentional."
        bullets={[
          "Defer code that is optional, infrequent, or clearly secondary.",
          "Keep the first meaningful screen eager and responsive.",
          "Prefer small fallback regions over whole-page spinners.",
          "Let the browser defer offscreen media and let virtualization cap DOM size.",
          "Preload on intent when a delayed interaction would feel clumsy.",
        ]}
      />

      <section className="callout-card">
        <p className="demo-kicker">Other deferred patterns</p>
        <h3>Not every lazy strategy looks like <code>React.lazy</code>.</h3>
        <ul className="guidance-list">
          <li>Route-level code splitting for pages that users may never visit.</li>
          <li>Visibility-triggered data fetches for sections below the fold.</li>
          <li>Idle-time prefetching for likely next routes after the first paint.</li>
          <li><code>useDeferredValue</code> and transitions when rendering work should lag behind urgent input.</li>
        </ul>
      </section>
    </section>
  );
}

function OnDemandPanelDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="demo-section lazy-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 1</p>
          <h3>Lazy load UI that many users never open.</h3>
          <p className="demo-copy demo-section-note">
            This is the simplest good case: keep the shell instant, and load the
            secondary panel only if the user asks for it.
          </p>
        </div>
        <span className="stat-chip">
          panel: {isOpen ? "requested" : "not loaded"}
        </span>
      </div>

      <div className="lazy-frame">
        <div className="lazy-control-strip">
          <p className="demo-copy">
            Orders overview stays visible while the audit panel code loads.
          </p>
          <button
            className="secondary-button"
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? "Hide" : "Open"} audit panel
          </button>
        </div>

        <div className="comparison-grid">
        <article className="comparison-card comparison-card-success">
          <ComparisonCardHeader
            label="Good fit"
            tone="success"
            title="Main workflow stays eager"
          />
            <p className="demo-copy">
              Keep the base page available immediately and defer the optional
              inspection tool.
            </p>
          </article>

          <article className="comparison-card">
            <ComparisonCardHeader label="Deferred region" title="Audit details" />
            {isOpen ? (
              <Suspense fallback={<LazyFallback label="Loading audit panel code..." />}>
                <LazyInsightsPanel
                  title="Audit activity"
                  detail="The user explicitly asked for this extra detail,"
                />
              </Suspense>
            ) : (
              <p className="demo-copy">
                No extra code is loaded until the panel is opened.
              </p>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}

function BoundaryPlacementDemo() {
  const [showCoarseChart, setShowCoarseChart] = useState(false);
  const [showScopedChart, setShowScopedChart] = useState(false);
  const [coarseFilter, setCoarseFilter] = useState("west");
  const [scopedFilter, setScopedFilter] = useState("west");

  return (
    <section className="demo-section lazy-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 2</p>
          <h3>Suspense boundary placement changes the feel of the page.</h3>
          <p className="demo-copy demo-section-note">
            Both views lazy load the same kind of chart. The difference is what
            gets blocked while that code arrives.
          </p>
        </div>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-caution">
          <ComparisonCardHeader
            label="Too coarse"
            tone="caution"
            title="Whole card suspends"
          />
          <Suspense fallback={<LazyFallback label="Loading entire sales card..." />}>
            <div className="lazy-boundary-card">
              <label className="field">
                Region filter
                <input
                  value={coarseFilter}
                  onChange={(event) => setCoarseFilter(event.target.value)}
                />
              </label>
              <button
                className="secondary-button"
                onClick={() => setShowCoarseChart(true)}
              >
                Load chart
              </button>
              {showCoarseChart ? (
                <LazyCoarseChart />
              ) : (
                <p className="demo-copy">
                  Controls and summary disappear once the boundary suspends.
                </p>
              )}
            </div>
          </Suspense>
        </article>

        <article className="comparison-card comparison-card-success">
          <ComparisonCardHeader
            label="Scoped better"
            tone="success"
            title="Only the chart region suspends"
          />
          <div className="lazy-boundary-card">
            <label className="field">
              Region filter
              <input
                value={scopedFilter}
                onChange={(event) => setScopedFilter(event.target.value)}
              />
            </label>
            <button
              className="secondary-button"
              onClick={() => setShowScopedChart(true)}
            >
              Load chart
            </button>
            {showScopedChart ? (
              <Suspense fallback={<LazyFallback label="Loading chart only..." />}>
                <LazyScopedChart />
              </Suspense>
            ) : (
              <p className="demo-copy">
                Inputs stay usable because only the deferred region waits.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function PreloadIntentDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [didPreload, setDidPreload] = useState(false);

  const handlePreload = () => {
    setDidPreload(true);
    void loadPreloadedInspector();
  };

  return (
    <section className="demo-section lazy-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 3</p>
          <h3>Preload when intent is visible, not only after the click.</h3>
          <p className="demo-copy demo-section-note">
            Hover or focus can be enough signal to begin loading code before the
            user fully commits to the action.
          </p>
        </div>
        <span className="stat-chip">
          preload: {didPreload ? "started" : "idle"}
        </span>
      </div>

      <div className="lazy-frame">
        <div className="lazy-control-strip">
          <p className="demo-copy">
            Hover or focus the button first, then open the inspector.
          </p>
          <button
            className="secondary-button"
            onMouseEnter={handlePreload}
            onFocus={handlePreload}
            onClick={() => setIsOpen(true)}
          >
            Preload on intent, then open
          </button>
        </div>

        {isOpen ? (
          <Suspense fallback={<LazyFallback label="Loading prewarmed inspector..." />}>
            <LazyPreloadedInspector
              title="Customer inspector"
              detail="The bundle request started before the click,"
            />
          </Suspense>
        ) : (
          <article className="comparison-card">
            <ComparisonCardHeader
              label="Intent loading"
              title="Route hover and button focus are useful signals"
            />
            <p className="demo-copy">
              This pattern works well for menus, drawers, and routes that are
              likely to open next.
            </p>
          </article>
        )}
      </div>
    </section>
  );
}

function ImageLazyLoadingDemo() {
  return (
    <section className="demo-section lazy-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 3</p>
          <h3>Let the browser lazy load media that starts offscreen.</h3>
          <p className="demo-copy demo-section-note">
            Images lower on the page usually do not need to compete with your
            first paint. Keep the hero image eager, mark secondary media lazy.
          </p>
        </div>
        <div className="stats-row">
          <span className="stat-chip">eager: 2 posters</span>
          <span className="stat-chip">lazy: 4 posters</span>
        </div>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-caution">
          <ComparisonCardHeader
            label="Too eager"
            tone="caution"
            title="Every image competes up front"
          />
          <p className="demo-copy">
            Marking an entire gallery eager forces the browser to prioritize
            media that may still be far below the fold.
          </p>
        </article>

        <article className="comparison-card comparison-card-success">
          <ComparisonCardHeader
            label="Better fit"
            tone="success"
            title="Eager first, lazy later"
          />
          <p className="demo-copy">
            The first useful visuals can stay eager while the rest defer to the
            browser’s offscreen loading heuristics.
          </p>
        </article>
      </div>

      <div className="lazy-gallery">
        {galleryItems.map((item) => (
          <article key={item.id} className="gallery-card">
            <img
              alt={item.title}
              className="gallery-image"
              loading={item.loading}
              src={buildPosterDataUrl(item.title, item.color)}
            />
            <div className="gallery-copy">
              <p className="comparison-label">
                {item.loading === "eager" ? "Eager image" : "Lazy image"}
              </p>
              <h4>{item.title}</h4>
              <p className="demo-copy">
                Uses <code>loading="{item.loading}"</code> so the browser can
                choose when to fetch it.
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function VirtualizedListDemo() {
  const rowHeight = 104;
  const viewportHeight = 272;
  const overscan = 3;
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
  const endIndex = Math.min(virtualRows.length, startIndex + visibleCount);
  const visibleRows = virtualRows.slice(startIndex, endIndex);
  const offsetY = startIndex * rowHeight;

  return (
    <section className="demo-section lazy-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 4</p>
          <h3>Virtualize long lists instead of mounting every row.</h3>
          <p className="demo-copy demo-section-note">
            If only a small window is visible, render that window plus a little
            overscan. This keeps DOM size and layout work under control.
          </p>
        </div>
        <div className="stats-row">
          <span className="stat-chip">total rows: {virtualRows.length}</span>
          <span className="stat-chip">mounted rows: {visibleRows.length}</span>
        </div>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-caution">
          <ComparisonCardHeader
            label="Too much work"
            tone="caution"
            title="Render every row"
          />
          <p className="demo-copy">
            A full render would mount {virtualRows.length} nodes even though the
            user can only see a handful at once.
          </p>
        </article>

        <article className="comparison-card comparison-card-success">
          <ComparisonCardHeader
            label="Preferred"
            tone="success"
            title="Render the visible window"
          />
          <p className="demo-copy">
            This list keeps the full scroll height but mounts only the rows near
            the viewport.
          </p>
        </article>
      </div>

      <div
        className="virtual-list-shell"
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        style={{ height: viewportHeight }}
      >
        <div
          className="virtual-list-spacer"
          style={{ height: virtualRows.length * rowHeight }}
        >
          <div
            className="virtual-list-window"
            style={{ transform: `translateY(${offsetY}px)` }}
          >
            {visibleRows.map((row) => (
              <article
                key={row.id}
                className="virtual-row"
                style={{ minHeight: rowHeight - 8 }}
              >
                <div>
                  <p className="comparison-label">Visible row</p>
                  <h4>{row.label}</h4>
                </div>
                <p className="demo-copy">{row.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LazyFallback({ label }: { label: string }) {
  return (
    <div className="lazy-fallback" role="status" aria-live="polite">
      <span className="lazy-pulse" aria-hidden="true" />
      <p className="demo-copy">{label}</p>
    </div>
  );
}

function buildPosterDataUrl(title: string, color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320">
      <rect width="480" height="320" rx="28" fill="${color}" />
      <circle cx="96" cy="84" r="42" fill="rgba(255,255,255,0.18)" />
      <rect x="56" y="176" width="368" height="18" rx="9" fill="rgba(11,13,16,0.38)" />
      <rect x="56" y="210" width="280" height="14" rx="7" fill="rgba(11,13,16,0.28)" />
      <text x="56" y="128" fill="#f7f4ec" font-size="34" font-family="Avenir Next, Segoe UI, sans-serif">${title}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
