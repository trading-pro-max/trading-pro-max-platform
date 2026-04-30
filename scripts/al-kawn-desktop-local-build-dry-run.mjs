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
const localPinAuthReport = join(root, "reports", "al-kawn-local-pin-passphrase-auth.md");
const packagingPreparationReport = join(
  root,
  "reports",
  "al-kawn-private-desktop-packaging-preparation.md",
);
const packageCheckScript = join(root, "scripts", "al-kawn-desktop-package-check.mjs");

const hasElectron = Boolean(dependencies.electron);
const hasTauri =
  Boolean(dependencies["@tauri-apps/api"]) || Boolean(dependencies["@tauri-apps/cli"]);
const hasNativeEntry =
  existsSync(join(root, "desktop", "main.ts")) ||
  existsSync(join(root, "desktop", "main.js")) ||
  existsSync(join(root, "desktop", "preload.ts")) ||
  existsSync(join(root, "desktop", "preload.js"));
const hasNativeShell = hasNativeEntry || hasElectron || hasTauri;
const hasPackageTool = hasElectron || hasTauri;
const hasUnsafeScript = Object.keys(scripts).some((name) =>
  /(release|publish|store|appstore|playstore|auto-?update|sign$|sign:|upload)/i.test(name),
);
const desktopArtifactPaths = [
  "release",
  "dist-electron",
  "desktop-dist",
  "app-bundle",
  join("out", "make"),
].map((relativePath) => join(root, relativePath));
const hasDesktopArtifact = desktopArtifactPaths.some((artifactPath) => existsSync(artifactPath));

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
    label: "local PIN/passphrase auth report exists",
    pass: existsSync(localPinAuthReport),
  },
  {
    label: "private desktop packaging preparation report exists",
    pass: existsSync(packagingPreparationReport),
  },
  {
    label: "desktop:package:check exists",
    pass:
      scripts["desktop:package:check"] === "node scripts/al-kawn-desktop-package-check.mjs" &&
      existsSync(packageCheckScript),
  },
  {
    label: "desktop:package:dry-run is local readiness only",
    pass:
      scripts["desktop:package:dry-run"] ===
      "node scripts/al-kawn-desktop-local-build-dry-run.mjs",
  },
  {
    label: "native shell is not accidentally present",
    pass: !hasNativeShell,
  },
  {
    label: "packaging tool is not accidentally present",
    pass: !hasPackageTool,
  },
  {
    label: "no release/signing/publish/upload script is declared",
    pass: !hasUnsafeScript,
  },
  {
    label: "no desktop release artifact exists",
    pass: !hasDesktopArtifact,
  },
];

const failed = checks.filter((check) => !check.pass);

console.log("Al-Kawn private desktop local build dry run");
console.log("local_dry_run_supported=false");
console.log("dry_run_executed=readiness_only");
console.log("native_shell=future_gate");
console.log("package_tool=future_gate");
console.log("local_auth=ready_with_notes");
console.log("local_pin_passphrase_auth=preserved");
console.log("artifacts_created=false");
console.log("generated_artifacts=none");
console.log("public_distribution=blocked");
console.log("production_signing=blocked_future_gate");
console.log("secrets_in_bundle=blocked");
console.log("product_truth=overrides_local_build");
for (const check of checks) {
  console.log(`${check.pass ? "PASS" : "FAIL"} ${check.label}`);
}

if (failed.length > 0) {
  process.exitCode = 1;
}
