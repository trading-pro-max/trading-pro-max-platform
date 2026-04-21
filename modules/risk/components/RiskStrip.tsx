import type { RiskStripProps } from "../../shell/types/view-props";

export function RiskStrip({
  openTradesLabel,
  openTradesValue,
  sessionResultLabel,
  sessionResultValue,
  sessionResultPositive,
  losingTradesLabel,
  losingTradesValue,
  sessionStatusLabel,
  sessionStatusValue,
  sessionLocked,
}: RiskStripProps) {
  return (
    <section className="tpm-risk-strip">
      <div className="tpm-risk-card">
        <span>{openTradesLabel}</span>
        <strong>{openTradesValue}</strong>
      </div>

      <div className="tpm-risk-card">
        <span>{sessionResultLabel}</span>
        <strong style={{ color: sessionResultPositive ? "#2dd4bf" : "#fda4af" }}>
          {sessionResultValue}
        </strong>
      </div>

      <div className="tpm-risk-card">
        <span>{losingTradesLabel}</span>
        <strong>{losingTradesValue}</strong>
      </div>

      <div className="tpm-risk-card">
        <span>{sessionStatusLabel}</span>
        <strong style={{ color: sessionLocked ? "#fda4af" : "#2dd4bf" }}>
          {sessionStatusValue}
        </strong>
      </div>
    </section>
  );
}