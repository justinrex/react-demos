import { FormEvent, useId, useRef, useState } from "react";
import { PageIntro } from "../components/PageIntro";
import { LessonHero } from "../components/LessonHero";
import { GuidanceGrid } from "../components/GuidanceGrid";
import { RuleCallout } from "../components/RuleCallout";
import { DemoSectionHeader } from "../components/DemoSectionHeader";

type ValidationMode = "change" | "blur" | "submit";

export function FormsPage() {
  return (
    <section className="page forms-page">
      <PageIntro
        eyebrow="Forms"
        title="Choose the form architecture that matches the user experience you actually need."
        subtitle="This page treats forms as data flow plus feedback: when controlled fields help, when uncontrolled fields are enough, when validation should run, and how submit state changes the design."
      />

      <LessonHero
        ariaLabel="Forms mental model"
        tone="forms"
        title="Do not default to controlled fields unless the UI needs to react continuously."
        copy="Some forms only need values at submit time. Others need live formatting, derived state, cross-field rules, or instant feedback. Start with the UX requirement, then choose the data flow."
        prompts={[
          {
            label: "Controlled fits",
            value: "live validation, derived UI, dependent fields, formatting",
          },
          {
            label: "Uncontrolled fits",
            value: "simple submit-driven forms with low ceremony",
          },
          {
            label: "Always design for",
            value: "validation timing, pending state, and error recovery",
          },
        ]}
      />

      <GuidanceGrid
        ariaLabel="Forms guidance"
        items={[
          {
            question: "Does the UI need the value before submit?",
            answer:
              "If not, uncontrolled fields can be simpler and perfectly valid. If the UI reacts on every edit, controlled state often earns its cost.",
          },
          {
            question: "When should the user see validation feedback?",
            answer:
              "On-change, on-blur, and on-submit validation each produce a different experience. The goal is not “earliest possible,” but “clearest without being noisy.”",
          },
          {
            question: "What happens while the form is submitting?",
            answer:
              "Pending state, field errors, retry flow, and success handling are part of the form architecture. They are not afterthought details.",
          },
        ]}
      />

      <ControlledVsUncontrolledDemo />
      <LiveSignupDemo />
      <ValidationTimingDemo />
      <SubmitStateDemo />

      <RuleCallout
        title="Use the least form machinery that still supports the intended UX."
        bullets={[
          "Use uncontrolled fields for simple submit-time collection.",
          "Use controlled fields when the UI reacts as the user types.",
          "Choose validation timing deliberately instead of validating everything immediately.",
          "Preserve input on error and make submit state visible.",
        ]}
      />
    </section>
  );
}

function ControlledVsUncontrolledDemo() {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState("none yet");
  const [draft, setDraft] = useState("starter");
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <section className="demo-section forms-demo-section">
      <DemoSectionHeader
        eyebrow="Example 1"
        title="Controlled vs uncontrolled depends on when React needs the value."
        note="The search form only reads the input on submit. The filter chip UI reacts immediately to the current value, so it benefits from a controlled field."
        aside={
          <span className="stat-chip">
            controlled renders: {renderCount.current}
          </span>
        }
      />

      <div className="comparison-grid">
        <article className="comparison-card comparison-card-success">
          <div>
            <p className="comparison-label comparison-label-success">Lower ceremony</p>
            <h4>Uncontrolled search form</h4>
          </div>
          <form
            className="forms-stack"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmittedQuery(searchInputRef.current?.value || "empty");
            }}
          >
            <label className="field">
              Search query
              <input ref={searchInputRef} placeholder="Conference schedule" />
            </label>
            <button className="secondary-button" type="submit">
              Read value on submit
            </button>
            <p className="demo-copy">Last submitted query: {submittedQuery}</p>
          </form>
        </article>

        <article className="comparison-card comparison-card-caution">
          <div>
            <p className="comparison-label comparison-label-caution">React is watching</p>
            <h4>Controlled draft filter</h4>
          </div>
          <div className="forms-stack">
            <label className="field">
              Filter label
              <input value={draft} onChange={(event) => setDraft(event.target.value)} />
            </label>
            <div className="forms-chip-row">
              <span className="css-mini-chip">Live preview</span>
              <span className="forms-live-chip">{draft || "empty draft"}</span>
            </div>
            <p className="demo-copy">
              This is the right trade when the UI needs the value continuously.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

