import type { RealityLayer, ZeroTruthAudit, ZeroTruthFinding } from "./types";

const realityAreas: Array<{
  area: string;
  layer: RealityLayer;
  status: ZeroTruthFinding["status"];
  summary: string;
  nextAction: string;
}> = [
  {
    area: "Public Pro Max Reality",
    layer: "public_pro_max_reality",
    status: "ready_with_notes",
    summary:
      "Public surfaces remain Pro Max / Pro Max Trading only and must keep internal kernel language hidden.",
    nextAction: "Keep public copy sanitized and test for internal terminology leaks.",
  },
  {
    area: "Private Alkon Universe",
    layer: "private_alkon_universe",
    status: "accepted",
    summary:
      "Alkon is modeled as private Founder-only governance and creator-runtime readiness.",
    nextAction: "Expose kernel status only inside Founder Command and founder APIs.",
  },
  {
    area: "Invisible Operating Layer",
    layer: "invisible_operating_layer",
    status: "accepted",
    summary:
      "Internal truth can translate into public-safe readiness labels without leaking doctrine.",
    nextAction: "Keep translation read-only and non-executing.",
  },
  {
    area: "Pro Max Trading / first heart",
    layer: "public_pro_max_reality",
    status: "ready_with_notes",
    summary:
      "Trading Workspace, chart, paper execution, Assistant, and Product Truth remain the first heart.",
    nextAction: "Protect chart-first hierarchy and wait for Ahmad visual acceptance.",
  },
  {
    area: "Trading Workspace",
    layer: "public_pro_max_reality",
    status: "needs_review",
    summary:
      "Workspace closure depends on Ahmad's human visual review after the latest visual balance work.",
    nextAction: "Ask Ahmad to accept or reject the current visual baseline.",
  },
  {
    area: "Assistant",
    layer: "public_pro_max_reality",
    status: "ready_with_notes",
    summary:
      "Assistant remains a user comfort and language layer, not a signal engine.",
    nextAction: "Keep trading signals, profit promises, and internal terms blocked.",
  },
  {
    area: "Product Truth",
    layer: "invisible_operating_layer",
    status: "accepted",
    summary:
      "Live execution, real money, broker/feed, billing, production, public launch, and shell execution remain blocked.",
    nextAction: "Reject any command that tries to bypass Product Truth gates.",
  },
  {
    area: "Visual acceptance",
    layer: "invisible_operating_layer",
    status: "needs_review",
    summary:
      "Local Day One cannot start until Ahmad explicitly accepts the public visual reality.",
    nextAction: "Use one clear visual review request instead of adding new worlds.",
  },
  {
    area: "Wake Report / tests / build / git",
    layer: "invisible_operating_layer",
    status: "needs_review",
    summary:
      "This kernel pass must produce fresh validation, reports, commit, push, and clean Git evidence.",
    nextAction: "Run validation before closure and record the evidence chain.",
  },
  {
    area: "Public leak status",
    layer: "invisible_operating_layer",
    status: "accepted",
    summary:
      "Public users must not see Alkon, Founder Command, Kernel, Zero Truth, Reality Trial, or internal governance.",
    nextAction: "Keep public leak tests active.",
  },
  {
    area: "Local Day One readiness",
    layer: "private_alkon_universe",
    status: "needs_review",
    summary:
      "Local Day One is gated by visual acceptance, validation, Wake Report, and clean Git.",
    nextAction: "Do not start Local Day One automatically.",
  },
];

export function getKernelZeroTruthAudit(): ZeroTruthAudit {
  const findings = realityAreas.map((finding, index) => ({
    findingId: `zero_truth_${String(index + 1).padStart(2, "0")}`,
    ...finding,
  }));
  const blockers = findings
    .filter((finding) => finding.status === "blocked")
    .map((finding) => finding.summary);

  return {
    zeroTruthStatus: blockers.length > 0 ? "blocked" : "needs_review",
    deletesRepo: false,
    resetsProject: false,
    breaksWorkingSystems: false,
    findings,
    blockers,
    oneNextActionCandidate:
      "Ask Ahmad to visually accept or reject the current Pro Max public and Trading Workspace baseline.",
  };
}
