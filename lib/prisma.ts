import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// Parse DATABASE_URL to extract connection details
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const url = new URL(databaseUrl);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1), // Remove leading slash
  port: parseInt(url.port, 10) || 3306, // Default to 3306 if port is missing
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
