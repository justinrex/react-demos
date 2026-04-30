import { useId, useState } from "react";
import { PageIntro } from "../components/PageIntro";

export function AccessibilitySemanticsPage() {
  return (
    <section className="page a11y-page">
      <PageIntro
        eyebrow="Accessibility + Semantics"
        title="Choose semantic HTML first, then add accessibility details where they are actually needed."
        subtitle="This page focuses on a practical rule: the right native element usually gives you keyboard behavior, roles, naming, and structure for free. ARIA is most useful after that baseline is already correct."
      />

      <section className="a11y-hero" aria-label="Accessibility mental model">
        <div className="a11y-hero-copy">
          <p className="demo-kicker">Mental model</p>
          <h3>Start with the element that already means what you want.</h3>
          <p className="demo-copy">
            Buttons should usually be buttons. Navigation should usually live in
            <code> nav </code>. Form controls need labels. Headings should
            outline the page. Most accessibility work gets easier when the HTML
            is doing the first half of the job.
          </p>
        </div>

        <div className="a11y-hero-grid">
          <article className="a11y-hero-prompt">
            <p className="effects-prompt-label">Use native HTML for</p>
            <p className="effects-prompt-value">
              roles, keyboard behavior, names, and structure
            </p>
          </article>
          <article className="a11y-hero-prompt">
            <p className="effects-prompt-label">Use ARIA for</p>
            <p className="effects-prompt-value">
              the missing semantics native HTML cannot express alone
            </p>
          </article>
          <article className="a11y-hero-prompt">
            <p className="effects-prompt-label">Avoid</p>
            <p className="effects-prompt-value">
              rebuilding buttons, links, headings, and labels from generic divs
            </p>
          </article>
        </div>
      </section>

      <section className="guide-grid" aria-label="Accessibility guidance">
        <article className="guide-card">
          <p className="demo-kicker">Question 1</p>
          <h3>Does this interaction already have a native element?</h3>
          <p className="demo-copy">
            If it does, use that first. A native button or link usually beats a
            clickable <code>div</code> plus patches for role, tab index, and key
            handling.
          </p>
        </article>

        <article className="guide-card">
          <p className="demo-kicker">Question 2</p>
          <h3>Will a screen reader understand the structure without visual cues?</h3>
          <p className="demo-copy">
            Landmarks, headings, lists, tables, labels, and fieldsets help
            non-visual users build the same mental map sighted users get from
            layout and typography.
          </p>
        </article>

        <article className="guide-card">
          <p className="demo-kicker">Question 3</p>
          <h3>Are we adding ARIA because native HTML was ignored?</h3>
          <p className="demo-copy">
            ARIA should usually clarify or supplement. If it is replacing a
            simpler native pattern, that is often a smell rather than a win.
          </p>
        </article>
      </section>

      <LandmarksDemo />
      <ControlsDemo />
      <LinkLookingButtonDemo />
      <FormsDemo />
      <ContentStructureDemo />

      <section className="callout-card">
        <p className="demo-kicker">Rule of thumb</p>
        <h3>No ARIA beats bad ARIA. Good HTML beats both.</h3>
        <ul className="guidance-list">
          <li>Use the correct native element before adding custom roles or key handling.</li>
          <li>If it performs an in-page action, use a button even when the design wants link styling.</li>
          <li>Give form controls persistent labels and connect errors to the field they describe.</li>
          <li>Use the most specific text element that matches the content: paragraph, heading, list item, label, caption, and so on.</li>
          <li>Reach for ARIA when native HTML cannot express the state, relationship, or live update you need.</li>
        </ul>
      </section>
    </section>
  );
}

