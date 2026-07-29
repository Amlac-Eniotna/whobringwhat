import { ScrollIndicator } from "@/components/scroll-indicator/scroll-indicator";
import { StartButton } from "@/components/start-button/start-button";
import { About } from "@/layout/about/about";
import { Metadata } from "next";
import Link from "next/link";

// Metadata propre à l'accueil : le title hérité du layout était « QuiRamèneQuoi »
// seul, alors que cette page est positionnée en top-10 sur « qui apporte quoi »,
// « qui amène quoi », « qui prend quoi » et « qui ramène quoi » — aucun de ces
// termes n'apparaissait dans l'extrait affiché par Google.
export const metadata: Metadata = {
  title: "Qui apporte quoi ? La liste partagée gratuite | QuiRamèneQuoi",
  description:
    "Repas partagé, apéro, anniversaire : créez une liste en un clic et chacun voit qui ramène quoi. Gratuit, sans inscription, il suffit de partager le lien.",
};

export default function Home() {
  return (
    <>
      <div id="bg-animate" className="absolute top-0 -z-1 h-lvh w-full" />
      <main className="min-h-[calc(100vh-68px)]">
        <section className="m-auto flex h-[calc(100vh-68px)] w-full max-w-3xl flex-col items-center justify-center gap-8 px-4 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-balance sm:text-5xl">
              Qui apporte quoi ?
            </h1>
            <p className="mx-auto max-w-xl text-lg text-pretty text-gray-600 dark:text-gray-300">
              Créez une liste partagée en un clic pour votre repas, votre apéro
              ou votre anniversaire. Chacun s{"'"}inscrit sur ce qu{"'"}il
              apporte, et personne n{"'"}arrive avec le troisième saladier.
            </p>
          </div>
          <StartButton />
          <p className="max-w-lg text-sm text-pretty text-gray-500 dark:text-gray-400">
            En cliquant sur «Créer une liste», vous acceptez nos{" "}
            <Link
              href="/terms"
              className="underline hover:text-gray-700 dark:hover:text-gray-500"
            >
              conditions d{"'"}utilisation
            </Link>{" "}
            et notre{" "}
            <Link
              href="/privacy"
              className="underline hover:text-gray-700 dark:hover:text-gray-500"
            >
              politique de confidentialité
            </Link>
            . Vos données sont stockées de manière anonyme pendant 2 ans.
          </p>
        </section>
        <div className="relative -top-16 h-0 w-full">
          <div className="absolute h-16 w-full bg-gradient-to-b from-transparent to-slate-100 dark:to-slate-950" />
        </div>
        <ScrollIndicator />
        <About />
      </main>
    </>
  );
}
