import { vi } from "vitest";

export const getClientIp = vi.fn(async () => "203.0.113.1");
export const rateLimit = vi.fn(() => ({ ok: true, remaining: 10 }));
