import "./globals.css";
import "./design-foundation.css";
import "./foundation-nav.css";
import "./ui-states.css";
import "./compact-modes.css";
import "./auth-ui.css";
import "./theme-localization.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { THEME_STORAGE_KEY } from "../lib/constants/storage";
import { DEFAULT_THEME_MODE, THEME_MODES } from "../lib/constants/theme";

export const metadata: Metadata = {
  title: "Trading Pro Max | Operator-Grade Evaluation Workstation",
  description:
    "Commercial-grade trading workstation with TPM IQ / Brain, truthful paper-only execution, fallback-first market context, and diagnostics-ready product trust.",
};

const THEME_BOOTSTRAP_SCRIPT = `
(function () {
  try {
    var key = ${JSON.stringify(THEME_STORAGE_KEY)};
    var modes = ${JSON.stringify([...THEME_MODES])};
    var mode = window.localStorage.getItem(key) || ${JSON.stringify(DEFAULT_THEME_MODE)};
    if (modes.indexOf(mode) === -1) mode = ${JSON.stringify(DEFAULT_THEME_MODE)};
    var resolved = mode === "system"
      ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
      : mode;
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  } catch (error) {
    document.documentElement.dataset.themeMode = ${JSON.stringify(DEFAULT_THEME_MODE)};
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
  }
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-theme-mode={DEFAULT_THEME_MODE}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
