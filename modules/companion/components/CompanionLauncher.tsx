"use client";

import { useState } from "react";
import TPMCompanionPanel from "./TPMCompanionPanel";

type CompanionLauncherProps = {
  diagnosticsHref: string;
  feedbackHref: string;
  locale: string;
  settingsHref: string;
};

export default function CompanionLauncher({
  diagnosticsHref,
  feedbackHref,
  locale,
  settingsHref,
}: CompanionLauncherProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="tpm-companion-shell" data-open={open}>
      {open ? (
        <TPMCompanionPanel
          diagnosticsHref={diagnosticsHref}
          feedbackHref={feedbackHref}
          locale={locale}
          onClose={() => setOpen(false)}
          settingsHref={settingsHref}
        />
      ) : null}
      <button
        type="button"
        className="tpm-companion-launcher"
        aria-expanded={open}
        aria-controls="tpm-companion-panel"
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden="true" />
        <strong>{open ? "Assistant open" : "Pro Max Assistant"}</strong>
        <small>Paper-safe guide</small>
      </button>
    </div>
  );
}
