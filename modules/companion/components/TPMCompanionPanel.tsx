"use client";

import { useEffect, useMemo, useState } from "react";
import { getAssistantTierSnapshot } from "@/lib/assistant/tiers";
import { getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
import { WhyBlockedHint } from "@/modules/state-explanations/components";
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
    "activate live",
    "real money",
    "activate broker",
    "connect broker",
    "activate feed",
    "activate billing",
    "checkout",
    "show credential",
    "broker credential",
    "api key",
    "change credentials",
    "bypass auth",
    "guarantee profit",
    "result certainty",
    "performance rate",
    "activate vip",
    "activate institutional",
    "fake institutional",
    "fake billing",
    "financial advice",
    "legal advice",
    "publish social",
    "launch publicly",
    "alkon",
    "show alkon",
    "reveal alkon",
    "founder command",
    "cosmic physics",
    "task passport",
    "result tribunal",
    "product memory",
    "codex tasks",
  ].some((phrase) => normalized.includes(phrase));
}

function inferCompanionIntent(value: string): string {
  const normalized = value.toLowerCase();
  if (
    normalized.includes("start me") ||
    normalized.includes("get started") ||
    normalized.includes("open workspace") ||
    normalized.includes("open the workspace") ||
    normalized.includes("open chart") ||
    normalized.includes("open the chart")
  ) {
    return "open_workspace_request";
  }
  if (normalized.includes("calmer") || normalized.includes("less noise") || normalized.includes("أهدأ")) {
    return "personal_reality_calm";
  }
  if (normalized.includes("bigger chart") || normalized.includes("larger chart") || normalized.includes("شارت أكبر")) {
    return "personal_reality_chart_comfort";
  }
  if (normalized.includes("low motion") || normalized.includes("reduce motion") || normalized.includes("قلل الحركة")) {
    return "personal_reality_low_motion";
  }
  if (normalized.includes("static") || normalized.includes("night mode") || normalized.includes("وضع ليلي")) {
    return "personal_reality_static";
  }
  if (normalized.includes("high contrast")) {
    return "personal_reality_high_contrast";
  }
  if (normalized.includes("focus") || normalized.includes("تركيز")) {
    return "personal_reality_focus";
  }
  if (normalized.includes("why locked") || normalized.includes("لماذا هذا مقفل")) {
    return "personal_reality_explain_locked";
  }
  if (
    normalized.includes("mobile app") ||
    normalized.includes("desktop app") ||
    normalized.includes("apps") ||
    normalized.includes("platforms")
  ) {
    return "guide_to_apps_platforms";
  }
  if (
    normalized.includes("support") ||
    normalized.includes("contact support") ||
    normalized.includes("report a problem")
  ) {
    return "guide_to_support";
  }
  if (normalized.includes("reset experience") || normalized.includes("restore defaults")) {
    return "reset_experience";
  }
  if (normalized.includes("blocked") || normalized.includes("why")) {
    return "explain_blocked_state";
  }
  if (normalized.includes("plan") || normalized.includes("vip") || normalized.includes("pro")) {
    return "explain_plan_access";
  }
  if (normalized.includes("paper")) return "explain_paper_mode";
  if (normalized.includes("feed") || normalized.includes("fallback")) return "explain_feed_fallback";
  if (normalized.includes("billing")) return "explain_billing_inactive";
  if (normalized.includes("live")) return "explain_live_disabled";
  if (normalized.includes("real money")) return "explain_real_money_blocked";
  if (normalized.includes("upgrade")) return "explain_upgrade_path_without_billing";
  if (normalized.includes("account") || normalized.includes("islamic")) {
    return "explain_account_type";
  }
  if (normalized.includes("diagnostic")) return "guide_to_diagnostics";
  if (normalized.includes("setting")) return "guide_to_settings";
  if (normalized.includes("feedback")) return "draft_feedback";
  if (normalized.includes("coach")) return "coach_prompt";
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
  const [activePromptId, setActivePromptId] = useState("start");
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
        title: "Current workspace state",
        body:
          context?.productTruth.liveExecution === "blocked"
            ? "This workspace is paper-safe. Live execution, real money, broker activation, billing, launch, and social publishing remain blocked or inactive."
            : "This surface is using bounded readiness context. Check diagnostics before trusting any operational state.",
      },
      start: {
        id: "response-start",
        role: "companion",
        state: "ready",
        title: "Start with the workspace",
        body:
          "Use Trading Workspace to start in the chart-first web terminal. It is paper-safe: live execution, real money, broker/feed activation, billing, and launch remain inactive.",
        safeNextStep: "Enter the workspace, then ask me for Bigger chart, Calmer, Journal, or Why blocked.",
      },
      blocked: {
        id: "response-blocked",
        role: "companion",
        state: "blocked",
        title: "Why a feature is blocked",
        body:
          "Blocked labels are intentional safety boundaries. They explain what is unavailable and the safe next step without promising an unlock.",
      },
      plan: {
        id: "response-plan",
        role: "companion",
        state: "planned",
        title: "Plan access truth",
      body:
          context?.realm
            ? `${context.realm.publicPlanName}: ${context.realm.workspaceBehavior} Pro is planned for professional workspace depth, VIP for premium advanced guidance, and Institutional for future team support.`
            : "Basic Assistant is active for Free guidance. Pro, VIP, and Institutional assistants remain locked or future-planned until real entitlement support exists.",
      },
      feedback: {
        id: "response-feedback",
        role: "companion",
        state: "ready",
        title: "Feedback draft foundation",
        body:
          "Suggested draft: I was on the workstation, noticed a blocked or fallback state, and expected a clearer safe next step. Route, theme, language, and plan context can be reviewed without restricted details.",
      },
      learning: {
        id: "response-learning",
        role: "companion",
        state: "ready",
        title: "Learning help",
        body:
          context?.brain.userGuidanceMode === "beginner_safe"
            ? "I will keep explanations plain, paper-first, and focused on what is safe to learn next."
            : "I can summarize context more compactly while keeping all guidance bounded and non-predictive.",
      },
      journal: {
        id: "response-journal",
        role: "companion",
        state: "ready",
        title: "Journal prompt",
        body:
          "Write what you are rehearsing in paper mode, what would make you pause, and one thing you want to learn. Keep it educational and non-advisory.",
        safeNextStep: "Use Journal/Coach for reflection, not outcome promises.",
      },
      support: {
        id: "response-support",
        role: "companion",
        state: "ready",
        title: "Support path",
        body:
          "Support can guide Help Center, Contact Support readiness, Report a Problem, Security Contact, and Partnership Contact. This build does not send email or fake ticket creation.",
        safeNextStep: "Open Support or ask me to draft a safe report.",
      },
      apps: {
        id: "response-apps",
        role: "companion",
        state: "planned",
        title: "Apps / Platforms",
        body:
          "Web App is current. Desktop App is planned. Mobile App is planned. Tablet App is future. No fake downloads, installers, APKs, or app-store claims are active.",
        safeNextStep: "Use the Web App now or open Apps / Platforms for readiness truth.",
      },
      calm: {
        id: "response-calm",
        role: "companion",
        state: "ready",
        title: "Calm Personal Reality",
        body:
          "I can help you preview Calm Workspace, Low Motion, and cleaner chart surroundings. These are active Free controls and do not unlock paid plans, live execution, billing, broker/feed, or real money.",
        safeNextStep: "Open Settings or ask me for Chart Comfort.",
      },
      focus: {
        id: "response-focus",
        role: "companion",
        state: "ready",
        title: "Focus Personal Reality",
        body:
          "Focus can make the chart more central and keep Assistant and Journal/Coach secondary. It is a layout preference, so I would ask before changing it.",
        safeNextStep: "Use Chart Comfort or workspace focus controls.",
      },
      chart: {
        id: "response-chart-comfort",
        role: "companion",
        state: "ready",
        title: "Chart Comfort",
        body:
          "Chart Comfort can make the chart feel larger and calmer by reducing surrounding pressure. It is not a trading signal, order shortcut, or live feature.",
        safeNextStep: "Preview the chart-first layout in Settings.",
      },
      lowMotion: {
        id: "response-low-motion",
        role: "companion",
        state: "ready",
        title: "Low Motion",
        body:
          "Low Motion reduces atmosphere movement and keeps the workspace steady. Static Mode goes further and turns motion off.",
        safeNextStep: "Choose Low Motion or Static Mode in Settings.",
      },
      static: {
        id: "response-static",
        role: "companion",
        state: "ready",
        title: "Static Mode",
        body:
          "Static Mode keeps the interface steady and disables atmospheric motion. Time, weather, and market session remain visual context only, never trading advice.",
        safeNextStep: "Use Static Mode when you want the calmest interface.",
      },
      locked: {
        id: "response-why-locked",
        role: "companion",
        state: "planned",
        title: "Why locked",
        body:
          "Planned or locked Personal Reality profiles are truthful boundaries. Free includes Clean Earth, Calm Workspace, Chart Comfort, Static, Low Motion, High Contrast, and Learning Basics now. Pro Orbit, VIP Lunar, and Institutional Station remain planned, locked, or future unless real entitlement gates exist.",
        safeNextStep: "Use an active Free profile or review Plans.",
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
          "That request touches execution, live activation, real money, broker/feed, billing, restricted credentials, launch, publishing, advice, or performance certainty. Those capabilities remain blocked in this build.",
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
              "I can explain product truth, plan access, blocked conditions, feedback, diagnostics, and journal prompts. I cannot execute or activate anything.",
            safeNextStep: "Ask about a blocked state, the current plan access, or session learning.",
          };
    }

    setChatMessages((messages) => [...messages, userMessage, companionMessage].slice(-8));
    setChatInput("");
  };

  const prompts: TPMCompanionPrompt[] = [
    { id: "start", label: "Start", response: promptResponses.start },
    { id: "blocked", label: "Why blocked?", response: promptResponses.blocked },
    { id: "chart", label: "Bigger chart", response: promptResponses.chart },
    { id: "calm", label: "Calmer", response: promptResponses.calm },
    { id: "plan", label: "Plans", response: promptResponses.plan },
    { id: "apps", label: "Apps", response: promptResponses.apps },
    { id: "support", label: "Support", response: promptResponses.support },
    { id: "journal", label: "Journal", response: promptResponses.journal },
  ];
  const activePrompt = prompts.find((prompt) => prompt.id === activePromptId) ?? prompts[0];
  const messages: TPMCompanionMessage[] = [
    {
      id: "intro",
      role: "companion",
      state: loadState === "ready" ? "ready" : "fallback",
      title: "Paper-safe workspace guidance",
      body: `I can explain ${formatRoute(
        context?.route ?? route
      )}, plan status, blocked states, Journal/Coach, apps, support, diagnostics, and safe experience settings. I cannot execute trades or activate live, money, broker, feed, billing, credentials, publishing, or launch.`,
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
      aria-label="Pro Max Assistant"
    >
      <header className="tpm-companion-head">
        <div>
          <span>Pro Max Assistant</span>
          <h2>{context?.assistantTier.label ?? assistantSnapshot.current.label}</h2>
        </div>
        {onClose ? (
          <button type="button" aria-label="Close Pro Max Assistant" onClick={onClose}>
            Close
          </button>
        ) : null}
      </header>

      <div className="tpm-companion-status-grid">
        <div>
          <span>Plan</span>
          <strong>{context?.realm.publicPlanName ?? currentPlan.planName}</strong>
          <small>
            {context?.realm.activationState ?? currentPlan.truthState.replaceAll("_", " ")}
          </small>
        </div>
        <div>
          <span>Context</span>
          <strong>{loadState === "ready" ? "Ready" : "Fallback"}</strong>
          <small>{context?.realm.assistantBehavior ?? "Safe daily use"}</small>
        </div>
        <div>
          <span>Authority</span>
          <strong>None</strong>
          <small>No execution or activation</small>
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

      <footer className="tpm-companion-actions">
        <a href={settingsHref}>Settings</a>
        <a href={diagnosticsHref}>Diagnostics</a>
        <a href={feedbackHref}>Feedback</a>
      </footer>
    </aside>
  );
}
