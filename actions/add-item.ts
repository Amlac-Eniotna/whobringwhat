"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod schema for input validation
const AddItemSchema = z.object({
  listId: z.string().min(1, "L'ID de la liste est requis"),
  title: z
    .string()
    .min(1, "Le nom de l'article est requis")
    .max(100, "Le nom de l'article est trop long"),
  who: z.string().optional(),
});

export type AddItemInput = z.infer<typeof AddItemSchema>;

export async function addItem(formData: FormData | AddItemInput) {
  try {
    // Parse input data based on input type
    const inputData =
      formData instanceof FormData
        ? {
            listId: formData.get("listId")?.toString() || "",
            title: formData.get("title")?.toString() || "",
            who: formData.get("who")?.toString() || undefined,
          }
        : formData;

    // Validate with Zod
    const validatedData = AddItemSchema.safeParse(inputData);

    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.flatten().fieldErrors,
      };
    }

    // Check if the list exists
    const list = await prisma.list.findUnique({
      where: { id: validatedData.data.listId },
    });

    if (!list) {
      return {
        success: false,
        error: { listId: ["List not found"] },
      };
    }

    // Add the item to the database
    const item = await prisma.item.create({
      data: {
        listId: validatedData.data.listId,
        title: validatedData.data.title,
        who: validatedData.data.who,
      },
    });

    // Revalidate the list page to show the new item
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
