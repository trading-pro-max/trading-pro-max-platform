import type { ReactNode } from "react";

type TradingChartCanvasProps = {
  children: ReactNode;
};

export function TradingChartCanvas({ children }: TradingChartCanvasProps) {
  return (
    <div
      className="tpm-living-chart-canvas"
      data-chart-body-rebuilt="swiss-zero"
      data-chart-dominant="true"
      data-chart-protection="chart_must_remain_king"
      data-earth-overlay="none"
      data-living-earth-chart-safe="true"
      data-living-earth-surface="trading_chart_atmosphere"
      data-raster-assets="none"
      data-swiss-precision-chart="true"
    >
      {children}
    </div>
  );
}
