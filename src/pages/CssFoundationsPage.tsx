import { useState } from "react";
import { PageIntro } from "../components/PageIntro";
import { LessonHero } from "../components/LessonHero";
import { GuidanceGrid } from "../components/GuidanceGrid";
import { RuleCallout } from "../components/RuleCallout";
import { ComparisonCardHeader } from "../components/ComparisonCardHeader";

const swatches = [
  { label: "Canvas", token: "--theme-surface" },
  { label: "Text", token: "--theme-text" },
  { label: "Accent", token: "--theme-accent" },
  { label: "Accent Soft", token: "--theme-accent-soft" },
];

type ThemeName = "sunset" | "ocean" | "forest";

export function CssFoundationsPage() {
  return (
    <section className="page css-page">
      <PageIntro
        eyebrow="CSS Foundations"
        title="Choose a sizing system on purpose, then layer tokens and themes on top."
        subtitle="This page takes a more opinionated stance: px is a valid default for boxes, rem is an app-wide scaling choice, em is a narrow local tool, and variables/themes matter no matter which unit system you pick."
      />

      <LessonHero
        ariaLabel="CSS mental model"
        tone="css"
        title="Separate sizing philosophy from token and theme design."
        copy="First decide whether boxes should stay mostly fixed or scale with user font settings. Then express repeated design values as tokens, and let themes remap those semantic roles without rewriting component CSS."
        prompts={[
          {
            label: "Default sizing stance",
            value: "Use px for predictable box metrics unless you want root-size scaling",
          },
          {
            label: "Use `rem` for",
            value: "A deliberate layout system that scales with root font size",
          },
          {
            label: "Use `em` for",
            value: "Rare cases where the box should follow local text size",
          },
        ]}
      />

      <GuidanceGrid
        ariaLabel="CSS guidance"
        items={[
          {
            question: "Do we want boxes to scale with user font settings at all?",
            answer:
              "If the answer is no, fixed units are usually the clearer default. If the answer is yes, then rem should be treated as a system choice, not sprinkled in randomly.",
          },
          {
            question: "Will this value repeat across components?",
            answer:
              "If a color, radius, space, or shadow shows up more than once, it is usually a token candidate instead of a literal value.",
          },
          {
            question: "Are we willing to test multiple root font sizes?",
            answer:
              "If not, do not pretend you have a rem-driven layout system. Choose a mostly fixed sizing approach and test large-text cases more directly for overflow and wrapping.",
          },
        ]}
      />

      <SizingSystemDemo />
      <RemVsEmDemo />
      <UserSettingsDemo />
      <VariablesDemo />
      <ThemeDemo />
      <ConsumptionDemo />
      <CascadeDemo />
      <ResponsiveTokensDemo />

      <RuleCallout
        title="Use px by default for boxes. Use rem only if you mean it systemically."
        bullets={[
          <>
            <code>px</code> is a valid practical default for padding, gaps,
            radii, borders, icons, and structural dimensions.
          </>,
          <>
            <code>rem</code> is strongest when typography and layout rhythm
            intentionally scale together across the app.
          </>,
          <>
            <code>em</code> is useful for text-bound components, but easy to
            misuse for general layout.
          </>,
          "CSS variables are strongest when they represent semantic roles, not arbitrary one-off values.",
          "Theme consumption should happen through a small token surface instead of hardcoded hex values.",
          "Prefer changing tokens at a boundary over escalating selector specificity inside components.",
        ]}
      />
    </section>
  );
}

