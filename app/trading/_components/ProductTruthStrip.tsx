import { AlKawnProductTruthStrip } from "@/app/_components/al-kawn-visual/AlKawnProductTruthStrip";
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
    "Universe: Ahmad devices only",
    `Private: ${truth.productTruth.privateMode}`,
    `Read-only: ${truth.productTruth.readOnly}`,
    `Demo-safe: ${truth.productTruth.demoSafe}`,
    "Pro Max: working name only",
    "Pro Max public/global approval: false",
    "Real money: disabled",
    "Broker execution: disabled/not connected",
    "Trading: demo-safe/read-only",
    "Public launch: not started",
    "Public launch: blocked/not started",
    "Billing: not active",
    "Brand Gate: frozen/deferred",
    "Brand Gate review: ready with notes",
    "Local Day One: not started",
    "Private origin public exposure: no",
    "Swiss legal review: pending",
    "Global legal review: pending",
    "Swiss-inspired visual identity only",
    "Device-time simulation only",
    "Device-date simulation only",
    "Weather not connected",
    "Weather is not connected",
    "Location: not requested",
    "Assets: local/procedural/license-safe",
    "Assets: local/legal-safe/procedural/manifest-tracked",
    "Soundscape: user controlled/off by default",
    "Private until legally ready",
  ];

  return (
    <div
      className={`${styles.truthStrip} tpm-workspace-truth-row`}
      data-product-truth-strip="true"
      aria-label="Premium Product Truth Strip"
    >
      <AlKawnProductTruthStrip compact includePrivateAlKawn={false} includeAlkon={false} />
      {labels.map((label) => (
        <span key={label}>{label}</span>
      ))}
    </div>
  );
}
