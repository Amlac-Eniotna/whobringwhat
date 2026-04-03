import { CreateListItem } from "@/components/list/CreateListItem";
import { Item } from "@/components/list/ListItem";
import { ListTitle } from "@/components/list/ListTitle";
import { StartButton } from "@/components/start-button/start-button";
import { prisma } from "@/lib/prisma";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const list = await prisma.list.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      item: true, // Include the items from the database
    },
  });
  return (
    <main className="m-auto flex h-[calc(100vh-68px)] w-full max-w-3xl flex-col items-center justify-center gap-8 p-4">
      {list ? <List data={list} /> : <E404 />}
    </main>
  );
};

const E404 = () => {
  return (
    <>
      <StartButton />
      <p className="max-w-lg text-sm text-pretty text-gray-500 dark:text-gray-600">
        En cliquant sur «Créer une liste», vous consentez au stockage et à la
        vente de vos données de manière anonyme pour une durée de 2 ans. Ces
        données sont essentielles pour faire vivre notre plateforme. Veuillez
        noter que l{"'"}utilisation de l{"'"}application implique nécessairement
        la collecte de ces données.
      </p>
    </>
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
