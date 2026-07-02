import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { addItem } from "@/actions/add-item";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

vi.mock("@/lib/prisma");
vi.mock("@/lib/rate-limit");
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const rateLimitMock = rateLimit as unknown as Mock;
const findList = prisma.list.findUnique as unknown as Mock;
const countItems = prisma.item.count as unknown as Mock;
const createItem = prisma.item.create as unknown as Mock;
const revalidatePathMock = revalidatePath as unknown as Mock;

const fakeList = {
  id: "list_1",
  title: "Courses",
  createdAt: new Date("2026-01-01"),
  updateAt: new Date("2026-01-01"),
};

const fakeItem = {
  id: 1,
  listId: "list_1",
  title: "Pain",
  who: "Zoé",
  createdAt: new Date("2026-01-01"),
  updateAt: new Date("2026-01-01"),
};

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("addItem", () => {
  it("refuse quand la limite de requêtes est atteinte", async () => {
    rateLimitMock.mockReturnValueOnce({ ok: false, remaining: 0 });

    const result = await addItem({ listId: "list_1", title: "Pain" });

    expect(result).toEqual({
      success: false,
      error: { _form: ["Trop de requêtes, réessayez dans une minute."] },
    });
    expect(findList).not.toHaveBeenCalled();
  });

  it("rejette un titre vide", async () => {
    const result = await addItem({ listId: "list_1", title: "" });

    expect(result).toEqual({
      success: false,
      error: { title: ["Le nom de l'article est requis"] },
    });
  });

  it("rejette un titre de plus de 100 caractères", async () => {
    const result = await addItem({
      listId: "list_1",
      title: "a".repeat(101),
    });

    expect(result).toEqual({
      success: false,
      error: { title: ["Le nom de l'article est trop long"] },
    });
  });

  it("rejette un prénom de plus de 50 caractères", async () => {
    const result = await addItem({
      listId: "list_1",
      title: "Pain",
      who: "a".repeat(51),
    });

    expect(result).toEqual({
      success: false,
      error: { who: ["Prénom trop long"] },
    });
  });

  it("échoue si la liste n'existe pas", async () => {
    findList.mockResolvedValueOnce(null);

    const result = await addItem({ listId: "absente", title: "Pain" });

    expect(result).toEqual({
      success: false,
      error: { listId: ["List not found"] },
    });
    expect(createItem).not.toHaveBeenCalled();
  });

  it("refuse d'ajouter au-delà de 500 articles", async () => {
    findList.mockResolvedValueOnce(fakeList);
    countItems.mockResolvedValueOnce(500);

    const result = await addItem({ listId: "list_1", title: "Pain" });

    expect(result).toEqual({
      success: false,
      error: {
        _form: ["Cette liste a atteint la limite de 500 articles."],
      },
    });
    expect(createItem).not.toHaveBeenCalled();
  });

  it("crée l'article et revalide la page de la liste", async () => {
    findList.mockResolvedValueOnce(fakeList);
    countItems.mockResolvedValueOnce(0);
    createItem.mockResolvedValueOnce(fakeItem);

    const result = await addItem({
      listId: "list_1",
      title: "Pain",
      who: "Zoé",
    });

    expect(result).toEqual({ success: true, data: fakeItem });
    expect(createItem).toHaveBeenCalledWith({
      data: { listId: "list_1", title: "Pain", who: "Zoé" },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/list_1");
  });

  it("accepte un FormData (who absent → undefined)", async () => {
    findList.mockResolvedValueOnce(fakeList);
    countItems.mockResolvedValueOnce(0);
    createItem.mockResolvedValueOnce({ ...fakeItem, who: null });

    const formData = new FormData();
    formData.append("listId", "list_1");
    formData.append("title", "Pain");

    const result = await addItem(formData);

    expect(result).toEqual({
      success: true,
      data: { ...fakeItem, who: null },
    });
    expect(createItem).toHaveBeenCalledWith({
      data: { listId: "list_1", title: "Pain", who: undefined },
    });
  });

  it("renvoie une erreur générique si Prisma échoue", async () => {
    findList.mockRejectedValueOnce(new Error("db down"));

    const result = await addItem({ listId: "list_1", title: "Pain" });

    expect(result).toEqual({
      success: false,
      error: { _form: ["Failed to add item. Please try again."] },
    });
  });
});
