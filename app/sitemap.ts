import { MetadataRoute } from "next";

/**
 * Pages statiques indexables du site.
 *
 * Volontairement absentes : /[id] (vues de liste), /connexion, /inscription
 * et /mes-listes portent toutes `robots: "noindex, nofollow"` dans leur
 * metadata — les y ajouter enverrait un signal contradictoire à Google
 * (« indexe-moi » via le sitemap vs « n'indexe pas » via la balise) et ferait
 * remonter des avertissements « URL envoyée marquée 'noindex' » dans Search
 * Console. Les routes /api/* ne sont pas des pages HTML indexables et sont
 * déjà exclues via robots.txt (Disallow: /api/).
 *
 * `lastModified` doit refléter la dernière modification RÉELLE du contenu de
 * chaque page, jamais un horodatage de build (`new Date()` au chargement du
 * module renvoie l'instant du build/déploiement, pas un vrai changement de
 * contenu — Google déconseille explicitement les dates fictives ou
 * identiques sur toutes les URLs, qui réduisent la confiance accordée au
 * sitemap entier). Valeurs initiales alignées sur le dernier commit ayant
 * modifié chaque fichier (`git log -1 --format=%cd -- app/xxx/page.tsx`) ;
 * à mettre à jour manuellement quand le contenu de la page change.
 *
 * priority et changefreq sont volontairement omis : Google les ignore
 * intégralement (cf. Google Search Central), les conserver n'apporterait
 * qu'une fausse précision à maintenir sans aucun bénéfice SEO.
 */
const STATIC_PAGES: ReadonlyArray<{ path: string; lastModified: string }> = [
  { path: "", lastModified: "2026-07-29" },
  { path: "/qui-apporte-quoi", lastModified: "2026-07-29" },
  { path: "/about", lastModified: "2026-07-29" },
  { path: "/guide", lastModified: "2026-04-03" },
  { path: "/faq", lastModified: "2026-07-29" },
  { path: "/privacy", lastModified: "2026-07-29" },
  { path: "/terms", lastModified: "2026-04-03" },
  { path: "/mentions-legales", lastModified: "2026-07-29" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Normalisation défensive : si NEXT_PUBLIC_APP_URL est un jour défini avec
  // un slash final, on évite de générer des doubles slashes (ex. .fr//about).
  const baseUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "https://quiramenequoi.fr"
  ).replace(/\/+$/, "");

  return STATIC_PAGES.map(({ path, lastModified }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
  }));
}
