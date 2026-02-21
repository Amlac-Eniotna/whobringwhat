import { ScrollIndicator } from "@/components/scroll-indicator/scroll-indicator";
import { StartButton } from "@/components/start-button/start-button";
import { About } from "@/layout/about/about";

export default function Home() {
  return (
    <>
      <div id="bg-animate" className="absolute top-0 -z-1 h-lvh w-full" />
      <main className="min-h-[calc(100vh-68px)]">
        <section className="m-auto flex h-[calc(100vh-68px)] w-full max-w-3xl flex-col items-center justify-center gap-8 px-4 text-center">
          <StartButton />
          {/* <p className="max-w-lg text-sm text-pretty text-gray-500 dark:text-gray-600">
            En cliquant sur «Créer une liste», vous consentez au stockage et à
            la vente de vos données de manière anonyme pour une durée de 2 ans.
            Ces données sont essentielles pour faire vivre notre plateforme.
            Veuillez noter que l’utilisation de l’application implique
            nécessairement la collecte de ces données.
          </p> */}
          {/* <div className="flex max-w-lg items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p>
              Toutes nos excuses pour la gêne occasionnée par le crash récent de
              nos serveurs. Nous travaillons activement pour résoudre ce
              problème et assurer une meilleure stabilité.
            </p>
          </div> */}
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
