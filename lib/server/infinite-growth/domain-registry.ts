import type {
  GrowthDomain,
  GrowthDomainRule,
  InfiniteGrowthLayer,
  SwissLawGravityLevel,
} from "./types";

const SAFE_CREATION_GATES: InfiniteGrowthLayer[] = [
  "product_truth_gate",
  "security_secrets_gate",
  "founder_final_authority_gate",
];

const PUBLIC_SAFE_GATES: InfiniteGrowthLayer[] = [
  "product_truth_gate",
  "claims_gate",
  "privacy_gate",
  "security_secrets_gate",
  "founder_final_authority_gate",
];

const MONEY_GATES: InfiniteGrowthLayer[] = [
  "product_truth_gate",
  "tax_accounting_gate",
  "treasury_gate",
  "security_secrets_gate",
  "founder_final_authority_gate",
];

const REGULATED_GATES: InfiniteGrowthLayer[] = [
  "product_truth_gate",
  "privacy_gate",
  "claims_gate",
  "financial_services_gate",
  "security_secrets_gate",
  "founder_final_authority_gate",
];

function domainRule(
  domain: GrowthDomain,
  purpose: string,
  allowedInfinity: string[],
  requiredGates: InfiniteGrowthLayer[],
  forbiddenActions: string[],
  gravity: SwissLawGravityLevel,
  requiredProof: string[],
  memoryRule: string,
  publicVisible = false
): GrowthDomainRule {
  return {
    domain,
    purpose,
    allowedInfinity,
    requiredGates,
    forbiddenActions,
    publicVisible,
    founderVisible: true,
    legalGravity: gravity,
    privacyGravity: publicVisible ? "public_claim_medium" : "local_private_low",
    moneyGravity:
      requiredGates.includes("treasury_gate") ||
      requiredGates.includes("tax_accounting_gate")
        ? "money_high"
        : "local_private_low",
    regulatoryGravity: requiredGates.includes("financial_services_gate")
      ? "regulated_activity_critical"
      : gravity,
    requiredProof,
    memoryRule,
  };
}

