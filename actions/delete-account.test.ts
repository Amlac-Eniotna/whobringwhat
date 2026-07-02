import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { deleteAccount } from "@/actions/delete-account";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

vi.mock("@/lib/auth");
vi.mock("@/lib/prisma");
vi.mock("@/lib/rate-limit");
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

const rateLimitMock = rateLimit as unknown as Mock;
const getSession = auth.api.getSession as unknown as Mock;
const deleteUser = prisma.user.delete as unknown as Mock;

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("deleteAccount", () => {
  it("refuse quand la limite de requêtes est atteinte", async () => {
    rateLimitMock.mockReturnValueOnce({ ok: false, remaining: 0 });

    const result = await deleteAccount();

    expect(result).toEqual({
      success: false,
      error: "Trop de requêtes, réessayez dans une minute.",
    });
    expect(getSession).not.toHaveBeenCalled();
  });

  it("refuse sans session", async () => {
    getSession.mockResolvedValueOnce(null);

    const result = await deleteAccount();

    expect(result).toEqual({
      success: false,
      error: "Vous n'êtes pas connecté.",
    });
    expect(deleteUser).not.toHaveBeenCalled();
  });

  it("supprime l'utilisateur de la session", async () => {
    getSession.mockResolvedValueOnce({ user: { id: "user_1" } });
    deleteUser.mockResolvedValueOnce({ id: "user_1" });

    const result = await deleteAccount();

    expect(result).toEqual({ success: true });
    expect(deleteUser).toHaveBeenCalledWith({ where: { id: "user_1" } });
    expect(rateLimitMock).toHaveBeenCalledWith(
      "delete-account:203.0.113.1",
      5,
      60_000,
    );
  });

  it("renvoie une erreur générique si la suppression échoue", async () => {
    getSession.mockResolvedValueOnce({ user: { id: "user_1" } });
    deleteUser.mockRejectedValueOnce(new Error("db down"));

    const result = await deleteAccount();

    expect(result).toEqual({
      success: false,
      error: "Impossible de supprimer le compte. Réessayez.",
    });
  });
});
