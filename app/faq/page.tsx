import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ - Questions fréquentes | QuiRamèneQuoi",
  description:
    "Toutes les réponses à vos questions sur QuiRamèneQuoi : comment créer une liste, partager, assigner des articles et gérer vos événements.",
};

const faqs = [
  {
    question: "Comment créer une liste ?",
    answer:
      "Cliquez sur le bouton «Créer une liste» sur la page d'accueil. Une liste vide est automatiquement créée et vous recevez un lien unique. Gardez ce lien précieusement — c'est votre seul accès à la liste.",
  },
  {
    question: "Faut-il créer un compte pour utiliser QuiRamèneQuoi ?",
    answer:
      "Non. Vous pouvez créer et partager une liste sans aucune inscription : elle reste accessible via le lien unique attribué à sa création. Un compte est proposé en option, si vous préférez retrouver toutes vos listes au même endroit plutôt que de conserver chaque lien. Il se crée avec une adresse e-mail et un mot de passe, ou via Google.",
  },
  {
    question: "Comment partager ma liste avec mes invités ?",
    answer:
      "Copiez simplement l'URL de votre liste depuis la barre d'adresse de votre navigateur et envoyez-la à vos invités par message, email ou n'importe quelle application de messagerie. Toute personne ayant le lien peut voir et modifier la liste.",
  },
  {
    question: "Est-ce que ma liste est privée ?",
    answer:
      "Votre liste n'est pas indexée par les moteurs de recherche et n'est pas accessible publiquement. Cependant, toute personne possédant votre lien peut y accéder et la modifier. Ne partagez le lien qu'avec les personnes de confiance.",
  },
  {
    question: "Comment ajouter des articles à ma liste ?",
    answer:
      "Sur la page de votre liste, utilisez le champ de saisie en bas pour ajouter un nouvel article. Tapez le nom de l'article et validez. L'article apparaît immédiatement dans la liste.",
  },
  {
    question: "Comment s'assigner un article ?",
    answer:
      "Cliquez sur un article dans la liste pour indiquer que vous vous en chargez. Vous pouvez entrer votre prénom pour que les autres sachent qui ramène quoi. La modification est visible par tous dès le prochain rafraîchissement.",
  },
  {
    question: "Les modifications sont-elles en temps réel ?",
    answer:
      "Les modifications sont enregistrées immédiatement dans la base de données. Les autres utilisateurs voient les changements après un rafraîchissement de leur page (F5 ou bouton actualiser du navigateur).",
  },
  {
    question: "Combien d'articles puis-je ajouter ?",
    answer:
      "Il n'y a pas de limite fixe au nombre d'articles par liste. Vous pouvez ajouter autant d'articles que nécessaire pour votre événement.",
  },
  {
    question: "Que se passe-t-il si je perds le lien de ma liste ?",
    answer:
      "Si vous n'avez pas de compte, le lien est irrécupérable : aucune adresse e-mail n'est associée à la liste. Pensez à le mettre en favori dans votre navigateur ou à l'enregistrer dans vos notes. Si vous êtes connecté, en revanche, chaque liste que vous ouvrez est rattachée à votre compte et reste accessible depuis « Mes listes ».",
  },
  {
    question: "Puis-je supprimer ma liste ou un article ?",
    answer:
      "Il n'est pas possible de supprimer une liste manuellement. Toutes les listes et leurs données sont automatiquement supprimées de nos serveurs après 2 ans d'inactivité. Vous pouvez en revanche modifier le titre de votre liste et supprimer ou modifier les articles individuellement.",
  },
  {
    question: "Combien de temps mes données sont-elles conservées ?",
    answer:
      "Vos listes et leurs articles sont conservés 2 ans après leur dernière modification, puis automatiquement supprimés de nos serveurs. Si vous avez créé un compte, votre adresse e-mail et vos informations de session sont conservées tant que ce compte existe : vous pouvez le supprimer à tout moment depuis « Mes listes », ce qui efface également ces données.",
  },
  {
    question: "QuiRamèneQuoi est-il gratuit ?",
    answer:
      "Oui, QuiRamèneQuoi est entièrement gratuit, sans publicité et sans abonnement. Profitez-en sans limite.",
  },
  {
    question: "L'application fonctionne-t-elle sur mobile ?",
    answer:
      "Oui, QuiRamèneQuoi est conçu pour fonctionner sur tous les appareils : smartphones, tablettes et ordinateurs. L'interface s'adapte automatiquement à la taille de votre écran.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Oui. Toutes les communications entre votre navigateur et nos serveurs sont chiffrées via HTTPS, et vos données sont stockées de manière sécurisée chez Vercel. Sans compte, aucune donnée personnelle identifiable n'est collectée. Avec un compte, nous conservons votre adresse e-mail et les informations nécessaires à la connexion — le détail figure dans notre politique de confidentialité.",
  },
];

export default function FAQ() {
  return (
    <main className="m-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">Questions fréquentes</h1>
      <p className="mb-10 text-gray-600 dark:text-gray-400">
        Vous avez une question sur QuiRamèneQuoi ? Consultez nos réponses
        ci-dessous. Si vous ne trouvez pas votre réponse, consultez notre{" "}
        <Link href="/guide" className="underline hover:text-gray-700 dark:hover:text-gray-500">
          guide de démarrage
        </Link>
        .
      </p>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <section
            key={index}
            className="rounded-lg border border-gray-200 p-6 dark:border-gray-800"
          >
            <h2 className="mb-3 text-lg font-semibold">{faq.question}</h2>
            <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-900">
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Prêt à essayer ? Créez votre première liste gratuitement.
        </p>
        <Link
          href="/"
          className="inline-block rounded-md bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Créer une liste
        </Link>
      </div>
    </main>
  );
}
