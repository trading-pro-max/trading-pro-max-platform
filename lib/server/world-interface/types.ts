import "server-only";

export type WorldInterfaceChannelCategory =
  | "email"
  | "support"
  | "partners"
  | "media"
  | "legal"
  | "security"
  | "vip"
  | "institutional"
  | "x_twitter"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "facebook"
  | "telegram"
  | "discord"
  | "reddit"
  | "blog_newsroom";

export type WorldInterfaceChannelState =
  | "not_configured"
  | "planned"
  | "read_only_future"
  | "draft_only"
  | "approval_required"
  | "publishing_enabled_later"
  | "disabled"
  | "blocked"
  | "compromised"
  | "rotation_required";

export type WorldInterfaceEventType =
  | "email_received"
  | "support_request"
  | "partner_request"
  | "media_request"
  | "vip_interest"
  | "institutional_interest"
  | "social_comment"
  | "social_dm"
  | "brand_impersonation"
  | "security_alert"
  | "legal_notice"
  | "public_complaint"
  | "content_opportunity"
  | "scam_attempt";

export type WorldInterfaceClassifierOutcome =
  | "classify"
  | "draft_reply"
  | "review_required"
  | "founder_approval_required"
  | "quarantine"
  | "blocked"
  | "archive";

export type WorldInterfaceQuarantineReason =
  | "scam"
  | "phishing"
  | "suspicious_links"
  | "impersonation"
  | "fake_partnership"
  | "threats"
  | "secret_requests";

export type WorldInterfaceChannel = {
  id: string;
  category: WorldInterfaceChannelCategory;
  label: string;
  state: WorldInterfaceChannelState;
  connected: false;
  tokenStored: false;
  sendingEnabled: false;
  publishingEnabled: false;
  readOnlyFuture: boolean;
  draftOnly: boolean;
  owner: string;
  requiredReviews: string[];
  blockedActions: string[];
  safeNextAction: string;
};

export type WorldInterfaceEventInput = {
  eventId: string;
  type: WorldInterfaceEventType;
  sourceChannel: WorldInterfaceChannelCategory;
  summary: string;
  containsLink?: boolean;
  asksForSecrets?: boolean;
  claimsPartnership?: boolean;
  impersonationRisk?: boolean;
  threatRisk?: boolean;
  legalRisk?: boolean;
  securityRisk?: boolean;
};

export type WorldInterfaceClassification = {
  eventId: string;
  type: WorldInterfaceEventType;
  sourceChannel: WorldInterfaceChannelCategory;
  outcome: WorldInterfaceClassifierOutcome;
  reason: string;
  quarantineReasons: WorldInterfaceQuarantineReason[];
  requiredReviews: string[];
  founderApprovalRequired: boolean;
  safeDraftType:
    | "auto_acknowledgement_draft"
    | "support_draft"
    | "partnership_draft"
    | "media_draft"
    | "legal_review_required"
    | "founder_approval_required"
    | "blocked_reply"
    | "none";
  externalActionAllowed: false;
  createdAt: string;
};

export type WorldInterfaceSnapshot = {
  checkedAt: string;
  mode: "world_interface_readiness";
  status: "ready";
  coreRule: string;
  channelStates: WorldInterfaceChannelState[];
  eventTypes: WorldInterfaceEventType[];
  classifierOutcomes: WorldInterfaceClassifierOutcome[];
  channels: WorldInterfaceChannel[];
  channelSummary: {
    total: number;
    connected: 0;
    tokenStored: 0;
    sendingEnabled: 0;
    publishingEnabled: 0;
    draftOnly: number;
    approvalRequired: number;
    blocked: number;
  };
  quarantine: {
    status: "ready";
    reasons: WorldInterfaceQuarantineReason[];
    evidenceLocker: "safe_metadata_only_no_tokens";
    secretRequestsQuarantined: true;
    suspiciousLinksQuarantined: true;
    fakePartnershipsQuarantined: true;
  };
  diplomaticResponse: {
    status: "draft_only";
    responseTypes: WorldInterfaceClassification["safeDraftType"][];
    sendActive: false;
    publishActive: false;
    externalAutomationActive: false;
    founderApprovalRequiredForExternalSend: true;
  };
  founderCommandReadiness: {
    unifiedInboxReadiness: "readiness_only";
    channelHealth: "status_only";
    quarantineReadiness: "ready";
    draftReplies: "draft_only";
    legalGuardianQueues: "review_required";
    vipInstitutionalInterest: "classification_only";
    partnershipOpportunities: "founder_approval_required";
    brandProtectionAlerts: "quarantine_ready";
  };
  sampleClassifications: {
    supportRequest: WorldInterfaceClassification;
    partnerRequest: WorldInterfaceClassification;
    mediaRequest: WorldInterfaceClassification;
    vipInterest: WorldInterfaceClassification;
    brandImpersonation: WorldInterfaceClassification;
    securityAlert: WorldInterfaceClassification;
    legalNotice: WorldInterfaceClassification;
    scamAttempt: WorldInterfaceClassification;
    secretRequest: WorldInterfaceClassification;
  };
  integrations: {
    secretsAuthority: "presence_only_no_values";
    securitySovereignty: "quarantine_and_incident_ready";
    trustGovernor: "review_required_for_external_claims";
    guardianLegal: "review_required_for_sensitive_replies";
    founderCommand: "private_readiness_only";
  };
  truth: {
    realEmailConnected: false;
    supportInboxConnected: false;
    socialAccountsConnected: false;
    socialTokensStored: false;
    emailsSent: false;
    dmsSent: false;
    publishingActive: false;
    externalAutomationActive: false;
    spamAutomationActive: false;
    fakeFollowersIncluded: false;
    fakeViewsIncluded: false;
    fakeMetricsIncluded: false;
    secretsExposed: false;
    tokensExposed: false;
    privateDataStored: false;
    productionActivated: false;
    billingActivated: false;
    brokerFeedActivated: false;
    liveExecutionActivated: false;
  };
};

export type FounderWorldInterfaceReadinessSnapshot = {
  checkedAt: string;
  mode: "founder_world_interface_readiness";
  status: "ready";
  summary: WorldInterfaceSnapshot["channelSummary"];
  founderCommandReadiness: WorldInterfaceSnapshot["founderCommandReadiness"];
  quarantine: WorldInterfaceSnapshot["quarantine"];
  diplomaticResponse: WorldInterfaceSnapshot["diplomaticResponse"];
  sampleOutcomes: Record<keyof WorldInterfaceSnapshot["sampleClassifications"], WorldInterfaceClassifierOutcome>;
  truth: WorldInterfaceSnapshot["truth"] & {
    founderCommandPublic: false;
  };
};
