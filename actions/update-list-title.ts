"use server";

import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod schema for input validation
const UpdateListTitleSchema = z.object({
  id: z.string().min(1, "L'ID de la liste est requis"),
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(100, "Titre est trop long"),
});

export type UpdateListTitleInput = z.infer<typeof UpdateListTitleSchema>;

export async function updateListTitle(
  formData: FormData | UpdateListTitleInput,
) {
  try {
    const ip = await getClientIp();
    const limit = rateLimit(`update-list-title:${ip}`, 60, 60_000);
    if (!limit.ok) {
      return {
        success: false,
        error: { _form: ["Trop de requêtes, réessayez dans une minute."] },
      };
    }

    // Parse input data based on input type
    const inputData =
      formData instanceof FormData
        ? {
            id: formData.get("id")?.toString() || "",
            title: formData.get("title")?.toString() || "",
          }
        : formData;

    // Validate with Zod
    const validatedData = UpdateListTitleSchema.safeParse(inputData);

    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.flatten().fieldErrors,
      };
    }

    // Check if the list exists
    const existingList = await prisma.list.findUnique({
      where: { id: validatedData.data.id },
    });

    if (!existingList) {
      return {
        success: false,
        error: { id: ["List not found"] },
      };
    }

    // Update the list title in the database
    const list = await prisma.list.update({
      where: { id: validatedData.data.id },
      data: {
        title: validatedData.data.title,
      },
    });

    // Revalidate the list page to show the updated title
    revalidatePath(`/${validatedData.data.id}`);

    return {
      success: true,
      data: list,
    };
  } catch (error) {
    console.error("Failed to update list title:", error);
    return {
      success: false,
      error: { _form: ["Failed to update list title. Please try again."] },
    };
  }
}
