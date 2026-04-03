import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité - QuiRamèneQuoi",
  description: "Politique de confidentialité et gestion des données de QuiRamèneQuoi",
};

export default function PrivacyPolicy() {
  return (
    <main className="m-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Politique de Confidentialité</h1>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">Données Collectées</h2>
        <p>Nous collectons et stockons uniquement :</p>
        <ul className="list-inside space-y-2 pl-4">
          <li>Le titre de vos listes</li>
          <li>Les articles que vous ajoutez</li>
          <li>Les assignations (qui ramène quoi)</li>
        </ul>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">Utilisation</h2>
        <p>
          Vos données sont utilisées uniquement pour vous permettre d'accéder à vos
          listes sur tous vos appareils.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">Partage</h2>
        <p>
          <strong>Vos données ne sont jamais vendues ni partagées avec des tiers.</strong>
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">Rétention</h2>
        <p>
          Vos données sont conservées pendant <strong>2 ans</strong>, puis
          automatiquement supprimées de nos serveurs.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">Sécurité</h2>
        <p>
          Vos données sont chiffrées en transit (HTTPS) et stockées de manière
          sécurisée chez Vercel.
        </p>
      </section>

      <section className="text-sm text-gray-500 dark:text-gray-400">
        <p>Dernière mise à jour : 3 avril 2026</p>
      </section>
    </main>
  );
}
