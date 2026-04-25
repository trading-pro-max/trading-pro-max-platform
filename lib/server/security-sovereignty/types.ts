import "server-only";

export type SecuritySovereigntyAuthorityKey =
  | "public_security"
  | "cyber_defense"
  | "red_team_command"
  | "blue_team_defense"
  | "purple_team_coordination"
  | "cyber_intelligence"
  | "digital_border_customs"
  | "secrets_protection"
  | "identity_access"
  | "incident_response"
  | "forensics_evidence"
  | "security_hardening"
  | "trust_safety_court";

export type SecuritySovereigntyDecisionLevel =
  | "allowed_with_logging"
  | "review_required"
  | "founder_approval_required"
  | "quarantined"
  | "blocked"
  | "incident_required";

export type SecuritySovereigntyAuthority = {
  key: SecuritySovereigntyAuthorityKey;
  label: string;
  mandate: string;
  owns: string[];
  requiredPartners: string[];
  forbiddenActions: string[];
};

export type SecuritySovereigntyActionInput = {
  action: string;
  targetOwnership: "owned_local_system" | "owned_staging_system" | "third_party" | "unknown";
  scope:
    | "defensive_review"
    | "red_team"
    | "blue_team"
    | "purple_team"
    | "incident_response"
    | "forensics"
    | "secrets"
    | "public_action";
  touchesSecrets?: boolean;
  initiatesLaunch?: boolean;
  enablesProduction?: boolean;
  enablesBilling?: boolean;
  enablesLiveExecution?: boolean;
  enablesRealMoney?: boolean;
  activatesBrokerFeed?: boolean;
  publishesSocial?: boolean;
  exposesFounderCommandPublicly?: boolean;
  usesMalwareOrExploit?: boolean;
  attemptsCredentialTheft?: boolean;
  externalAttackAutomation?: boolean;
  illegalAction?: boolean;
};

export type SecuritySovereigntyDecision = {
  checkedAt: string;
  decisionLevel: SecuritySovereigntyDecisionLevel;
  action: string;
  reason: string;
  requiredReviews: string[];
  loggingRequired: boolean;
  founderApprovalRequired: boolean;
  safeAlternative: string;
};

export type SecurityTeamReadiness = {
  status: "ready" | "readiness_only" | "blocked";
  mission: string;
  allowedScope: string[];
  forbiddenScope: string[];
};

export type SecuritySovereigntySnapshot = {
  checkedAt: string;
  mode: "public_security_cyber_sovereignty_ministry";
  status: "ready";
  ministryName: "Ministry of Public Security & Cyber Sovereignty";
  coreLaw: string;
  authorities: SecuritySovereigntyAuthority[];
  decisionLevels: SecuritySovereigntyDecisionLevel[];
  redTeam: SecurityTeamReadiness;
  blueTeam: SecurityTeamReadiness;
  purpleTeam: SecurityTeamReadiness;
  incidentResponse: SecurityTeamReadiness;
  forensicsEvidence: SecurityTeamReadiness;
  hardening: SecurityTeamReadiness;
  evidenceLedger: {
    status: "defined_no_secret_payloads";
    allowedEvidence: string[];
    forbiddenEvidence: string[];
    retentionTruth: "policy_defined_not_surveillance";
  };
  integrations: {
    guardianLegal: "connected";
    trustGovernor: "connected";
    productTruth: "connected";
    founderCommand: "private_readiness_only";
    codexTaskCompiler: "draft_only_guarded";
    worldInterfaceReadiness: "readiness_only_not_publicly_connected";
    secretsAuthority: "presence_and_policy_only_no_secret_values";
  };
  integrationEvidence: {
    guardianLegalBlocksSecretExposure: boolean;
    trustGovernorBlocksPrivateDataExposure: boolean;
    productTruthBlocksLiveBillingAndLaunch: boolean;
  };
  founderCommandReadiness: {
    cyberSovereigntyStatus: "ready";
    redBluePurpleReadiness: "ready";
    incidentReadiness: "ready";
    evidenceReadiness: "ready";
    hardeningReadiness: "ready";
    publicExposure: false;
    actionExecutionActive: false;
  };
  decisionSamples: {
    thirdPartyRedTeam: SecuritySovereigntyDecision;
    localDefensiveReview: SecuritySovereigntyDecision;
    secretExposureAttempt: SecuritySovereigntyDecision;
    launchAttempt: SecuritySovereigntyDecision;
    billingAttempt: SecuritySovereigntyDecision;
    socialPublishingAttempt: SecuritySovereigntyDecision;
    liveExecutionAttempt: SecuritySovereigntyDecision;
    realMoneyAttempt: SecuritySovereigntyDecision;
    brokerFeedAttempt: SecuritySovereigntyDecision;
    malwareExploitAttempt: SecuritySovereigntyDecision;
    founderCommandPublicAttempt: SecuritySovereigntyDecision;
  };
  productTruth: {
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    billing: "inactive";
    brokerFeedActivation: "blocked";
    publicLaunch: "inactive";
    socialPublishing: "inactive";
    secrets: "not_exposed";
    founderCommand: "owner_only_private";
  };
  truth: {
    thirdPartyTargetingAllowed: false;
    malwareAllowed: false;
    credentialTheftAllowed: false;
    externalAttackAutomationAllowed: false;
    secretsExposed: false;
    productionSecretsTouched: false;
    liveExecutionActivated: false;
    realMoneyActivated: false;
    billingActivated: false;
    brokerFeedActivated: false;
    publicLaunchActivated: false;
    socialPublishingActive: false;
    founderCommandPublic: false;
    authWeakened: false;
  };
};
