import "server-only";

import { createCodexDraft } from "./codex-draft";
import type { CodexSubmitReadiness, TaskPassport } from "./types";

export function getCodexSubmitReadiness(
  passports: TaskPassport[],
  checkedAt = new Date().toISOString()
): CodexSubmitReadiness {
  const draftablePassports = passports.filter(
    (passport) => passport.workerLevel !== "restricted"
  );

  return {
    checkedAt,
    defaultMode: "manual_only",
    supportedModes: [
      "manual_only",
      "cli_exec_ready",
      "cloud_exec_ready",
      "github_comment_ready",
    ],
    readyModes: [
      "manual_only",
      "cli_exec_ready",
      "cloud_exec_ready",
      "github_comment_ready",
    ],
    notEnabled: [
      "web app shell execution",
      "direct Codex API calls",
      "automatic GitHub comments",
      "external runner submission",
      "secret forwarding",
    ],
    drafts: draftablePassports.flatMap((passport) => [
      createCodexDraft(passport, "manual_only"),
      createCodexDraft(passport, "cli_exec_ready"),
      createCodexDraft(passport, "cloud_exec_ready"),
      createCodexDraft(passport, "github_comment_ready"),
    ]),
    truth: {
      webAppShellExecution: false,
      callsCodexDirectly: false,
      sendsSecretsToCodex: false,
      externalRunnerApproved: false,
    },
  };
}
