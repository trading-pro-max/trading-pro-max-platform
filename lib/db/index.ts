export { prisma, type TradingProMaxPrismaClient } from "./client";
export {
  getPrismaDatabaseUrl,
  getPrismaSingleton,
  LOCAL_SQLITE_DATABASE_URL,
  PRISMA_CLIENT_OUTPUT_PATH,
  PRISMA_SCHEMA_PATH,
  resetPrismaSingletonForTests,
} from "./prisma-foundation";
