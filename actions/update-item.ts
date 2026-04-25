"use server";

import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UpdateItemSchema = z.object({
  id: z.number().int().positive("Item ID is required"),
  listId: z.string().min(1, "List ID is required"),
  title: z
    .string()
    .min(1, "Item name is required")
    .max(100, "Item name is too long"),
  who: z.string().max(50, "Prénom trop long").optional(),
});

export type UpdateItemInput = z.infer<typeof UpdateItemSchema>;

export async function updateItem(formData: FormData | UpdateItemInput) {
  try {
    const ip = await getClientIp();
    const limit = rateLimit(`update-item:${ip}`, 60, 60_000);
    if (!limit.ok) {
      return {
        success: false,
        error: { _form: ["Trop de requêtes, réessayez dans une minute."] },
      };
    }

    const inputData =
      formData instanceof FormData
        ? {
            id: Number(formData.get("id")) || 0,
            listId: formData.get("listId")?.toString() || "",
            title: formData.get("title")?.toString() || "",
            who: formData.get("who")?.toString() || undefined,
          }
        : formData;

    const validatedData = UpdateItemSchema.safeParse(inputData);

    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.flatten().fieldErrors,
      };
    }

    const result = await prisma.item.updateMany({
      where: {
        id: validatedData.data.id,
        listId: validatedData.data.listId,
      },
      data: {
        title: validatedData.data.title,
        who: validatedData.data.who,
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: { id: ["Item not found"] },
      };
    }

    revalidatePath(`/${validatedData.data.listId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to update item:", error);
    return {
      success: false,
      error: { _form: ["Failed to update item. Please try again."] },
    };
  }
}
