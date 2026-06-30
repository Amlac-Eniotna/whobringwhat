import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { op } from "@/lib/op";
import { prisma } from "@/lib/prisma";

const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders:
    googleId && googleSecret
      ? { google: { clientId: googleId, clientSecret: googleSecret } }
      : {},
  account: {
    accountLinking: {
      enabled: true,
      // Google vérifie les adresses e-mail : on autorise la liaison
      // automatique d'une connexion Google à un compte e-mail/mot de passe
      // existant portant la même adresse (évite l'erreur account_not_linked).
      trustedProviders: ["google"],
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Ne se déclenche qu'à la création réelle d'un utilisateur : ni à une
        // connexion existante, ni à une liaison de compte. C'est donc la
        // source de vérité unique « un compte vient d'être créé », couvrant à
        // la fois l'inscription e-mail et l'inscription via Google.
        after: async (user, context) => {
          // Méthode déduite du chemin de l'endpoint qui a créé le compte :
          // /sign-up/email (e-mail) vs /callback/:id (OAuth Google, seul
          // provider social configuré).
          const path = context?.path ?? "";
          const method = path.includes("sign-up")
            ? "email"
            : path.includes("callback")
              ? "google"
              : "unknown";
          try {
            // Tracking serveur (événement métier). profileId = id du compte
            // (aléatoire, non-PII) ; on n'envoie aucune donnée personnelle
            // (e-mail, nom).
            await op.track("account_created", { profileId: user.id, method });
          } catch (error) {
            // Le tracking ne doit jamais faire échouer la création de compte.
            console.error("Failed to track account_created:", error);
          }
        },
      },
    },
  },
});
