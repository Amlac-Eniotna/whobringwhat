import { vi } from "vitest";

export const auth = {
  api: {
    getSession: vi.fn(),
  },
} as unknown as (typeof import("@/lib/auth"))["auth"];
