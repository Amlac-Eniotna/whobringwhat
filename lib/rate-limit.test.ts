import { headers } from "next/headers";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

vi.mock("next/headers", () => ({ headers: vi.fn() }));

const headersMock = headers as unknown as Mock;

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("autorise sous la limite et décrémente remaining", () => {
    expect(rateLimit("t1", 3, 60_000)).toEqual({ ok: true, remaining: 2 });
    expect(rateLimit("t1", 3, 60_000)).toEqual({ ok: true, remaining: 1 });
    expect(rateLimit("t1", 3, 60_000)).toEqual({ ok: true, remaining: 0 });
  });

  it("bloque une fois la limite atteinte", () => {
    rateLimit("t2", 1, 60_000);
    expect(rateLimit("t2", 1, 60_000)).toEqual({ ok: false, remaining: 0 });
  });

  it("réinitialise le compteur après expiration de la fenêtre", () => {
    rateLimit("t3", 1, 60_000);
    expect(rateLimit("t3", 1, 60_000).ok).toBe(false);
    vi.advanceTimersByTime(60_001);
    expect(rateLimit("t3", 1, 60_000).ok).toBe(true);
  });

  it("évince la plus ancienne clé quand MAX_KEYS (5000) est atteint", () => {
    // "evict-target" est épuisée (limit 1). On insère ensuite 5000 clés :
    // la Map plafonne à 5000 entrées en évinçant les plus anciennes (FIFO),
    // donc "evict-target" est évincée. Un nouvel appel repart alors de zéro.
    rateLimit("evict-target", 1, 60_000);
    expect(rateLimit("evict-target", 1, 60_000).ok).toBe(false);
    for (let i = 0; i < 5000; i++) {
      rateLimit(`filler-${i}`, 1, 60_000);
    }
    expect(rateLimit("evict-target", 1, 60_000).ok).toBe(true);
  });
});

describe("getClientIp", () => {
  it("prend la première IP de x-forwarded-for", async () => {
    headersMock.mockResolvedValueOnce(
      new Headers({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" }),
    );
    expect(await getClientIp()).toBe("1.2.3.4");
  });

  it("se replie sur x-real-ip", async () => {
    headersMock.mockResolvedValueOnce(new Headers({ "x-real-ip": "9.8.7.6" }));
    expect(await getClientIp()).toBe("9.8.7.6");
  });

  it('renvoie "unknown" sans en-tête IP', async () => {
    headersMock.mockResolvedValueOnce(new Headers());
    expect(await getClientIp()).toBe("unknown");
  });
});
