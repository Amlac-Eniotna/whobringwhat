import { StartButton } from "@/components/start-button/start-button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Qui apporte quoi ? Organiser un repas partagé sans doublon",
  description:
    "Comment répartir les plats et les boissons quand chacun apporte quelque chose : la méthode, les quantités par personne et les erreurs à éviter. Liste partagée gratuite.",
};

export default function QuiApporteQuoi() {
  return (
    <main className="m-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold text-balance sm:text-4xl">
        Qui apporte quoi ? La méthode pour ne rien oublier
      </h1>

      <p className="mb-10 text-lg text-pretty text-gray-600 dark:text-gray-300">
        Une liste « qui apporte quoi » répartit à l{"'"}avance ce que chaque
        invité amène à un repas partagé, pour que rien ne manque et que personne
        n{"'"}apporte la même chose. C{"'"}est l{"'"}outil de base de l{"'"}
        auberge espagnole, du barbecue entre amis, du pot de départ ou du repas
        de Noël en famille.
      </p>

      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-semibold">
          Comment s{"'"}organiser en trois étapes
        </h2>
        <ol className="list-decimal space-y-3 pl-6 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Listez les postes, pas les plats.</strong> Écrivez « entrée
            », « plat principal », « dessert », « boissons », « pain », «
            vaisselle » plutôt que « tarte aux pommes ». Chacun choisit ensuite
            ce qu{"'"}il sait faire dans la catégorie qui reste libre.
          </li>
          <li>
            <strong>Partagez la liste, pas un sondage.</strong> Un lien unique
            que tout le monde ouvre et modifie évite les quarante messages dans
            le groupe et les réponses qui se croisent.
          </li>
          <li>
            <strong>Laissez chacun s{"'"}inscrire.</strong> Quand une personne
            met son nom sur un poste, il disparaît de la liste des besoins. Plus
            de doublons, et vous voyez en un coup d{"'"}œil ce qui manque
            encore.
          </li>
        </ol>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-semibold">Combien prévoir par personne</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Les quantités sont la première source d{"'"}erreur. Quelques repères
          qui fonctionnent pour un repas d{"'"}adultes :
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="py-2 pr-4 font-semibold">Poste</th>
                <th className="py-2 font-semibold">Par personne</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              <tr className="border-b border-gray-100 dark:border-gray-900">
                <td className="py-2 pr-4">Apéritif (chips, olives, cakes)</td>
                <td className="py-2">80 à 100 g</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-900">
                <td className="py-2 pr-4">Viande ou poisson</td>
                <td className="py-2">150 à 200 g</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-900">
                <td className="py-2 pr-4">Accompagnement</td>
                <td className="py-2">200 g</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-900">
                <td className="py-2 pr-4">Fromage</td>
                <td className="py-2">40 à 50 g</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-900">
                <td className="py-2 pr-4">Pain</td>
                <td className="py-2">1/4 de baguette</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Boisson</td>
                <td className="py-2">
                  1/3 de bouteille de vin, ou 1 L de soft
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Comptez large sur l{"'"}apéritif : c{"'"}est toujours ce qui part le
          plus vite, surtout si les invités arrivent en décalé.
        </p>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-semibold">Les erreurs classiques</h2>
        <ul className="list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Trois desserts et pas d{"'"}entrée.</strong> Sans liste
            visible, tout le monde choisit ce qu{"'"}il préfère préparer.
            Répartir par catégorie règle le problème.
          </li>
          <li>
            <strong>Oublier l{"'"}intendance.</strong> Glace, sacs poubelle,
            gobelets, tire-bouchon, rallonge : ces postes n{"'"}intéressent
            personne mais manquent toujours. Mettez-les dans la liste.
          </li>
          <li>
            <strong>Ignorer les régimes.</strong> Une ligne « plat végétarien »
            dans la liste évite de découvrir le problème à table.
          </li>
          <li>
            <strong>Compter sur la mémoire du groupe.</strong> Une conversation
            de messagerie n{"'"}est pas une liste : l{"'"}information s{"'"}y
            perd dès qu{"'"}elle dépasse une dizaine de messages.
          </li>
        </ul>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-semibold">
          Qui apporte quoi, qui amène quoi, qui ramène quoi ?
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Ces formulations désignent exactement la même chose : la répartition
          de ce que chacun apporte à un événement. « Qui apporte quoi » et « qui
          amène quoi » sont les plus courantes à l{"'"}écrit, « qui ramène quoi
          » et « qui prend quoi » à l{"'"}oral. Vous croiserez aussi «{" "}
          <em>potluck</em> », son équivalent anglo-saxon, et « auberge espagnole
          » quand chacun apporte un plat de son choix sans répartition
          préalable.
        </p>
      </section>

      <section className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-900">
        <h2 className="mb-3 text-2xl font-semibold">
          Créez votre liste en un clic
        </h2>
        <p className="mx-auto mb-6 max-w-xl text-gray-600 dark:text-gray-400">
          Gratuit, sans inscription. Vous obtenez un lien à partager : chacun
          ouvre la liste et s{"'"}inscrit sur ce qu{"'"}il apporte.
        </p>
        <StartButton />
      </section>

      <p className="mt-10 text-sm text-gray-600 dark:text-gray-400">
        Pour aller plus loin, consultez le{" "}
        <Link
          href="/guide"
          className="underline hover:text-gray-700 dark:hover:text-gray-300"
        >
          guide de démarrage
        </Link>{" "}
        ou la{" "}
        <Link
          href="/faq"
          className="underline hover:text-gray-700 dark:hover:text-gray-300"
        >
          FAQ
        </Link>
        .
      </p>
    </main>
  );
}
