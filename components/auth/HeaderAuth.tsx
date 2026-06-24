import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export async function HeaderAuth() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <Link
      href={session ? "/mes-listes" : "/connexion"}
      className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
    >
      {session ? "Mes listes" : "Se connecter"}
    </Link>
  );
}
