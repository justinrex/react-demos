type PageIntroProps = {
  eyebrow: string;
  title: string;
  subtitle: React.ReactNode;
};

export function PageIntro({ eyebrow, title, subtitle }: PageIntroProps) {
  return (
    <header className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="page-intro-copy">{subtitle}</p>
    </header>
  );
}
