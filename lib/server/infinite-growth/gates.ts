import type {
  GrowthGateStatus,
  InfiniteGrowthGate,
  InfiniteGrowthIdea,
} from "./types";

const FAKE_CLAIM_PATTERN =
  /fake|guarantee|guaranteed|win-rate|profit promise|Swiss certified|Sharia certified|partnership|app store|play store|download now|live active|billing active|broker active|real money active/i;
const SECRET_PATTERN =
  /api key|token|secret|password|cvv|card number|bank credential|private key/i;

function gate(
  gateId: InfiniteGrowthGate["gateId"],
  status: GrowthGateStatus,
  reason: string,
  evidenceNeeded: string[],
  requiredReview: string[],
  safeAlternative: string
): InfiniteGrowthGate {
  return {
    gateId,
    status,
    reason,
    evidenceNeeded,
    requiredReview,
    safeAlternative,
  };
}

export function productTruthGate(idea: InfiniteGrowthIdea): InfiniteGrowthGate {
  const text = `${idea.title} ${idea.description} ${idea.claimText ?? ""}`;
  const directFalseClaim = idea.involvesFakeClaim || FAKE_CLAIM_PATTERN.test(text);

  if (directFalseClaim) {
    return gate(
      "ProductTruthGate",
      "blocked",
      "The request risks fake activation, fake availability, fake certification, fake partnership, or outcome claims.",
      ["Product Truth wording"],
      ["Founder review", "claims review"],
      "Use truthful planned, inactive, future, or paper-safe language."
    );
  }

  return gate(
    "ProductTruthGate",
    "pass",
    "No fake activation or false product claim is required.",
    ["Product Truth check"],
    [],
    "Keep public wording factual and calm."
  );
}

export function privacyGate(idea: InfiniteGrowthIdea): InfiniteGrowthGate {
  if (idea.involvesPreciseTracking) {
    return gate(
      "PrivacyGate",
      "blocked",
      "Precise hidden tracking or GPS is not allowed in this local scope.",
      ["privacy impact review"],
      ["privacy review"],
      "Use coarse, user-controlled, explicit settings with no GPS."
    );
  }

  if (idea.collectsUserData || idea.domain === "data") {
    return gate(
      "PrivacyGate",
      "review_required",
      "User data requires privacy readiness, minimization, and clear explanation.",
      ["privacy policy/readiness", "data minimization proof"],
      ["privacy review", "Founder review"],
      "Keep the design readiness-only until privacy gates pass."
    );
  }

  return gate(
    "PrivacyGate",
    "pass",
    "No user-data collection or precise tracking is required.",
    ["public/private boundary check"],
    [],
    "Continue without collecting hidden personal data."
  );
}

export function taxAccountingGate(idea: InfiniteGrowthIdea): InfiniteGrowthGate {
  if (idea.domain === "tax" && idea.description.toLowerCase().includes("file")) {
    return gate(
      "TaxAccountingGate",
      "blocked",
      "Tax filing automation and final tax advice are not allowed.",
      ["accountant review"],
      ["accountant review", "Founder review"],
      "Prepare accountant-ready notes instead of filing."
    );
  }

  if (
    ["billing", "payments", "treasury", "tax", "accounting"].includes(
      idea.domain
    ) ||
    idea.involvesTax ||
    idea.involvesMoney
  ) {
    return gate(
      "TaxAccountingGate",
      "review_required",
      "Money and tax-adjacent growth needs invoice evidence, tax reserve, VAT threshold watch, and accountant review when required.",
      ["invoice evidence", "tax reserve check", "VAT threshold watch"],
      ["accounting review", "Founder review"],
      "Keep the request as accounting readiness with no payment or filing execution."
    );
  }

  return gate(
    "TaxAccountingGate",
    "pass",
    "No tax or accounting move is requested.",
    ["not applicable"],
    [],
    "No tax/accounting action is needed."
  );
}

