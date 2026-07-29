"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";

/**
 * Composant client volontairement, et non server component.
 *
 * La version serveur appelait `auth.api.getSession({ headers: await headers() })`.
 * Or `headers()` est une API dynamique de Next.js : l'utiliser dans un composant
 * monté par le layout racine faisait basculer *toute* l'application en rendu
 * dynamique. Conséquence mesurée en production : `/about`, `/guide`, `/faq`,
 * `/privacy` et `/terms` — du contenu strictement statique — étaient recalculées
 * à chaque requête avec une lecture de session en base, servies en
 * `cache-control: private, no-cache, no-store`, jamais mises en cache CDN, et le
 * bfcache était désactivé sur l'ensemble du site.
 *
 * Côté client, la session est résolue après hydratation. Pendant ce court
 * instant on affiche l'état anonyme : c'est ce que voit un visiteur non connecté
 * (la grande majorité) comme un crawler, et cela évite un trou dans l'en-tête
 * qui décalerait la mise en page.
 */
export function HeaderAuth() {
  const { data: session } = useSession();

  return (
    <Link
      href={session ? "/mes-listes" : "/connexion"}
      className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
    >
      {session ? "Mes listes" : "Se connecter"}
    </Link>
  );
}
