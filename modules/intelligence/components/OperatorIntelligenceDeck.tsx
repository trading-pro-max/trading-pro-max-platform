"use client";

import type { TradingIntelligenceViewModel } from "../../shell/components/trading-intelligence-view-model";

function IntelligenceStatus({
  text,
  tone,
}: {
  text: string;
  tone: "approved" | "pending" | "restricted" | "blocked";
}) {
  return <span className={`tpmv2-status-tag ${tone}`}>{text}</span>;
}

function IntelligenceCard({
  panel,
}: {
  panel: TradingIntelligenceViewModel["marketPanel"];
}) {
  return (
    <article className="tpmv2-brain-card">
      <div className="tpmv2-brain-card-head">
        <span className="tpmv2-section-label">{panel.title}</span>
        <IntelligenceStatus text={panel.badge} tone={panel.badgeTone} />
      </div>

      <strong className="tpmv2-brain-card-headline">{panel.headline}</strong>
      <p className="tpmv2-brain-card-summary">{panel.summary}</p>

      <div className="tpmv2-brain-metrics">
        {panel.metrics.map((metric) => (
          <div key={`${metric.label}-${metric.value}`} className="tpmv2-brain-metric">
            <span>{metric.label}</span>
            <strong
              className={
                metric.tone ? `tpmv2-ticket-status-value ${metric.tone}` : undefined
              }
            >
              {metric.value}
            </strong>
          </div>
        ))}
      </div>

      {panel.note ? <div className="tpmv2-brain-note">{panel.note}</div> : null}

      {panel.chips.length > 0 ? (
        <div className="tpmv2-chip-list tpmv2-brain-chip-list">
          {panel.chips.map((chip) => (
            <span key={chip} className="tpmv2-badge tpmv2-chip">
              {chip}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default function OperatorIntelligenceDeck({
  intelligence,
}: {
  intelligence: TradingIntelligenceViewModel;
}) {
  return (
    <section className="tpmv2-card tpmv2-brain-deck" aria-label={intelligence.productLabel}>
      <div className="tpmv2-brain-deck-head">
        <div>
          <span className="tpmv2-section-label">{intelligence.productLabel}</span>
          <strong className="tpmv2-brain-deck-title">{intelligence.marketPanel.headline}</strong>
        </div>

        <div className="tpmv2-brain-status-row">
          <div className="tpmv2-brain-status">
            <span>{intelligence.stateLabel}</span>
            <IntelligenceStatus
              text={intelligence.stateValue}
              tone={intelligence.stateTone}
            />
          </div>

          <div className="tpmv2-brain-status">
            <span>{intelligence.confidenceLabel}</span>
            <IntelligenceStatus
              text={intelligence.confidenceValue}
              tone={intelligence.confidenceTone}
            />
          </div>
        </div>
      </div>

      <div className="tpmv2-brain-grid">
        <IntelligenceCard panel={intelligence.marketPanel} />
        <IntelligenceCard panel={intelligence.executionPanel} />
        <IntelligenceCard panel={intelligence.guidancePanel} />
        <IntelligenceCard panel={intelligence.truthPanel} />
      </div>
    </section>
  );
}
