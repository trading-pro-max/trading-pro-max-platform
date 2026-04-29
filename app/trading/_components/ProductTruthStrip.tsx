import type { ProjectUniverseTruthSnapshot } from "@/lib/server/project-universe-truth";
import styles from "../trading-premium-realism.module.css";

export default function ProductTruthStrip({
  truth,
}: {
  truth: ProjectUniverseTruthSnapshot;
}) {
  const labels = [
    "Paper-safe active",
    "Live inactive",
    "Broker/feed inactive",
    "Billing inactive",
    "Real money blocked",
    `Private: ${truth.productTruth.privateMode}`,
    `Read-only: ${truth.productTruth.readOnly}`,
    `Demo-safe: ${truth.productTruth.demoSafe}`,
    "Pro Max: working name only",
    "Real money: disabled",
    "Broker execution: disabled/not connected",
    "Public launch: not started",
    "Billing: not active",
    "Brand Gate: frozen/deferred",
    "Brand Gate review: ready with notes",
    "Local Day One: not started",
    "Private origin public exposure: no",
    "Swiss legal review: pending",
    "Global legal review: pending",
    "Swiss-inspired visual identity only",
    "Device-time simulation only",
    "Weather not connected",
    "Assets: local/procedural/license-safe",
  ];

  return (
    <div
      className={`${styles.truthStrip} tpm-workspace-truth-row`}
      data-product-truth-strip="true"
      aria-label="Premium Product Truth Strip"
    >
      {labels.map((label) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  );
}
