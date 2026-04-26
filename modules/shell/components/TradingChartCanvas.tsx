import type { ReactNode } from "react";

type TradingChartCanvasProps = {
  children: ReactNode;
};

export function TradingChartCanvas({ children }: TradingChartCanvasProps) {
  return (
    <div
      className="tpm-living-chart-canvas"
      data-chart-dominant="true"
      data-raster-assets="none"
    >
      {children}
    </div>
  );
}
