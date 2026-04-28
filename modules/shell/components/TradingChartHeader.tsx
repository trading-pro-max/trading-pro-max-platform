type TradingChartHeaderProps = {
  assetChange: string;
  assetPrice: string;
  assetSymbol: string;
  feedStatus: string;
  focusModeLabel: string;
  marketStatus: string;
  paperAccess: string;
  selectedTimeframe: string;
};

export function TradingChartHeader({
  assetChange,
  assetPrice,
  assetSymbol,
  feedStatus,
  focusModeLabel,
  marketStatus,
  paperAccess,
  selectedTimeframe,
}: TradingChartHeaderProps) {
  return (
    <header
      className="tpm-living-chart-header"
      data-chart-header="true"
      data-swiss-precision-chart="true"
    >
      <div className="tpm-living-chart-header-main">
        <div className="tpm-living-chart-header-title">
          <span>Swiss precision chart</span>
          <strong>{assetSymbol}</strong>
        </div>
        <div className="tpm-living-chart-header-marketline">
          <strong>{assetPrice}</strong>
          <small className={assetChange.startsWith("-") ? "negative" : "positive"}>
            {assetChange}
          </small>
          <small>{marketStatus}</small>
          <small>{selectedTimeframe}</small>
        </div>
      </div>

      <div className="tpm-living-chart-header-truth" aria-label="Workspace truth">
        <span>{paperAccess}</span>
        <span>{feedStatus}</span>
        <span>{focusModeLabel}</span>
      </div>
    </header>
  );
}
