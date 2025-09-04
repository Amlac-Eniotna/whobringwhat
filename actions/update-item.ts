"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod schema for input validation
const UpdateItemSchema = z.object({
  id: z.number().int().positive("Item ID is required"),
  listId: z.string().min(1, "List ID is required"),
  title: z
    .string()
    .min(1, "Item name is required")
    .max(100, "Item name is too long"),
  who: z.string().optional(),
});

export type UpdateItemInput = z.infer<typeof UpdateItemSchema>;

export async function updateItem(formData: FormData | UpdateItemInput) {
  try {
    // Parse input data based on input type
    const inputData =
      formData instanceof FormData
        ? {
            id: Number(formData.get("id")) || 0,
            listId: formData.get("listId")?.toString() || "",
            title: formData.get("title")?.toString() || "",
            who: formData.get("who")?.toString() || undefined,
          }
        : formData;

    // Validate with Zod
    const validatedData = UpdateItemSchema.safeParse(inputData);

    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.flatten().fieldErrors,
      };
    }

    // Check if the item exists
    const existingItem = await prisma.item.findUnique({
      where: { id: validatedData.data.id },
    });

    if (!existingItem) {
      return {
        success: false,
        error: { id: ["Item not found"] },
      };
    }

    // Update the item in the database
    const item = await prisma.item.update({
      where: { id: validatedData.data.id },
      data: {
        title: validatedData.data.title,
        who: validatedData.data.who,
      },
    });

    // Revalidate the list page to show the updated item
    revalidatePath(`/${validatedData.data.listId}`);

    return {
      success: true,
      data: item,
    };
  } catch (error) {
    console.error("Failed to update item:", error);
    return {
      success: false,
      error: { _form: ["Failed to update item. Please try again."] },
    };
  }
}
