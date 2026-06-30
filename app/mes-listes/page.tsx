import { ClaimPendingList } from "@/components/auth/ClaimPendingList";
import { DeleteAccountButton } from "@/components/auth/DeleteAccountButton";
import { RemoveFromListButton } from "@/components/auth/RemoveFromListButton";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { StartButton } from "@/components/start-button/start-button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Mes listes · QuiRamèneQuoi",
  robots: "noindex, nofollow",
};

export default async function MesListesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/connexion?redirect=/mes-listes");

  const rows = await prisma.userList.findMany({
    where: { userId: session.user.id },
    select: {
      list: {
        select: {
          id: true,
          title: true,
          updateAt: true,
          _count: { select: { item: true } },
        },
      },
    },
    orderBy: { list: { updateAt: "desc" } },
  });

  return (
    <main className="m-auto flex min-h-[calc(100vh-68px)] w-full max-w-3xl flex-col gap-6 p-4">
      <ClaimPendingList />
      <div className="flex items-center justify-between">
        <h2 className="font-nunito-sans text-2xl">Mes listes</h2>
        <SignOutButton />
      </div>

      <div>
        <StartButton />
      </div>

      {rows.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Aucune liste pour l{"'"}instant. Ouvrez ou créez une liste : elle
          apparaîtra ici automatiquement.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map(({ list }) => (
            <li
              key={list.id}
              className="flex items-center justify-between rounded-md border px-4 py-3"
            >
              <Link href={`/${list.id}`} className="flex flex-col">
                <span className="font-medium">{list.title}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {list._count.item} article{list._count.item > 1 ? "s" : ""} ·{" "}
                  {list.updateAt.toLocaleDateString("fr-FR")}
                </span>
              </Link>
              <RemoveFromListButton listId={list.id} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto border-t border-gray-200 pt-6 dark:border-gray-800">
        <DeleteAccountButton />
      </div>
    </main>
  );
}
