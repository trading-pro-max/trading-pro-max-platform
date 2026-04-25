import "server-only";

import { evaluateGuardianLegalRules } from "@/lib/server/guardian-legal";
import { getProductTruthSnapshot } from "@/lib/server/product";
import { getTrustGovernorSnapshot } from "@/lib/server/trust-governor";
import type {
  SecuritySovereigntyActionInput,
  SecuritySovereigntyAuthority,
  SecuritySovereigntyDecision,
  SecuritySovereigntyDecisionLevel,
  SecuritySovereigntySnapshot,
  SecurityTeamReadiness,
} from "./types";

const forbiddenDangerousScope = [
  "third-party targeting",
  "malware or exploit deployment",
  "credential theft",
  "external attack automation",
  "production secret changes",
  "public Founder Command exposure",
  "launch activation",
  "billing activation",
  "broker/feed activation",
  "live execution",
  "real-money routing",
  "social publishing",
];

const authorities: SecuritySovereigntyAuthority[] = [
  {
    key: "public_security",
    label: "Public Security Authority",
    mandate: "Protect public surfaces, public APIs, auth boundaries, and safety posture.",
    owns: ["public routes", "public API security posture", "community safety posture"],
    requiredPartners: ["Guardian", "Legal", "Product Truth"],
    forbiddenActions: forbiddenDangerousScope,
  },
  {
    key: "cyber_defense",
    label: "Cyber Defense Authority",
    mandate: "Own defensive monitoring readiness, zero-trust policy, and hardening strategy.",
    owns: ["zero trust", "defense readiness", "security posture reviews"],
    requiredPartners: ["Ops", "Security Hardening", "Incident Response"],
    forbiddenActions: forbiddenDangerousScope,
  },
  {
    key: "red_team_command",
    label: "Offensive Security / Red Team Command",
    mandate: "Run safe adversarial thinking against owned local systems only.",
    owns: ["local threat modeling", "permissioned tests", "abuse-case review"],
    requiredPartners: ["Legal", "Guardian", "Founder approval"],
    forbiddenActions: [
      "third-party targeting",
      "malware",
      "credential theft",
      "illegal actions",
      "external attack automation",
    ],
  },
  {
    key: "blue_team_defense",
    label: "Blue Team Defense",
    mandate: "Defend identity, session, route, secret, and platform boundaries.",
    owns: ["defensive controls", "containment playbooks", "security reviews"],
    requiredPartners: ["Ops", "Incident Response", "Forensics"],
    forbiddenActions: forbiddenDangerousScope,
  },
  {
    key: "purple_team_coordination",
    label: "Purple Team Coordination",
    mandate: "Turn safe red-team findings into blue-team controls and Codex-ready repairs.",
    owns: ["finding triage", "control mapping", "safe task drafting"],
    requiredPartners: ["Red Team", "Blue Team", "Codex Task Compiler"],
    forbiddenActions: forbiddenDangerousScope,
  },
  {
    key: "cyber_intelligence",
    label: "Cyber Intelligence Authority",
    mandate: "Track platform threat classes without surveillance or private data capture.",
    owns: ["threat taxonomy", "abuse patterns", "security briefings"],
    requiredPartners: ["Trust Governor", "Guardian", "Legal"],
    forbiddenActions: ["private surveillance", "raw private data capture", ...forbiddenDangerousScope],
  },
  {
    key: "digital_border_customs",
    label: "Digital Border & Customs Authority",
    mandate: "Guard external integrations, uploads, tokens, and network boundaries.",
    owns: ["external boundary review", "integration ingress/egress", "token handling policy"],
    requiredPartners: ["Ops", "Secrets Protection", "Legal"],
    forbiddenActions: forbiddenDangerousScope,
  },
  {
    key: "secrets_protection",
    label: "Secrets Protection Authority",
    mandate: "Ensure secrets are never exposed, persisted unsafely, logged, or sent to Codex.",
    owns: ["secret policy", "redaction", "presence-only reporting"],
    requiredPartners: ["Security", "Ops", "Founder Command"],
    forbiddenActions: ["secret value exposure", "production secret mutation", ...forbiddenDangerousScope],
  },
  {
    key: "identity_access",
    label: "Identity & Access Authority",
    mandate: "Protect auth, owner-only command boundaries, sessions, and least privilege.",
    owns: ["auth policy", "session security", "owner-only access"],
    requiredPartners: ["Security", "Founder Command", "Ops"],
    forbiddenActions: ["auth bypass", "public command exposure", ...forbiddenDangerousScope],
  },
  {
    key: "incident_response",
    label: "Incident Response Authority",
    mandate: "Define detection, containment, eradication, recovery, and post-incident review.",
    owns: ["incident doctrine", "quarantine decisions", "recovery coordination"],
    requiredPartners: ["Forensics", "Ops", "Founder Command", "Legal"],
    forbiddenActions: ["quietly hide incidents", "destroy evidence", ...forbiddenDangerousScope],
  },
  {
    key: "forensics_evidence",
    label: "Forensics & Evidence Authority",
    mandate: "Preserve non-secret evidence summaries, chain-of-custody, and review artifacts.",
    owns: ["evidence ledger", "chain-of-custody model", "forensics summaries"],
    requiredPartners: ["Legal", "Incident Response", "Secrets Protection"],
    forbiddenActions: ["secret payload storage", "private sensitive data hoarding", ...forbiddenDangerousScope],
  },
  {
    key: "security_hardening",
    label: "Security Hardening Authority",
    mandate: "Own hardening checklist, route protection, dependency posture, and safe defaults.",
    owns: ["hardening backlog", "route protections", "safe configuration"],
    requiredPartners: ["Ops", "Quality", "Codex Task Compiler"],
    forbiddenActions: forbiddenDangerousScope,
  },
  {
    key: "trust_safety_court",
    label: "Trust & Safety Court",
    mandate: "Make high-risk trust and safety decisions with Guardian, Legal, and Founder review.",
    owns: ["high-risk adjudication", "abuse decisions", "appeal/readiness policy"],
    requiredPartners: ["Guardian", "Legal", "Founder Command"],
    forbiddenActions: ["unreviewed high-risk action", ...forbiddenDangerousScope],
  },
];

