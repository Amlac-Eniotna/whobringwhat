import { prisma } from "@/lib/prisma";
import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;

  const auth = req.headers.get("authorization");
  if (!auth) return false;

  const expectedHeader = `Bearer ${expected}`;
  const a = Buffer.from(auth);
  const b = Buffer.from(expectedHeader);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
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
