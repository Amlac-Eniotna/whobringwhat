import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// Parse DATABASE_URL to extract connection details
const databaseUrl = process.env.DATABASE_URL || "";
const urlMatch = databaseUrl.match(
  /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/
);

if (!urlMatch) {
  throw new Error("Invalid DATABASE_URL format");
}

const [, user, password, host, port, database] = urlMatch;

const adapter = new PrismaMariaDb({
  host,
  user,
  password,
  database,
  port: parseInt(port, 10),
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
