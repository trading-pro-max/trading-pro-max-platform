import type { ReactNode } from "react";

type TradingChartSurfaceProps = {
  children: ReactNode;
};

export function TradingChartSurface({ children }: TradingChartSurfaceProps) {
  return (
    <section
      className="tpm-living-chart-surface"
      aria-label="Chart-first trading surface"
      data-chart-body-rebuilt="swiss-zero"
      data-chart-protection="chart_must_remain_king"
      data-chart-surface="living-market-core"
      data-earth-overlay="none"
      data-living-earth-chart-safe="true"
      data-living-earth-surface="trading_chart_atmosphere"
      data-swiss-precision-chart="true"
      data-visual-priority="primary"
    >
      {children}
    </section>
  );
}
