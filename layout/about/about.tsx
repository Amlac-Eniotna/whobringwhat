import { StartButton } from "@/components/start-button/start-button";

export function About() {
  return (
    <section className="m-auto max-w-3xl px-4 py-12">
      <div className="space-y-8">
        <header className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
            QuiRamèneQuoi - L{"'"}art de l{"'"}organisation partagée
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            Simplifiez l{"'"}organisation de vos événements en partageant
            facilement vos listes avec vos proches
          </p>
        </header>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Comment ça marche ?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                  1
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Créez votre liste</strong> - Ajoutez tous les éléments
                  nécessaires pour votre événement (repas, boissons,
                  matériel...)
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                  2
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Partagez le lien</strong> - Envoyez simplement l{"'"}
                  URL unique de votre liste à vos invités
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                  3
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Chacun s{"'"}engage</strong> - Vos invités peuvent
                  voir en temps réel qui ramène quoi et s{"'"}assigner des
                  éléments
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Pourquoi QuiRamèneQuoi ?
            </h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>
                  <strong>Gratuit et simple</strong> - Aucune inscription
                  requise, utilisable immédiatement
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>
                  <strong>Temps réel</strong> - Les modifications sont visibles
                  par tous à chaque rafraîchissement de la page
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>
                  <strong>Accessible partout</strong> - Fonctionne sur mobile,
                  tablette et ordinateur
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>
                  <strong>Évite les doublons</strong> - Finies les situations où
                  tout le monde ramène la même chose
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>
                  <strong>Organisé et transparent</strong> - Chacun sait
                  exactement ce qu{"'"}il doit apporter
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
          <h2 className="mb-4 text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Parfait pour tous vos événements
          </h2>
          <div className="grid gap-6 text-center md:grid-cols-3">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                🎉 Fêtes & Soirées
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Apéros, anniversaires, soirées à thème - organisez facilement
                qui amène quoi
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                🍽️ Repas partagés
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dîners entre amis, pique-niques, barbecues - coordonnez vos
                menus
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                🏠 Événements familiaux
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Réunions de famille, fêtes de Noël - simplifiez l{"'"}
                organisation
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Prêt à simplifier vos événements ?
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Créez votre première liste en quelques secondes et découvrez comme c
            {"'"}est facile d{"'"}organiser vos événements
          </p>
          <StartButton />
        </div>
      </div>
    </section>
  );
}
