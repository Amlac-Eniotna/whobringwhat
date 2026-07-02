import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { removeFromMyLists } from "@/actions/remove-from-my-lists";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

vi.mock("@/lib/auth");
vi.mock("@/lib/prisma");
vi.mock("@/lib/rate-limit");
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

const rateLimitMock = rateLimit as unknown as Mock;
const getSession = auth.api.getSession as unknown as Mock;
const deleteUserLists = prisma.userList.deleteMany as unknown as Mock;
const revalidatePathMock = revalidatePath as unknown as Mock;

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("removeFromMyLists", () => {
  it("refuse quand la limite de requêtes est atteinte", async () => {
    rateLimitMock.mockReturnValueOnce({ ok: false, remaining: 0 });

    const result = await removeFromMyLists("list_1");

    expect(result).toEqual({
      success: false,
      error: "Trop de requêtes, réessayez dans une minute.",
    });
    expect(getSession).not.toHaveBeenCalled();
  });

  it("refuse sans session", async () => {
    getSession.mockResolvedValueOnce(null);

    const result = await removeFromMyLists("list_1");

    expect(result).toEqual({
      success: false,
      error: "Vous n'êtes pas connecté.",
    });
    expect(deleteUserLists).not.toHaveBeenCalled();
  });

  it("retire le lien et revalide /mes-listes", async () => {
    getSession.mockResolvedValueOnce({ user: { id: "user_1" } });
    deleteUserLists.mockResolvedValueOnce({ count: 1 });

    const result = await removeFromMyLists("list_1");

    expect(result).toEqual({ success: true });
    expect(deleteUserLists).toHaveBeenCalledWith({
      where: { userId: "user_1", listId: "list_1" },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/mes-listes");
    expect(rateLimitMock).toHaveBeenCalledWith(
      "remove-from-my-lists:203.0.113.1",
      30,
      60_000,
    );
  });

  it("renvoie une erreur générique si Prisma échoue", async () => {
    getSession.mockResolvedValueOnce({ user: { id: "user_1" } });
    deleteUserLists.mockRejectedValueOnce(new Error("db down"));

    const result = await removeFromMyLists("list_1");

    expect(result).toEqual({
      success: false,
      error: "Impossible de retirer la liste. Réessayez.",
    });
  });
});
