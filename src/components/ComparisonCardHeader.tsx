import type { ReactNode } from "react";

type ComparisonCardHeaderProps = {
  label?: ReactNode;
  tone?: "caution" | "success" | "neutral";
  title: ReactNode;
  aside?: ReactNode;
};

export function ComparisonCardHeader({
  label,
  tone = "neutral",
  title,
  aside,
}: ComparisonCardHeaderProps) {
  const labelClassName =
    tone === "caution"
      ? "comparison-label comparison-label-caution"
      : tone === "success"
        ? "comparison-label comparison-label-success"
        : "comparison-label";

  return (
    <div className="demo-section-header">
      <div>
        {label ? <p className={labelClassName}>{label}</p> : null}
        <h4>{title}</h4>
      </div>
      {aside ? aside : null}
    </div>
  );
}