function LandmarksDemo() {
  return (
    <section className="demo-section a11y-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 1</p>
          <h3>Landmarks and headings give a page navigable structure.</h3>
          <p className="demo-copy demo-section-note">
            Visual grouping is not enough. Screen reader users benefit when the
            document has clear landmark regions and a heading outline.
          </p>
        </div>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-caution">
          <div>
            <p className="comparison-label comparison-label-caution">Weak structure</p>
            <h4>Generic containers only</h4>
          </div>
          <pre className="css-code-block">{`<div class="header">...</div>
<div class="menu">...</div>
<div class="content">...</div>`}</pre>
          <p className="demo-copy">
            This may look fine visually, but it gives assistive tech little
            information about page regions or content hierarchy.
          </p>
        </article>

        <article className="comparison-card comparison-card-success">
          <div>
            <p className="comparison-label comparison-label-success">Semantic structure</p>
            <h4>Landmarks plus headings</h4>
          </div>
          <div className="a11y-structure-preview">
            <header className="a11y-region">
              <p className="comparison-label">header</p>
              <h4>Product launch report</h4>
            </header>
            <nav className="a11y-region" aria-label="Section links">
              <p className="comparison-label">nav</p>
              <p className="demo-copy">Overview · Risks · Timeline</p>
            </nav>
            <main className="a11y-region">
              <p className="comparison-label">main</p>
              <section>
                <h4>Overview</h4>
                <p className="demo-copy">
                  Landmarks give quick-jump regions. Headings give interior structure.
                </p>
              </section>
            </main>
          </div>
        </article>
      </div>
    </section>
  );
}

function ControlsDemo() {
  const [count, setCount] = useState(0);

  return (
    <section className="demo-section a11y-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 2</p>
          <h3>Interactive controls should usually be buttons or links, not patched divs.</h3>
          <p className="demo-copy demo-section-note">
            Native elements come with focus behavior, keyboard support, naming,
            and assistive semantics that generic containers do not.
          </p>
        </div>
        <span className="stat-chip">count: {count}</span>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-caution">
          <div>
            <p className="comparison-label comparison-label-caution">Patchy</p>
            <h4>Clickable div</h4>
          </div>
          <pre className="css-code-block">{`<div
  role="button"
  tabIndex={0}
  onClick={increment}
  onKeyDown={handleKeys}
/>`}</pre>
          <p className="demo-copy">
            This rebuilds behavior the browser already knows how to provide.
          </p>
        </article>

        <article className="comparison-card comparison-card-success">
          <div>
            <p className="comparison-label comparison-label-success">Native</p>
            <h4>Real button</h4>
          </div>
          <button
            className="secondary-button"
            onClick={() => setCount((value) => value + 1)}
          >
            Increment counter
          </button>
          <p className="demo-copy">
            Native buttons support keyboard activation, focus, disabled state,
            and expected semantics with far less code.
          </p>
        </article>
      </div>
    </section>
  );
}

function LinkLookingButtonDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="demo-section a11y-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 3</p>
          <h3>Semantics follow behavior, not visual styling.</h3>
          <p className="demo-copy demo-section-note">
            If the control opens a panel, toggles UI, or triggers an in-page
            action, it should usually be a <code>button</code> even if design
            wants it to look like a link.
          </p>
        </div>
        <span className="stat-chip">details: {isOpen ? "open" : "closed"}</span>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-caution">
          <div>
            <p className="comparison-label comparison-label-caution">Misleading semantics</p>
            <h4>Link-styled action implemented as a link</h4>
          </div>
          <pre className="css-code-block">{`<a href="#" onClick={openDetails}>
  View invoice breakdown
</a>`}</pre>
          <p className="demo-copy">
            It looks right, but it announces and behaves like navigation even
            though it is really mutating the current UI.
          </p>
        </article>

        <article className="comparison-card comparison-card-success">
          <div>
            <p className="comparison-label comparison-label-success">Behavior-first</p>
            <h4>Button styled like a link</h4>
          </div>
          <button
            type="button"
            className="text-link-button"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            View invoice breakdown
          </button>
          {isOpen ? (
            <div className="a11y-region">
              <p className="comparison-label">Details panel</p>
              <p className="demo-copy">
                The control still looks lightweight, but it now has button
                semantics, keyboard behavior, and an explicit expanded state.
              </p>
            </div>
          ) : (
            <p className="demo-copy">
              Styling can borrow link aesthetics without borrowing link semantics.
            </p>
          )}
        </article>
      </div>
    </section>
  );
}

