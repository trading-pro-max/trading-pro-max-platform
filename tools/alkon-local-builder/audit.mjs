import fs from "node:fs";
import path from "node:path";

const requiredReports = [
  "alkon-wake-report.md",
  "alkon-last-full-report.md",
  "alkon-execution-history.md",
  "alkon-next-command.md",
  "alkon-operating-mode-status.md",
  "alkon-kernel-status.md",
  "alkon-a-z-operating-status.md",
];

const missing = requiredReports.filter(
  (report) => !fs.existsSync(path.join(process.cwd(), "reports", report))
);

console.log(
  JSON.stringify(
    {
      ok: missing.length === 0,
      mode: "alkon_local_builder_audit",
      missing,
      unsafeActivation: false,
      externalCalls: false,
      webShellExecution: false,
    },
    null,
    2
  )
);