function SizingSystemDemo() {
  return (
    <section className="demo-section css-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 1</p>
          <h3>Pick a sizing philosophy before you pick units.</h3>
          <p className="demo-copy demo-section-note">
            The real decision is not `px` versus `rem` in isolation. It is
            whether your layout boxes should stay mostly fixed or scale with the
            root font size.
          </p>
        </div>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-success">
          <div>
            <p className="comparison-label comparison-label-success">Practical default</p>
            <h4>Mostly fixed box system</h4>
          </div>
          <p className="demo-copy">
            Use <code>px</code> for spacing, padding, radii, and structural
            dimensions when you want visual stability and you do not want boxes
            changing with user font preferences.
          </p>
          <ul className="guidance-list">
            <li>Good fit for app shells, grids, panels, and most container padding.</li>
            <li>Still test larger text for wrapping, clipping, and overflow.</li>
          </ul>
        </article>

        <article className="comparison-card comparison-card-caution">
          <div>
            <p className="comparison-label comparison-label-caution">System choice</p>
            <h4>Root-scaled layout system</h4>
          </div>
          <p className="demo-copy">
            Use <code>rem</code> broadly when you intentionally want spacing and
            typography to scale together with root font size changes.
          </p>
          <ul className="guidance-list">
            <li>Works best when used across the whole spacing rhythm, not selectively.</li>
            <li>Requires testing at multiple root font sizes so scaling stays coherent.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}

function RemVsEmDemo() {
  const [size, setSize] = useState<"compact" | "large">("compact");

  return (
    <section className="demo-section css-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 2</p>
          <h3><code>em</code> is powerful, but it often feels strange for box spacing.</h3>
          <p className="demo-copy demo-section-note">
            Toggle the parent text size. The `px` card keeps the same box
            metrics, while the `em` card grows because its padding is tied to
            local text size. That coupling is sometimes useful, but not a good
            general default.
          </p>
        </div>
        <span className="stat-chip">parent size: {size}</span>
      </div>

      <div className="control-row">
        <button
          className="secondary-button"
          onClick={() =>
            setSize((value) => (value === "compact" ? "large" : "compact"))
          }
        >
          Toggle parent text size
        </button>
      </div>

      <div
        className={`comparison-grid css-scale-stage css-scale-stage-${size}`}
      >
        <article className="comparison-card comparison-card-success css-card-px">
          <div>
            <p className="comparison-label comparison-label-success">Stable box</p>
            <h4>`px` spacing card</h4>
          </div>
          <p className="demo-copy">
            Padding and radius stay fixed, so the component footprint does not
            change just because its text context changed.
          </p>
          <div className="css-chip-row">
            <span className="css-mini-chip">padding: 16px</span>
            <span className="css-mini-chip">radius: 16px</span>
          </div>
        </article>

        <article className="comparison-card comparison-card-caution css-card-em">
          <div>
            <p className="comparison-label comparison-label-caution">Local coupling</p>
            <h4>`em` spacing card</h4>
          </div>
          <p className="demo-copy">
            Padding uses <code>em</code>, so the card expands when its own text
            context gets bigger. This can work for pills, buttons, or inline
            UI, but it is easy to dislike for general containers.
          </p>
          <div className="css-chip-row">
            <span className="css-mini-chip">padding: 1em</span>
            <span className="css-mini-chip">font-size: inherited</span>
          </div>
        </article>
      </div>
    </section>
  );
}

function UserSettingsDemo() {
  return (
    <section className="demo-section css-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 3</p>
          <h3>Know what users and browsers actually change.</h3>
          <p className="demo-copy demo-section-note">
            Browser zoom is not the same as changing the default font size. If
            your layout uses <code>rem</code>, root font-size changes can grow
            the boxes too.
          </p>
        </div>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-success">
          <div>
            <p className="comparison-label comparison-label-success">Zoom</p>
            <h4>Browser zoom scales everything</h4>
          </div>
          <p className="demo-copy">
            Zoom affects text, images, fixed pixel boxes, and relative units.
            It is a full-page magnification mechanism.
          </p>
        </article>

        <article className="comparison-card comparison-card-caution">
          <div>
            <p className="comparison-label comparison-label-caution">Root size</p>
            <h4>Default font size changes `rem` systems</h4>
          </div>
          <p className="demo-copy">
            If the browser default moves from 16px to 20px, then
            <code>1rem</code> grows too unless the app rigidly overrides the
            root size. That can be a feature or a downside depending on your
            design goal.
          </p>
        </article>
      </div>
    </section>
  );
}

function VariablesDemo() {
  const [accent, setAccent] = useState("#d8a04a");

  return (
    <section className="demo-section css-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 2</p>
          <h3>CSS variables let one change fan out across a component.</h3>
          <p className="demo-copy demo-section-note">
            The preview card consumes a local `--panel-accent` token for border,
            badge, and button state instead of repeating the same literal color
            in multiple declarations.
          </p>
        </div>
        <span className="stat-chip">accent: {accent}</span>
      </div>

      <div className="control-row">
        <label className="field">
          Accent token
          <input
            type="color"
            value={accent}
            onChange={(event) => setAccent(event.target.value)}
          />
        </label>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-caution">
          <ComparisonCardHeader
            label="Hardcoded"
            tone="caution"
            title="Repeated literal values"
          />
          <p className="demo-copy">
            Hardcoding the same accent into border, text, hover, and badge
            styles makes updates scattered and easier to miss.
          </p>
          <pre className="css-code-block">{`.panel {
  border-color: #d8a04a;
}
.badge {
  background: #d8a04a22;
  color: #d8a04a;
}`}</pre>
        </article>

        <article
          className="comparison-card comparison-card-success css-variable-card"
          style={{ ["--panel-accent" as string]: accent }}
        >
          <ComparisonCardHeader
            label="Tokenized"
            tone="success"
            title="One variable, many consumers"
            aside={<span className="css-token-badge">var(--panel-accent)</span>}
          />
          <p className="demo-copy">
            Update the token once and the whole component responds without
            repeating the same value through multiple rules.
          </p>
          <div className="css-variable-preview">
            <span className="css-variable-pill">Accent badge</span>
            <button className="css-variable-button">Token-driven action</button>
          </div>
        </article>
      </div>
    </section>
  );
}

function ThemeDemo() {
  const [theme, setTheme] = useState<ThemeName>("sunset");

  return (
    <section className="demo-section css-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 3</p>
          <h3>Themes work best when components consume semantic tokens.</h3>
          <p className="demo-copy demo-section-note">
            The theme switch only changes token values. The component markup and
            internal class names stay the same.
          </p>
        </div>
        <span className="stat-chip">theme: {theme}</span>
      </div>

      <div className="control-row">
        <button className="secondary-button" onClick={() => setTheme("sunset")}>
          Sunset
        </button>
        <button className="secondary-button" onClick={() => setTheme("ocean")}>
          Ocean
        </button>
        <button className="secondary-button" onClick={() => setTheme("forest")}>
          Forest
        </button>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-caution">
          <ComparisonCardHeader
            label="Fragile"
            tone="caution"
            title="Raw color consumption"
          />
          <p className="demo-copy">
            Components that directly ask for `#1b2a41` or `#d8a04a` are coupled
            to one palette and harder to restyle globally.
          </p>
        </article>

        <article className={`comparison-card comparison-card-success theme-card theme-${theme}`}>
          <ComparisonCardHeader
            label="Semantic tokens"
            tone="success"
            title="Theme consumer card"
            aside={<span className="css-token-badge">surface / text / accent</span>}
          />
          <p className="demo-copy">
            This card consumes role-based variables, so swapping the theme just
            remaps those roles.
          </p>

          <div className="theme-swatch-grid">
            {swatches.map((swatch) => (
              <article key={swatch.token} className="theme-swatch">
                <span
                  className="theme-swatch-color"
                  style={{ ["--swatch-token" as string]: `var(${swatch.token})` }}
                />
                <div>
                  <p className="comparison-label">{swatch.label}</p>
                  <p className="demo-copy">{swatch.token}</p>
                </div>
              </article>
            ))}
          </div>

          <button className="css-theme-button">Token-driven button</button>
        </article>
      </div>
    </section>
  );
}

function ConsumptionDemo() {
  return (
    <section className="demo-section css-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 4</p>
          <h3>Consume tokens through a small, boring component API.</h3>
          <p className="demo-copy demo-section-note">
            The cleanest consumption pattern is usually semantic class names plus
            a few tokens for surface, text, border, and accent roles.
          </p>
        </div>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-caution">
          <div>
            <p className="comparison-label comparison-label-caution">Too direct</p>
            <h4>Component hardcodes design values</h4>
          </div>
          <pre className="css-code-block">{`.cta-card {
  background: #11151c;
  color: #f7f4ec;
  border: 1px solid #d8a04a55;
}`}</pre>
          <p className="demo-copy">
            This works once, but every visual change becomes a hunt across
            component files.
          </p>
        </article>

        <article className="comparison-card comparison-card-success">
          <div>
            <p className="comparison-label comparison-label-success">More resilient</p>
            <h4>Component consumes semantic variables</h4>
          </div>
          <pre className="css-code-block">{`.cta-card {
  background: var(--card-surface);
  color: var(--card-text);
  border: 1px solid var(--card-border);
}`}</pre>
          <div className="css-consumption-stack">
            <article className="css-consumer-card css-consumer-primary">
              <p className="comparison-label">Primary consumer</p>
              <h4>Launch checklist</h4>
              <p className="demo-copy">
                Same markup, different token assignments.
              </p>
            </article>
            <article className="css-consumer-card css-consumer-secondary">
              <p className="comparison-label">Secondary consumer</p>
              <h4>Follow-up review</h4>
              <p className="demo-copy">
                Variants can override the same semantic token slots.
              </p>
            </article>
          </div>
        </article>
      </div>
    </section>
  );
}

function CascadeDemo() {
  const [surfaceMode, setSurfaceMode] = useState<"default" | "warning">(
    "default",
  );

  return (
    <section className="demo-section css-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 5</p>
          <h3>Use the cascade to override tokens, not to fight component CSS.</h3>
          <p className="demo-copy demo-section-note">
            A wrapper can redefine semantic variables for a subtree. That is
            usually safer than adding more classes, nesting, or specificity wars.
          </p>
        </div>
        <span className="stat-chip">surface mode: {surfaceMode}</span>
      </div>

      <div className="control-row">
        <button
          className="secondary-button"
          onClick={() => setSurfaceMode("default")}
        >
          Default surface
        </button>
        <button
          className="secondary-button"
          onClick={() => setSurfaceMode("warning")}
        >
          Warning surface
        </button>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-caution">
          <div>
            <p className="comparison-label comparison-label-caution">Hard to scale</p>
            <h4>Override with stronger selectors</h4>
          </div>
          <pre className="css-code-block">{`.dashboard .cta-card.urgent {
  background: #3a1d17;
  border-color: #e19378;
}`}</pre>
          <p className="demo-copy">
            This style works, but it couples the override to markup structure
            and tends to snowball as variants multiply.
          </p>
        </article>

        <article
          className={`comparison-card comparison-card-success css-cascade-zone css-cascade-zone-${surfaceMode}`}
        >
          <div>
            <p className="comparison-label comparison-label-success">Token boundary</p>
            <h4>Override semantic variables at the wrapper</h4>
          </div>
          <pre className="css-code-block">{`.warning-zone {
  --card-surface: rgba(225, 147, 120, 0.12);
  --card-border: rgba(225, 147, 120, 0.28);
}`}</pre>
          <article className="css-consumer-card">
            <p className="comparison-label">Shared component</p>
            <h4>Billing alert</h4>
            <p className="demo-copy">
              The component CSS stays unchanged while the wrapper remaps the
              token values for everything inside it.
            </p>
          </article>
        </article>
      </div>
    </section>
  );
}

function ResponsiveTokensDemo() {
  const [density, setDensity] = useState<"comfortable" | "compact">(
    "comfortable",
  );

  return (
    <section className="demo-section css-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 6</p>
          <h3>Responsive design gets simpler when spacing scales through tokens.</h3>
          <p className="demo-copy demo-section-note">
            Instead of rewriting every gap and padding rule, change a small set
            of spacing tokens at a layout boundary.
          </p>
        </div>
        <span className="stat-chip">density: {density}</span>
      </div>

      <div className="control-row">
        <button
          className="secondary-button"
          onClick={() => setDensity("comfortable")}
        >
          Comfortable
        </button>
        <button
          className="secondary-button"
          onClick={() => setDensity("compact")}
        >
          Compact
        </button>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-caution">
          <div>
            <p className="comparison-label comparison-label-caution">Verbose</p>
            <h4>Rewrite every rule at each breakpoint</h4>
          </div>
          <pre className="css-code-block">{`@media (max-width: 700px) {
  .panel { padding: 0.75rem; }
  .stack { gap: 0.5rem; }
  .toolbar { margin-bottom: 0.5rem; }
}`}</pre>
          <p className="demo-copy">
            This works, but every component has to know the responsive policy.
          </p>
        </article>

        <article
          className={`comparison-card comparison-card-success css-density-stage css-density-${density}`}
        >
          <div>
            <p className="comparison-label comparison-label-success">Token scale</p>
            <h4>Update spacing tokens once</h4>
          </div>
          <pre className="css-code-block">{`.layout-compact {
  --space-2: 0.5rem;
  --space-4: 0.875rem;
}`}</pre>
          <div className="css-responsive-panel">
            <div className="css-responsive-toolbar">
              <span className="css-mini-chip">Toolbar</span>
              <span className="css-mini-chip">Filters</span>
            </div>
            <article className="css-responsive-card">
              <h4>Token-scaled panel</h4>
              <p className="demo-copy">
                Padding, gaps, and toolbar spacing all respond together because
                they share the same spacing vocabulary.
              </p>
            </article>
          </div>
        </article>
      </div>
    </section>
  );
}
