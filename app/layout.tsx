import "./globals.css";
import "./design-foundation.css";
import "./foundation-nav.css";
import "./ui-states.css";
import "./compact-modes.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Trading Pro Max",
  description: "Trading platform foundation",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}