export function treasuryGate(idea: InfiniteGrowthIdea): InfiniteGrowthGate {
  const text = `${idea.title} ${idea.description}`.toLowerCase();

  if (idea.involvesBankCardData || text.includes("card") || text.includes("bank credential")) {
    return gate(
      "TreasuryGate",
      "black_hole",
      "Bank/card data and payment credentials are forbidden in product code.",
      ["no bank/card secret proof"],
      ["Founder review", "security review"],
      "Use a manual, external, accountant/Founder-approved payment path."
    );
  }

  if (idea.involvesPayments || text.includes("execute payment")) {
    return gate(
      "TreasuryGate",
      "black_hole",
      "Payment execution from the app or code is forbidden.",
      ["invoice", "budget", "reserve", "Founder approval"],
      ["Founder review", "accounting review"],
      "Create a readiness report only; do not execute payment."
    );
  }

  if (["billing", "payments", "treasury"].includes(idea.domain)) {
    return gate(
      "TreasuryGate",
      "founder_approval_required",
      "Treasury movement requires budget, reserve, invoice evidence, and Founder approval.",
      ["invoice", "budget", "reserve"],
      ["Founder review", "accounting review"],
      "Keep treasury as readiness-only until approved."
    );
  }

  return gate(
    "TreasuryGate",
    "pass",
    "No treasury movement is requested.",
    ["not applicable"],
    [],
    "No money movement is allowed or needed."
  );
}

export function claimsGate(idea: InfiniteGrowthIdea): InfiniteGrowthGate {
  const text = `${idea.title} ${idea.description} ${idea.claimText ?? ""}`;

  if (FAKE_CLAIM_PATTERN.test(text)) {
    return gate(
      "ClaimsGate",
      "blocked",
      "Public claims cannot promise profit, win-rate, fake availability, fake Swiss status, fake certification, or fake partnerships.",
      ["claims firewall review"],
      ["claims review", "legal/guardian review"],
      "Use precise inactive, planned, future, or readiness wording."
    );
  }

  if (idea.involvesMediaClaims || idea.publicVisible) {
    return gate(
      "ClaimsGate",
      "review_required",
      "Public or media-facing claims need review before exposure.",
      ["claims review"],
      ["claims review"],
      "Keep the copy draft internal until review passes."
    );
  }

  return gate(
    "ClaimsGate",
    "pass",
    "No public or media claim is being made.",
    ["not applicable"],
    [],
    "Keep claims factual if the idea becomes public."
  );
}

export function mediaPublishingGate(idea: InfiniteGrowthIdea): InfiniteGrowthGate {
  if (idea.involvesPublishing || idea.domain === "social") {
    return gate(
      "MediaPublishingGate",
      "blocked",
      "Publishing, auto-posting, ad spend, and social tokens remain inactive.",
      ["publishing approval", "claims review"],
      ["Founder review", "claims review"],
      "Prepare a private draft only; do not publish or connect tokens."
    );
  }

  if (idea.domain === "media") {
    return gate(
      "MediaPublishingGate",
      "readiness_only",
      "Media may be drafted and reviewed, but publishing stays inactive.",
      ["claims review", "Founder review"],
      ["Founder review"],
      "Keep media in draft/review mode."
    );
  }

  return gate(
    "MediaPublishingGate",
    "pass",
    "No publishing path is requested.",
    ["not applicable"],
    [],
    "No media publishing action is allowed."
  );
}

export function launchGate(idea: InfiniteGrowthIdea): InfiniteGrowthGate {
  if (idea.domain === "launch" || idea.involvesLaunch) {
    return gate(
      "LaunchGate",
      "blocked",
      "Launch requires legal, support, security, monitoring, rollback, and Founder final approval gates.",
      ["launch checklist", "rollback proof", "support readiness"],
      ["Founder review", "legal review", "security review"],
      "Keep launch as readiness-only until all gates pass."
    );
  }

  return gate(
    "LaunchGate",
    "pass",
    "No launch activation is requested.",
    ["not applicable"],
    [],
    "Public launch remains inactive."
  );
}

