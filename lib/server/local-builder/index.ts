export function getLocalBuilderReadinessSnapshot(
  checkedAt = new Date().toISOString()
) {
  return {
    checkedAt,
    mode: "alkon_local_builder_readiness",
    status: "ready_with_notes" as const,
    founderOnly: true,
    readOnly: true,
    terminalOnly: true,
    webAppCanExecuteShell: false,
    webAppCanRunCodex: false,
    externalCalls: false,
    secretsVisible: false,
    dangerousCommands: false,
    scripts: [
      "alkon:status",
      "alkon:wake",
      "alkon:next",
      "alkon:passport",
      "alkon:audit",
    ],
    allowed: [
      "read reports",
      "summarize Wake Report",
      "suggest one next action",
      "prepare local passport preview",
      "audit report presence",
    ],
    blocked: [
      "delete files",
      "run Codex",
      "execute shell from web app",
      "make external calls",
      "read or print secrets",
      "activate launch, billing, broker/feed, live execution, or real money",
    ],
    nextSafeAction: "Use local builder scripts only from Ahmad's terminal when Codex quota is exhausted.",
  };
}
