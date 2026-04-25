"use server";

import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const DeleteItemSchema = z.object({
  id: z.number().int().positive("Item ID is required"),
  listId: z.string().min(1, "List ID is required"),
});

export type DeleteItemInput = z.infer<typeof DeleteItemSchema>;

export async function deleteItem(formData: FormData | DeleteItemInput) {
  try {
    const ip = await getClientIp();
    const limit = rateLimit(`delete-item:${ip}`, 60, 60_000);
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
          }
        : formData;

    const validatedData = DeleteItemSchema.safeParse(inputData);

    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.flatten().fieldErrors,
      };
    }

    const result = await prisma.item.deleteMany({
      where: {
        id: validatedData.data.id,
        listId: validatedData.data.listId,
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
    console.error("Failed to delete item:", error);
    return {
      success: false,
      error: { _form: ["Failed to delete item. Please try again."] },
    };
  }
}
