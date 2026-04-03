import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guide de démarrage | QuiRamèneQuoi",
  description:
    "Apprenez à utiliser QuiRamèneQuoi en quelques minutes : créez une liste, ajoutez des articles, partagez avec vos amis et organisez vos événements facilement.",
};

export default function Guide() {
  return (
    <main className="m-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">Guide de démarrage</h1>
      <p className="mb-10 text-gray-600 dark:text-gray-400">
        Organisez votre prochain événement en moins de 5 minutes grâce à ce
        guide pas à pas.
      </p>

      <div className="space-y-12">
        <section>
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white">
              1
            </div>
            <h2 className="text-2xl font-semibold">Créez votre liste</h2>
          </div>
          <div className="ml-14 space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              Depuis la page d{"'"}accueil, cliquez sur le bouton{" "}
              <strong>«Créer une liste»</strong>. Une nouvelle liste vide est
              automatiquement créée et vous êtes redirigé vers votre liste
              personnelle.
            </p>
            <div className="rounded-md border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Important :</strong> L{"'"}URL de votre liste (ex.{" "}
                <code className="font-mono">quiramenequoi.fr/abc123</code>) est
                votre seul accès. Sauvegardez-la en favori ou notez-la.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white">
              2
            </div>
            <h2 className="text-2xl font-semibold">Nommez votre liste</h2>
          </div>
          <div className="ml-14 space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              En haut de votre liste, vous pouvez donner un titre à votre
              événement (ex. <em>«Soirée chez Marie»</em>,{" "}
              <em>«BBQ du weekend»</em>). Cliquez sur le titre pour le modifier.
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white">
              3
            </div>
            <h2 className="text-2xl font-semibold">Ajoutez vos articles</h2>
          </div>
          <div className="ml-14 space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              Utilisez le champ de saisie en bas de liste pour ajouter chaque
              article dont vous avez besoin. Exemples d{"'"}articles :
            </p>
            <ul className="list-inside space-y-1 pl-2">
              <li>Boissons (vin blanc, bières, jus de fruits)</li>
              <li>Nourriture (chips, fromage, baguette)</li>
              <li>Matériel (glacière, serviettes, allume-feu)</li>
              <li>Desserts (gâteau, fruits)</li>
            </ul>
            <p>
              Ajoutez autant d{"'"}articles que nécessaire — il n{"'"}y a pas de
              limite.
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white">
              4
            </div>
            <h2 className="text-2xl font-semibold">
              Partagez le lien avec vos invités
            </h2>
          </div>
          <div className="ml-14 space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              Copiez l{"'"}URL depuis la barre d{"'"}adresse de votre navigateur
              et envoyez-la à vos invités via :
            </p>
            <ul className="list-inside space-y-1 pl-2">
              <li>WhatsApp / Messenger / Signal</li>
              <li>SMS ou email</li>
              <li>Tout autre moyen de communication</li>
            </ul>
            <div className="rounded-md border border-amber-100 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Astuce :</strong> Sur la page de votre liste, un rappel
                en haut vous encourage à sauvegarder votre lien. C{"'"}est la
                seule façon d{"'"}y revenir plus tard.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white">
              5
            </div>
            <h2 className="text-2xl font-semibold">
              Chacun s{"'"}assigne ses articles
            </h2>
          </div>
          <div className="ml-14 space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              Vos invités ouvrent le lien et voient la liste complète. Chacun
              peut cliquer sur un article pour indiquer qu{"'"}il s{"'"}en
              charge et entrer son prénom. Tout le monde voit en temps réel qui
              ramène quoi.
            </p>
            <p>
              Plus jamais trois personnes qui amènent du vin et personne avec
              les chips !
            </p>
          </div>
        </section>
      </div>

      <div className="mt-12 space-y-4 border-t border-gray-200 pt-8 dark:border-gray-800">
        <h2 className="text-xl font-semibold">Conseils pratiques</h2>
        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-green-500">✓</span>
            <span>
              <strong>Créez la liste à l{"'"}avance</strong> — Donnez le temps à
              vos invités de s{"'"}organiser.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-green-500">✓</span>
            <span>
              <strong>Soyez précis</strong> — «Vin blanc 75cl» est plus utile
              que «boisson».
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-green-500">✓</span>
            <span>
              <strong>Mettez le lien en favori</strong> — Pour retrouver votre
              liste facilement depuis votre téléphone.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-green-500">✓</span>
            <span>
              <strong>Rafraîchissez la page</strong> — Pour voir les dernières
              modifications de vos invités.
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">
          Vous avez d{"'"}autres questions ?
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/faq"
            className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Voir la FAQ
          </Link>
          <Link
            href="/"
            className="rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            Créer une liste
          </Link>
        </div>
      </div>
    </main>
  );
}
