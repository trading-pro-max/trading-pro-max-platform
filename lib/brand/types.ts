export type BrandSurface =
  | "public_entry"
  | "workstation"
  | "settings"
  | "diagnostics"
  | "assistant"
  | "journal_coach"
  | "academy"
  | "community"
  | "media_office"
  | "founder_command"
  | "local_command"
  | "mobile_future"
  | "desktop_future";

export type BrandMotionIntensity = "none" | "low" | "medium" | "high";

export type BrandOccasionThemeKey =
  | "default"
  | "local_day_one"
  | "product_milestone"
  | "maintenance"
  | "security_review"
  | "founder_review"
  | "swiss_national_day"
  | "new_year"
  | "custom_founder_theme"
  | "ramadan_or_eid_optional"
  | "christmas_optional";

export type BrandOccasionTheme = {
  key: BrandOccasionThemeKey;
  label: string;
  autoApplies: boolean;
  publicAllowed: boolean;
  founderApprovalRequired: boolean;
  legalReviewRequired: boolean;
  guardianReviewRequired: boolean;
  visualRule: string;
  forbidden: string[];
};
