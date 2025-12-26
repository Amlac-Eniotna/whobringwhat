import 'dotenv/config';
import { defineConfig } from "prisma/config";

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.PRISMA_DATABASE_URL;

if (!url) {
  throw new Error(
    "No valid database connection string found in environment (DATABASE_URL, POSTGRES_URL, PRISMA_DATABASE_URL)"
  );
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: url
  }
});