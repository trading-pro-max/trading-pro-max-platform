import "server-only";

import { createProductMemoryDraft } from "./store";
import type { FounderAcceptanceMemoryCategory, ProductMemoryItem } from "./types";

export const founderAcceptanceCategories: FounderAcceptanceMemoryCategory[] = [
  "public_entry",
  "workstation",
  "chart",
  "execution",
  "tpm_assistant",
  "journal_coach",
  "settings",
  "diagnostics",
  "plan_clarity",
  "visual_identity",
  "swiss_precision",
  "local_operation",
  "product_truth",
  "overall_satisfaction",
];

export const founderMemoryPreferenceRules = [
  "no images unless explicitly requested",
  "Free should feel familiar and premium",
  "Pro and VIP should carry differentiation",
  "Institutional replaces Enterprise in public language",
  "Founder terms remain internal only",
  "chart-first workstation",
  "no clutter",
  "no boxed/small feeling",
  "no fake claims",
  "no rush to launch",
  "final visual acceptance requires Ahmad approval",
  "current visual direction was rejected and must be reset",
  "desired logo is Earth with gold world-map edges and visible moon orbit",
  "chart must be calmer, deeper, and less annoying",
];

export function getFounderAcceptanceMemoryItems(
  checkedAt = new Date().toISOString()
): ProductMemoryItem[] {
  const drafts = [
    createProductMemoryDraft(
      {
        domain: "founder_acceptance",
        title: "Command 3 visual simplification needs human acceptance",
        summary:
          "The public interface was simplified and screenshots were captured, but final visual acceptance remains Ahmad-only and cannot be auto-claimed.",
        status: "needs_polish",
        tags: ["visual", "acceptance", "command-3"],
        source: "visual-simplification-global-standard",
        relatedArea: "public interface",
        sensitivity: "internal",
        visibility: "founder_only",
        productTruthImpact: "preserves_truth",
        founderDecisionImpact: "acceptance_required",
      },
      checkedAt
    ),
    createProductMemoryDraft(
      {
        domain: "visual_feedback",
        title: "Full visual identity reset required",
        summary:
          "Ahmad rejected the current visual direction. The reset direction is a code-only Celestial Swiss Earth Mark with gold world-map edges and moon orbit, plus a calmer premium chart rebuild and less boxed product surface.",
        status: "needs_polish",
        tags: ["visual-rejection", "celestial-earth-mark", "chart-rebuild"],
        source: "full-visual-identity-reset",
        relatedArea: "brand and workstation",
        sensitivity: "internal",
        visibility: "founder_only",
        productTruthImpact: "preserves_truth",
        founderDecisionImpact: "acceptance_required",
      },
      checkedAt
    ),
    createProductMemoryDraft(
      {
        domain: "visual_feedback",
        title: "Chart-first and no boxed/small feeling preference",
        summary:
          "Founder preference memory keeps chart dominance, reduced boxes, simple Free surface, and restricted internal terminology as recurring visual acceptance constraints.",
        status: "future",
        tags: ["chart", "visual", "preference"],
        source: "founder-preference-model",
        relatedArea: "workstation",
        sensitivity: "internal",
        visibility: "internal_readiness",
        productTruthImpact: "preserves_truth",
        founderDecisionImpact: "review_later",
      },
      checkedAt
    ),
  ];

  return drafts.flatMap((result) => (result.ok ? [result.item] : []));
}

export function getFounderAcceptanceProductMemorySnapshot(
  checkedAt = new Date().toISOString()
) {
  const items = getFounderAcceptanceMemoryItems(checkedAt);

  return {
    checkedAt,
    mode: "founder_acceptance_product_memory" as const,
    categories: founderAcceptanceCategories,
    preferenceRules: founderMemoryPreferenceRules,
    items,
    summary: {
      total: items.length,
      accepted: items.filter((item) => item.status === "accepted").length,
      needsPolish: items.filter((item) => item.status === "needs_polish").length,
      future: items.filter((item) => item.status === "future").length,
      humanAhmadAcceptanceRequired: true,
    },
    truth: {
      storesSecrets: false,
      storesPrivateSensitiveData: false,
      fakeAcceptanceRecords: false,
      launchApprovalRecorded: false,
    },
  };
}
