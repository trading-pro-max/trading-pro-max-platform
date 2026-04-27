import type { ReactNode } from "react";

type ExecutionRailProps = {
  children: ReactNode;
};

export function ExecutionRail({ children }: ExecutionRailProps) {
  return (
    <section
      className="tpm-living-execution-rail"
      aria-label="Paper execution rail"
      data-execution-rail="paper-only"
      data-visual-priority="secondary"
    >
      <div className="tpm-living-execution-rail-head">
        <span>Execution Rail</span>
        <strong>Paper-only route</strong>
      </div>
      {children}
    </section>
  );
}
