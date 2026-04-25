"use client";

import { useEffect, useMemo, useState } from "react";
import { getAssistantTierSnapshot } from "@/lib/assistant/tiers";
import { getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
import { StateExplanationCard, WhyBlockedHint } from "@/modules/state-explanations/components";
import type { StateExplanationView } from "@/modules/state-explanations/types";
import CompanionInput from "./CompanionInput";
import CompanionMessageList from "./CompanionMessageList";
import type {
  TPMCompanionContextView,
  TPMCompanionMessage,
  TPMCompanionPrompt,
  TPMCompanionResponseTemplate,
  TPMCompanionStateExplanationMap,
} from "../types";

type CompanionContextPayload = {
  ok: boolean;
  snapshot: TPMCompanionContextView;
  responses?: TPMCompanionResponseTemplate[];
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

function isBlockedCompanionRequest(value: string) {
  const normalized = value.toLowerCase();
  return [
    "execute trade",
    "place trade",
    "open order",
    "enable live",
    "real money",
    "activate broker",
    "connect broker",
    "activate feed",
    "change secrets",
    "bypass auth",
    "guarantee profit",
    "win rate",
    "activate vip",
    "fake billing",
    "launch publicly",
  ].some((phrase) => normalized.includes(phrase));
}

function inferCompanionIntent(value: string): string {
  const normalized = value.toLowerCase();
  if (normalized.includes("blocked") || normalized.includes("why")) {
    return "explain_blocked_state";
  }
  if (normalized.includes("plan") || normalized.includes("vip") || normalized.includes("pro")) {
    return "explain_plan_access";
  }
  if (normalized.includes("upgrade")) return "explain_plan_upgrade_without_billing";
  if (normalized.includes("account") || normalized.includes("islamic")) {
    return "explain_account_type";
  }
  if (normalized.includes("diagnostic")) return "guide_to_diagnostics";
  if (normalized.includes("setting")) return "guide_to_settings";
  if (normalized.includes("feedback")) return "draft_feedback";
  if (normalized.includes("journal") || normalized.includes("learn")) return "journal_prompt";
  if (normalized.includes("session") || normalized.includes("summary")) return "session_summary";
  if (normalized.includes("market") || normalized.includes("symbol") || normalized.includes("timeframe")) {
    return "explain_market_context";
  }
  if (normalized.includes("founder")) return "founder_unavailable_for_user";
  return "explain_platform_state";
}

function templateToMessage(
  template: TPMCompanionResponseTemplate,
  id: string
): TPMCompanionMessage {
  return {
    id,
    role: "companion",
    state: template.state,
    title: template.title,
    body: template.body,
    safeNextStep: template.safeNextStep,
  };
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
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<TPMCompanionMessage[]>([]);
  const [responseTemplates, setResponseTemplates] = useState<TPMCompanionResponseTemplate[]>([]);
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
          throw new Error("Assistant readiness routes unavailable.");
        }

        const contextPayload = (await contextResponse.json()) as CompanionContextPayload;
        const explanationPayload = (await explanationResponse.json()) as StateExplanationPayload;

        setContext(contextPayload.snapshot);
        setResponseTemplates(contextPayload.responses ?? []);
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
        title: "Plan access truth",
        body:
          context?.planetAccess
            ? `${context.planetAccess.activeLayer}. Free is the familiar paper trading layer with basic Assistant support. Pro is planned as the intelligent professional workspace, VIP as the elite premium workspace layer, and Institutional as future team support.`
            : "Basic Assistant is active for Free guidance. Pro, VIP, and Institutional assistants remain locked or future-planned until real entitlement support exists.",
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

  const templateByIntent = useMemo(() => {
    return responseTemplates.reduce<Record<string, TPMCompanionResponseTemplate>>(
      (result, template) => {
        result[template.intent] = template;
        return result;
      },
      {}
    );
  }, [responseTemplates]);

  const submitChatMessage = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const createdAt = Date.now();
    const userMessage: TPMCompanionMessage = {
      id: `user-${createdAt}`,
      role: "user",
      state: "ready",
      title: "Your question",
      body: trimmed,
    };

    let companionMessage: TPMCompanionMessage;

    if (isBlockedCompanionRequest(trimmed)) {
      companionMessage = {
        id: `companion-blocked-${createdAt}`,
        role: "companion",
        state: "blocked",
        title: "I cannot do that",
        body:
          "That request touches execution, live activation, real money, broker/feed, billing, secrets, launch, or guaranteed performance. Those capabilities remain blocked in this build.",
        safeNextStep:
          "Stay in paper-safe mode, review diagnostics, or ask me to explain the blocked state.",
      };
    } else {
      const intent = inferCompanionIntent(trimmed);
      const template = templateByIntent[intent] ?? templateByIntent.explain_platform_state;

      companionMessage = template
        ? templateToMessage(template, `companion-${intent}-${createdAt}`)
        : {
            id: `companion-fallback-${createdAt}`,
            role: "companion",
            state: "fallback",
            title: "Safe platform guidance",
            body:
              "I can explain product truth, plan access, blocked states, feedback, diagnostics, and journal prompts. I cannot execute or activate anything.",
            safeNextStep: "Ask about a blocked state, the current plan access, or session learning.",
          };
    }

    setChatMessages((messages) => [...messages, userMessage, companionMessage].slice(-8));
    setChatInput("");
  };

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
    ...chatMessages,
  ];
  const liveExplanation = stateExplanations.live_disabled;
  const moneyExplanation = stateExplanations.real_money_blocked;
  const brokerExplanation = stateExplanations.broker_unavailable;

  return (
    <aside
      id="tpm-companion-panel"
      className="tpm-companion-panel"
      aria-label="TPM Assistant"
    >
      <header className="tpm-companion-head">
        <div>
          <span>TPM Assistant</span>
          <h2>{context?.assistantTier.label ?? assistantSnapshot.current.label}</h2>
        </div>
        {onClose ? (
          <button type="button" aria-label="Close TPM Assistant" onClick={onClose}>
            Close
          </button>
        ) : null}
      </header>

      <div className="tpm-companion-status-grid">
        <div>
          <span>Plan</span>
          <strong>{currentPlan.planName}</strong>
          <small>
            {context?.planetAccess.activeLayer ?? currentPlan.truthState.replaceAll("_", " ")}
          </small>
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

      <CompanionInput
        disabled={loadState === "loading"}
        onChange={setChatInput}
        onSubmit={submitChatMessage}
        value={chatInput}
      />

      <div className="tpm-companion-blocked-intents" aria-label="Blocked assistant intents">
        {(context?.blockedIntents ?? [
          "execute_trade",
          "enable_live",
          "enable_real_money",
          "activate_broker",
          "fake_launch",
        ])
          .slice(0, 5)
          .map((intent) => (
            <span key={intent}>{intent.replaceAll("_", " ")}</span>
          ))}
      </div>

      <div className="tpm-companion-state-strip">
        <WhyBlockedHint explanation={liveExplanation} label="Live" />
        <WhyBlockedHint explanation={moneyExplanation} label="Money" />
        <WhyBlockedHint explanation={brokerExplanation} label="Broker" />
      </div>

      <StateExplanationCard compact explanation={liveExplanation} />

      <div className="tpm-companion-capability-grid">
        <div>
          <span>Workspace layer</span>
          {(context?.planetAccess.visibleCities ?? []).slice(0, 3).map((city) => (
            <small key={city}>{city}</small>
          ))}
        </div>
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
