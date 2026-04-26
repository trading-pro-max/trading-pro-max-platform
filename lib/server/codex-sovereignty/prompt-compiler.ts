import "server-only";

import type {
  CodexCompiledPrompt,
  CodexExecutionPermit,
  CodexTaskPassport,
} from "./types";

const redactionPattern =
  /(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|password\s*=\s*\S+|token\s*=\s*\S+|private_key\s*=\s*\S+)/gi;

function redactSensitiveText(value: string) {
  return value.replace(redactionPattern, "[redacted]");
}

function list(title: string, values: string[]) {
  return [`${title}:`, ...values.map((value) => `- ${redactSensitiveText(value)}`)].join("\n");
}

export function compileCodexTaskPrompt(
  passport: CodexTaskPassport,
  permit: CodexExecutionPermit
): CodexCompiledPrompt {
  const prompt = redactSensitiveText(
    [
      "PROJECT: Trading Pro Max",
      "MISSION:",
      passport.mission,
      "",
      "ROLE:",
      "Codex is a licensed construction worker, not a ruler. Follow the task passport, execution permit, and Product Truth exactly.",
      "",
      "SCOPE:",
      `Task ID: ${passport.taskId}`,
      `Title: ${passport.title}`,
      `Category: ${passport.category}`,
      `Risk: ${passport.riskLevel}`,
      `Owner area: ${passport.ownerMinistryOrArea}`,
      `Permit: ${permit.decision}`,
      "",
      list("ALLOWED FILES", passport.allowedFiles),
      "",
      list("FORBIDDEN FILES", passport.forbiddenFiles),
      "",
      list("ALLOWED SURFACES", passport.allowedSurfaces),
      "",
      list("FORBIDDEN SURFACES", passport.forbiddenSurfaces),
      "",
      list("NON-NEGOTIABLE FORBIDDEN SCOPE", passport.forbiddenScope),
      "",
      list("PRODUCT TRUTH", passport.productTruthRequirements),
      "",
      list("PUBLIC LANGUAGE RULE", passport.publicLanguageRules),
      "",
      list("VALIDATION COMMANDS", passport.validationCommands),
      "",
      passport.screenshotRequirements.length > 0
        ? list("SCREENSHOT REQUIREMENTS", passport.screenshotRequirements)
        : "SCREENSHOT REQUIREMENTS:\n- None unless the work becomes visual; if it does, stop and request review.",
      "",
      list("FINAL RESPONSE FORMAT", passport.finalReportFormat),
      "",
      `EXPECTED COMMIT MESSAGE: ${passport.expectedCommitMessage}`,
      "DO NOT EXPAND SCOPE.",
      "Do not activate blocked systems. Do not expose private controls. Do not include secrets, private user data, tokens, or credentials.",
    ].join("\n")
  );
  const escapedPrompt = prompt.replace(/"/g, '\\"').replace(/\r?\n/g, "\\n");
  const promptId = `prompt_${passport.taskId}`;

  return {
    promptId,
    taskId: passport.taskId,
    mode: "manual_only",
    prompt,
    manualCopyPasteCommand:
      "Open the approved external Codex environment and paste the compiled prompt manually.",
    githubCommentText: `@codex ${prompt}`,
    codexExecCommandText: `codex exec "${escapedPrompt}"`,
    codexCloudExecCommandText: `codex cloud exec --prompt "${escapedPrompt}"`,
    includesForbiddenScope: prompt.includes("NON-NEGOTIABLE FORBIDDEN SCOPE"),
    includesValidationCommands: prompt.includes("VALIDATION COMMANDS"),
    secretsIncluded: false,
    executableFromWebApp: false,
    externalSubmissionActive: false,
  };
}
