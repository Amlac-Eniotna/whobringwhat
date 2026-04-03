import { ScrollIndicator } from "@/components/scroll-indicator/scroll-indicator";
import { StartButton } from "@/components/start-button/start-button";
import { About } from "@/layout/about/about";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div id="bg-animate" className="absolute top-0 -z-1 h-lvh w-full" />
      <main className="min-h-[calc(100vh-68px)]">
        <section className="m-auto flex h-[calc(100vh-68px)] w-full max-w-3xl flex-col items-center justify-center gap-8 px-4 text-center">
          <StartButton />
          <p className="max-w-lg text-sm text-pretty text-gray-500 dark:text-gray-600">
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
