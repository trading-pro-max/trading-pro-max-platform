import "server-only";

export const PRISMA_SCHEMA_PATH = "prisma/schema.prisma";
export const PRISMA_CLIENT_OUTPUT_PATH = "lib/db/generated/client";
export const LOCAL_SQLITE_DATABASE_URL = "file:./prisma/dev.db";

export function getPrismaDatabaseUrl() {
  return process.env.DATABASE_URL || LOCAL_SQLITE_DATABASE_URL;
}

type PrismaClientFactory<TClient> = () => TClient;

const globalForPrisma = globalThis as typeof globalThis & {
  tradingProMaxPrisma?: unknown;
};

export function getPrismaSingleton<TClient>(
  createClient: PrismaClientFactory<TClient>
): TClient {
  if (!globalForPrisma.tradingProMaxPrisma) {
    globalForPrisma.tradingProMaxPrisma = createClient();
  }

  return globalForPrisma.tradingProMaxPrisma as TClient;
}

export function resetPrismaSingletonForTests() {
  if (process.env.NODE_ENV !== "test") return;

  globalForPrisma.tradingProMaxPrisma = undefined;
}
