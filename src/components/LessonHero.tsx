import type { ReactNode } from "react";

type LessonHeroPrompt = {
  label: string;
  value: ReactNode;
};

type LessonHeroProps = {
  ariaLabel: string;
  title: string;
  copy: ReactNode;
  prompts: LessonHeroPrompt[];
  tone: "effects" | "lazy" | "css" | "a11y" | "forms";
};

export function LessonHero({
  ariaLabel,
  title,
  copy,
  prompts,
  tone,
}: LessonHeroProps) {
  return (
    <section
      className={`lesson-hero lesson-hero-${tone}`}
      aria-label={ariaLabel}
    >
      <div className="lesson-hero-copy">
        <p className="demo-kicker">Mental model</p>
        <h3>{title}</h3>
        <p className="demo-copy">{copy}</p>
      </div>

      <div className="lesson-hero-grid">
        {prompts.map((prompt) => (
          <article key={prompt.label} className="lesson-hero-prompt">
            <p className="effects-prompt-label">{prompt.label}</p>
            <p className="effects-prompt-value">{prompt.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
