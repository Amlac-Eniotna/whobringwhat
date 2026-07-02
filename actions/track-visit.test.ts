import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { trackVisit } from "@/actions/track-visit";
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
const findList = prisma.list.findUnique as unknown as Mock;
const upsertUserList = prisma.userList.upsert as unknown as Mock;

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("trackVisit", () => {
  it("échoue silencieusement sans listId, avant même le rate-limit", async () => {
    const result = await trackVisit("");

    expect(result).toEqual({ success: false });
    expect(rateLimitMock).not.toHaveBeenCalled();
  });

  it("échoue silencieusement quand la limite de requêtes est atteinte", async () => {
    rateLimitMock.mockReturnValueOnce({ ok: false, remaining: 0 });

    const result = await trackVisit("list_1");

    expect(result).toEqual({ success: false });
    expect(getSession).not.toHaveBeenCalled();
  });

  it("ne trace rien sans session, sans échouer", async () => {
    getSession.mockResolvedValueOnce(null);

    const result = await trackVisit("list_1");

    expect(result).toEqual({ success: true, tracked: false });
    expect(findList).not.toHaveBeenCalled();
  });

  it("échoue si la liste n'existe pas", async () => {
    getSession.mockResolvedValueOnce({ user: { id: "user_1" } });
    findList.mockResolvedValueOnce(null);

    const result = await trackVisit("absente");

    expect(result).toEqual({ success: false });
    expect(upsertUserList).not.toHaveBeenCalled();
  });

  it("rattache la liste à l'utilisateur connecté (upsert idempotent)", async () => {
    getSession.mockResolvedValueOnce({ user: { id: "user_1" } });
    findList.mockResolvedValueOnce({ id: "list_1" });
    upsertUserList.mockResolvedValueOnce({});

    const result = await trackVisit("list_1");

    expect(result).toEqual({ success: true, tracked: true });
    expect(upsertUserList).toHaveBeenCalledWith({
      where: { userId_listId: { userId: "user_1", listId: "list_1" } },
      create: { userId: "user_1", listId: "list_1" },
      update: {},
    });
  });

  it("échoue silencieusement si Prisma échoue", async () => {
    getSession.mockResolvedValueOnce({ user: { id: "user_1" } });
    findList.mockRejectedValueOnce(new Error("db down"));

    const result = await trackVisit("list_1");

    expect(result).toEqual({ success: false });
  });
});