const decisionLevels: SecuritySovereigntyDecisionLevel[] = [
  "allowed_with_logging",
  "review_required",
  "founder_approval_required",
  "quarantined",
  "blocked",
  "incident_required",
];

const redTeam: SecurityTeamReadiness = {
  status: "readiness_only",
  mission: "Adversarial review of owned local systems only, scoped to threat modeling and safe permissioned checks.",
  allowedScope: [
    "owned local system threat modeling",
    "local route/auth review",
    "safe abuse-case checklist",
    "Codex-ready defensive task drafting",
  ],
  forbiddenScope: [
    "third-party targeting",
    "malware",
    "credential theft",
    "illegal actions",
    "external attack automation",
  ],
};

const blueTeam: SecurityTeamReadiness = {
  status: "ready",
  mission: "Defend auth, routes, secrets, sessions, command boundaries, and platform truth.",
  allowedScope: ["hardening", "incident containment", "route review", "secret redaction review"],
  forbiddenScope: forbiddenDangerousScope,
};

const purpleTeam: SecurityTeamReadiness = {
  status: "ready",
  mission: "Convert safe red-team findings into blue-team controls, regression tests, and Codex drafts.",
  allowedScope: ["finding triage", "defensive control mapping", "test/backlog creation"],
  forbiddenScope: forbiddenDangerousScope,
};

const incidentResponse: SecurityTeamReadiness = {
  status: "ready",
  mission: "Classify, contain, recover, and report incidents without hiding evidence or exposing secrets.",
  allowedScope: ["detect", "triage", "contain", "recover", "post-incident review"],
  forbiddenScope: ["destroy evidence", "hide incident truth", ...forbiddenDangerousScope],
};

const forensicsEvidence: SecurityTeamReadiness = {
  status: "readiness_only",
  mission: "Store safe evidence summaries and chain-of-custody metadata only.",
  allowedScope: ["timestamp", "event category", "affected area", "hash/reference", "review state"],
  forbiddenScope: ["secret values", "passwords", "tokens", "payment data", "broker credentials", "raw private sensitive data"],
};

const hardening: SecurityTeamReadiness = {
  status: "ready",
  mission: "Harden auth, routes, input bounds, logging policy, dependency posture, and deployment gates.",
  allowedScope: ["zero-trust checklist", "route hardening", "secret scanning policy", "safe defaults"],
  forbiddenScope: ["weaken auth", "disable guards", ...forbiddenDangerousScope],
};

function blockedDecision(input: SecuritySovereigntyActionInput, checkedAt: string, reason: string): SecuritySovereigntyDecision {
  return {
    checkedAt,
    decisionLevel: "blocked",
    action: input.action,
    reason,
    requiredReviews: ["Public Security", "Guardian", "Legal"],
    loggingRequired: true,
    founderApprovalRequired: false,
    safeAlternative:
      "Convert the request into defensive readiness, documentation, or a scoped local-only review task.",
  };
}

