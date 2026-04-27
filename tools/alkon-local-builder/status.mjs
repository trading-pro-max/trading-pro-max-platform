import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const config = JSON.parse(
  fs.readFileSync(path.join(root, "tools", "alkon-local-builder", "config.json"), "utf8")
);
const reports = ["alkon-wake-report.md", "alkon-next-command.md", "alkon-operating-mode-status.md"];

const presentReports = reports.filter((report) =>
  fs.existsSync(path.join(root, config.reportsDirectory, report))
);

console.log(
  JSON.stringify(
    {
      ok: true,
      mode: config.mode,
      status: config.status,
      readOnly: config.readOnlyDefault,
      webShellExecution: config.webShellExecution,
      codexExecution: config.codexExecution,
      externalCalls: config.externalCalls,
      presentReports,
      next: "Read Wake Report and choose one safe local action.",
    },
    null,
    2
  )
);

