import "server-only";

import { createProductMemoryDraft } from "./store";
import type { ProductGapMemory, ProductMemoryItem } from "./types";

export const knownProductGaps: ProductGapMemory[] = [
  {
    id: "gap-boxed-small-ui",
    category: "visual",
    gap: "Avoid boxed/small UI feeling on public entry and workstation.",
    severity: "medium",
    founderFeedback: "Visible product should feel simple, premium, and full-screen.",
    affectedSurface: "Public entry and Trading Workspace",
    suggestedFix: "Keep chart-first layout, reduce nested cards, and use viewport space intentionally.",
    ownerMinistry: "Product + Quality",
    status: "needs_polish",
    nextAction: "Include in every visual acceptance pass.",
  },
  {
    id: "gap-chart-dominance",
    category: "chart",
    gap: "Chart must remain dominant and comfortable.",
    severity: "high",
    founderFeedback: "Do not damage the repaired chart or hide it behind overlays.",
    affectedSurface: "Trading Workspace",
    suggestedFix: "Keep Assistant and Journal compact and prevent execution overlap.",
    ownerMinistry: "Markets/Trading + Quality",
    status: "needs_polish",
    nextAction: "Capture chart-focus screenshot after visual changes.",
  },
  {
    id: "gap-internal-language-leak",
    category: "plan_clarity",
    gap: "Internal Founder/Planet/governance language must not leak to normal users.",
    severity: "high",
    founderFeedback: "Public language is Free, Pro, VIP, Institutional, TPM Assistant, and Trading Workspace.",
    affectedSurface: "Public UI, Settings, Diagnostics, Assistant",
    suggestedFix: "Run public terminology checks and keep restricted language internal.",
    ownerMinistry: "Product + Legal + Quality",
    status: "blocked_by_design",
    nextAction: "Keep regression assertions active.",
  },
  {
    id: "gap-earth-mark-block",
    category: "visual",
    gap: "Earth Mark must never return to an oversized dark block.",
    severity: "medium",
    founderFeedback: "Logo should stay clean, premium, SVG-based, and readable in dark/light.",
    affectedSurface: "Public entry and navigation",
    suggestedFix: "Keep Earth Mark size guarded and avoid raster/generated logo assets.",
    ownerMinistry: "Brand + Quality",
    status: "resolved",
    nextAction: "Retain logo regression coverage.",
  },
  {
    id: "gap-no-unrequested-images",
    category: "visual",
    gap: "Do not generate or add images unless explicitly requested.",
    severity: "medium",
    founderFeedback: "Use code-native UI and SVG for current product identity unless images are requested.",
    affectedSurface: "Public UI and brand assets",
    suggestedFix: "Prefer CSS/SVG/component work for interface passes.",
    ownerMinistry: "Product + Brand",
    status: "blocked_by_design",
    nextAction: "Keep as a Founder preference in task drafting.",
  },
];

export function getProductGapMemoryItems(
  checkedAt = new Date().toISOString()
): ProductMemoryItem[] {
  return knownProductGaps.flatMap((gap) => {
    const result = createProductMemoryDraft(
      {
        id: gap.id,
        domain: "product_gap",
        title: gap.gap,
        summary:
          `${gap.founderFeedback} Suggested fix: ${gap.suggestedFix} Next action: ${gap.nextAction}`,
        status: gap.status,
        tags: [gap.category, gap.severity],
        source: "founder-preference-and-visual-acceptance",
        relatedArea: gap.affectedSurface,
        sensitivity: "internal",
        visibility: gap.category === "founder_command" ? "founder_only" : "internal_readiness",
        productTruthImpact:
          gap.category === "launch_forbidden" ? "blocked_if_claimed" : "preserves_truth",
        founderDecisionImpact:
          gap.status === "needs_polish" ? "review_later" : "none",
      },
      checkedAt
    );

    return result.ok ? [result.item] : [];
  });
}

export function getProductGapMemorySnapshot(
  checkedAt = new Date().toISOString()
) {
  const items = getProductGapMemoryItems(checkedAt);

  return {
    checkedAt,
    mode: "product_gap_memory_readiness" as const,
    gaps: knownProductGaps,
    items,
    summary: {
      total: knownProductGaps.length,
      open: knownProductGaps.filter((gap) =>
        ["needs_polish", "confusing", "missing", "future"].includes(gap.status)
      ).length,
      blockers: knownProductGaps.filter((gap) => gap.severity === "blocker").length,
      high: knownProductGaps.filter((gap) => gap.severity === "high").length,
    },
    truth: {
      fakeMetricsStored: false,
      privateUserDataStored: false,
      secretsStored: false,
    },
  };
}
