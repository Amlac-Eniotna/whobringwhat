"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function deleteAccount() {
  try {
    const ip = await getClientIp();
    const limit = rateLimit(`delete-account:${ip}`, 5, 60_000);
    if (!limit.ok) {
      return { success: false, error: "Trop de requêtes, réessayez dans une minute." };
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Vous n'êtes pas connecté." };

    // La cascade (onDelete: Cascade sur Session, Account et UserList) supprime
    // sessions, comptes liés et liens « Mes listes ». Les listes partagées,
    // elles, ne sont pas touchées : l'URL reste la seule capacité d'accès.
    await prisma.user.delete({ where: { id: session.user.id } });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete account:", error);
    return { success: false, error: "Impossible de supprimer le compte. Réessayez." };
  }
}
