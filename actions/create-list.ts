// actions/create-list.ts
"use server";

import { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import crypto from "crypto";

export async function redirectList() {
  try {
    const ip = await getClientIp();
    const limit = rateLimit(`create-list:${ip}`, 5, 60_000);
    if (!limit.ok) {
      return {
        success: false,
        error: "Trop de requêtes, réessayez dans une minute.",
      };
    }

    const list = await createList();
    return { success: true, listId: list.id };
  } catch (error) {
    console.error("Failed to create list:", error);
    return {
      success: false,
      error: "Impossible de créer la liste. Réessayez.",
    };
  }
}

async function createList() {
  let created = false;
  let list = { id: "" };

  while (!created) {
    try {
      const id = crypto.randomBytes(12).toString("base64url");

      list = await prisma.list.create({
        data: {
          id,
          title: `Titre de la liste`,
        },
      });

      created = true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          error.code === "P2002" &&
          error.meta?.target &&
          Array.isArray(error.meta.target) &&
          error.meta.target.includes("id")
        ) {
          console.log("ID collision detected, retrying with a new ID");
          continue;
        }
      }
      throw error;
    }
  }

  return list;
}
