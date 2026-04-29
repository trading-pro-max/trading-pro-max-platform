import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};
const scripts = packageJson.scripts ?? {};

const desktopRoutePath = join(root, "app", "desktop", "kawn", "page.tsx");
const packagingGateReport = join(root, "reports", "al-kawn-private-desktop-packaging-gate.md");
const localAuthGateReport = join(root, "reports", "al-kawn-local-packaged-auth-gate.md");
const localAuthGateModel = join(root, "lib", "server", "universe", "local-packaged-auth-gate");

const hasElectron = Boolean(dependencies.electron);
const hasTauri =
  Boolean(dependencies["@tauri-apps/api"]) || Boolean(dependencies["@tauri-apps/cli"]);
const hasNativeShell = existsSync(join(root, "desktop", "main.ts")) ||
  existsSync(join(root, "desktop", "main.js")) ||
  existsSync(join(root, "desktop", "preload.ts")) ||
  existsSync(join(root, "desktop", "preload.js")) ||
  hasElectron ||
  hasTauri;
const hasUnsafeScript = Object.keys(scripts).some((name) =>
  /(release|publish|store|appstore|playstore|auto-?update|sign$|sign:|upload)/i.test(name),
);

const checks = [
  {
    label: "/desktop/kawn route exists",
    pass: existsSync(desktopRoutePath),
  },
  {
    label: "private desktop packaging gate report exists",
    pass: existsSync(packagingGateReport),
  },
  {
    label: "local packaged auth gate report exists",
    pass: existsSync(localAuthGateReport),
  },
  {
    label: "local packaged auth gate model exists",
    pass: existsSync(localAuthGateModel),
  },
  {
    label: "no Electron dependency is declared",
    pass: !hasElectron,
  },
  {
    label: "no Tauri dependency is declared",
    pass: !hasTauri,
  },
  {
    label: "native shell is not accidentally present",
    pass: !hasNativeShell,
  },
  {
    label: "no release/signing/publish/upload script is declared",
    pass: !hasUnsafeScript,
  },
];

const failed = checks.filter((check) => !check.pass);

console.log("Al-Kawn private desktop package check");
console.log("packaging_supported_now=false");
console.log("native_shell=future_gate");
console.log("packaging_tool=future_gate");
console.log("safe_package_script=desktop:package:check");
console.log("public_distribution=blocked");
console.log("signing=blocked_future_gate");
console.log("secrets_in_bundle=blocked");
for (const check of checks) {
  console.log(`${check.pass ? "PASS" : "FAIL"} ${check.label}`);
}

if (failed.length > 0) {
  process.exitCode = 1;
}
