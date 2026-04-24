import "server-only";

import type { FounderBriefing, MinistryReport, PlanetStateSummary } from "./types";

const checkedAtFallback = "2026-04-24T00:00:00.000Z";

export function getPlanetEarthStateSummary(
  checkedAt = new Date().toISOString()
): PlanetStateSummary {
  return {
    checkedAt,
    model: "tpm_planet_earth_os",
    founderCommand: {
      privateOwnerOnly: true,
      publicRouteExposed: false,
      desktopAppShipped: false,
      mobileAppShipped: false,
    },
    continents: [
      {
        id: "trading",
        name: "Trading Continent",
        purpose: "Market reading and paper execution rehearsal.",
        ownerRole: "Markets & Trading Ministry",
        readiness: "active",
        automationLevel: "review",
        riskLevel: "high",
        citizenClasses: ["free_demo", "pro", "vip", "enterprise"],
        states: ["Market State", "Execution State", "Risk State", "Chart City", "Ticket City"],
        truthRules: ["live execution blocked", "real money blocked", "paper route only"],
      },
      {
        id: "intelligence",
        name: "Intelligence Continent",
        purpose: "Bounded AI/IQ, Companion, Coach, and strategy-review foundations.",
        ownerRole: "AI / IQ / Brain Ministry",
        readiness: "foundation_ready",
        automationLevel: "review",
        riskLevel: "medium",
        citizenClasses: ["free_demo", "pro", "vip", "enterprise"],
        states: ["Brain State", "Companion State", "Coach State", "AI/IQ Center"],
        truthRules: ["no prediction certainty", "no win-rate claims"],
      },
      {
        id: "protection",
        name: "Protection Continent",
        purpose: "Guardian, abuse defense, safety boundaries, and incident response.",
        ownerRole: "Guardian & Defense Ministry",
        readiness: "foundation_ready",
        automationLevel: "review",
        riskLevel: "high",
        citizenClasses: ["free_demo", "pro", "vip", "enterprise"],
        states: ["Guardian State", "Abuse Defense State", "Safety Boundaries State"],
        truthRules: ["privacy-conscious protection", "no invasive surveillance"],
      },
      {
        id: "law_rights",
        name: "Law & Rights Continent",
        purpose: "Legal Counsel, claims, rights, brand, and Islamic account wording.",
        ownerRole: "Justice / Legal / Compliance Ministry",
        readiness: "foundation_ready",
        automationLevel: "founder_approval",
        riskLevel: "high",
        citizenClasses: ["free_demo", "pro", "vip", "enterprise"],
        states: ["Legal State", "Claims Court", "Rights & Brand Office"],
        truthRules: ["no legal certification claim", "no Sharia certification claim"],
      },
      {
        id: "founder_command_capital",
        name: "Founder Command Capital",
        purpose: "Private owner command, Founder approval, and planet overview.",
        ownerRole: "Founder King / Sovereign Creator",
        readiness: "foundation_ready",
        automationLevel: "founder_approval",
        riskLevel: "critical",
        citizenClasses: [],
        states: ["Founder King Command Room", "Founder Approval Center"],
        truthRules: ["not public", "no fake metrics", "critical blocks remain blocked"],
      },
    ],
    truth: {
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      brokerFeedActivation: "not_faked",
      billing: "inactive",
      publicLaunch: "not_claimed",
      socialPublishing: "inactive",
      secrets: "not_exposed",
    },
  };
}

export function getFounderBriefing(
  checkedAt = checkedAtFallback
): FounderBriefing {
  return {
    checkedAt,
    planetStatus: "planned",
    topRisks: [
      "Do not claim public launch.",
      "Do not activate billing, broker/feed, live execution, or real money.",
      "Keep Founder Command private until owner-only app auth exists.",
    ],
    operatingNormally: ["Trading Continent", "Brand/Product docs", "Safety contracts"],
    blockedOrDegraded: ["Production deployment", "Live integrations", "Billing", "Public launch"],
    guardianAlerts: ["No invasive surveillance; protect auth and APIs."],
    legalWarnings: ["No profit, win-rate, risk-free, legal, or Sharia certification claims."],
    pendingApprovals: ["Future media, VIP, billing, launch, and broker/feed claims."],
    recommendedDecisions: ["Continue architecture and internal product refinement only."],
    whatNotToDoToday: [
      "Do not launch.",
      "Do not expose secrets.",
      "Do not publish media externally.",
      "Do not turn planned systems into active claims.",
    ],
  };
}

export function getMinistryReportContractExample(
  checkedAt = checkedAtFallback
): MinistryReport {
  return {
    ministryId: "guardian_defense",
    ministryName: "Guardian & Defense Ministry",
    leaderTitle: "Guardian Commander",
    status: "planned",
    confidence: "medium",
    riskLevel: "high",
    summary: "Guardian reporting model is defined without invasive surveillance.",
    keyMetrics: ["no_secret_exposure", "live_execution_blocked"],
    activeWork: ["threat model", "operator playbook"],
    blockers: ["owner command app not shipped"],
    incidents: [],
    pendingApprovals: [],
    guardianFlags: ["protect assistant misuse", "protect feedback spam"],
    legalFlags: ["avoid surveillance claims"],
    engineeringFlags: ["no public command route"],
    citizenImpact: "Improves safety semantics without adding public friction.",
    revenueImpactLater: "No revenue claim; supports future trust readiness only.",
    nextActions: ["Keep protection docs aligned with implementation."],
    founderDecisionNeeded: false,
    lastUpdated: checkedAt,
    reportCadence: "weekly",
  };
}