function FormsDemo() {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("starter");
  const [showErrors, setShowErrors] = useState(false);
  const hasEmailError = showErrors && !email.includes("@");
  const emailErrorId = `${emailId}-error`;

  return (
    <section className="demo-section a11y-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 4</p>
          <h3>Accessible forms need real labels, grouping, and connected errors.</h3>
          <p className="demo-copy demo-section-note">
            Placeholder-only forms disappear as soon as users type. Labels,
            fieldsets, legends, and described-by connections keep the form
            understandable through assistive tech and memory.
          </p>
        </div>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-caution">
          <div>
            <p className="comparison-label comparison-label-caution">Easy to lose context</p>
            <h4>Placeholder-only input</h4>
          </div>
          <pre className="css-code-block">{`<input placeholder="Work email" />
<div>Choose plan</div>
<input type="radio" /> Starter`}</pre>
          <p className="demo-copy">
            This removes persistent labeling and weakens the relationship
            between the prompt and the grouped controls.
          </p>
        </article>

        <article className="comparison-card comparison-card-success">
          <div>
            <p className="comparison-label comparison-label-success">Connected form</p>
            <h4>Labels, fieldset, and error association</h4>
          </div>
          <form
            className="a11y-form"
            onSubmit={(event) => {
              event.preventDefault();
              setShowErrors(true);
            }}
          >
            <label className="field" htmlFor={emailId}>
              Work email
              <input
                id={emailId}
                value={email}
                aria-invalid={hasEmailError}
                aria-describedby={hasEmailError ? emailErrorId : undefined}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            {hasEmailError ? (
              <p id={emailErrorId} className="a11y-error">
                Enter an email address that includes `@`.
              </p>
            ) : null}

            <fieldset className="a11y-fieldset">
              <legend>Select plan</legend>
              <label className="toggle">
                <input
                  type="radio"
                  name="plan"
                  checked={plan === "starter"}
                  onChange={() => setPlan("starter")}
                />
                Starter
              </label>
              <label className="toggle">
                <input
                  type="radio"
                  name="plan"
                  checked={plan === "team"}
                  onChange={() => setPlan("team")}
                />
                Team
              </label>
            </fieldset>

            <button className="secondary-button" type="submit">
              Validate form
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}

function ContentStructureDemo() {
  return (
    <section className="demo-section a11y-demo-section">
      <div className="demo-section-header">
        <div>
          <p className="demo-kicker">Example 5</p>
          <h3>Use lists, articles, and tables when the content actually is one.</h3>
          <p className="demo-copy demo-section-note">
            CSS can make anything look like cards or rows, but assistive tech
            still benefits when the underlying HTML reflects the data model.
            The same rule applies to text: use paragraphs for paragraphs,
            headings for headings, and labels or captions when those are the
            real roles.
          </p>
        </div>
      </div>

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-caution">
          <div>
            <p className="comparison-label comparison-label-caution">Looks right, says little</p>
            <h4>Card grid made from generic divs</h4>
          </div>
          <pre className="css-code-block">{`<div class="card">
  <div class="title">Launch review</div>
  <div class="meta">Tomorrow</div>
</div>`}</pre>
          <p className="demo-copy">
            Generic wrappers flatten meaning. The relationship between multiple
            repeated items is less explicit.
          </p>
        </article>

        <article className="comparison-card comparison-card-success">
          <div>
            <p className="comparison-label comparison-label-success">Content-aware HTML</p>
            <h4>List of articles</h4>
          </div>
          <ul className="a11y-article-list">
            <li>
              <article className="a11y-article-card">
                <h4>Launch review</h4>
                <p className="demo-copy">Tomorrow at 10:00 AM</p>
              </article>
            </li>
            <li>
              <article className="a11y-article-card">
                <h4>Accessibility audit</h4>
                <p className="demo-copy">Friday at 1:30 PM</p>
              </article>
            </li>
          </ul>
          <p className="demo-copy">
            If the data is tabular, use a table. If it is a sequence of peer
            items, use a list. If each item stands alone, an article can help.
          </p>
        </article>
      </div>
    </section>
  );
}
