type TradingChartFooterProps = {
  fallbackTruth: string;
  shortcutHint: string;
};

export function TradingChartFooter({
  fallbackTruth,
  shortcutHint,
}: TradingChartFooterProps) {
  return (
    <footer className="tpm-living-chart-footer" data-product-truth-strip="compact">
      <span>Paper-safe active</span>
      <span>{fallbackTruth}</span>
      <span>Interpretive only</span>
      <span>Live inactive</span>
      <span>Broker/feed inactive</span>
      <span>Real money blocked</span>
      <small>{shortcutHint}</small>
    </footer>
  );
}
