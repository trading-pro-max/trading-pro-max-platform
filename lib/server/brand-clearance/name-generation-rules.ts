export const globalBrandNameGenerationRules = {
  mustBe: [
    "invented or rare",
    "not generic",
    "easy to pronounce in Arabic, English, and German",
    "domain-friendly",
    "trademark-friendly",
    "expandable into finance, tech, assistant, academy, business, and future worlds",
  ],
  mustNotBe: [
    "Pro Max",
    "close to Apple, Dell, Alcon, or Alkon names",
    "a fake Swiss legal or regulatory claim",
    "a trading-only limitation if the brand should become a world brand",
    "a profit, guarantee, broker, bank, FINMA, licensed, or regulated implication",
  ],
  adoptionRule:
    "No generated or proposed name becomes final until trademark, domain, conflict, language, legal, and Ahmad approval gates pass.",
};

export function getGlobalBrandNameGenerationRules() {
  return globalBrandNameGenerationRules;
}
