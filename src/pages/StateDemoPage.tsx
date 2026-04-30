import { useState } from "react";
import { PageIntro } from "../components/PageIntro";

const phases = ["idle", "loading", "success"] as const;

export function StateDemoPage() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phase = phases[phaseIndex];

  return (
    <section className="page">
      <PageIntro
        eyebrow="State Demo"
        title="Cycle through simple UI states on one dedicated page."
        subtitle="Keep this page for testing state transitions, loading flows, and small interaction sequences in isolation."
      />

      <div className="state-panel">
        <p className="state-label">Current state</p>
        <p className="state-value">{phase}</p>
        <button
          className="primary-button"
          onClick={() => setPhaseIndex((index) => (index + 1) % phases.length)}
        >
          Advance state
        </button>
      </div>
    </section>
  );
}
