import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de Confidentialité - QuiRamèneQuoi",
  description:
    "Quelles données QuiRamèneQuoi collecte, pourquoi, combien de temps elles sont conservées et comment exercer vos droits RGPD.",
};

export default function PrivacyPolicy() {
  return (
    <main className="m-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Politique de Confidentialité</h1>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">Données Collectées</h2>

        <h3 className="text-lg font-semibold">Sans compte</h3>
        <p>
          Si vous utilisez QuiRamèneQuoi sans créer de compte, nous stockons
          uniquement :
        </p>
        <ul className="list-inside space-y-2 pl-4">
          <li>Le titre de vos listes</li>
          <li>Les articles que vous ajoutez</li>
          <li>Les assignations (qui ramène quoi)</li>
        </ul>
        <p>
          Aucune donnée personnelle identifiante n{"'"}est associée à une liste
          créée sans compte.
        </p>

        <h3 className="text-lg font-semibold">Avec un compte</h3>
        <p>
          La création d{"'"}un compte est facultative. Si vous en créez un, nous
          stockons en plus :
        </p>
        <ul className="list-inside space-y-2 pl-4">
          <li>Votre adresse e-mail et votre nom</li>
          <li>
            Votre mot de passe, sous forme chiffrée — ou, si vous passez par
            Google, les jetons d{"'"}authentification fournis par Google et
            votre photo de profil
          </li>
          <li>
            Vos sessions de connexion, qui incluent votre adresse IP et votre
            navigateur
          </li>
          <li>
            La liste des listes que vous ouvrez en étant connecté, afin de les
            retrouver dans « Mes listes »
          </li>
        </ul>

        <h3 className="text-lg font-semibold">Mesure d{"'"}audience</h3>
        <p>
          Nous mesurons la fréquentation du site avec OpenPanel, sur une
          instance que nous hébergeons nous-mêmes. Les mesures transitent par
          notre propre serveur : elles ne sont transmises à aucune régie
          publicitaire et ne servent à aucun profilage. Aucun cookie
          publicitaire n{"'"}est déposé.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">Utilisation</h2>
        <p>
          Vos données servent uniquement à faire fonctionner le service :
          afficher vos listes, vous permettre de vous connecter si vous avez un
          compte, et comprendre de manière agrégée comment le site est utilisé.
          Elles ne servent ni à la publicité, ni au profilage, ni à la prise de
          décision automatisée.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">Partage</h2>
        <p>
          <strong>
            Vos données ne sont jamais vendues, ni cédées à des fins
            publicitaires.
          </strong>{" "}
          Elles sont traitées par les prestataires strictement nécessaires au
          fonctionnement du service :
        </p>
        <ul className="list-inside space-y-2 pl-4">
          <li>
            <strong>Vercel</strong> — hébergement du site et de la base de
            données
          </li>
          <li>
            <strong>Google</strong> — uniquement si vous choisissez de vous
            connecter avec votre compte Google
          </li>
        </ul>
        <p>
          Toute personne disposant du lien d{"'"}une liste peut la consulter et
          la modifier : c{"'"}est le principe même du partage. Ne diffusez ce
          lien qu{"'"}aux personnes concernées.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">Rétention</h2>
        <p>
          Les listes sont conservées <strong>2 ans</strong> après leur dernière
          modification, puis automatiquement supprimées de nos serveurs, avec
          tous leurs articles.
        </p>
        <p>
          Les données de compte sont conservées tant que le compte existe. Vous
          pouvez le supprimer à tout moment depuis la page « Mes listes » : la
          suppression efface votre adresse e-mail, vos sessions et vos jetons de
          connexion.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">Vos droits</h2>
        <p>
          Conformément au Règlement général sur la protection des données
          (RGPD), vous disposez d{"'"}un droit d{"'"}accès, de rectification, d
          {"'"}effacement, de portabilité, de limitation et d{"'"}opposition sur
          vos données personnelles.
        </p>
        <p>
          Le droit d{"'"}effacement s{"'"}exerce directement depuis « Mes listes
          » via la suppression du compte. Pour toute autre demande, écrivez-nous
          à l{"'"}adresse indiquée ci-dessous ; nous répondons sous un mois.
        </p>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez
          introduire une réclamation auprès de la CNIL (
          <a
            href="https://www.cnil.fr"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
            rel="noopener noreferrer"
            target="_blank"
          >
            cnil.fr
          </a>
          ).
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p>
          Pour toute question relative à cette politique ou pour exercer vos
          droits, écrivez à{" "}
          <a
            href="mailto:quiramenequoi@antoinecalma.fr"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
          >
            quiramenequoi@antoinecalma.fr
          </a>
          . L{"'"}identité de l{"'"}éditeur figure dans les{" "}
          <Link
            href="/mentions-legales"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
          >
            mentions légales
          </Link>
          .
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">Sécurité</h2>
        <p>
          Vos données sont chiffrées en transit (HTTPS) et stockées de manière
          sécurisée chez Vercel. Les mots de passe ne sont jamais stockés en
          clair.
        </p>
      </section>

      <section className="text-sm text-gray-500 dark:text-gray-400">
        <p>Dernière mise à jour : 29 juillet 2026</p>
      </section>
    </main>
  );
}
