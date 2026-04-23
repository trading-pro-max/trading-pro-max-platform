import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

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
