import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 2);

  const deletedItems = await prisma.item.deleteMany({
    where: { list: { updateAt: { lt: cutoff } } },
  });

  const deletedLists = await prisma.list.deleteMany({
    where: { updateAt: { lt: cutoff } },
  });

  return NextResponse.json({
    deletedLists: deletedLists.count,
    deletedItems: deletedItems.count,
    cutoff: cutoff.toISOString(),
  });
}
