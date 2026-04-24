import "./globals.css";
import "./design-foundation.css";
import "./foundation-nav.css";
import "./ui-states.css";
import "./compact-modes.css";
import "./auth-ui.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Trading Pro Max | Operator-Grade Evaluation Workstation",
  description:
    "Commercial-grade trading workstation with TPM IQ / Brain, truthful paper-only execution, fallback-first market context, and diagnostics-ready product trust.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
