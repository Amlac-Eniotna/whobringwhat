"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function trackVisit(listId: string) {
  try {
    if (!listId) return { success: false };

    const ip = await getClientIp();
    const limit = rateLimit(`track-visit:${ip}`, 60, 60_000);
    if (!limit.ok) return { success: false };

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: true, tracked: false };

    const list = await prisma.list.findUnique({
      where: { id: listId },
      select: { id: true },
    });
    if (!list) return { success: false };

    await prisma.userList.upsert({
      where: { userId_listId: { userId: session.user.id, listId } },
      create: { userId: session.user.id, listId },
      update: {},
    });

    return { success: true, tracked: true };
  } catch (error) {
    console.error("Failed to track visit:", error);
    return { success: false };
  }
}
