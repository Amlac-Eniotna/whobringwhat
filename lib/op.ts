// Client OpenPanel côté serveur — utilisé dans les server actions pour suivre
// les événements métier (création de liste, ajout d'item, etc.).
// ⚠️ NE JAMAIS importer ce fichier dans un composant client : le CLIENT_SECRET
// y est exposé et doit rester uniquement côté serveur.
import { OpenPanel } from "@openpanel/nextjs";

export const op = new OpenPanel({
  apiUrl: process.env.ANALYTICS_API_URL!,
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
});
