import { useState } from "react";

const phases = ["idle", "loading", "success"] as const;

export function StateDemoPage() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phase = phases[phaseIndex];

  return (
    <section className="page">
      <div className="page-header">
        <p className="eyebrow">State Demo</p>
        <h2>Cycle through simple UI states on one dedicated page.</h2>
      </div>

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
