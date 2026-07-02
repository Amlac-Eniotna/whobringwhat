import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { redirectList } from "@/actions/create-list";
import { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

vi.mock("@/lib/prisma");
vi.mock("@/lib/rate-limit");

const rateLimitMock = rateLimit as unknown as Mock;
const createList = prisma.list.create as unknown as Mock;

const fakeList = {
  id: "abc123abc123abc1",
  title: "Titre de la liste",
  createdAt: new Date("2026-01-01"),
  updateAt: new Date("2026-01-01"),
};

function collisionError() {
  return new Prisma.PrismaClientKnownRequestError(
    "Unique constraint failed on the fields: (`id`)",
    { code: "P2002", clientVersion: "7.8.0", meta: { target: ["id"] } },
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("redirectList", () => {
  it("refuse quand la limite de requêtes est atteinte", async () => {
    rateLimitMock.mockReturnValueOnce({ ok: false, remaining: 0 });

    const result = await redirectList();

    expect(result).toEqual({
      success: false,
      error: "Trop de requêtes, réessayez dans une minute.",
    });
    expect(createList).not.toHaveBeenCalled();
  });

  it("crée une liste avec un ID base64url de 16 caractères et le titre par défaut", async () => {
    createList.mockResolvedValueOnce(fakeList);

    const result = await redirectList();

    expect(result).toEqual({ success: true, listId: "abc123abc123abc1" });
    expect(createList).toHaveBeenCalledTimes(1);
    const args = createList.mock.calls[0][0];
    expect(args.data.title).toBe("Titre de la liste");
    expect(args.data.id).toMatch(/^[A-Za-z0-9_-]{16}$/);
  });

  it("réessaie avec un nouvel ID en cas de collision P2002", async () => {
    createList
      .mockRejectedValueOnce(collisionError())
      .mockResolvedValueOnce(fakeList);

    const result = await redirectList();

    expect(result).toEqual({ success: true, listId: "abc123abc123abc1" });
    expect(createList).toHaveBeenCalledTimes(2);
    const [first, second] = createList.mock.calls;
    expect(first[0].data.id).not.toBe(second[0].data.id);
  });

  it("renvoie une erreur générique si la création échoue pour une autre raison", async () => {
    createList.mockRejectedValueOnce(new Error("db down"));

    const result = await redirectList();

    expect(result).toEqual({
      success: false,
      error: "Impossible de créer la liste. Réessayez.",
    });
  });
});