function LiveSignupDemo() {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const hasEmailShape = email.includes("@");
  const passwordScore =
    password.length >= 12 ? "strong" : password.length >= 8 ? "solid" : "weak";
  const canSubmit = hasEmailShape && password.length >= 8;

  return (
    <section className="demo-section forms-demo-section">
      <DemoSectionHeader
        eyebrow="Example 2"
        title="Controlled state earns its keep when the form drives live feedback."
        note="Inline feedback, derived submit state, and password guidance all depend on the current draft values. This is where controlled inputs are usually worth it."
        aside={
          <span className="stat-chip">
            submit: {canSubmit ? "enabled" : "blocked"}
          </span>
        }
      />

      <form className="forms-live-card" onSubmit={(event) => event.preventDefault()}>
        <label className="field" htmlFor={emailId}>
          Work email
          <input
            id={emailId}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="field" htmlFor={passwordId}>
          Password
          <input
            id={passwordId}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <div className="comparison-grid">
          <article className="comparison-card">
            <div>
              <p className="comparison-label">Live email feedback</p>
              <h4>{hasEmailShape ? "Looks valid enough to continue" : "Missing an @"}</h4>
            </div>
            <p className="demo-copy">
              Useful when the form should steer users before submit.
            </p>
          </article>

          <article className="comparison-card">
            <div>
              <p className="comparison-label">Password strength</p>
              <h4>{passwordScore}</h4>
            </div>
            <p className="demo-copy">
              Current length: {password.length}. Controlled state makes this
              kind of derived feedback straightforward.
            </p>
          </article>
        </div>

        <button className="secondary-button" type="submit" disabled={!canSubmit}>
          Create account
        </button>
      </form>
    </section>
  );
}

function ValidationTimingDemo() {
  const [mode, setMode] = useState<ValidationMode>("blur");
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const hasError = !value.includes("@");

  const shouldShowError =
    mode === "change"
      ? value.length > 0 && hasError
      : mode === "blur"
        ? touched && hasError
        : submitted && hasError;

  return (
    <section className="demo-section forms-demo-section">
      <DemoSectionHeader
        eyebrow="Example 3"
        title="Validation timing changes the tone of the form."
        note="The same validation rule can feel helpful or hostile depending on whether it fires while typing, after blur, or only at submit time."
        aside={<span className="stat-chip">mode: {mode}</span>}
      />

      <div className="control-row">
        <button className="secondary-button" onClick={() => setMode("change")}>
          Validate on change
        </button>
        <button className="secondary-button" onClick={() => setMode("blur")}>
          Validate on blur
        </button>
        <button className="secondary-button" onClick={() => setMode("submit")}>
          Validate on submit
        </button>
      </div>

      <form
        className="forms-live-card"
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <label className="field">
          Notification email
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onBlur={() => setTouched(true)}
          />
        </label>

        {shouldShowError ? (
          <p className="a11y-error">Enter an email address that includes `@`.</p>
        ) : (
          <p className="demo-copy">
            {mode === "change"
              ? "Feedback appears as the user types."
              : mode === "blur"
                ? "Feedback waits until the field loses focus."
                : "Feedback waits until submit is attempted."}
          </p>
        )}

        <button className="secondary-button" type="submit">
          Submit example
        </button>
      </form>
    </section>
  );
}

function SubmitStateDemo() {
  const [email, setEmail] = useState("team@example.com");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("No submission yet.");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("pending");
    setMessage("Saving changes...");

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    if (email.includes("error")) {
      setStatus("error");
      setMessage("The server rejected that email. Input was preserved.");
      return;
    }

    setStatus("success");
    setMessage("Settings saved. The field stayed intact during the request.");
  }

  return (
    <section className="demo-section forms-demo-section">
      <DemoSectionHeader
        eyebrow="Example 4"
        title="Submission state is part of the form design, not a final detail."
        note="Pending state, retry flow, and preserving user input on error all change whether a form feels reliable."
        aside={<span className="stat-chip">status: {status}</span>}
      />

      <form className="forms-live-card" onSubmit={handleSubmit}>
        <label className="field">
          Billing email
          <input
            value={email}
            disabled={status === "pending"}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <p className="demo-copy">
          Try a value containing <code>error</code> to simulate a server failure.
        </p>
        <button className="secondary-button" type="submit" disabled={status === "pending"}>
          {status === "pending" ? "Saving..." : "Save settings"}
        </button>
        <p
          className={
            status === "error" ? "a11y-error" : "demo-copy"
          }
        >
          {message}
        </p>
      </form>
    </section>
  );
}
