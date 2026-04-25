"use server";

import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const AddItemSchema = z.object({
  listId: z.string().min(1, "L'ID de la liste est requis"),
  title: z
    .string()
    .min(1, "Le nom de l'article est requis")
    .max(100, "Le nom de l'article est trop long"),
  who: z.string().max(50, "Prénom trop long").optional(),
});

export type AddItemInput = z.infer<typeof AddItemSchema>;

const MAX_ITEMS_PER_LIST = 500;

export async function addItem(formData: FormData | AddItemInput) {
  try {
    const ip = await getClientIp();
    const limit = rateLimit(`add-item:${ip}`, 30, 60_000);
    if (!limit.ok) {
      return {
        success: false,
        error: { _form: ["Trop de requêtes, réessayez dans une minute."] },
      };
    }

    const inputData =
      formData instanceof FormData
        ? {
            listId: formData.get("listId")?.toString() || "",
            title: formData.get("title")?.toString() || "",
            who: formData.get("who")?.toString() || undefined,
          }
        : formData;

    const validatedData = AddItemSchema.safeParse(inputData);

    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.flatten().fieldErrors,
      };
    }

    const list = await prisma.list.findUnique({
      where: { id: validatedData.data.listId },
    });

    if (!list) {
      return {
        success: false,
        error: { listId: ["List not found"] },
      };
    }

    const itemCount = await prisma.item.count({
      where: { listId: validatedData.data.listId },
    });

    if (itemCount >= MAX_ITEMS_PER_LIST) {
      return {
        success: false,
        error: {
          _form: [
            `Cette liste a atteint la limite de ${MAX_ITEMS_PER_LIST} articles.`,
          ],
        },
      };
    }

    const item = await prisma.item.create({
      data: {
        listId: validatedData.data.listId,
        title: validatedData.data.title,
        who: validatedData.data.who,
      },
    });

    revalidatePath(`/${validatedData.data.listId}`);

    return {
      success: true,
      data: item,
    };
  } catch (error) {
    console.error("Failed to add item:", error);
    return {
      success: false,
      error: { _form: ["Failed to add item. Please try again."] },
    };
  }
}
