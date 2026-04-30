import type { ReactNode } from "react";

type RuleCalloutProps = {
  title: string;
  bullets: ReactNode[];
};

export function RuleCallout({ title, bullets }: RuleCalloutProps) {
  return (
    <section className="callout-card">
      <p className="demo-kicker">Rule of thumb</p>
      <h3>{title}</h3>
      <ul className="guidance-list">
        {bullets.map((bullet, index) => (
          <li key={index}>{bullet}</li>
        ))}
      </ul>
    </section>
  );
}
