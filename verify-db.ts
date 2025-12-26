
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { Pool } from "pg";
import { PrismaClient } from "./lib/generated/prisma";

dotenv.config();

async function main() {
  const connectionString = process.env.DATABASE_URL;
  console.log("Testing connection to:", connectionString?.split("@")[1]); // Log host only for security

  if (!connectionString) {
    throw new Error("DATABASE_URL is missing");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Connecting...");
    await prisma.$connect();
    console.log("Connected successfully!");
    
    const count = await prisma.list.count();
    console.log("List count:", count);

    await prisma.$disconnect();
    console.log("Disconnected.");
  } catch (e) {
    console.error("Connection failed:", e);
    process.exit(1);
  }
}

main();
