import "dotenv/config";
import { closeSync, existsSync, mkdirSync, openSync } from "node:fs";
import { dirname, join } from "node:path";
import { defineConfig } from "prisma/config";

const localDatabaseUrl = "file:./prisma/dev.db";
const datasourceUrl = process.env.DATABASE_URL || localDatabaseUrl;

function ensureLocalSqliteDatabase() {
  const databasePath = join(process.cwd(), "prisma", "dev.db");

  mkdirSync(dirname(databasePath), { recursive: true });

  if (!existsSync(databasePath)) {
    closeSync(openSync(databasePath, "a"));
  }
}

if (datasourceUrl === localDatabaseUrl) {
  ensureLocalSqliteDatabase();
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl,
  },
});
