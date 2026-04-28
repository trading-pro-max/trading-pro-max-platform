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
      data-raster-assets="none"
      data-swiss-precision-chart="true"
    >
      {children}
    </div>
  );
}
