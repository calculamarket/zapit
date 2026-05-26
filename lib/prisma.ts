import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import path from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const getPrismaClient = () => {
  const dbPath = path.join(process.cwd(), "dev.db");
  const db = new Database(dbPath);
  const adapter = new PrismaBetterSqlite3(db);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
