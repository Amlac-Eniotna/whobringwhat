import { vi } from "vitest";

export const prisma = {
  list: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  item: {
    count: vi.fn(),
    create: vi.fn(),
    deleteMany: vi.fn(),
    updateMany: vi.fn(),
  },
  user: {
    delete: vi.fn(),
  },
  userList: {
    upsert: vi.fn(),
    deleteMany: vi.fn(),
  },
} as unknown as (typeof import("@/lib/prisma"))["prisma"];
