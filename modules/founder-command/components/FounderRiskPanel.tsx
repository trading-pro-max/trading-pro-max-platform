import type { FounderCommandRoomFoundationSnapshot } from "@/lib/server/founder-command";
import type { ReactNode } from "react";
import { toneFromCommandState } from "../types";

type FounderRiskPanelProps = {
  snapshot: FounderCommandRoomFoundationSnapshot;
};

function CommandSubPanel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="tpm-founder-subpanel">
      <span>{eyebrow}</span>
      <h3>{title}</h3>
      {children}
    </article>
  );
}

export default function FounderRiskPanel({ snapshot }: FounderRiskPanelProps) {
  return (
    <section className="tpm-founder-risk-grid">
      <CommandSubPanel eyebrow="Guardian" title="Protection command">
        <div className="tpm-founder-mini-list">
          {snapshot.guardianLegal.guardian.map((alert) => (
            <div data-tone={toneFromCommandState(alert.actionState, alert.riskLevel)} key={alert.id}>
              <strong>{alert.category}</strong>
              <span>{alert.currentTruth}</span>
            </div>
          ))}
        </div>
      </CommandSubPanel>

      <CommandSubPanel eyebrow="Legal Counsel" title="Claims protection">
        <div className="tpm-founder-mini-list">
          {snapshot.guardianLegal.legal.map((review) => (
            <div data-tone={toneFromCommandState(review.lifecycle, review.riskLevel)} key={review.id}>
              <strong>{review.category}</strong>
              <span>{review.blockedClaimPatterns.slice(0, 4).join(", ")}</span>
            </div>
          ))}
        </div>
        <p>{snapshot.guardianLegal.certificationTruth.join(" ")}</p>
      </CommandSubPanel>

      <CommandSubPanel eyebrow="Treasury" title="Monetization truth">
        <div className="tpm-founder-mini-list">
          {snapshot.treasury.controls.map((control) => (
            <div data-tone={toneFromCommandState(control.actionState, control.riskLevel)} key={control.id}>
              <strong>{control.label}</strong>
              <span>{control.currentTruth}</span>
            </div>
          ))}
        </div>
        <p>
          Current performance fee: {snapshot.treasury.currentPerformanceFee}.
          Future research range: {snapshot.treasury.futurePerformanceFeeResearchRange};
          legal, regulatory, consent, and Founder review required.
        </p>
      </CommandSubPanel>

      <CommandSubPanel eyebrow="Media + AI Video" title="Publishing blocked">
        <div className="tpm-founder-mini-list">
          {snapshot.mediaVideo.media.map((mediaItem) => (
            <div data-tone={toneFromCommandState(mediaItem.lifecycle, mediaItem.riskLevel)} key={mediaItem.id}>
              <strong>{mediaItem.contentType}</strong>
              <span>{mediaItem.currentTruth}</span>
            </div>
          ))}
        </div>
        <p>
          Social connected: {String(snapshot.mediaVideo.socialAccountsConnected)}.
          Publishing active: {String(snapshot.mediaVideo.externalPublishingActive)}.
          Reviews: {snapshot.mediaVideo.requiredReviews.join(" + ")}.
        </p>
      </CommandSubPanel>
    </section>
  );
}
