import type { BrandOccasionTheme, BrandOccasionThemeKey } from "./types";

const forbiddenOccasionScope = [
  "political symbols",
  "copyrighted symbols",
  "uncontracted brand names",
  "fake partnership",
  "full UI takeover",
  "chart distraction",
  "paid activation implication",
];

export const BRAND_OCCASION_THEMES: Record<
  BrandOccasionThemeKey,
  BrandOccasionTheme
> = {
  default: {
    key: "default",
    label: "Default",
    autoApplies: true,
    publicAllowed: true,
    founderApprovalRequired: false,
    legalReviewRequired: false,
    guardianReviewRequired: false,
    visualRule: "Use the normal Trading Pro Max identity without occasion decoration.",
    forbidden: forbiddenOccasionScope,
  },
  local_day_one: {
    key: "local_day_one",
    label: "Local Day One",
    autoApplies: false,
    publicAllowed: false,
    founderApprovalRequired: true,
    legalReviewRequired: false,
    guardianReviewRequired: true,
    visualRule: "Internal/local readiness accent only; never imply launch.",
    forbidden: [...forbiddenOccasionScope, "launch celebration"],
  },
  product_milestone: {
    key: "product_milestone",
    label: "Product Milestone",
    autoApplies: false,
    publicAllowed: false,
    founderApprovalRequired: true,
    legalReviewRequired: true,
    guardianReviewRequired: true,
    visualRule: "Small internal milestone accent after validation evidence exists.",
    forbidden: [...forbiddenOccasionScope, "fake users", "fake revenue", "fake metrics"],
  },
  maintenance: {
    key: "maintenance",
    label: "Maintenance",
    autoApplies: false,
    publicAllowed: true,
    founderApprovalRequired: false,
    legalReviewRequired: false,
    guardianReviewRequired: true,
    visualRule: "Muted readiness treatment; no broken or alarming styling.",
    forbidden: [...forbiddenOccasionScope, "panic styling"],
  },
  security_review: {
    key: "security_review",
    label: "Security Review",
    autoApplies: false,
    publicAllowed: false,
    founderApprovalRequired: true,
    legalReviewRequired: false,
    guardianReviewRequired: true,
    visualRule: "Restricted internal review accent only; no secrets or alert theater.",
    forbidden: [...forbiddenOccasionScope, "secret exposure"],
  },
  founder_review: {
    key: "founder_review",
    label: "Founder Review",
    autoApplies: false,
    publicAllowed: false,
    founderApprovalRequired: true,
    legalReviewRequired: false,
    guardianReviewRequired: true,
    visualRule: "Owner-only command review styling; no public UI exposure.",
    forbidden: [...forbiddenOccasionScope, "public command surface"],
  },
  swiss_national_day: {
    key: "swiss_national_day",
    label: "Swiss National Day",
    autoApplies: false,
    publicAllowed: false,
    founderApprovalRequired: true,
    legalReviewRequired: true,
    guardianReviewRequired: true,
    visualRule: "Optional reviewed accent only; never imply Swiss legal/company status.",
    forbidden: [...forbiddenOccasionScope, "official Swiss status claim"],
  },
  new_year: {
    key: "new_year",
    label: "New Year",
    autoApplies: false,
    publicAllowed: false,
    founderApprovalRequired: true,
    legalReviewRequired: true,
    guardianReviewRequired: true,
    visualRule: "Optional reviewed milestone accent; no performance promises.",
    forbidden: [...forbiddenOccasionScope, "profit promise"],
  },
  custom_founder_theme: {
    key: "custom_founder_theme",
    label: "Custom Founder Theme",
    autoApplies: false,
    publicAllowed: false,
    founderApprovalRequired: true,
    legalReviewRequired: true,
    guardianReviewRequired: true,
    visualRule: "Owner-defined internal theme after review.",
    forbidden: forbiddenOccasionScope,
  },
  ramadan_or_eid_optional: {
    key: "ramadan_or_eid_optional",
    label: "Ramadan / Eid optional",
    autoApplies: false,
    publicAllowed: false,
    founderApprovalRequired: true,
    legalReviewRequired: true,
    guardianReviewRequired: true,
    visualRule:
      "Optional only after explicit configuration and review; no automatic religious theme.",
    forbidden: [...forbiddenOccasionScope, "automatic religious theme"],
  },
  christmas_optional: {
    key: "christmas_optional",
    label: "Christmas optional",
    autoApplies: false,
    publicAllowed: false,
    founderApprovalRequired: true,
    legalReviewRequired: true,
    guardianReviewRequired: true,
    visualRule:
      "Optional only after explicit configuration and review; no automatic religious/cultural theme.",
    forbidden: [...forbiddenOccasionScope, "automatic religious theme"],
  },
};

export function getBrandOccasionTheme(
  key: BrandOccasionThemeKey = "default"
): BrandOccasionTheme {
  return BRAND_OCCASION_THEMES[key] ?? BRAND_OCCASION_THEMES.default;
}

export function getBrandOccasionThemes(): BrandOccasionTheme[] {
  return Object.values(BRAND_OCCASION_THEMES);
}
