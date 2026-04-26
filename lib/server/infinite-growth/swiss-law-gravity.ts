import { getGrowthDomainRule } from "./domain-registry";
import type {
  GrowthDomain,
  InfiniteGrowthIdea,
  InfiniteGrowthLayer,
  SwissLawGravityResult,
} from "./types";

const DIRECT_BLACK_HOLE_DOMAINS: GrowthDomain[] = [
  "broker_feed",
  "live_execution",
  "real_money",
];

const MONEY_DOMAINS: GrowthDomain[] = [
  "billing",
  "payments",
  "treasury",
  "tax",
  "accounting",
];

const LOCAL_DOMAINS: GrowthDomain[] = [
  "idea",
  "design",
  "docs",
  "tests",
  "audit",
  "memory",
  "safe_local_build",
];

function uniqueLayers(layers: InfiniteGrowthLayer[]): InfiniteGrowthLayer[] {
  return layers.filter((layer, index, list) => list.indexOf(layer) === index);
}

export function evaluateSwissLawGravity(
  idea: InfiniteGrowthIdea
): SwissLawGravityResult {
  const rule = getGrowthDomainRule(idea.domain);
  const blockedReasons: string[] = [];
  const requiredGates: InfiniteGrowthLayer[] = [...rule.requiredGates];
  const text = `${idea.title} ${idea.description}`.toLowerCase();

  const directForbiddenActivation =
    DIRECT_BLACK_HOLE_DOMAINS.includes(idea.domain) ||
    idea.involvesLiveExecution ||
    idea.involvesBrokerFeed ||
    idea.involvesCustomerFunds ||
    idea.involvesTrading ||
    (idea.involvesMoney && idea.involvesFinancialAdvice) ||
    (idea.domain === "billing" &&
      (text.includes("activate") ||
        text.includes("checkout") ||
        text.includes("bill users"))) ||
    idea.involvesBankCardData ||
    (idea.involvesSecrets && idea.domain !== "safe_local_build");

  if (directForbiddenActivation) {
    blockedReasons.push(
      "Direct activation of live, broker/feed, real money, billing, customer funds, bank/card data, or secrets is forbidden in local scope."
    );

    return {
      gravity: "black_hole",
      requiredGates: uniqueLayers([
        ...requiredGates,
        "financial_services_gate",
        "security_secrets_gate",
        "founder_final_authority_gate",
      ]),
      blockedReasons,
      safeAlternative:
        "Keep the request as a private readiness report or Product Truth explanation with no activation.",
      nextSafeAction:
        "Draft a blocked-state report and keep every real-world activation inactive.",
    };
  }

  if (
    idea.domain === "financial_services" ||
    idea.domain === "regulated_activity" ||
    idea.involvesFinancialAdvice
  ) {
    return {
      gravity: "regulated_activity_critical",
      requiredGates: uniqueLayers([
        ...requiredGates,
        "financial_services_gate",
        "claims_gate",
        "founder_final_authority_gate",
      ]),
      blockedReasons,
      safeAlternative:
        "Prepare legal/regulatory readiness analysis without advice, custody, brokerage, or activation.",
      nextSafeAction:
        "Request Swiss legal/regulatory review before any external or user-facing move.",
    };
  }

  if (idea.involvesLaunch || idea.involvesProduction || idea.domain === "launch") {
    return {
      gravity: "launch_high",
      requiredGates: uniqueLayers([
        ...requiredGates,
        "launch_gate",
        "production_gate",
        "founder_final_authority_gate",
      ]),
      blockedReasons,
      safeAlternative:
        "Keep launch and production as readiness-only until all gates pass.",
      nextSafeAction:
        "Complete legal, support, security, monitoring, rollback, and Founder gates.",
    };
  }

  if (idea.involvesMediaClaims || idea.involvesPublishing || idea.domain === "media" || idea.domain === "social") {
    return {
      gravity: "media_claim_high",
      requiredGates: uniqueLayers([
        ...requiredGates,
        "claims_gate",
        "media_publishing_gate",
        "founder_final_authority_gate",
      ]),
      blockedReasons,
      safeAlternative:
        "Keep media as draft/review-only and avoid auto-publishing or tokens.",
      nextSafeAction:
        "Run claims review and keep publishing inactive.",
    };
  }

  if (MONEY_DOMAINS.includes(idea.domain) || idea.involvesMoney || idea.involvesPayments || idea.involvesTax) {
    return {
      gravity: "money_high",
      requiredGates: uniqueLayers([
        ...requiredGates,
        "tax_accounting_gate",
        "treasury_gate",
        "founder_final_authority_gate",
      ]),
      blockedReasons,
      safeAlternative:
        "Prepare invoice, budget, reserve, tax, and accounting readiness without payment execution.",
      nextSafeAction:
        "Collect invoice evidence and route to Founder/accounting review.",
    };
  }

  if (idea.collectsUserData || idea.involvesPreciseTracking || idea.domain === "data") {
    return {
      gravity: "user_data_high",
      requiredGates: uniqueLayers([
        ...requiredGates,
        "privacy_gate",
        "security_secrets_gate",
        "founder_final_authority_gate",
      ]),
      blockedReasons,
      safeAlternative:
        "Use privacy-minimized readiness design with no GPS or hidden precise tracking.",
      nextSafeAction:
        "Complete privacy review and explain data use before collection.",
    };
  }

  if (idea.publicVisible || ["public_ui", "assistant", "workspace", "support"].includes(idea.domain)) {
    return {
      gravity: "public_claim_medium",
      requiredGates: uniqueLayers([
        ...requiredGates,
        "product_truth_gate",
        "claims_gate",
        "privacy_gate",
      ]),
      blockedReasons,
      safeAlternative:
        "Use public-safe, Product Truth aligned copy and keep private systems hidden.",
      nextSafeAction:
        "Run public leak and Product Truth checks before exposing changes.",
    };
  }

  if (LOCAL_DOMAINS.includes(idea.domain)) {
    return {
      gravity: "local_private_low",
      requiredGates: uniqueLayers(requiredGates),
      blockedReasons,
      safeAlternative:
        "Continue safe local creation with no external activation.",
      nextSafeAction:
        "Build, test, document, and audit locally under Product Truth.",
    };
  }

  return {
    gravity: rule.legalGravity,
    requiredGates: uniqueLayers(requiredGates),
    blockedReasons,
    safeAlternative:
      "Keep the action in readiness mode until its gates are proven.",
    nextSafeAction: "Run gate checks and ask Founder for sensitive decisions.",
  };
}
