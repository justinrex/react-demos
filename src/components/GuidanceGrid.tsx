import type { ReactNode } from "react";

type GuidanceItem = {
  question: string;
  answer: ReactNode;
};

type GuidanceGridProps = {
  ariaLabel: string;
  items: GuidanceItem[];
};

export function GuidanceGrid({ ariaLabel, items }: GuidanceGridProps) {
  return (
    <section className="guide-grid" aria-label={ariaLabel}>
      {items.map((item, index) => (
        <article key={item.question} className="guide-card">
          <p className="demo-kicker">Question {index + 1}</p>
          <h3>{item.question}</h3>
          <p className="demo-copy">{item.answer}</p>
        </article>
      ))}
    </section>
  );
}
