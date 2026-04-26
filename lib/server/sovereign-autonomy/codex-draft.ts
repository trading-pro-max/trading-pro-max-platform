import "server-only";

import type { CodexDraft, CodexSubmitMode, TaskPassport } from "./types";

function promptForPassport(passport: TaskPassport) {
  return [
    `MISSION: ${passport.title}`,
    `TASK PASSPORT: ${passport.taskId}`,
    `EVENT: ${passport.eventId}`,
    `OWNER: ${passport.ownerArea}`,
    `WORKER LEVEL: ${passport.workerLevel}`,
    `REASON: ${passport.reason}`,
    "",
    "ALLOWED FILES:",
    passport.allowedFiles.map((file) => `- ${file}`).join("\n"),
    "",
    "FORBIDDEN FILES:",
    passport.forbiddenFiles.map((file) => `- ${file}`).join("\n"),
    "",
    "FORBIDDEN SCOPE:",
    passport.forbiddenScope.map((scope) => `- ${scope}`).join("\n"),
    "",
    "PRODUCT TRUTH REQUIREMENTS:",
    passport.productTruthRequirements.map((rule) => `- ${rule}`).join("\n"),
    "",
    "PUBLIC LANGUAGE RULES:",
    passport.publicLanguageRules.map((rule) => `- ${rule}`).join("\n"),
    "",
    "VALIDATION COMMANDS:",
    passport.validationCommands.map((command) => `- ${command}`).join("\n"),
    "",
    "SCREENSHOT REQUIREMENTS:",
    passport.screenshotRequirements.length
      ? passport.screenshotRequirements.map((path) => `- ${path}`).join("\n")
      : "- none unless UI changes",
    "",
    `ROLLBACK RULE: ${passport.rollbackRule}`,
    `EXPECTED COMMIT MESSAGE: ${passport.expectedCommitMessage}`,
    "",
    "Do not execute shell commands from the web app. Do not call Codex from the web app. Do not include secrets.",
  ].join("\n");
}

export function createCodexDraft(
  passport: TaskPassport,
  mode: CodexSubmitMode = "manual_only"
): CodexDraft {
  const codexReadyPrompt = promptForPassport(passport);
  const escapedPrompt = "<paste task passport prompt>";

  return {
    draftId: `draft_${mode}_${passport.taskId}`,
    taskId: passport.taskId,
    mode,
    codexReadyPrompt,
    manualCopyPasteCommand:
      "Open a terminal in the repo, review the Task Passport, then paste the prompt into Codex manually.",
    githubCommentText: `@codex ${codexReadyPrompt}`,
    codexExecCommandText: `codex exec ${escapedPrompt}`,
    codexCloudExecCommandText: `codex cloud exec ${escapedPrompt}`,
    executableFromWebApp: false,
    externalSubmissionActive: false,
    secretsIncluded: false,
    includesForbiddenScope: codexReadyPrompt.includes("FORBIDDEN SCOPE"),
    includesValidation: codexReadyPrompt.includes("VALIDATION COMMANDS"),
  };
}
