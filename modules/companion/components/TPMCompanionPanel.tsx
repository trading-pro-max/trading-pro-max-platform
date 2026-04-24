"use client";

import { useEffect, useMemo, useState } from "react";
import { getAssistantTierSnapshot } from "@/lib/assistant/tiers";
import { getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
import { StateExplanationCard, WhyBlockedHint } from "@/modules/state-explanations/components";
import type { StateExplanationView } from "@/modules/state-explanations/types";
import CompanionMessageList from "./CompanionMessageList";
import type {
  TPMCompanionContextView,
  TPMCompanionMessage,
  TPMCompanionPrompt,
  TPMCompanionStateExplanationMap,
} from "../types";

type CompanionContextPayload = {
  ok: boolean;
  snapshot: TPMCompanionContextView;
};

type StateExplanationPayload = {
  ok: boolean;
  snapshot: {
    explanations: StateExplanationView[];
  };
};

type TPMCompanionPanelProps = {
  diagnosticsHref: string;
  feedbackHref: string;
  locale: string;
  onClose?: () => void;
  route?: string;
  settingsHref: string;
};

const fallbackExplanations: TPMCompanionStateExplanationMap = {
  live_disabled: {
    key: "live_disabled",
    title: "Live disabled",
    shortMessage: "Live disabled",
    reason: "Live execution is disabled by product truth.",
    safeNextStep: "Use paper-only simulation.",
    severity: "blocked",
    resolvedBy: "founder",
    userCopy: "Live disabled. Use paper-only simulation.",
  },
  real_money_blocked: {
    key: "real_money_blocked",
    title: "Real money blocked",
    shortMessage: "Real money blocked",
    reason: "Real-money routing is hard-blocked and no cash route is active.",
    safeNextStep: "Stay in paper mode.",
    severity: "blocked",
    resolvedBy: "founder",
    userCopy: "Real money blocked. Stay in paper mode.",
  },
  broker_unavailable: {
    key: "broker_unavailable",
    title: "Broker unavailable",
    shortMessage: "Broker unavailable",
    reason: "No broker is configured for live routing.",
    safeNextStep: "Keep broker status unconfigured/blocked.",
    severity: "blocked",
    resolvedBy: "external_configuration",
    userCopy: "Broker unavailable. Keep broker status unconfigured.",
  },
};

function explanationMap(explanations: StateExplanationView[]) {
  return explanations.reduce<TPMCompanionStateExplanationMap>(
    (result, explanation) => {
      result[explanation.key] = explanation;
      return result;
    },
    { ...fallbackExplanations }
  );
}

function formatRoute(route?: string) {
  if (!route || route === "/") return "public entry";
  return route.replace(/^\/+/, "");
}

export default function TPMCompanionPanel({
  diagnosticsHref,
  feedbackHref,
  locale,
  onClose,
  route,
  settingsHref,
}: TPMCompanionPanelProps) {
  const [context, setContext] = useState<TPMCompanionContextView | null>(null);
  const [stateExplanations, setStateExplanations] =
    useState<TPMCompanionStateExplanationMap>(fallbackExplanations);
  const [activePromptId, setActivePromptId] = useState("state");
  const [loadState, setLoadState] = useState<"loading" | "ready" | "fallback">("loading");
  const assistantSnapshot = getAssistantTierSnapshot("evaluation");
  const planSnapshot = getPlanEntitlementSnapshot("demo_free");
  const currentPlan = planSnapshot.plans.find(
    (plan) => plan.planId === planSnapshot.currentPlan
  ) ?? planSnapshot.plans[0];

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams({
      language: locale,
      route: route ?? window.location.pathname,
    });

    async function loadCompanionState() {
      try {
        const [contextResponse, explanationResponse] = await Promise.all([
          fetch(`/api/companion/context?${params.toString()}`, {
            cache: "no-store",
            method: "GET",
          }),
          fetch("/api/planet/state-explanations", {
            cache: "no-store",
            method: "GET",
          }),
        ]);

        if (!active) return;

        if (!contextResponse.ok || !explanationResponse.ok) {
          throw new Error("Companion readiness routes unavailable.");
        }

        const contextPayload = (await contextResponse.json()) as CompanionContextPayload;
        const explanationPayload = (await explanationResponse.json()) as StateExplanationPayload;

        setContext(contextPayload.snapshot);
        setStateExplanations(
          explanationMap(explanationPayload.snapshot.explanations)
        );
        setLoadState("ready");
      } catch {
        if (!active) return;
        setLoadState("fallback");
      }
    }

    void loadCompanionState();

    return () => {
      active = false;
    };
  }, [locale, route]);

  const promptResponses = useMemo<Record<string, TPMCompanionMessage>>(
    () => ({
      state: {
        id: "response-state",
        role: "companion",
        state: "fallback",
        title: "Current platform state",
        body:
          context?.productTruth.liveExecution === "blocked"
            ? "This build is paper-safe. Live execution, real money, broker activation, billing, launch, and social publishing remain blocked or inactive."
            : "This surface is using safe readiness context. Check diagnostics before trusting any operational state.",
      },
      blocked: {
        id: "response-blocked",
        role: "companion",
        state: "blocked",
        title: "Why the blocked states are visible",
        body:
          "Blocked states are intentional safety boundaries. They explain what is unavailable, who can resolve it later, and the safe next step without promising an unlock.",
      },
      plan: {
        id: "response-plan",
        role: "companion",
        state: "planned",
        title: "Assistant tier truth",
        body:
          "Demo / Paper Assistant is active for basic guidance. Pro, VIP, and Enterprise assistants remain locked or future-planned until real entitlement support exists.",
      },
      feedback: {
        id: "response-feedback",
        role: "companion",
        state: "ready",
        title: "Feedback draft foundation",
        body:
          "Suggested draft: I was on the workstation, noticed a blocked or fallback state, and expected a clearer safe next step. Route, theme, language, and plan context can be reviewed without secrets.",
      },
      learning: {
        id: "response-learning",
        role: "companion",
        state: "ready",
        title: "Skill-aware learning help",
        body:
          context?.brain.userGuidanceMode === "beginner_safe"
            ? "I will keep explanations plain, paper-first, and focused on what is safe to learn next."
            : "I can summarize context more compactly while keeping all guidance bounded and non-predictive.",
      },
    }),
    [context]
  );

  const prompts: TPMCompanionPrompt[] = [
    { id: "state", label: "State", response: promptResponses.state },
    { id: "blocked", label: "Why blocked", response: promptResponses.blocked },
    { id: "plan", label: "Plan", response: promptResponses.plan },
    { id: "feedback", label: "Feedback", response: promptResponses.feedback },
    { id: "learning", label: "Learning", response: promptResponses.learning },
  ];
  const activePrompt = prompts.find((prompt) => prompt.id === activePromptId) ?? prompts[0];
  const messages: TPMCompanionMessage[] = [
    {
      id: "intro",
      role: "companion",
      state: loadState === "ready" ? "ready" : "fallback",
      title: "Platform-aware, paper-safe guidance",
      body: `I can explain ${formatRoute(
        context?.route ?? route
      )}, plan status, blocked states, diagnostics, and feedback. I cannot execute trades or activate live, money, broker, feed, billing, secrets, or launch.`,
    },
    activePrompt.response,
  ];
  const liveExplanation = stateExplanations.live_disabled;
  const moneyExplanation = stateExplanations.real_money_blocked;
  const brokerExplanation = stateExplanations.broker_unavailable;

  return (
    <aside
      id="tpm-companion-panel"
      className="tpm-companion-panel"
      aria-label="TPM Personal Companion"
    >
      <header className="tpm-companion-head">
        <div>
          <span>TPM Companion</span>
          <h2>{context?.assistantTier.label ?? assistantSnapshot.current.label}</h2>
        </div>
        {onClose ? (
          <button type="button" aria-label="Close TPM Companion" onClick={onClose}>
            Close
          </button>
        ) : null}
      </header>

      <div className="tpm-companion-status-grid">
        <div>
          <span>Plan</span>
          <strong>{currentPlan.planName}</strong>
          <small>{currentPlan.truthState.replaceAll("_", " ")}</small>
        </div>
        <div>
          <span>Context</span>
          <strong>{loadState === "ready" ? "Ready" : "Fallback"}</strong>
          <small>No secrets, no credentials</small>
        </div>
        <div>
          <span>Authority</span>
          <strong>None</strong>
          <small>No execution or activation</small>
        </div>
        <div>
          <span>Brain</span>
          <strong>{context?.brain.contextQuality ?? "bounded"}</strong>
          <small>{context?.preferences.skillLevel ?? "beginner"} guidance</small>
        </div>
      </div>

      <CompanionMessageList
        activePromptId={activePromptId}
        messages={messages}
        onSelectPrompt={setActivePromptId}
        prompts={prompts}
      />

      <div className="tpm-companion-state-strip">
        <WhyBlockedHint explanation={liveExplanation} label="Live" />
        <WhyBlockedHint explanation={moneyExplanation} label="Money" />
        <WhyBlockedHint explanation={brokerExplanation} label="Broker" />
      </div>

      <StateExplanationCard compact explanation={liveExplanation} />

      <div className="tpm-companion-capability-grid">
        <div>
          <span>Available</span>
          {currentPlan.allowedFeatures.slice(0, 3).map((feature) => (
            <small key={feature.label}>{feature.label}</small>
          ))}
        </div>
        <div>
          <span>Locked / later</span>
          {[...currentPlan.lockedFeatures, ...currentPlan.comingLaterFeatures]
            .slice(0, 3)
            .map((feature) => (
              <small key={feature.label}>{feature.label}</small>
            ))}
        </div>
        <div>
          <span>Intent safety</span>
          {(context?.intents ?? [])
            .filter((intent) => intent.demoFree === "allowed")
            .slice(0, 3)
            .map((intent) => (
              <small key={intent.intent}>{intent.label}</small>
            ))}
        </div>
      </div>

      <footer className="tpm-companion-actions">
        <a href={settingsHref}>Settings</a>
        <a href={diagnosticsHref}>Diagnostics</a>
        <a href={feedbackHref}>Feedback</a>
      </footer>
    </aside>
  );
}