export const INFINITE_GROWTH_DOMAIN_REGISTRY: GrowthDomainRule[] = [
  domainRule(
    "idea",
    "Capture safe ideas without committing real-world action.",
    ["ideation", "prioritization", "gap detection", "task drafting"],
    SAFE_CREATION_GATES,
    ["external activation", "public claim", "secret storage"],
    "local_private_low",
    ["Product Truth check", "private boundary check"],
    "Infinity is safe creation only."
  ),
  domainRule(
    "design",
    "Explore interface and product design without fake launch or public claims.",
    ["wireframes", "copy drafts", "visual review", "local UI polish"],
    SAFE_CREATION_GATES,
    ["raster asset generation", "public Alkon exposure", "fake availability"],
    "local_private_low",
    ["visual review", "public leak check"],
    "No images or raster assets unless explicitly approved."
  ),
  domainRule(
    "docs",
    "Document doctrine, policy, and readiness boundaries.",
    ["doctrine", "indexes", "audits", "legal-readiness notes"],
    SAFE_CREATION_GATES,
    ["legal final advice", "tax final advice", "fake certification"],
    "local_private_low",
    ["docs exist", "Product Truth wording check"],
    "Docs can grow without limit, but claims remain reviewed."
  ),
  domainRule(
    "tests",
    "Prove safe behavior through deterministic validation.",
    ["regression coverage", "route smoke", "leak scans", "readiness assertions"],
    SAFE_CREATION_GATES,
    ["fake passing status", "production activation"],
    "local_private_low",
    ["TypeScript", "ESLint", "regression", "smoke"],
    "Testing may grow freely when it protects Product Truth."
  ),
  domainRule(
    "audit",
    "Inspect readiness, security, claims, privacy, and operational gaps.",
    ["gap scoring", "readiness reports", "risk maps", "cleanup candidates"],
    SAFE_CREATION_GATES,
    ["external reporting", "secret display", "payment execution"],
    "local_private_low",
    ["audit report", "no secrets check"],
    "Audit growth is internal and never exposes secrets."
  ),
  domainRule(
    "memory",
    "Store safe lessons that prevent repeated mistakes.",
    ["lessons", "future guards", "Founder preferences", "regression reminders"],
    SAFE_CREATION_GATES,
    ["secrets", "private sensitive data", "fake metrics"],
    "local_private_low",
    ["memory law check", "secret-free scan"],
    "Memory preserves lessons, not secret values."
  ),
  domainRule(
    "safe_local_build",
    "Build and test local code without production activation.",
    ["local components", "read-only APIs", "deterministic engines"],
    SAFE_CREATION_GATES,
    ["production activation", "external calls", "shell execution from web app"],
    "local_private_low",
    ["TypeScript", "ESLint", "build", "regression"],
    "Local build is unlimited only while reality remains gated."
  ),
  domainRule(
    "public_ui",
    "Improve public clarity under Product Truth and private boundary rules.",
    ["copy polish", "layout simplification", "truth strips", "accessibility"],
    PUBLIC_SAFE_GATES,
    ["Alkon exposure", "fake claims", "fake downloads"],
    "public_claim_medium",
    ["public screenshot", "public leak check", "Product Truth check"],
    "Public UI can improve only with truthful wording.",
    true
  ),
  domainRule(
    "assistant",
    "Guide users through intent, explanations, and safe alternatives.",
    ["intent registry", "blocked explanations", "plan-aware guidance"],
    PUBLIC_SAFE_GATES,
    ["trading signals", "profit promises", "internal leakage"],
    "public_claim_medium",
    ["assistant response tests", "blocked intent tests"],
    "Assistant growth must never become advice, signals, or internal leakage.",
    true
  ),
  domainRule(
    "workspace",
    "Keep paper-safe workspace useful without live execution.",
    ["chart-first polish", "paper-safe flows", "Journal/Coach prompts"],
    PUBLIC_SAFE_GATES,
    ["live execution", "broker/feed activation", "fake live data"],
    "public_claim_medium",
    ["workspace proof", "Product Truth check"],
    "Workspace growth stays paper-safe until regulated gates clear.",
    true
  ),
  domainRule(
    "media",
    "Prepare truthful communication under claims review.",
    ["drafts", "story architecture", "claims firewall", "review queue"],
    [
      "product_truth_gate",
      "claims_gate",
      "media_publishing_gate",
      "security_secrets_gate",
      "founder_final_authority_gate",
    ],
    ["auto-publishing", "social tokens", "profit claims", "fake availability"],
    "media_claim_high",
    ["claims review", "media gate inactive proof"],
    "Media remains draft and review only until approved."
  ),
  domainRule(
    "support",
    "Make support readiness truthful without fake backend promises.",
    ["support copy", "readiness status", "routing explanation"],
    PUBLIC_SAFE_GATES,
    ["fake support SLA", "fake live agents", "private data exposure"],
    "public_claim_medium",
    ["support readiness test", "public leak check"],
    "Support claims must match the support system that really exists.",
    true
  ),
  domainRule(
    "data",
    "Handle user data only under privacy readiness.",
    ["privacy modeling", "consent design", "data minimization"],
    ["product_truth_gate", "privacy_gate", "security_secrets_gate", "founder_final_authority_gate"],
    ["GPS", "precise hidden tracking", "secret user profiling"],
    "user_data_high",
    ["privacy review", "security review"],
    "Data growth requires explicit privacy gates before use."
  ),
  domainRule(
    "billing",
    "Prepare billing readiness without checkout activation.",
    ["pricing doctrine", "refund policy draft", "support readiness"],
    MONEY_GATES,
    ["checkout now", "paid activation", "fake Pro/VIP activation"],
    "money_high",
    ["legal review", "accounting review", "support review"],
    "Billing remains blocked until legal, accounting, support, and Founder gates pass."
  ),
  domainRule(
    "payments",
    "Model payments readiness without payment execution.",
    ["invoice review", "budget check", "payment approval model"],
    MONEY_GATES,
    ["payment execution from code", "bank/card secrets", "autopay activation"],
    "money_high",
    ["invoice evidence", "budget proof", "Founder approval"],
    "Payments require invoice, budget, reserve, and Founder approval."
  ),
  domainRule(
    "treasury",
    "Govern spend readiness, reserves, and Founder-funded mode.",
    ["budget caps", "reserve readiness", "reimbursement draft"],
    MONEY_GATES,
    ["bank/card storage", "autopay execution", "unapproved spend"],
    "money_high",
    ["treasury review", "invoice proof"],
    "Money is governed and never executed from product code."
  ),
  domainRule(
    "tax",
    "Track tax and VAT readiness without filing automation.",
    ["tax reserve", "VAT threshold watch", "accountant review notes"],
    MONEY_GATES,
    ["tax filing automation", "final tax advice", "fake VAT status"],
    "money_high",
    ["accountant review", "tax reserve check"],
    "Tax readiness is modeled; final tax advice is never provided by the product."
  ),
  domainRule(
    "accounting",
    "Prepare accounting evidence and review paths.",
    ["invoice registry readiness", "category mapping", "evidence rules"],
    MONEY_GATES,
    ["payment execution", "bank credential storage", "fake accounting status"],
    "money_high",
    ["invoice evidence", "accountant review"],
    "Accounting readiness protects money movement before any action."
  ),
  domainRule(
    "launch",
    "Prepare launch gates without public launch activation.",
    ["launch checklist", "rollback plan", "support/security/legal gates"],
    [
      "product_truth_gate",
      "privacy_gate",
      "claims_gate",
      "launch_gate",
      "security_secrets_gate",
      "founder_final_authority_gate",
    ],
    ["launch now", "fake public availability", "unreviewed public claims"],
    "launch_high",
    ["launch gate proof", "rollback proof", "Founder final approval"],
    "Launch is blocked until all gates pass and Founder decides."
  ),
  domainRule(
    "production",
    "Prepare production readiness without activating production.",
    ["deployment readiness", "monitoring readiness", "rollback readiness"],
    [
      "product_truth_gate",
      "privacy_gate",
      "production_gate",
      "security_secrets_gate",
      "founder_final_authority_gate",
    ],
    ["production activation now", "production secrets access", "public launch claim"],
    "launch_high",
    ["security review", "rollback proof", "monitoring proof"],
    "Production remains inactive until launch and security gates clear."
  ),
  domainRule(
    "social",
    "Prepare social/media readiness without publishing or tokens.",
    ["post drafts", "claims review", "channel planning"],
    [
      "product_truth_gate",
      "claims_gate",
      "media_publishing_gate",
      "security_secrets_gate",
      "founder_final_authority_gate",
    ],
    ["auto-posting", "social tokens", "unreviewed claims", "ad spend"],
    "media_claim_high",
    ["claims review", "Founder approval", "publishing gate inactive proof"],
    "Social remains draft-only until manually approved later."
  ),
  domainRule(
    "broker_feed",
    "Classify broker/feed integration as forbidden in local scope.",
    ["readiness doctrine only"],
    REGULATED_GATES,
    ["broker connection", "feed activation", "API key storage", "live routing"],
    "regulated_activity_critical",
    ["regulatory review", "security review"],
    "Broker/feed activation is blocked now."
  ),
  domainRule(
    "live_execution",
    "Classify live execution as forbidden in local scope.",
    ["risk doctrine only"],
    REGULATED_GATES,
    ["live order routing", "real trade execution", "broker activation"],
    "regulated_activity_critical",
    ["regulatory review", "Founder final approval"],
    "Live execution is blocked now."
  ),
  domainRule(
    "real_money",
    "Classify real-money routing as forbidden in local scope.",
    ["risk doctrine only"],
    REGULATED_GATES,
    ["customer funds", "real-money routing", "custody claims"],
    "regulated_activity_critical",
    ["regulatory review", "legal review", "security review"],
    "Real money remains blocked now."
  ),
  domainRule(
    "financial_services",
    "Gate any financial-services move behind legal and regulatory review.",
    ["policy drafting", "risk analysis", "review preparation"],
    REGULATED_GATES,
    ["financial advice", "custody", "brokerage", "guaranteed outcomes"],
    "financial_services_critical",
    ["FINMA/legal review if applicable", "KYC/AML analysis if applicable"],
    "Financial services activity is regulated and blocked until cleared."
  ),
  domainRule(
    "regulated_activity",
    "Gate regulated financial activity behind formal review and Founder authority.",
    ["regulatory analysis", "readiness report", "blocked-state explanation"],
    REGULATED_GATES,
    ["regulated launch", "customer funds", "unlicensed financial activity"],
    "regulated_activity_critical",
    ["regulatory review", "legal review", "Founder final approval"],
    "Regulated activity cannot activate from local code."
  ),
];

export function getGrowthDomainRule(domain: GrowthDomain): GrowthDomainRule {
  const rule = INFINITE_GROWTH_DOMAIN_REGISTRY.find(
    (item) => item.domain === domain
  );

  if (!rule) {
    throw new Error(`Unknown growth domain: ${domain}`);
  }

  return rule;
}
