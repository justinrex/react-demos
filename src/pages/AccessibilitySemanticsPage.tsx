import { useId, useState } from "react";
import { PageIntro } from "../components/PageIntro";
import { LessonHero } from "../components/LessonHero";
import { GuidanceGrid } from "../components/GuidanceGrid";
import { RuleCallout } from "../components/RuleCallout";
import { DemoSectionHeader } from "../components/DemoSectionHeader";

export function AccessibilitySemanticsPage() {
  return (
    <section className="page a11y-page">
      <PageIntro
        eyebrow="Accessibility + Semantics"
        title="Choose semantic HTML first, then add accessibility details where they are actually needed."
        subtitle="This page focuses on a practical rule: the right native element usually gives you keyboard behavior, roles, naming, and structure for free. ARIA is most useful after that baseline is already correct."
      />

      <LessonHero
        ariaLabel="Accessibility mental model"
        tone="a11y"
        title="Start with the element that already means what you want."
        copy={
          <>
            Buttons should usually be buttons. Navigation should usually live in
            <code> nav </code>. Form controls need labels. Headings should
            outline the page. Most accessibility work gets easier when the HTML
            is doing the first half of the job.
          </>
        }
        prompts={[
          {
            label: "Use native HTML for",
            value: "roles, keyboard behavior, names, and structure",
          },
          {
            label: "Use ARIA for",
            value: "the missing semantics native HTML cannot express alone",
          },
          {
            label: "Avoid",
            value: "rebuilding buttons, links, headings, and labels from generic divs",
          },
        ]}
      />

      <GuidanceGrid
        ariaLabel="Accessibility guidance"
        items={[
          {
            question: "Does this interaction already have a native element?",
            answer:
              "If it does, use that first. A native button or link usually beats a clickable div plus patches for role, tab index, and key handling.",
          },
          {
            question: "Will a screen reader understand the structure without visual cues?",
            answer:
              "Landmarks, headings, lists, tables, labels, and fieldsets help non-visual users build the same mental map sighted users get from layout and typography.",
          },
          {
            question: "Are we adding ARIA because native HTML was ignored?",
            answer:
              "ARIA should usually clarify or supplement. If it is replacing a simpler native pattern, that is often a smell rather than a win.",
          },
        ]}
      />

      <LandmarksDemo />
      <ControlsDemo />
      <LinkLookingButtonDemo />
      <FormsDemo />
      <ContentStructureDemo />

      <RuleCallout
        title="No ARIA beats bad ARIA. Good HTML beats both."
        bullets={[
          "Use the correct native element before adding custom roles or key handling.",
          "If it performs an in-page action, use a button even when the design wants link styling.",
          "Give form controls persistent labels and connect errors to the field they describe.",
          "Use the most specific text element that matches the content: paragraph, heading, list item, label, caption, and so on.",
          "Reach for ARIA when native HTML cannot express the state, relationship, or live update you need.",
        ]}
      />
    </section>
  );
}

function LandmarksDemo() {
  return (
    <section className="demo-section a11y-demo-section">
      <DemoSectionHeader
        eyebrow="Example 1"
        title="Landmarks and headings give a page navigable structure."
        note="Visual grouping is not enough. Screen reader users benefit when the document has clear landmark regions and a heading outline."
      />

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
      <DemoSectionHeader
        eyebrow="Example 2"
        title="Interactive controls should usually be buttons or links, not patched divs."
        note="Native elements come with focus behavior, keyboard support, naming, and assistive semantics that generic containers do not."
        aside={<span className="stat-chip">count: {count}</span>}
      />

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
      <DemoSectionHeader
        eyebrow="Example 3"
        title="Semantics follow behavior, not visual styling."
        note={
          <>
            If the control opens a panel, toggles UI, or triggers an in-page
            action, it should usually be a <code>button</code> even if design
            wants it to look like a link.
          </>
        }
        aside={
          <span className="stat-chip">details: {isOpen ? "open" : "closed"}</span>
        }
      />

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
      <DemoSectionHeader
        eyebrow="Example 4"
        title="Accessible forms need real labels, grouping, and connected errors."
        note="Placeholder-only forms disappear as soon as users type. Labels, fieldsets, legends, and described-by connections keep the form understandable through assistive tech and memory."
      />

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
      <DemoSectionHeader
        eyebrow="Example 5"
        title="Use lists, articles, and tables when the content actually is one."
        note="CSS can make anything look like cards or rows, but assistive tech still benefits when the underlying HTML reflects the data model. The same rule applies to text: use paragraphs for paragraphs, headings for headings, and labels or captions when those are the real roles."
      />

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
