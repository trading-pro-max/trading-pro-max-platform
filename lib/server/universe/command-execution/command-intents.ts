import type { AlKawnCommandIntentExample } from "./types";

export const COMMAND_EXECUTION_REPORT_PATH =
  "reports/command-execution/al-kawn-command-execution-latest.md";

export const COMMAND_INTENT_EXAMPLES: AlKawnCommandIntentExample[] = [
  {
    id: "capability_summary",
    label: "ماذا تستطيع أن تفعل؟",
    description: "Shows what الكون can do internally now.",
    verdict: "execute_internal_now",
    quickAction: true,
    matchPhrases: ["ماذا تستطيع أن تفعل", "ماذا تستطيع", "what can you do"],
  },
  {
    id: "explain_current_screen",
    label: "اشرح لي ما أراه",
    description: "Explains /desktop/kawn as Ahmad's private command home.",
    verdict: "execute_internal_now",
    quickAction: true,
    matchPhrases: ["اشرح لي ما أراه", "اشرح", "explain"],
  },
  {
    id: "internal_health_check",
    label: "افحص الكون",
    description: "Returns a safe internal health summary from deterministic project truth.",
    verdict: "execute_internal_now",
    quickAction: true,
    matchPhrases: ["افحص الكون", "فحص الكون", "health", "check الكون"],
  },
  {
    id: "organize_daily_work",
    label: "رتب يومي",
    description: "Builds a safe daily internal plan without sensitive personal data.",
    verdict: "prepare_internal_report",
    quickAction: true,
    matchPhrases: ["رتب يومي", "نظم يومي", "daily plan", "organize my day"],
  },
  {
    id: "safe_internal_cycle",
    label: "نفذ دورة داخلية آمنة",
    description: "Runs a deterministic internal cycle summary and stops after the report.",
    verdict: "execute_internal_now",
    quickAction: true,
    matchPhrases: ["نفذ دورة داخلية آمنة", "دورة داخلية", "safe internal cycle"],
  },
  {
    id: "show_next_action",
    label: "اعرض الخطوة التالية",
    description: "Shows one next safe action only.",
    verdict: "execute_internal_now",
    quickAction: true,
    matchPhrases: ["اعرض الخطوة التالية", "الخطوة التالية", "next action"],
  },
  {
    id: "show_product_truth",
    label: "اعرض Product Truth",
    description: "Shows the Product Truth boundary summary.",
    verdict: "execute_internal_now",
    quickAction: true,
    matchPhrases: ["اعرض product truth", "product truth", "حقيقة المنتج"],
  },
  {
    id: "show_local_day_one",
    label: "اعرض حالة Local Day One",
    description: "Shows Local Day One as ready_not_started.",
    verdict: "execute_internal_now",
    quickAction: true,
    matchPhrases: ["اعرض حالة local day one", "local day one", "اليوم الأول"],
  },
];

export function getCommandIntentExamples(): AlKawnCommandIntentExample[] {
  return COMMAND_INTENT_EXAMPLES;
}
