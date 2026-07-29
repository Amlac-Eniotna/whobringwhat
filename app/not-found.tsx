import { StartButton } from "@/components/start-button/start-button";
import { Metadata } from "next";
import Link from "next/link";

// Pas de `robots` ici : Next.js émet déjà `noindex` sur cette route, en
// ajouter un second ne ferait qu'un doublon de balise.
export const metadata: Metadata = {
  title: "Liste introuvable · QuiRamèneQuoi",
};

/**
 * Rendu par Next.js avec un vrai statut HTTP 404, pour toute URL non reconnue
 * comme pour un identifiant de liste inexistant (`notFound()` dans app/[id]).
 *
 * Auparavant la route attrape-tout /[id] rendait ce contenu en HTTP 200 :
 * n'importe quelle URL (/wp-admin, /index.html, une faute de frappe) répondait
 * « 200 OK » avec un canonical auto-référencé sur une adresse inexistante.
 * Google classe ce motif en soft 404 et dépense du budget de crawl pour rien.
 */
export default function NotFound() {
  return (
    <main className="m-auto flex min-h-[calc(100vh-68px)] w-full max-w-3xl flex-col items-center justify-center gap-8 p-4 text-center">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Liste introuvable</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Ce lien ne correspond à aucune liste. Il a peut-être été mal recopié,
          ou la liste a été supprimée après deux ans sans activité.
        </p>
      </div>

      <StartButton />

      <p className="max-w-lg text-sm text-pretty text-gray-500 dark:text-gray-400">
        En cliquant sur «Créer une liste», vous acceptez nos{" "}
        <Link
          href="/terms"
          className="underline hover:text-gray-700 dark:hover:text-gray-300"
        >
          conditions d{"'"}utilisation
        </Link>{" "}
        et notre{" "}
        <Link
          href="/privacy"
          className="underline hover:text-gray-700 dark:hover:text-gray-300"
        >
          politique de confidentialité
        </Link>
        . Vos données sont stockées de manière anonyme pendant 2 ans.
      </p>
    </main>
  );
}
