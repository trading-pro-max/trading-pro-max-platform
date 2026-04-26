import type { NumberOneEvaluationTarget, ProMaxStandard } from "./types";

export const PRO_MAX_STANDARDS: ProMaxStandard[] = [
  {
    standardId: "ui_standard",
    requirement: "Every public surface must be calm, clear, low-clutter, and fast to understand.",
    forbiddenPatterns: ["button chaos", "repeated warnings", "private terms", "casino/neon pressure"],
    proofRequired: ["screenshot proof", "public leak test"],
    owner: "Public Earth / Product Design",
    tests: ["public UI leak regression", "navigation clarity regression"],
    memoryRule: "No clutter and no internal leakage.",
  },
  {
    standardId: "chart_standard",
    requirement: "The chart stays dominant in the Trading Workspace.",
    forbiddenPatterns: ["chart covered by assistant", "duplicate topbars", "visual effects that distract price"],
    proofRequired: ["workspace screenshot", "chart-first regression"],
    owner: "Living Market Core",
    tests: ["workspace chart focus proof"],
    memoryRule: "Chart is king.",
  },
  {
    standardId: "assistant_standard",
    requirement: "Pro Max Assistant translates intent into safe actions, explanations, alternatives, and blocked-state clarity.",
    forbiddenPatterns: ["trading signals", "profit promises", "internal Alkon leakage", "long generic replies"],
    proofRequired: ["intent tests", "blocked-intent tests"],
    owner: "Assistant Layer",
    tests: ["assistant intent regression"],
    memoryRule: "Assistant is the intent interface.",
  },
  {
    standardId: "earth_identity_standard",
    requirement: "Earth-native identity must support trust and product clarity, not fantasy spectacle.",
    forbiddenPatterns: ["fantasy game look", "raster assets", "generated images", "crowded logo lockups"],
    proofRequired: ["public screenshot", "no raster asset scan"],
    owner: "Brand Universe",
    tests: ["no images/raster regression"],
    memoryRule: "Earth is product reality.",
  },
  {
    standardId: "security_standard",
    requirement: "Security and auth must not be weakened for speed or appearance.",
    forbiddenPatterns: ["secret exposure", "auth bypass", "web shell execution", "direct Codex execution"],
    proofRequired: ["security source scan", "route safety check"],
    owner: "Security Sovereignty",
    tests: ["no secrets exposed", "no shell execution"],
    memoryRule: "Security is immune system.",
  },
  {
    standardId: "truth_standard",
    requirement: "Public truth must match active, planned, inactive, and future reality.",
    forbiddenPatterns: ["fake activation", "fake users", "fake downloads", "public #1 claim"],
    proofRequired: ["Product Truth check", "public claim firewall"],
    owner: "Product Truth",
    tests: ["public truth regression"],
    memoryRule: "#1 is internal standard, not public claim.",
  },
  {
    standardId: "legal_standard",
    requirement: "Legal, tax, financial, and regulated claims require review and never become final advice.",
    forbiddenPatterns: ["regulated status claim", "Swiss legal status claim", "Sharia certification claim"],
    proofRequired: ["Legal/Guardian review when applicable"],
    owner: "Legal / Guardian",
    tests: ["claims firewall regression"],
    memoryRule: "No legal/tax/financial final advice.",
  },
  {
    standardId: "treasury_standard",
    requirement: "Money, billing, invoices, payments, and budgets are governed and readiness-only unless gates pass.",
    forbiddenPatterns: ["payment execution", "bank/card data", "billing activation now"],
    proofRequired: ["treasury readiness", "accounting readiness"],
    owner: "Treasury Life",
    tests: ["payment execution blocked"],
    memoryRule: "No money without treasury/accounting.",
  },
  {
    standardId: "media_standard",
    requirement: "Media and public claims pass claims review before any publishing or ads.",
    forbiddenPatterns: ["auto-publishing", "tokens", "profit claims", "fake partnerships"],
    proofRequired: ["claims review", "publishing inactive proof"],
    owner: "Media Reality",
    tests: ["media claims firewall"],
    memoryRule: "No media without claims review.",
  },
  {
    standardId: "support_standard",
    requirement: "Support language must be truthful about readiness and never fake backend capability.",
    forbiddenPatterns: ["fake tickets", "fake email sending", "fake priority support"],
    proofRequired: ["support readiness proof"],
    owner: "Support",
    tests: ["support truth regression"],
    memoryRule: "No fake support backend.",
  },
  {
    standardId: "accessibility_standard",
    requirement: "Reduced motion, static mode, high contrast, keyboard access, and readable copy remain supported.",
    forbiddenPatterns: ["motion-only meaning", "hover-only essentials", "low contrast"],
    proofRequired: ["accessibility mode proof"],
    owner: "Accessibility",
    tests: ["reduced motion/static/high contrast regression"],
    memoryRule: "Clarity serves real humans.",
  },
  {
    standardId: "performance_standard",
    requirement: "Quality improvements must not make the app heavy, slow, or fragile.",
    forbiddenPatterns: ["heavy effects", "large assets", "unneeded client code"],
    proofRequired: ["build pass", "route smoke"],
    owner: "Platform Engineering",
    tests: ["build", "smoke routes"],
    memoryRule: "World-class quality is fast and stable.",
  },
  {
    standardId: "alkon_privacy_standard",
    requirement: "Alkon, Founder Command, and private governance stay private.",
    forbiddenPatterns: ["public Alkon", "public Founder Command", "public Task Passport", "public Result Tribunal"],
    proofRequired: ["public no-leak proof"],
    owner: "Alkon Private Universe",
    tests: ["public private boundary regression"],
    memoryRule: "Alkon is private.",
  },
];

export function selectApplicableStandards(
  target: NumberOneEvaluationTarget
): ProMaxStandard[] {
  const standards = PRO_MAX_STANDARDS.filter((standard) => {
    if (target.type === "workspace" && standard.standardId === "chart_standard") {
      return true;
    }
    if (target.type === "assistant_behavior" && standard.standardId === "assistant_standard") {
      return true;
    }
    if (target.type === "public_copy" && ["truth_standard", "legal_standard", "media_standard"].includes(standard.standardId)) {
      return true;
    }
    if (target.type === "future_world" && standard.standardId === "alkon_privacy_standard") {
      return true;
    }
    return [
      "ui_standard",
      "truth_standard",
      "security_standard",
      "accessibility_standard",
      "performance_standard",
      "alkon_privacy_standard",
    ].includes(standard.standardId);
  });

  return standards;
}
