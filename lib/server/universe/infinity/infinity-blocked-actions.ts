import "server-only";

import type { InfinityAutomationItem } from "./types";

export function getInfinityBlockedActions(): InfinityAutomationItem[] {
  return [
    {
      id: "public_launch",
      title: "Public launch blocked",
      scope: "blocked",
      reason: "Public launch is outside private internal readiness.",
      productTruthImpact: "Public launch remains blocked.",
    },
    {
      id: "billing",
      title: "Billing blocked",
      scope: "blocked",
      reason: "Billing touches money and must stop for Ahmad.",
      productTruthImpact: "Billing remains inactive.",
    },
    {
      id: "payments",
      title: "Payments blocked",
      scope: "blocked",
      reason: "Payment activation touches money and external accounts.",
      productTruthImpact: "Payments remain inactive.",
    },
    {
      id: "receiving_money",
      title: "Receiving money blocked",
      scope: "blocked",
      reason: "Receiving money is a money gate.",
      productTruthImpact: "Receiving money remains inactive.",
    },
    {
      id: "real_money",
      title: "Real money blocked",
      scope: "blocked",
      reason: "Real-money work is not private internal readiness.",
      productTruthImpact: "Real money remains disabled.",
    },
    {
      id: "broker_execution",
      title: "Broker execution blocked",
      scope: "blocked",
      reason: "Broker execution is a money and external-account boundary.",
      productTruthImpact: "Broker execution remains disabled/not connected.",
    },
    {
      id: "legal_claims",
      title: "Legal claims blocked",
      scope: "blocked",
      reason: "Legal wording, approvals, contracts, and regulatory claims stop for Ahmad.",
      productTruthImpact: "Legal review remains pending.",
    },
    {
      id: "finma_claims",
      title: "FINMA claims blocked",
      scope: "blocked",
      reason: "FINMA or licensed/regulated claims require verified legal evidence.",
      productTruthImpact: "No legal approval claim is made.",
    },
    {
      id: "external_accounts",
      title: "External accounts blocked",
      scope: "blocked",
      reason: "External accounts require Ahmad approval and are not part of Infinity preparation.",
      productTruthImpact: "No public, money, broker, legal, or external automation.",
    },
    {
      id: "customer_onboarding",
      title: "Customer onboarding blocked",
      scope: "blocked",
      reason: "Customer-facing operations are public/product launch work.",
      productTruthImpact: "Private Ahmad-only boundary remains preserved.",
    },
    {
      id: "public_universe",
      title: "Public Al-Kawn blocked",
      scope: "blocked",
      reason: "Al-Kawn remains Ahmad's private electronic self.",
      productTruthImpact: "Public Al-Kawn remains blocked.",
    },
    {
      id: "public_alkon",
      title: "Public ALKON blocked",
      scope: "blocked",
      reason: "ALKON remains a private background guardian.",
      productTruthImpact: "Public ALKON remains blocked.",
    },
    {
      id: "secrets_movement",
      title: "Secrets movement blocked",
      scope: "blocked",
      reason: "Secrets must not enter Git, reports, bundles, public assets, or external services.",
      productTruthImpact: "Secret safety remains enforced.",
    },
  ];
}
