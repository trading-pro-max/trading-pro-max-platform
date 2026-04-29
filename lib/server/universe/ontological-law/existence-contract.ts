import "server-only";
import type { ExistenceContract } from "./types";

const existenceContracts: ExistenceContract[] = [
  {
    entityId: "alkawn_root",
    entityType: "module",
    arabicLabel: "الكون",
    technicalLabel: "Al-Kawn private digital existence system",
    parentLayer: "ahmad_private_devices",
    childLayers: [
      "root_constitution",
      "product_truth",
      "universe_operating_kernel",
      "universe_one",
      "pro_max_galaxy",
    ],
    reasonForExistence:
      "Defines Ahmad's private digital existence system and the place where every project entity must prove origin, layer, truth, protection, and impact.",
    ownerLayer: "alkawn",
    truthSource: "manual_founder_decision",
    productTruthImpact: "highest_law",
    privacyImpact: "private",
    legalTouch: "approval_required",
    moneyTouch: "approval_required",
    securityTouch: "private",
    executionVerdict: "execute_inside_al_kawn",
    rollbackExplanationPath:
      "Return every claim to Ahmad as origin, Product Truth as highest law, and the Universe Operating Kernel as executive judge.",
    reportEvidence: ["reports/al-kawn-ontological-operating-law.md"],
    testEvidence: ["tests/regression/al-kawn-ontological-operating-law.spec.ts"],
    status: "active",
  },
  {
    entityId: "founder_universe_route",
    entityType: "route",
    arabicLabel: "مركز أمر الكون",
    technicalLabel: "/founder/universe",
    parentLayer: "alkawn",
    childLayers: ["human_interface", "product_truth", "universe_operating_kernel"],
    reasonForExistence:
      "Shows Ahmad the private operating truth, hierarchy, gates, kernel status, founder boundary, and ontological law without public exposure.",
    ownerLayer: "human_interface",
    truthSource: "local_project_state",
    productTruthImpact: "preserves_truth",
    privacyImpact: "private",
    legalTouch: "approval_required",
    moneyTouch: "approval_required",
    securityTouch: "read_only",
    executionVerdict: "execute_inside_al_kawn",
    rollbackExplanationPath:
      "Explain the route from UI section to server truth modules, then back to Ahmad private devices.",
    reportEvidence: ["reports/canonical-architecture-registry.md"],
    testEvidence: ["tests/regression/al-kawn-ontological-operating-law.spec.ts"],
    status: "protected",
  },
  {
    entityId: "trading_surface",
    entityType: "route",
    arabicLabel: "سطح التداول",
    technicalLabel: "/trading",
    parentLayer: "earth_planet",
    childLayers: ["trading_project", "product_truth"],
    reasonForExistence:
      "Represents the private/demo-safe trading surface on Earth Planet inside Pro Max Galaxy.",
    ownerLayer: "trading_surface",
    truthSource: "local_project_state",
    productTruthImpact: "preserves_truth",
    privacyImpact: "read_only",
    legalTouch: "approval_required",
    moneyTouch: "blocked",
    securityTouch: "read_only",
    executionVerdict: "execute_inside_al_kawn",
    rollbackExplanationPath:
      "Return trading claims to Earth Planet, then Pro Max Galaxy, then الكون, then Product Truth.",
    reportEvidence: ["reports/trading-premium-visual-realism-closure.md"],
    testEvidence: ["tests/regression/trading-premium-visual-realism-closure.spec.ts"],
    status: "active",
  },
  {
    entityId: "public_pro_max_future",
    entityType: "future_feature",
    arabicLabel: "Pro Max العام المستقبلي",
    technicalLabel: "Public Pro Max Future",
    parentLayer: "earth_planet",
    childLayers: ["global_layer"],
    reasonForExistence:
      "Keeps the future public product visible as a blocked gate rather than an active launch.",
    ownerLayer: "public_pro_max_future",
    truthSource: "future_gate_pending",
    productTruthImpact: "blocks_if_contradicted",
    privacyImpact: "future_gate_pending",
    legalTouch: "approval_required",
    moneyTouch: "approval_required",
    securityTouch: "approval_required",
    executionVerdict: "needs_more_evidence",
    rollbackExplanationPath:
      "Any public claim returns to Brand Gate, legal/compliance review, Product Truth, and Ahmad approval.",
    reportEvidence: ["reports/global-brand-clearance-status.md"],
    testEvidence: ["tests/regression/global-exclusive-brand-gate.spec.ts"],
    status: "future_only",
  },
  {
    entityId: "alkon_background_guardian",
    entityType: "module",
    arabicLabel: "حارس الخلفية",
    technicalLabel: "ALKON Background Guardian",
    parentLayer: "earth_planet",
    childLayers: ["product_truth", "protection_core"],
    reasonForExistence:
      "Provides private background intelligence support, evidence awareness, and boundary protection without becoming public or second layer.",
    ownerLayer: "alkon_background_guardian",
    truthSource: "local_project_state",
    productTruthImpact: "preserves_truth",
    privacyImpact: "private",
    legalTouch: "approval_required",
    moneyTouch: "approval_required",
    securityTouch: "private",
    executionVerdict: "execute_inside_al_kawn",
    rollbackExplanationPath:
      "Explain ALKON only as private background guardian inside Earth Planet, not as public product or second layer.",
    reportEvidence: ["reports/controlled-canonical-cleanup.md"],
    testEvidence: ["tests/regression/controlled-canonical-cleanup.spec.ts"],
    status: "protected",
  },
];

export function getExistenceContracts(): ExistenceContract[] {
  return existenceContracts;
}

export function getExistenceContract(entityId = "alkawn_root"): ExistenceContract {
  return (
    existenceContracts.find((contract) => contract.entityId === entityId) ??
    existenceContracts[0]
  );
}
