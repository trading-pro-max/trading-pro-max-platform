import type { AlkonRawSignalInput, AlkonSignal, AlkonSignalType } from "./types";

type SignalRule = {
  type: AlkonSignalType;
  title: string;
  surface: string;
  pattern: RegExp;
};

const SIGNAL_RULES: SignalRule[] = [
  {
    type: "chart_annoyance",
    title: "Chart annoyance",
    surface: "Trading Workspace",
    pattern: /chart|شارت|candles?|workspace.*annoy|مزعج/i,
  },
  {
    type: "shell_duplication",
    title: "Duplicate shell or topbar",
    surface: "Shell / Navigation",
    pattern: /duplicate.*(topbar|bar|header|logo|nav)|two top|duplicated bars?|public nav leaks?/i,
  },
  {
    type: "logo_rejection",
    title: "Logo rejected",
    surface: "Visual Identity",
    pattern: /logo.*reject|rejected logo|الشعار.*مرفوض|شعار.*مرفوض/i,
  },
  {
    type: "visual_rejection",
    title: "Visual rejection",
    surface: "Visual Identity",
    pattern: /visual.*reject|ugly|not accepted|مرفوض|لا أريد صور|no images|raster/i,
  },
  {
    type: "public_private_leak",
    title: "Public/private leak",
    surface: "Public Earth",
    pattern: /public.*(alkon|founder|codex|secret|internal)|alkon.*public|leak/i,
  },
  {
    type: "secret_risk",
    title: "Secret risk",
    surface: "Secrets Authority",
    pattern: /secret|api key|password|token|credential|production secrets?/i,
  },
  {
    type: "billing_request",
    title: "Billing requested",
    surface: "Launch Readiness",
    pattern: /billing|checkout|payment|invoice|subscription/i,
  },
  {
    type: "live_request",
    title: "Live execution requested",
    surface: "Trading Workspace",
    pattern: /live execution|real trade|execute live|real money|live trading/i,
  },
  {
    type: "broker_feed_request",
    title: "Broker/feed requested",
    surface: "Markets",
    pattern: /broker|feed|market data provider|live feed/i,
  },
  {
    type: "social_publish_request",
    title: "Social publishing requested",
    surface: "World Interface",
    pattern: /social.*publish|publish.*social|social posts?|post to|tweet|linkedin|instagram|telegram/i,
  },
  {
    type: "launch_request",
    title: "Launch requested",
    surface: "Launch Readiness",
    pattern: /launch now|public launch|production activation|go production/i,
  },
  {
    type: "build_failure",
    title: "Build failure",
    surface: "Construction",
    pattern: /build failed|build failure|compile failed|tsc failed/i,
  },
  {
    type: "validation_failure",
    title: "Validation failure",
    surface: "Construction",
    pattern: /test failed|validation failed|eslint failed|smoke failed|regression failed/i,
  },
  {
    type: "support_gap",
    title: "Support gap",
    surface: "Support",
    pattern: /support.*missing|help.*missing|contact.*missing/i,
  },
  {
    type: "apps_gap",
    title: "Apps gap",
    surface: "Apps / Platforms",
    pattern: /mobile app|desktop app|app store|play store|download/i,
  },
  {
    type: "assistant_gap",
    title: "Assistant gap",
    surface: "TPM Assistant",
    pattern: /assistant.*confus|assistant.*unsafe|tpm assistant|intent/i,
  },
  {
    type: "environment_signal",
    title: "Environment signal",
    surface: "Adaptive Atmosphere",
    pattern: /environment|atmosphere|theme|static|motion|high contrast/i,
  },
  {
    type: "weather_signal",
    title: "Weather signal",
    surface: "Adaptive Atmosphere",
    pattern: /weather|rain|storm|snow|fog|heat|wind/i,
  },
  {
    type: "market_session_signal",
    title: "Market session signal",
    surface: "Markets",
    pattern: /market session|asia session|europe session|us session|after hours/i,
  },
  {
    type: "codex_result",
    title: "Codex result",
    surface: "Codex Construction",
    pattern: /codex result|codex returned|task result/i,
  },
  {
    type: "local_day_signal",
    title: "Local day signal",
    surface: "Local Day",
    pattern: /local day|daily report|day loop/i,
  },
  {
    type: "public_ui_gap",
    title: "Public UI gap",
    surface: "Public Earth",
    pattern: /home crowded|public ui|navigation crowded|missing public/i,
  },
];

function normalizeSignalText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function findRule(text: string): SignalRule {
  return SIGNAL_RULES.find((rule) => rule.pattern.test(text)) ?? {
    type: "founder_idea",
    title: "Founder idea",
    surface: "Alkon Command",
    pattern: /.*/,
  };
}

export function senseAlkonSignal(
  input: string | AlkonRawSignalInput,
  checkedAt = new Date().toISOString()
): AlkonSignal {
  const rawInput =
    typeof input === "string"
      ? { text: input, source: "founder" as const }
      : input;
  const text = normalizeSignalText(rawInput.text);
  const rule = findRule(text);
  const world =
    rule.type === "secret_risk" ||
    rule.type === "codex_result" ||
    rule.type === "local_day_signal"
      ? "private_alkon"
      : rule.type === "founder_idea"
        ? "private_alkon"
        : rule.type === "public_private_leak"
          ? "invisible_operating_layer"
          : "public_earth";

  return {
    signalId:
      rawInput.inputId ??
      `alkon_signal_${rule.type}_${checkedAt.replace(/[-:.TZ]/g, "").slice(0, 14)}`,
    type: rule.type,
    title: rule.title,
    rawSummary: text.slice(0, 180),
    source: rawInput.source ?? "founder",
    surface: rawInput.surface ?? rule.surface,
    world,
    explicitImageApproval: rawInput.explicitImageApproval ?? false,
    containsSecrets: false,
    containsPrivateSensitiveData: false,
    createdAt: rawInput.createdAt ?? checkedAt,
  };
}

export function senseAlkonSignals(
  inputs: Array<string | AlkonRawSignalInput>,
  checkedAt = new Date().toISOString()
) {
  return inputs.map((input, index) =>
    senseAlkonSignal(
      typeof input === "string"
        ? { inputId: `alkon_signal_${index + 1}`, text: input, source: "founder" }
        : { inputId: input.inputId ?? `alkon_signal_${index + 1}`, ...input },
      checkedAt
    )
  );
}