function actionTextContainsForbiddenOffense(action: string) {
  return /\b(malware|exploit deployment|credential theft|steal credentials|phishing kit|token exfiltration|external attack automation|illegal access)\b/i.test(
    action
  );
}

export function evaluateSecuritySovereigntyAction(
  input: SecuritySovereigntyActionInput,
  checkedAt = new Date().toISOString()
): SecuritySovereigntyDecision {
  if (input.targetOwnership === "third_party" || input.targetOwnership === "unknown") {
    return blockedDecision(input, checkedAt, "Only owned local systems can be reviewed. Third-party or unknown targets are blocked.");
  }

  if (input.scope === "red_team" && input.targetOwnership !== "owned_local_system") {
    return blockedDecision(input, checkedAt, "Red-team scope is limited to owned local systems in this pass.");
  }

  if (
    input.usesMalwareOrExploit ||
    input.attemptsCredentialTheft ||
    input.externalAttackAutomation ||
    input.illegalAction ||
    actionTextContainsForbiddenOffense(input.action)
  ) {
    return blockedDecision(
      input,
      checkedAt,
      "Malware, exploit deployment, credential theft, illegal action, and external attack automation are blocked."
    );
  }

  if (
    input.touchesSecrets ||
    input.initiatesLaunch ||
    input.enablesProduction ||
    input.enablesBilling ||
    input.enablesLiveExecution ||
    input.enablesRealMoney ||
    input.activatesBrokerFeed ||
    input.publishesSocial ||
    input.exposesFounderCommandPublicly
  ) {
    return blockedDecision(input, checkedAt, "Dangerous activation, secret exposure, publishing, or public command exposure is blocked.");
  }

  if (input.scope === "incident_response") {
    return {
      checkedAt,
      decisionLevel: "incident_required",
      action: input.action,
      reason: "Potential incident must enter the incident response doctrine with evidence preservation.",
      requiredReviews: ["Incident Response", "Forensics", "Founder Command"],
      loggingRequired: true,
      founderApprovalRequired: true,
      safeAlternative: "Open an incident readiness record and preserve non-secret evidence summaries.",
    };
  }

  if (input.scope === "red_team" || input.scope === "purple_team") {
    return {
      checkedAt,
      decisionLevel: "founder_approval_required",
      action: input.action,
      reason: "Adversarial or coordinated security review requires explicit Founder approval even on owned local systems.",
      requiredReviews: ["Public Security", "Guardian", "Legal", "Founder"],
      loggingRequired: true,
      founderApprovalRequired: true,
      safeAlternative: "Draft a local-only review plan with scope, boundaries, and validation before execution.",
    };
  }

  return {
    checkedAt,
    decisionLevel: "allowed_with_logging",
    action: input.action,
    reason: "Defensive owned-system review is allowed when logged and bounded.",
    requiredReviews: ["Public Security"],
    loggingRequired: true,
    founderApprovalRequired: false,
    safeAlternative: "Proceed as a defensive readiness task with no secrets, no external targeting, and no activation.",
  };
}

