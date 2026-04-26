import type { ReactNode } from "react";

type LivingMarketCoreProps = {
  assistantDock: ReactNode;
  chart: ReactNode;
  chartFooter: ReactNode;
  chartHeader: ReactNode;
  executionRail?: ReactNode;
  journalCoachDock: ReactNode;
  marketStatusStrip?: ReactNode;
};

export function LivingMarketCore({
  assistantDock,
  chart,
  chartFooter,
  chartHeader,
  executionRail,
  journalCoachDock,
  marketStatusStrip,
}: LivingMarketCoreProps) {
  return (
    <section
      className={[
        "tpm-living-market-core",
        executionRail ? "" : "tpm-living-market-core-execution-hidden",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Living Market Core"
      data-chart-first="true"
      data-living-market-core="true"
    >
      {marketStatusStrip ? (
        <div className="tpm-living-market-status-strip">{marketStatusStrip}</div>
      ) : null}

      <section className="tpm-living-market-core-grid">
        <section className="tpm-living-market-chart-column">
          {chartHeader}
          {chart}
          {chartFooter}
        </section>

        {executionRail ? (
          <aside className="tpm-living-market-execution-column">
            {executionRail}
          </aside>
        ) : null}
      </section>

      <section
        className="tpm-living-market-helper-docks"
        aria-label="Workspace helper docks"
      >
        {assistantDock}
        {journalCoachDock}
      </section>
    </section>
  );
}
