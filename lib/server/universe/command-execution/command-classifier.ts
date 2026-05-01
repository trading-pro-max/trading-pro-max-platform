import { COMMAND_INTENT_EXAMPLES } from "./command-intents";
import type { AlKawnCommandClassification } from "./types";

const MONEY_KEYWORDS = [
  "payment",
  "payments",
  "billing",
  "subscription",
  "withdraw",
  "withdrawal",
  "bank",
  "transfer",
  "broker",
  "real money",
  "دفع",
  "مدفوعات",
  "فوترة",
  "اشتراك",
  "قبض",
  "استلام مال",
  "سحب",
  "تحويل",
  "بنك",
  "بروكر",
  "وسيط",
  "مال حقيقي",
];

const LEGAL_KEYWORDS = [
  "legal filing",
  "contract",
  "trademark",
  "finma",
  "licensed",
  "regulated",
  "legal approval",
  "قانون",
  "عقد",
  "علامة تجارية",
  "ترخيص",
  "مرخص",
  "منظم",
  "موافقة قانونية",
];

const EXTERNAL_KEYWORDS = [
  "public launch",
  "publish",
  "cloud upload",
  "external account",
  "email",
  "calendar",
  "drive",
  "app store",
  "website publishing",
  "إطلاق عام",
  "نشر",
  "رفع للسحابة",
  "حساب خارجي",
  "إيميل",
  "تقويم",
  "درايف",
  "متجر التطبيقات",
];

const SECRET_KEYWORDS = [
  "secret in git",
  "secrets in git",
  "secret in bundle",
  "secrets in bundle",
  "api key",
  "password",
  "أسرار في git",
  "سر في git",
  "أسرار في الباندل",
  "كلمة مرور",
  "مفتاح api",
];

const PRODUCT_TRUTH_BLOCK_KEYWORDS = [
  "public الكون",
  "public alkon",
  "guaranteed profit",
  "risk free",
  "fake product truth",
  "physical universe control",
  "الكون عام",
  "ALKON عام",
  "ربح مضمون",
  "بدون مخاطر",
  "Product Truth كاذب",
  "تحكم بالكون الفيزيائي",
];

function normalizeCommand(commandText: string): string {
  return commandText.trim().toLowerCase().replace(/\s+/g, " ");
}

function findMatchedPhrases(
  normalizedCommand: string,
  phrases: string[],
): string[] {
  return phrases.filter((phrase) =>
    normalizedCommand.includes(normalizeCommand(phrase)),
  );
}

function buildClassification(
  commandText: string,
  intentId: AlKawnCommandClassification["intentId"],
  intentLabel: string,
  verdict: AlKawnCommandClassification["verdict"],
  reason: string,
  layer: string,
  risk: AlKawnCommandClassification["risk"],
  supported: boolean,
  matchedPhrases: string[],
): AlKawnCommandClassification {
  return {
    commandText,
    normalizedCommand: normalizeCommand(commandText),
    intentId,
    intentLabel,
    verdict,
    reason,
    layer,
    risk,
    supported,
    matchedPhrases,
  };
}

export function classifyAlKawnCommand(
  commandText: string,
): AlKawnCommandClassification {
  const normalizedCommand = normalizeCommand(commandText);

  if (!normalizedCommand) {
    return buildClassification(
      commandText,
      "unknown",
      "طلب غير مكتمل",
      "needs_clarification",
      "الكون يحتاج أمرًا واضحًا قبل التنفيذ.",
      "command_input",
      "none",
      false,
      [],
    );
  }

  const secretMatches = findMatchedPhrases(normalizedCommand, SECRET_KEYWORDS);
  if (secretMatches.length > 0) {
    return buildClassification(
      commandText,
      "secret_exposure",
      "خطر كشف أسرار",
      "blocked_secret_exposure",
      "الأمر قد يكشف أسرارًا أو يطلب تخزينها في Git أو الباندل.",
      "protection",
      "secret",
      false,
      secretMatches,
    );
  }

  const productTruthMatches = findMatchedPhrases(
    normalizedCommand,
    PRODUCT_TRUTH_BLOCK_KEYWORDS,
  );
  if (productTruthMatches.length > 0) {
    return buildClassification(
      commandText,
      "product_truth_violation",
      "كسر Product Truth",
      "blocked_product_truth",
      "الأمر يخالف Product Truth أو يطلب ادعاءً غير مسموح.",
      "product_truth",
      "product_truth",
      false,
      productTruthMatches,
    );
  }

  const moneyMatches = findMatchedPhrases(normalizedCommand, MONEY_KEYWORDS);
  if (moneyMatches.length > 0) {
    return buildClassification(
      commandText,
      "money",
      "قرار مال حقيقي",
      "requires_ahmad_money_decision",
      "المال الحقيقي بيد أحمد فقط.",
      "money_gate",
      "money",
      false,
      moneyMatches,
    );
  }

  const legalMatches = findMatchedPhrases(normalizedCommand, LEGAL_KEYWORDS);
  if (legalMatches.length > 0) {
    return buildClassification(
      commandText,
      "legal",
      "قرار قانوني",
      "requires_ahmad_legal_decision",
      "القرارات القانونية الرسمية تتوقف لأحمد.",
      "legal_gate",
      "legal",
      false,
      legalMatches,
    );
  }

  const externalMatches = findMatchedPhrases(normalizedCommand, EXTERNAL_KEYWORDS);
  if (externalMatches.length > 0) {
    return buildClassification(
      commandText,
      "external",
      "قرار خروج للعالم",
      "requires_ahmad_external_decision",
      "الخروج للعالم يمر عبر قرار أحمد.",
      "external_gate",
      "external",
      false,
      externalMatches,
    );
  }

  const supportedIntent = COMMAND_INTENT_EXAMPLES.find((intent) =>
    findMatchedPhrases(normalizedCommand, intent.matchPhrases).length > 0,
  );

  if (supportedIntent) {
    return buildClassification(
      commandText,
      supportedIntent.id,
      supportedIntent.label,
      supportedIntent.verdict,
      "الأمر داخلي وآمن ضمن MVP المحلي.",
      "command_execution_mvp",
      "none",
      true,
      findMatchedPhrases(normalizedCommand, supportedIntent.matchPhrases),
    );
  }

  return buildClassification(
    commandText,
    "unknown",
    "غير مدعوم بعد",
    "unsupported_yet",
    "الكون فهم الطلب، لكنه ليس ضمن أوامر MVP المدعومة بعد.",
    "future_gate",
    "none",
    false,
    [],
  );
}
