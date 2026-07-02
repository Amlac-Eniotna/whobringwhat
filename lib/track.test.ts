import { afterEach, describe, expect, it, vi } from "vitest";
import { trackEvent } from "@/lib/track";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("trackEvent", () => {
  it("ne fait rien sans window (environnement serveur)", () => {
    expect(() => trackEvent("evt")).not.toThrow();
  });

  it("ne fait rien si window.op n'est pas une fonction", () => {
    vi.stubGlobal("window", {});
    expect(() => trackEvent("evt")).not.toThrow();
  });

  it("appelle window.op('track', name, properties)", () => {
    const op = vi.fn();
    vi.stubGlobal("window", { op });
    trackEvent("list_created", { listId: "abc" });
    expect(op).toHaveBeenCalledWith("track", "list_created", {
      listId: "abc",
    });
  });
});
