export const THEME_FOUNDATION = {
  colors: {
    bg: "#07111d",
    surface: "rgba(8, 15, 26, 0.88)",
    surfaceAlt: "rgba(15, 23, 42, 0.74)",
    border: "rgba(148, 163, 184, 0.14)",
    borderSoft: "rgba(148, 163, 184, 0.12)",
    text: "#eef6ff",
    textSoft: "#8fa4c0",
    accent: "#2dd4bf",
    accentStrong: "#14b8a6",
    danger: "#f87171",
    success: "#2dd4bf",
  },
  radius: {
    xl: "28px",
    lg: "24px",
    md: "18px",
    sm: "14px",
    pill: "999px",
  },
  shadow: {
    panel: "0 16px 40px rgba(0, 0, 0, 0.22)",
    menu: "0 16px 40px rgba(0, 0, 0, 0.28)",
  },
  spacing: {
    page: "18px",
    panel: "18px",
    compact: "12px",
    mobile: "10px",
  },
} as const;

export const THEME_MODES = ["system", "dark", "light"] as const;

export type ThemeMode = (typeof THEME_MODES)[number];
export type ResolvedTheme = Exclude<ThemeMode, "system">;

export const DEFAULT_THEME_MODE: ThemeMode = "system";

export const THEME_MODE_LABELS: Record<ThemeMode, string> = {
  system: "System",
  dark: "Dark",
  light: "Light",
};

export function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return THEME_MODES.includes(value as ThemeMode);
}
