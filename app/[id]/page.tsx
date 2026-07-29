import { CreateListItem } from "@/components/list/CreateListItem";
import { Item } from "@/components/list/ListItem";
import { ListTitle } from "@/components/list/ListTitle";
import { TrackVisit } from "@/components/auth/TrackVisit";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

const getList = cache((id: string) =>
  prisma.list.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      item: true, // Include the items from the database
    },
  }),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const list = await getList(id);
  return {
    title: list
      ? `${list.title} · QuiRamèneQuoi`
      : "Liste introuvable · QuiRamèneQuoi",
    robots: "noindex, nofollow",
  };
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const list = await getList(id);

  // notFound() plutôt qu'un rendu d'erreur inline : cette route attrape toutes
  // les URL non reconnues du site. Sans cet appel, /wp-admin, /index.html ou une
  // simple faute de frappe répondaient HTTP 200 (soft 404). Le contenu affiché
  // est celui de app/not-found.tsx, cette fois avec un vrai statut 404.
  if (!list) notFound();

  return (
    <main className="m-auto flex min-h-[calc(100vh-68px)] w-full max-w-3xl flex-col items-center justify-center gap-8 p-4">
      <List data={list} />
    </main>
  );
};

const List = ({
  data,
}: {
  data: {
    id: string;
    title: string;
    item: Array<{
      id: number;
      title: string;
      who: string | null;
    }>;
  };
}) => {
  return (
    <>
      <TrackVisit listId={data.id} />
      <p className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
        Gardez ce lien pour retrouver votre liste sur tous vos appareils.
      </p>
      <ListTitle title={data.title} />

      <ul className="w-full">
        {data.item.length > 0 ? (
          data.item.map((item) => (
            <Item
              item={{
                id: item.id,
                food: item.title,
                who: item.who || "",
              }}
              key={item.id}
            />
          ))
        ) : (
          <li className="mb-3 text-center text-gray-500">
            Aucun article pour l{"'"}instant. Ajoutez votre premier article !
          </li>
        )}
        <li className="w-full">
          <CreateListItem />
        </li>
      </ul>
    </>
  );
};

export default Page;
