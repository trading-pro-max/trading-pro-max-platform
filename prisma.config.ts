import "dotenv/config";
import { defineConfig } from "prisma/config";

const localDatabaseUrl = "file:./prisma/dev.db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL || localDatabaseUrl,
  },
});
