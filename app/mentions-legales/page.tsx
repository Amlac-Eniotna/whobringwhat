import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales - QuiRamèneQuoi",
  description:
    "Identité de l'éditeur, hébergeur et contact du site QuiRamèneQuoi.",
};

/**
 * L'article 6-III de la LCEN impose à tout éditeur de site accessible au public
 * de se rendre identifiable. Le 6-III-2 dispense l'éditeur non professionnel de
 * publier son adresse personnelle, à condition d'avoir communiqué son identité
 * à son hébergeur — ce qu'implique la détention d'un compte Vercel. Seuls le
 * nom, une adresse de contact et l'hébergeur sont donc publiés ici.
 *
 * L'adresse de contact doit rester valide : elle est le canal des demandes RGPD
 * annoncées dans /privacy, auxquelles il faut répondre sous un mois.
 */
export default function MentionsLegales() {
  return (
    <main className="m-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Mentions légales</h1>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">Éditeur du site</h2>
        <p>
          QuiRamèneQuoi est édité par Antoine Calma, à titre personnel et non
          professionnel. Le site est un projet indépendant : aucune société n
          {"'"}est constituée pour son exploitation.
        </p>
        <p>
          Directeur de la publication : Antoine Calma
          <br />
          Contact :{" "}
          <a
            href="mailto:quiramenequoi@antoinecalma.fr"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
          >
            quiramenequoi@antoinecalma.fr
          </a>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Conformément à l{"'"}article 6-III-2 de la LCEN, l{"'"}éditeur non
          professionnel qui a communiqué son identité à son hébergeur peut ne
          pas publier son adresse personnelle.
        </p>
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
