import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { updateListTitle } from "@/actions/update-list-title";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

vi.mock("@/lib/prisma");
vi.mock("@/lib/rate-limit");
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const rateLimitMock = rateLimit as unknown as Mock;
const findList = prisma.list.findUnique as unknown as Mock;
const updateList = prisma.list.update as unknown as Mock;
const revalidatePathMock = revalidatePath as unknown as Mock;

const fakeList = {
  id: "list_1",
  title: "Courses",
  createdAt: new Date("2026-01-01"),
  updateAt: new Date("2026-01-01"),
};

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("updateListTitle", () => {
  it("refuse quand la limite de requêtes est atteinte", async () => {
    rateLimitMock.mockReturnValueOnce({ ok: false, remaining: 0 });

    const result = await updateListTitle({ id: "list_1", title: "Fête" });

    expect(result).toEqual({
      success: false,
      error: { _form: ["Trop de requêtes, réessayez dans une minute."] },
    });
    expect(findList).not.toHaveBeenCalled();
  });

  it("rejette un titre vide", async () => {
    const result = await updateListTitle({ id: "list_1", title: "" });

    expect(result).toEqual({
      success: false,
      error: { title: ["Le titre est requis"] },
    });
  });

  it("rejette un id vide", async () => {
    const result = await updateListTitle({ id: "", title: "Fête" });

    expect(result).toEqual({
      success: false,
      error: { id: ["L'ID de la liste est requis"] },
    });
  });

  it("rejette un titre de plus de 100 caractères", async () => {
    const result = await updateListTitle({
      id: "list_1",
      title: "a".repeat(101),
    });

    expect(result).toEqual({
      success: false,
      error: { title: ["Titre est trop long"] },
    });
  });

  it("échoue si la liste n'existe pas", async () => {
    findList.mockResolvedValueOnce(null);

    const result = await updateListTitle({ id: "absente", title: "Fête" });

    expect(result).toEqual({
      success: false,
      error: { id: ["List not found"] },
    });
    expect(updateList).not.toHaveBeenCalled();
  });

  it("met à jour le titre et revalide la page de la liste", async () => {
    findList.mockResolvedValueOnce(fakeList);
    updateList.mockResolvedValueOnce({ ...fakeList, title: "Pique-nique" });

    const result = await updateListTitle({
      id: "list_1",
      title: "Pique-nique",
    });

    expect(result).toEqual({
      success: true,
      data: { ...fakeList, title: "Pique-nique" },
    });
    expect(updateList).toHaveBeenCalledWith({
      where: { id: "list_1" },
      data: { title: "Pique-nique" },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/list_1");
    expect(rateLimitMock).toHaveBeenCalledWith(
      "update-list-title:203.0.113.1",
      60,
      60_000,
    );
  });

  it("accepte un FormData et met à jour le titre", async () => {
    findList.mockResolvedValueOnce(fakeList);
    updateList.mockResolvedValueOnce({ ...fakeList, title: "Pique-nique" });

    const formData = new FormData();
    formData.append("id", "list_1");
    formData.append("title", "Pique-nique");

    const result = await updateListTitle(formData);

    expect(result).toEqual({
      success: true,
      data: { ...fakeList, title: "Pique-nique" },
    });
  });

  it("renvoie une erreur générique si Prisma échoue", async () => {
    findList.mockRejectedValueOnce(new Error("db down"));

    const result = await updateListTitle({ id: "list_1", title: "Fête" });

    expect(result).toEqual({
      success: false,
      error: { _form: ["Failed to update list title. Please try again."] },
    });
  });
});
