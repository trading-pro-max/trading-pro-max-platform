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
      data-chart-surface="living-market-core"
      data-swiss-precision-chart="true"
      data-visual-priority="primary"
    >
      {children}
    </section>
  );
}
