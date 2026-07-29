import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales - QuiRamèneQuoi",
  description:
    "Identité de l'éditeur, hébergeur et contact du site QuiRamèneQuoi.",
};

/**
 * ⚠️ À COMPLÉTER AVANT DÉPLOIEMENT.
 *
 * L'article 6-III de la LCEN impose à tout éditeur de site accessible au public
 * de publier son identité et un moyen de le contacter. Les valeurs marquées
 * « À_COMPLÉTER » ci-dessous n'ont volontairement pas été inventées : elles
 * doivent être renseignées par l'éditeur du site.
 *
 * Pour un particulier éditant un site non professionnel, la loi permet de ne
 * publier que le nom de l'hébergeur, à condition d'avoir communiqué son
 * identité à ce dernier — mais une adresse de contact reste nécessaire pour
 * traiter les demandes RGPD référencées dans /privacy.
 */
export default function MentionsLegales() {
  return (
    <main className="m-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Mentions légales</h1>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">Éditeur du site</h2>
        <p>
          QuiRamèneQuoi est édité par À_COMPLÉTER (nom ou raison sociale).
          <br />
          Statut : À_COMPLÉTER
          <br />
          Adresse : À_COMPLÉTER
          <br />
          Contact : À_COMPLÉTER (adresse e-mail)
        </p>
        <p>Directeur de la publication : À_COMPLÉTER</p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">Hébergement</h2>
        <p>
          Le site est hébergé par Vercel Inc.
          <br />
          340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
          <br />
          <a
            href="https://vercel.com"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
            rel="noopener noreferrer"
            target="_blank"
          >
            vercel.com
          </a>
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">Données personnelles</h2>
        <p>
          Le traitement de vos données et les modalités d{"'"}exercice de vos
          droits sont détaillés dans notre{" "}
          <Link
            href="/privacy"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
          >
            politique de confidentialité
          </Link>
          .
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">Propriété intellectuelle</h2>
        <p>
          Le nom QuiRamèneQuoi, le logo et l{"'"}interface du site sont la
          propriété de l{"'"}éditeur. Le contenu des listes créées par les
          utilisateurs reste la propriété de leurs auteurs.
        </p>
      </section>

      <section className="text-sm text-gray-500 dark:text-gray-400">
        <p>Dernière mise à jour : 29 juillet 2026</p>
      </section>
    </main>
  );
}
