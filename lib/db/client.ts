import "server-only";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/client/client";
import { getPrismaDatabaseUrl, getPrismaSingleton } from "./prisma-foundation";

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({
    url: getPrismaDatabaseUrl(),
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export type TradingProMaxPrismaClient = ReturnType<typeof createPrismaClient>;

export const prisma = getPrismaSingleton(createPrismaClient);
