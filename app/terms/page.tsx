import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'Utilisation - QuiRamèneQuoi",
  description: "Conditions d'utilisation de QuiRamèneQuoi",
};

export default function TermsOfService() {
  return (
    <main className="m-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Conditions d'Utilisation</h1>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">1. Acceptation</h2>
        <p>
          En utilisant QuiRamèneQuoi, vous acceptez ces conditions d'utilisation.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">2. Service</h2>
        <p>
          QuiRamèneQuoi est une application simple et gratuite pour partager des
          listes d'articles lors d'événements.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">3. Droits d'Utilisation</h2>
        <p>
          Vous pouvez utiliser QuiRamèneQuoi pour créer et partager vos listes
          personnelles. Vous ne pouvez pas :
        </p>
        <ul className="list-inside space-y-2 pl-4">
          <li>Utiliser l'application à des fins illégales ou abusives</li>
          <li>Tenter de pirater ou surcharger le service</li>
          <li>Créer du contenu offensant ou dangereux</li>
        </ul>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">4. Responsabilité</h2>
        <p>
          QuiRamèneQuoi est fourni "tel quel". Nous ne sommes pas responsables des
          dommages ou pertes résultant de l'utilisation du service.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">5. Modifications</h2>
        <p>
          Nous pouvons modifier ou interrompre le service à tout moment, avec ou
          sans préavis.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">6. Modification des Conditions</h2>
        <p>
          Nous pouvons mettre à jour ces conditions à tout moment. Les changements
          prendront effet immédiatement après leur publication.
        </p>
      </section>

      <section className="text-sm text-gray-500 dark:text-gray-400">
        <p>Dernière mise à jour : 3 avril 2026</p>
      </section>
    </main>
  );
}
