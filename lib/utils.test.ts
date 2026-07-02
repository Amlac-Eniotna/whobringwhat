import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("fusionne les classes et ignore les valeurs falsy", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });

  it("résout les conflits Tailwind en faveur de la dernière classe", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
