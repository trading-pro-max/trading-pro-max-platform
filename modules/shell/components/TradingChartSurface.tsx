import type { ReactNode } from "react";

type TradingChartSurfaceProps = {
  children: ReactNode;
};

export function TradingChartSurface({ children }: TradingChartSurfaceProps) {
  return (
    <section
      className="tpm-living-chart-surface"
      aria-label="Chart-first trading surface"
      data-chart-surface="living-market-core"
    >
      {children}
    </section>
  );
}
