import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos | QuiRamèneQuoi",
  description:
    "Découvrez QuiRamèneQuoi : l'application simple et gratuite pour organiser vos événements entre amis sans prise de tête.",
};

export default function About() {
  return (
    <main className="m-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">À propos de QuiRamèneQuoi</h1>

      <section className="mb-10 space-y-4 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Le problème qu{"'"}on a tous vécu
        </h2>
        <p>
          Vous organisez un apéro, un BBQ, une soirée. Vous créez un groupe
          WhatsApp, vous posez la question fatidique : «Qui ramène quoi ?».
          Résultat : trois personnes apportent du vin, personne ne pense aux
          chips, et quelqu{"'"}un oublie les serviettes.
        </p>
        <p>
          QuiRamèneQuoi résout ce problème de la façon la plus simple possible :
          une liste partagée, un lien, pas de compte requis.
        </p>
      </section>

      <section className="mb-10 space-y-4 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Notre philosophie
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-800">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              Simplicité
            </h3>
            <p className="text-sm">
              Un clic pour créer une liste. Un lien pour la partager. Aucune
              inscription, aucun mot de passe, aucune app à installer.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-800">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              Gratuité
            </h3>
            <p className="text-sm">
              QuiRamèneQuoi est et restera gratuit. Pas de publicité, pas
              d{"'"}abonnement, pas de version premium.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-5 dark:border-gray-800">
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              Respect de la vie privée
            </h3>
            <p className="text-sm">
              Nous collectons uniquement ce qui est nécessaire : le titre de vos
              listes et leurs articles. Aucune donnée personnelle.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10 space-y-4 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Comment ça fonctionne
        </h2>
        <p>
          QuiRamèneQuoi est une application web construite avec les technologies
          modernes (Next.js, MySQL). Vos listes sont stockées de manière
          sécurisée et accessibles depuis n{"'"}importe quel appareil via votre
          lien unique. Aucune installation requise.
        </p>
        <p>
          Les données sont conservées pendant 2 ans, puis automatiquement
          supprimées. Rien n{"'"}est vendu ni partagé avec des tiers.
        </p>
      </section>

      <section className="mb-10 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Pour aller plus loin
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/guide"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-5 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
          >
            <span className="text-2xl">📖</span>
            <div>
              <p className="font-semibold">Guide de démarrage</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Apprenez à utiliser QuiRamèneQuoi en 5 minutes
              </p>
            </div>
          </Link>
          <Link
            href="/faq"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-5 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
          >
            <span className="text-2xl">❓</span>
            <div>
              <p className="font-semibold">Questions fréquentes</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Toutes les réponses à vos questions
              </p>
            </div>
          </Link>
        </div>
      </section>

      <div className="text-center">
        <Link
          href="/"
          className="inline-block rounded-md bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Créer une liste gratuitement
        </Link>
      </div>
    </main>
  );
}
