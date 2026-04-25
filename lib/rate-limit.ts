import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

const MAX_KEYS = 5000;
const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || b.resetAt < now) {
    if (buckets.size >= MAX_KEYS) {
      const firstKey = buckets.keys().next().value;
      if (firstKey) buckets.delete(firstKey);
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (b.count >= limit) return { ok: false, remaining: 0 };
  b.count += 1;
  return { ok: true, remaining: limit - b.count };
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}
