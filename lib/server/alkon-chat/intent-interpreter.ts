import type { AlkonChatIntent, AlkonChatIntentType } from "./types";

type IntentPattern = {
  type: AlkonChatIntentType;
  confidence: number;
  terms: string[];
};

const UNSAFE_TERMS = [
  "run shell",
  "execute shell",
  "shell command",
  "run codex",
  "execute codex",
  "activate billing",
  "enable billing",
  "activate live",
  "live execution",
  "enable real money",
  "real money",
  "publish",
  "reveal secrets",
  "show secrets",
  "expose alkon publicly",
  "payment execution",
  "send payment",
  "delete files",
  "modify files from chat",
  "شغل الشل",
  "نفذ الشل",
  "شغل كودكس",
  "نفذ كودكس",
  "فعل الفوترة",
  "فعل التداول",
  "أموال حقيقية",
  "انشر",
  "اكشف الأسرار",
  "اكشف الكون للعامة",
  "نفذ الدفع",
];

const INTENT_PATTERNS: IntentPattern[] = [
  {
    type: "prepare_command_passport",
    confidence: 0.94,
    terms: [
      "prepare command",
      "command passport",
      "prepare a command passport",
      "جهز أمر",
      "جهز جواز تنفيذ",
      "جهز امر",
    ],
  },
  {
    type: "ask_status",
    confidence: 0.9,
    terms: ["status", "حالة الكون", "ما حالة الكون", "state of alkon"],
  },
  {
    type: "ask_one_next_action",
    confidence: 0.9,
    terms: ["next action", "one next action", "ما القرار التالي", "القرار التالي"],
  },
  {
    type: "ask_zero_truth",
    confidence: 0.86,
    terms: ["zero truth", "truth now", "افحص الحقيقة", "الحقيقة"],
  },
  {
    type: "ask_wake_report",
    confidence: 0.86,
    terms: ["wake report", "ماذا يقول wake report", "تقرير الاستيقاظ"],
  },
  {
    type: "ask_kernel_status",
    confidence: 0.85,
    terms: ["kernel", "kernel status", "النواة"],
  },
  {
    type: "ask_reality_trial",
    confidence: 0.85,
    terms: ["reality trial", "trial", "محاكمة الواقع"],
  },
  {
    type: "ask_evidence",
    confidence: 0.84,
    terms: ["evidence", "evidence chain", "هل يوجد خطر", "الدليل", "سلسلة الدليل"],
  },
  {
    type: "ask_memory",
    confidence: 0.82,
    terms: ["memory", "ذاكرة"],
  },
  {
    type: "ask_device_status",
    confidence: 0.86,
    terms: ["device status", "device constellation", "ما حالة الأجهزة", "الأجهزة"],
  },
  {
    type: "ask_local_day_one",
    confidence: 0.88,
    terms: ["local day one", "هل نبدأ local day one", "start local day one"],
  },
  {
    type: "ask_what_not_to_do",
    confidence: 0.88,
    terms: ["what not to do", "what must not be done", "ماذا لا نفعل"],
  },
  {
    type: "classify_idea",
    confidence: 0.83,
    terms: ["classify this", "classify idea", "صنف هذه الفكرة", "عام أم خاص"],
  },
  {
    type: "visual_review_guidance",
    confidence: 0.84,
    terms: ["visual review", "is the chart accepted", "هل الشارت مقبول", "مراجعة بصرية"],
  },
  {
    type: "focused_correction_request",
    confidence: 0.82,
    terms: ["focused correction", "أريد إصلاح مركز", "إصلاح مركز"],
  },
  {
    type: "founder_decision_request",
    confidence: 0.82,
    terms: ["founder decision", "ahmad decision", "قرار أحمد", "موافقة أحمد"],
  },
];

function detectLanguage(message: string) {
  const hasArabic = /[\u0600-\u06ff]/.test(message);
  const hasLatin = /[a-z]/i.test(message);

  if (hasArabic && hasLatin) return "mixed" as const;
  if (hasArabic) return "ar" as const;

  return "en" as const;
}

function normalize(message: string) {
  return message.toLowerCase().replace(/\s+/g, " ").trim();
}

function matchesAny(normalized: string, terms: string[]) {
  return terms.filter((term) => normalized.includes(term.toLowerCase()));
}

export function interpretAlkonChatIntent(message: string): AlkonChatIntent {
  const originalMessage = message.trim();
  const normalized = normalize(originalMessage);
  const language = detectLanguage(originalMessage);
  const safePrepareCommand =
    /prepare command|command passport|prepare a command passport|جهز أمر|جهز امر|جهز جواز تنفيذ/i.test(
      originalMessage
    );
  const unsafeMatches = matchesAny(normalized, UNSAFE_TERMS);

  if (unsafeMatches.length > 0 && !safePrepareCommand) {
    return {
      type: "unsafe_execution_request",
      confidence: 0.99,
      language,
      matchedTerms: unsafeMatches,
      originalMessage,
    };
  }

  for (const pattern of INTENT_PATTERNS) {
    const matchedTerms = matchesAny(normalized, pattern.terms);
    if (matchedTerms.length > 0) {
      return {
        type: pattern.type,
        confidence: pattern.confidence,
        language,
        matchedTerms,
        originalMessage,
      };
    }
  }

  return {
    type: "unknown",
    confidence: 0.42,
    language,
    matchedTerms: [],
    originalMessage,
  };
}
