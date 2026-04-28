export const finalBrandCandidateRules = {
  mustBe: [
    "original",
    "rare",
    "pronounceable",
    "not generic",
    "not close to Apple, Dell, Alcon, or Alkon conflicts",
    "suitable for fintech, software, education, and AI",
    "domain-friendly",
    "trademark-class friendly",
    "capable of being owned by Ahmad if approved and registered",
  ],
  rejectIf: [
    "too generic",
    "already widely used",
    "confusingly similar",
    "legally risky",
    "misleading",
    "impossible to own clearly",
    "implies regulation, licensing, banking, or Swiss legal status without proof",
  ],
  noAutomaticAdoption: true,
};

export function getNameGenerationRules() {
  return finalBrandCandidateRules;
}
