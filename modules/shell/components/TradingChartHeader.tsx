type TradingChartHeaderProps = {
  assetChange: string;
  assetPrice: string;
  assetSymbol: string;
  feedStatus: string;
  focusModeLabel: string;
  marketStatus: string;
  paperAccess: string;
};

export function TradingChartHeader({
  assetChange,
  assetPrice,
  assetSymbol,
  feedStatus,
  focusModeLabel,
  marketStatus,
  paperAccess,
}: TradingChartHeaderProps) {
  return (
    <header className="tpm-living-chart-header" data-chart-header="true">
      <div className="tpm-living-chart-header-main">
        <span>Trading Workspace</span>
        <strong>{assetSymbol}</strong>
        <small>
          {assetPrice} / {assetChange} / {marketStatus}
        </small>
      </div>

      <div className="tpm-living-chart-header-truth" aria-label="Workspace truth">
        <span>{paperAccess}</span>
        <span>{feedStatus}</span>
        <span>{focusModeLabel}</span>
      </div>
    </header>
  );
}
