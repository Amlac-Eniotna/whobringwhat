import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
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
});
