"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function removeFromMyLists(listId: string) {
  try {
    const ip = await getClientIp();
    const limit = rateLimit(`remove-from-my-lists:${ip}`, 30, 60_000);
    if (!limit.ok) {
      return { success: false, error: "Trop de requêtes, réessayez dans une minute." };
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Vous n'êtes pas connecté." };

    await prisma.userList.deleteMany({
      where: { userId: session.user.id, listId },
    });

    revalidatePath("/mes-listes");
    return { success: true };
  } catch (error) {
    console.error("Failed to remove from my lists:", error);
    return { success: false, error: "Impossible de retirer la liste. Réessayez." };
  }
}
