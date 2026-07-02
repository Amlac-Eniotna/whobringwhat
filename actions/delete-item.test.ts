import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { deleteItem } from "@/actions/delete-item";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

vi.mock("@/lib/prisma");
vi.mock("@/lib/rate-limit");
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const rateLimitMock = rateLimit as unknown as Mock;
const deleteMany = prisma.item.deleteMany as unknown as Mock;
const revalidatePathMock = revalidatePath as unknown as Mock;

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("deleteItem", () => {
  it("refuse quand la limite de requêtes est atteinte", async () => {
    rateLimitMock.mockReturnValueOnce({ ok: false, remaining: 0 });

    const result = await deleteItem({ id: 5, listId: "list_1" });

    expect(result).toEqual({
      success: false,
      error: { _form: ["Trop de requêtes, réessayez dans une minute."] },
    });
    expect(deleteMany).not.toHaveBeenCalled();
  });

  it("rejette un id non positif", async () => {
    const result = await deleteItem({ id: 0, listId: "list_1" });

    expect(result).toEqual({
      success: false,
      error: { id: ["Item ID is required"] },
    });
  });

  it("parse un FormData et supprime l'item ciblé", async () => {
    deleteMany.mockResolvedValueOnce({ count: 1 });

    const formData = new FormData();
    formData.append("id", "5");
    formData.append("listId", "list_1");

    const result = await deleteItem(formData);

    expect(result).toEqual({ success: true });
    expect(deleteMany).toHaveBeenCalledWith({
      where: { id: 5, listId: "list_1" },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/list_1");
  });

  it("échoue si aucun item ne correspond (count 0)", async () => {
    deleteMany.mockResolvedValueOnce({ count: 0 });

    const result = await deleteItem({ id: 99, listId: "list_1" });

    expect(result).toEqual({
      success: false,
      error: { id: ["Item not found"] },
    });
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("renvoie une erreur générique si Prisma échoue", async () => {
    deleteMany.mockRejectedValueOnce(new Error("db down"));

    const result = await deleteItem({ id: 5, listId: "list_1" });

    expect(result).toEqual({
      success: false,
      error: { _form: ["Failed to delete item. Please try again."] },
    });
  });
});
