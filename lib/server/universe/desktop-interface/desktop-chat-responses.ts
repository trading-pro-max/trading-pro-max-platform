import "server-only";

export function getAlKawnDesktopWelcomeMessage(): string {
  return [
    "أحمد، Product Truth محفوظ.",
    "الكون يتواصل مع أحمد فقط.",
    "الكون يعمل عن أحمد داخليًا.",
    "داخل الكون: التنفيذ مباشر.",
    "عند القانون: يتوقف لأحمد.",
    "عند المال: يتوقف لأحمد.",
    "Product Truth overrides every action.",
  ].join(" ");
}

export function getAlKawnDesktopResponseForIntent(intent: string): string {
  const responses: Record<string, string> = {
    today_state: "أحمد، النواة جاهزة، Product Truth محفوظ، والخطوة الآمنة التالية هي تنظيم أسطح التحكم.",
    legal: "أحمد، هذا القرار يتعلق بالقانون ويحتاج توقفك.",
    money: "أحمد، هذا القرار يتعلق بالمال ويحتاج توقفك.",
    product_truth: "Product Truth overrides every action.",
    kernel: "أحمد، النواة جاهزة.",
    public_universe: "أحمد، هذا الإجراء محجوب لأنه يخالف Product Truth.",
  };

  return responses[intent] ?? "أحمد، العمل الداخلي الآمن يمكن تنفيذه مباشرة.";
}