export function getSecuritySovereigntySnapshot(
  checkedAt = new Date().toISOString()
): SecuritySovereigntySnapshot {
  const productTruth = getProductTruthSnapshot(checkedAt);
  const trustGovernor = getTrustGovernorSnapshot(checkedAt);
  const guardianLegal = evaluateGuardianLegalRules({
    text: "public launch active billing active live trading active",
    category: "product_claim",
  });

  return {
    checkedAt,
    mode: "public_security_cyber_sovereignty_ministry",
    status: "ready",
    ministryName: "Ministry of Public Security & Cyber Sovereignty",
    coreLaw:
      "No sensitive system is trusted by default. Every sensitive action requires verification, permission, logging, and review.",
    authorities,
    decisionLevels,
    redTeam,
    blueTeam,
    purpleTeam,
    incidentResponse,
    forensicsEvidence,
    hardening,
    evidenceLedger: {
      status: "defined_no_secret_payloads",
      allowedEvidence: [
        "event id",
        "timestamp",
        "affected area",
        "safe summary",
        "review status",
        "non-secret artifact hash/reference",
      ],
      forbiddenEvidence: [
        "secret values",
        "passwords",
        "API keys",
        "broker credentials",
        "payment data",
        "social tokens",
        "raw private sensitive data",
      ],
      retentionTruth: "policy_defined_not_surveillance",
    },
    integrations: {
      guardianLegal: "connected",
      trustGovernor: "connected",
      productTruth: "connected",
      founderCommand: "private_readiness_only",
      codexTaskCompiler: "draft_only_guarded",
      worldInterfaceReadiness: "readiness_only_not_publicly_connected",
      secretsAuthority: "presence_and_policy_only_no_secret_values",
    },
    integrationEvidence: {
      guardianLegalBlocksSecretExposure:
        guardianLegal.privacyTruth.secretExposure === false,
      trustGovernorBlocksPrivateDataExposure:
        trustGovernor.truth.privateDataExposureAllowed === false,
      productTruthBlocksLiveBillingAndLaunch:
        productTruth.summary.liveExecution === "blocked" &&
        productTruth.summary.billing === "inactive" &&
        productTruth.summary.publicLaunch === "inactive",
    },
    founderCommandReadiness: {
      cyberSovereigntyStatus: "ready",
      redBluePurpleReadiness: "ready",
      incidentReadiness: "ready",
      evidenceReadiness: "ready",
      hardeningReadiness: "ready",
      publicExposure: false,
      actionExecutionActive: false,
    },
    decisionSamples: {
      thirdPartyRedTeam: evaluateSecuritySovereigntyAction(
        {
          action: "run red-team test against external exchange",
          targetOwnership: "third_party",
          scope: "red_team",
        },
        checkedAt
      ),
      localDefensiveReview: evaluateSecuritySovereigntyAction(
        {
          action: "review local auth route hardening",
          targetOwnership: "owned_local_system",
          scope: "defensive_review",
        },
        checkedAt
      ),
      secretExposureAttempt: evaluateSecuritySovereigntyAction(
        {
          action: "print production API key for debugging",
          targetOwnership: "owned_local_system",
          scope: "secrets",
          touchesSecrets: true,
        },
        checkedAt
      ),
      launchAttempt: evaluateSecuritySovereigntyAction(
        {
          action: "activate public launch",
          targetOwnership: "owned_local_system",
          scope: "public_action",
          initiatesLaunch: true,
        },
        checkedAt
      ),
      billingAttempt: evaluateSecuritySovereigntyAction(
        {
          action: "activate billing provider",
          targetOwnership: "owned_local_system",
          scope: "public_action",
          enablesBilling: true,
        },
        checkedAt
      ),
      socialPublishingAttempt: evaluateSecuritySovereigntyAction(
        {
          action: "connect and publish social launch post",
          targetOwnership: "owned_local_system",
          scope: "public_action",
          publishesSocial: true,
        },
        checkedAt
      ),
      liveExecutionAttempt: evaluateSecuritySovereigntyAction(
        {
          action: "enable live execution",
          targetOwnership: "owned_local_system",
          scope: "public_action",
          enablesLiveExecution: true,
        },
        checkedAt
      ),
      realMoneyAttempt: evaluateSecuritySovereigntyAction(
        {
          action: "enable real-money routing",
          targetOwnership: "owned_local_system",
          scope: "public_action",
          enablesRealMoney: true,
        },
        checkedAt
      ),
      brokerFeedAttempt: evaluateSecuritySovereigntyAction(
        {
          action: "activate broker/feed integration",
          targetOwnership: "owned_local_system",
          scope: "public_action",
          activatesBrokerFeed: true,
        },
        checkedAt
      ),
      malwareExploitAttempt: evaluateSecuritySovereigntyAction(
        {
          action: "deploy exploit payload against target",
          targetOwnership: "owned_local_system",
          scope: "red_team",
          usesMalwareOrExploit: true,
        },
        checkedAt
      ),
      founderCommandPublicAttempt: evaluateSecuritySovereigntyAction(
        {
          action: "expose Founder Command to public navigation",
          targetOwnership: "owned_local_system",
          scope: "public_action",
          exposesFounderCommandPublicly: true,
        },
        checkedAt
      ),
    },
    productTruth: {
      liveExecution: productTruth.summary.liveExecution,
      realMoneyRouting: productTruth.summary.realMoneyRouting,
      billing: productTruth.summary.billing,
      brokerFeedActivation: "blocked",
      publicLaunch: productTruth.summary.publicLaunch,
      socialPublishing: productTruth.summary.socialPublishing,
      secrets: productTruth.summary.secrets,
      founderCommand: productTruth.summary.founderCommand,
    },
    truth: {
      thirdPartyTargetingAllowed: false,
      malwareAllowed: false,
      credentialTheftAllowed: false,
      externalAttackAutomationAllowed: false,
      secretsExposed: false,
      productionSecretsTouched: false,
      liveExecutionActivated: false,
      realMoneyActivated: false,
      billingActivated: false,
      brokerFeedActivated: false,
      publicLaunchActivated: false,
      socialPublishingActive: false,
      founderCommandPublic: false,
      authWeakened: false,
    },
  };
}
