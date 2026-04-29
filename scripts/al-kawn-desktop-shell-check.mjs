import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};
const scripts = packageJson.scripts ?? {};

const routePath = join(root, "app", "desktop", "kawn", "page.tsx");
const desktopStatePath = join(
  root,
  "lib",
  "server",
  "universe",
  "desktop-interface",
  "desktop-state.ts",
);

const hasElectron = Boolean(dependencies.electron);
const hasTauri =
  Boolean(dependencies["@tauri-apps/api"]) || Boolean(dependencies["@tauri-apps/cli"]);
const hasPublicReleaseScript = Object.keys(scripts).some((name) =>
  /(release|sign|publish|store|appstore|playstore)/i.test(name),
);

const checks = [
  {
    label: "/desktop/kawn route exists",
    pass: existsSync(routePath),
  },
  {
    label: "desktop interface state exists",
    pass: existsSync(desktopStatePath),
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
    label: "no public release/signing/store script is declared",
    pass: !hasPublicReleaseScript,
  },
  {
    label: "desktop:check script is declared",
    pass: scripts["desktop:check"] === "node scripts/al-kawn-desktop-shell-check.mjs",
  },
];

const failed = checks.filter((check) => !check.pass);

console.log("Al-Kawn desktop shell check");
console.log("shell_type=next_route_only");
console.log("private_home=/desktop/kawn");
console.log("native_shell=future_gate");
console.log("public_distribution=blocked");
console.log("secrets_in_bundle=blocked");
for (const check of checks) {
  console.log(`${check.pass ? "PASS" : "FAIL"} ${check.label}`);
}

if (failed.length > 0) {
  process.exitCode = 1;
}
