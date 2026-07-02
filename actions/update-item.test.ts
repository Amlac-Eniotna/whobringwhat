import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { updateItem } from "@/actions/update-item";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

vi.mock("@/lib/prisma");
vi.mock("@/lib/rate-limit");
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const rateLimitMock = rateLimit as unknown as Mock;
const updateMany = prisma.item.updateMany as unknown as Mock;
const revalidatePathMock = revalidatePath as unknown as Mock;

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("updateItem", () => {
  it("refuse quand la limite de requêtes est atteinte", async () => {
    rateLimitMock.mockReturnValueOnce({ ok: false, remaining: 0 });

    const result = await updateItem({
      id: 5,
      listId: "list_1",
      title: "Fromage",
    });

    expect(result).toEqual({
      success: false,
      error: { _form: ["Trop de requêtes, réessayez dans une minute."] },
    });
    expect(updateMany).not.toHaveBeenCalled();
  });

  it("rejette un titre vide", async () => {
    const result = await updateItem({ id: 5, listId: "list_1", title: "" });

    expect(result).toEqual({
      success: false,
      error: { title: ["Item name is required"] },
    });
  });

  it("échoue si aucun item ne correspond (count 0)", async () => {
    updateMany.mockResolvedValueOnce({ count: 0 });

    const result = await updateItem({
      id: 99,
      listId: "list_1",
      title: "Fromage",
    });

    expect(result).toEqual({
      success: false,
      error: { id: ["Item not found"] },
    });
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("met à jour l'item et revalide la page de la liste", async () => {
    updateMany.mockResolvedValueOnce({ count: 1 });

    const result = await updateItem({
      id: 5,
      listId: "list_1",
      title: "Fromage",
      who: "Ana",
    });

    expect(result).toEqual({ success: true });
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: 5, listId: "list_1" },
      data: { title: "Fromage", who: "Ana" },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/list_1");
  });

  it("renvoie une erreur générique si Prisma échoue", async () => {
    updateMany.mockRejectedValueOnce(new Error("db down"));

    const result = await updateItem({
      id: 5,
      listId: "list_1",
      title: "Fromage",
    });

    expect(result).toEqual({
      success: false,
      error: { _form: ["Failed to update item. Please try again."] },
    });
  });
});