export function productionGate(idea: InfiniteGrowthIdea): InfiniteGrowthGate {
  if (idea.domain === "production" || idea.involvesProduction) {
    return gate(
      "ProductionGate",
      "blocked",
      "Production activation is blocked until security, launch, monitoring, rollback, and Founder gates pass.",
      ["security proof", "monitoring proof", "rollback proof"],
      ["Founder review", "security review"],
      "Keep work local/readiness-only."
    );
  }

  return gate(
    "ProductionGate",
    "pass",
    "No production activation is requested.",
    ["not applicable"],
    [],
    "Production remains inactive."
  );
}

export function securitySecretsGate(idea: InfiniteGrowthIdea): InfiniteGrowthGate {
  const text = `${idea.title} ${idea.description} ${idea.claimText ?? ""}`;

  if (idea.involvesSecrets || SECRET_PATTERN.test(text)) {
    return gate(
      "SecuritySecretsGate",
      "black_hole",
      "Secrets, API keys, tokens, bank credentials, and raw sensitive values must never be exposed.",
      ["secret-free scan"],
      ["security review", "Founder review"],
      "Use redacted readiness labels and never store or display raw secret values."
    );
  }

  return gate(
    "SecuritySecretsGate",
    "pass",
    "No secret or credential exposure is required.",
    ["secret-free scan"],
    [],
    "Continue without touching production secrets or credentials."
  );
}

export function financialServicesGate(
  idea: InfiniteGrowthIdea
): InfiniteGrowthGate {
  if (
    idea.domain === "financial_services" ||
    idea.domain === "regulated_activity" ||
    idea.involvesFinancialAdvice ||
    idea.involvesCustomerFunds ||
    idea.involvesTrading ||
    idea.involvesBrokerFeed ||
    idea.involvesLiveExecution
  ) {
    return gate(
      "FinancialServicesGate",
      "blocked",
      "Financial services, regulated activity, customer funds, live execution, broker/feed, and advice require legal/regulatory review and are blocked until cleared.",
      ["FINMA/legal review if applicable", "KYC/AML analysis if applicable"],
      ["legal review", "regulatory review", "Founder final approval"],
      "Keep the work as internal readiness and public Product Truth explanation only."
    );
  }

  return gate(
    "FinancialServicesGate",
    "pass",
    "No regulated financial services activity is requested.",
    ["not applicable"],
    [],
    "Do not imply financial advice, custody, brokerage, or live execution."
  );
}

export function founderFinalAuthorityGate(
  idea: InfiniteGrowthIdea
): InfiniteGrowthGate {
  const sensitive =
    idea.publicVisible ||
    idea.collectsUserData ||
    idea.involvesMoney ||
    idea.involvesPayments ||
    idea.involvesTax ||
    idea.involvesMediaClaims ||
    idea.involvesLaunch ||
    idea.involvesProduction ||
    idea.involvesFinancialAdvice ||
    idea.involvesPublishing ||
    idea.domain === "billing" ||
    idea.domain === "payments" ||
    idea.domain === "treasury" ||
    idea.domain === "launch" ||
    idea.domain === "production" ||
    idea.domain === "financial_services" ||
    idea.domain === "regulated_activity";

  if (sensitive) {
    return gate(
      "FounderFinalAuthorityGate",
      "founder_approval_required",
      "Sensitive growth needs Ahmad's explicit final authority.",
      ["Founder decision record"],
      ["Founder final review"],
      "Prepare a permit report and wait for explicit Founder approval."
    );
  }

  return gate(
    "FounderFinalAuthorityGate",
    "pass",
    "Safe local creation does not need real-world authority yet.",
    ["local-only scope"],
    [],
    "Continue safe local creation."
  );
}

export function evaluateGrowthGates(
  idea: InfiniteGrowthIdea
): InfiniteGrowthGate[] {
  return [
    productTruthGate(idea),
    privacyGate(idea),
    taxAccountingGate(idea),
    treasuryGate(idea),
    claimsGate(idea),
    mediaPublishingGate(idea),
    launchGate(idea),
    productionGate(idea),
    securitySecretsGate(idea),
    financialServicesGate(idea),
    founderFinalAuthorityGate(idea),
  ];
}
