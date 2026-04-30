import type { ReactNode } from "react";

type DemoSectionHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  note?: ReactNode;
  aside?: ReactNode;
};

export function DemoSectionHeader({
  eyebrow,
  title,
  note,
  aside,
}: DemoSectionHeaderProps) {
  return (
    <div className="demo-section-header">
      <div>
        <p className="demo-kicker">{eyebrow}</p>
        <h3>{title}</h3>
        {note ? <p className="demo-copy demo-section-note">{note}</p> : null}
      </div>
      {aside ? aside : null}
    </div>
  );
}
