import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const workspaceRoot = process.cwd();
const requiredPaths = [
  {
    label: "Prisma schema",
    path: resolve(workspaceRoot, "prisma", "schema.prisma"),
  },
  {
    label: "Generated Prisma client entry",
    path: resolve(workspaceRoot, "lib", "db", "generated", "client", "client.ts"),
  },
];
const nextBuildIdPath = resolve(workspaceRoot, ".next", "BUILD_ID");
const nextStaticPath = resolve(workspaceRoot, ".next", "static");
const styleSourcePaths = [
  resolve(workspaceRoot, "app", "layout.tsx"),
  resolve(workspaceRoot, "app", "globals.css"),
  resolve(workspaceRoot, "app", "design-foundation.css"),
  resolve(workspaceRoot, "app", "foundation-nav.css"),
  resolve(workspaceRoot, "app", "ui-states.css"),
  resolve(workspaceRoot, "app", "compact-modes.css"),
  resolve(workspaceRoot, "app", "auth-ui.css"),
  resolve(workspaceRoot, "app", "theme-localization.css"),
];
const requiredCssSelectors = [
  ".tpm-app-body",
  ".tpm-foundation-frame",
  ".tpm-foundation-nav",
  ".tpm-product-entry",
  ".tpmv2-desktop-master",
  ".tpmv2-chart-surface",
  ".tpmv2-execution",
  ".tpm-auth-panel",
];

function fail(message) {
  console.error(`[runtime-baseline] ${message}`);
  process.exitCode = 1;
}

for (const item of requiredPaths) {
  if (!existsSync(item.path)) {
    fail(`${item.label} is missing at ${item.path}. Run npm run prisma:generate, then npm run build.`);
  }
}

if (!existsSync(nextBuildIdPath)) {
  fail("Production build output is missing. Run npm run build before npm start.");
}

function collectCssFiles(directory) {
  if (!existsSync(directory)) return [];

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) return collectCssFiles(entryPath);
    return entry.isFile() && entry.name.endsWith(".css") ? [entryPath] : [];
  });
}

if (existsSync(nextBuildIdPath)) {
  const buildMtime = statSync(nextBuildIdPath).mtimeMs;
  const staleStyleSources = styleSourcePaths.filter(
    (sourcePath) => existsSync(sourcePath) && statSync(sourcePath).mtimeMs > buildMtime + 1000,
  );

  if (staleStyleSources.length > 0) {
    fail(
      `Production build is older than styling/layout sources: ${staleStyleSources
        .map((sourcePath) => sourcePath.replace(`${workspaceRoot}\\`, ""))
        .join(", ")}. Run npm run build before npm start.`,
    );
  }

  const cssFiles = collectCssFiles(nextStaticPath);

  if (cssFiles.length === 0) {
    fail("Built CSS assets are missing under .next/static. Run npm run build before npm start.");
  } else {
    const bundledCss = cssFiles
      .map((filePath) => readFileSync(filePath, "utf8"))
      .join("\n");
    const missingSelectors = requiredCssSelectors.filter(
      (selector) => !bundledCss.includes(selector),
    );

    if (missingSelectors.length > 0) {
      fail(
        `Built CSS assets are incomplete; missing selectors: ${missingSelectors.join(
          ", ",
        )}. Run npm run build and verify global CSS imports in app/layout.tsx.`,
      );
    }
  }
}

const schemaPath = requiredPaths[0].path;
const clientPath = requiredPaths[1].path;

if (existsSync(schemaPath) && existsSync(clientPath)) {
  const schemaMtime = statSync(schemaPath).mtimeMs;
  const clientMtime = statSync(clientPath).mtimeMs;

  if (clientMtime + 1000 < schemaMtime) {
    fail("Generated Prisma client is older than prisma/schema.prisma. Run npm run prisma:generate and rebuild.");
  }
}

if (process.exitCode) {
  process.exit();
}
