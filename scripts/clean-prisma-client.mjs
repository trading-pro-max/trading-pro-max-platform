import { existsSync, rmSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";

const workspaceRoot = process.cwd();
const generatedClientPath = resolve(workspaceRoot, "lib", "db", "generated", "client");
const relativePath = relative(workspaceRoot, generatedClientPath);

if (
  !relativePath ||
  relativePath.startsWith("..") ||
  isAbsolute(relativePath)
) {
  throw new Error(
    `Refusing to clean Prisma client outside workspace: ${generatedClientPath}`,
  );
}

if (existsSync(generatedClientPath)) {
  rmSync(generatedClientPath, { recursive: true, force: true });
}
