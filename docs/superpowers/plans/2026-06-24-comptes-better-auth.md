# Comptes & connexion (better-auth) — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permettre de créer un compte / se connecter (e-mail+mot de passe et Google) pour retrouver dans un tableau de bord « Mes listes » toutes les listes visitées en étant connecté.

**Architecture:** better-auth (adaptateur Prisma) gère utilisateurs/sessions/OAuth. Une table de jointure `UserList` relie un utilisateur aux listes qu'il a ouvertes. Le rattachement est automatique : à chaque visite réelle d'une liste, un composant client déclenche une server action qui, si une session existe, fait un `upsert` du lien. Les comptes n'ajoutent **aucune** restriction d'accès aux listes — l'URL reste la seule capacité.

**Tech Stack:** Next.js 16 (App Router), React 19, Prisma 7 + `@prisma/adapter-pg` (PostgreSQL), better-auth, Zod, Tailwind v4, Radix UI.

**Spec de référence:** [docs/superpowers/specs/2026-06-24-comptes-better-auth-design.md](../specs/2026-06-24-comptes-better-auth-design.md)

## Global Constraints

- **Aucune suite de tests** dans le repo (cf. CLAUDE.md). La « boucle de test » de chaque tâche = `npx tsc --noEmit` (typecheck) + `npm run lint` + vérification manuelle décrite. Ne PAS introduire de framework de test.
- **Langue** : toutes les chaînes UI sont **en français**, pas d'i18n. Match le ton existant.
- **Prisma** : utiliser le singleton exporté `prisma` de [lib/prisma.ts](lib/prisma.ts) ; ne jamais instancier `PrismaClient`. Ne jamais éditer `lib/generated/prisma/**` (généré, ignoré par ESLint).
- **Server actions** : pattern existant = `"use server"` + rate-limit IP via `lib/rate-limit.ts` + retour `{ success, error? }` + `revalidatePath` après mutation. Pas de REST/tRPC.
- **Modèle d'accès inchangé** : aucune action existante (`add-item`, `update-item`, `delete-item`, `update-list-title`, `create-list`) ne doit être restreinte par compte.
- **Confiance serveur** : ne jamais accepter un `userId` venant du client ; toujours relire la session via `auth.api.getSession`.
- **Pages noindex** : `/connexion`, `/inscription`, `/mes-listes` doivent porter `robots: "noindex, nofollow"`.
- **Path alias** : `@/*` → racine du repo.
- **Prettier** : `prettier-plugin-tailwindcss` ordonne les classes automatiquement ; ne pas se battre avec l'ordre des classes.

---

## File Structure

**Créés :**
- `lib/auth.ts` — config serveur `betterAuth()` (adaptateur Prisma, e-mail+mdp, Google).
- `lib/auth-client.ts` — `createAuthClient()` (signIn/signUp/signOut/useSession côté client).
- `app/api/auth/[...all]/route.ts` — handler des routes d'auth (`toNextJsHandler`).
- `actions/track-visit.ts` — server action : lie une liste à l'utilisateur connecté (upsert).
- `actions/remove-from-my-lists.ts` — server action : retire un lien `UserList`.
- `components/auth/TrackVisit.tsx` — client, déclenche `trackVisit` au montage.
- `components/auth/HeaderAuth.tsx` — server, lit la session, rend le lien header.
- `components/auth/LoginForm.tsx` — client, formulaire de connexion.
- `components/auth/SignupForm.tsx` — client, formulaire d'inscription.
- `components/auth/SignOutButton.tsx` — client, bouton de déconnexion.
- `components/auth/RemoveFromListButton.tsx` — client, bouton « Retirer ».
- `app/connexion/page.tsx` — server, métadonnées + `<LoginForm />` (sous Suspense).
- `app/inscription/page.tsx` — server, métadonnées + `<SignupForm />`.
- `app/mes-listes/page.tsx` — server, garde de session + tableau de bord.

**Modifiés :**
- `prisma/schema.prisma` — ajoute `User`, `Session`, `Account`, `Verification`, `UserList` + relations sur `List`.
- `app/[id]/page.tsx` — monte `<TrackVisit listId={id} />` dans la branche « liste trouvée ».
- `app/layout.tsx` — ajoute `<HeaderAuth />` dans le header, à côté de `<ModeToggle />`.
- `.env` — nouvelles variables (valeurs fournies par l'utilisateur).

---

## Task 1: Dépendance, schéma Prisma & migration

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `.env`
- Modify: `package.json` (via `npm install`)

**Interfaces:**
- Produces: modèles Prisma `User`, `Session`, `Account`, `Verification`, `UserList` ; relation `List.collaborators UserList[]`. Le client Prisma généré expose `prisma.userList` avec la clé composite `userId_listId`.

- [ ] **Step 1: Installer better-auth**

Run :
```bash
npm install better-auth
```
Expected : `better-auth` ajouté aux `dependencies` de `package.json`, installation sans erreur.

- [ ] **Step 2: Ajouter les modèles d'auth + jointure au schéma Prisma**

Dans `prisma/schema.prisma`, ajouter la relation inverse sur le modèle `List` existant (ajouter la ligne `collaborators`) :

```prisma
model List {
  id            String     @id @unique
  title         String
  item          Item[]
  collaborators UserList[]
  createdAt     DateTime   @default(now())
  updateAt      DateTime   @updatedAt
}
```

Puis ajouter, à la fin du fichier, les modèles suivants (champs better-auth standard, à ne pas renommer) :

```prisma
model User {
  id            String     @id
  name          String
  email         String     @unique
  emailVerified Boolean    @default(false)
  image         String?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  sessions      Session[]
  accounts      Account[]
  lists         UserList[]
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String   @unique
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model UserList {
  id      String   @id @default(cuid())
  userId  String
  listId  String
  addedAt DateTime @default(now())
  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  list    List     @relation(fields: [listId], references: [id], onDelete: Cascade)

  @@unique([userId, listId])
}
```

- [ ] **Step 3: Ajouter les variables d'environnement**

Dans `.env`, ajouter (générer le secret avec `openssl rand -base64 32`, et renseigner les identifiants Google depuis Google Cloud Console) :

```
BETTER_AUTH_SECRET=<openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<google client id>
GOOGLE_CLIENT_SECRET=<google client secret>
```

Note : en production (Vercel), `BETTER_AUTH_URL` = `https://quiramenequoi.fr` et l'URI de redirection autorisée côté Google doit être `https://quiramenequoi.fr/api/auth/callback/google` (+ `http://localhost:3000/api/auth/callback/google` pour le dev).

- [ ] **Step 4: Générer la migration et le client Prisma**

Run :
```bash
npx prisma migrate dev --name add-auth-and-userlist
```
Expected : nouvelle migration créée sous `prisma/migrations/`, appliquée à la base, client Prisma régénéré sans erreur. (Nécessite `DATABASE_URL` accessible — déjà présent dans `.env`.)

- [ ] **Step 5: Typecheck**

Run :
```bash
npx tsc --noEmit
```
Expected : aucune erreur (le client généré connaît `prisma.userList`).

- [ ] **Step 6: Commit**

```bash
git add prisma/schema.prisma prisma/migrations package.json package-lock.json
git commit -m "feat: schéma Prisma auth (User/Session/Account/Verification) + jointure UserList"
```

---

## Task 2: Config better-auth serveur, client & route API

**Files:**
- Create: `lib/auth.ts`
- Create: `lib/auth-client.ts`
- Create: `app/api/auth/[...all]/route.ts`

**Interfaces:**
- Produces:
  - `auth` (export de `lib/auth.ts`) — instance better-auth ; `auth.api.getSession({ headers })` renvoie `{ user: { id: string; name: string; email: string; image: string | null }, session: {...} } | null`.
  - `authClient` (export de `lib/auth-client.ts`) + ré-exports `signIn`, `signUp`, `signOut`, `useSession`.
  - Routes `GET`/`POST` sous `/api/auth/*`.

- [ ] **Step 1: Créer la config serveur `lib/auth.ts`**

```ts
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
});
```

Note : better-auth lit automatiquement `BETTER_AUTH_SECRET` et `BETTER_AUTH_URL` depuis l'environnement. Le provider Google n'est activé que si `GOOGLE_CLIENT_ID` **et** `GOOGLE_CLIENT_SECRET` sont définis — ainsi le développement local sans identifiants Google fonctionne (e-mail+mot de passe), et le bouton Google s'active dès que les clés sont fournies.

- [ ] **Step 2: Créer le client `lib/auth-client.ts`**

```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
```

- [ ] **Step 3: Créer le handler de routes `app/api/auth/[...all]/route.ts`**

```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

- [ ] **Step 4: Typecheck + lint**

Run :
```bash
npx tsc --noEmit && npm run lint
```
Expected : aucune erreur.

- [ ] **Step 5: Vérifier que les endpoints répondent**

Run (dans un terminal) :
```bash
npm run dev
```
Puis dans un autre terminal :
```bash
curl -i http://localhost:3000/api/auth/get-session
```
Expected : réponse HTTP `200` (corps `null` car non connecté), pas de 404/500.

- [ ] **Step 6: Commit**

```bash
git add lib/auth.ts lib/auth-client.ts app/api/auth
git commit -m "feat: configuration better-auth (serveur, client, route API)"
```

---

## Task 3: Page d'inscription

**Files:**
- Create: `components/auth/SignupForm.tsx`
- Create: `app/inscription/page.tsx`

**Interfaces:**
- Consumes: `authClient.signUp.email`, `authClient.signIn.social` de `lib/auth-client.ts` ; `Button` de `@/components/ui/button` ; `useToast` de `@/components/ui/use-toast`.
- Produces: route `/inscription`.

- [ ] **Step 1: Créer `components/auth/SignupForm.tsx`**

```tsx
"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/mes-listes";
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await authClient.signUp.email({
      email,
      password,
      name: email.split("@")[0],
    });
    if (error) {
      toast({
        title: "Erreur",
        description:
          error.message === "User already exists"
            ? "Un compte existe déjà avec cet e-mail."
            : "Inscription impossible. Vérifiez vos informations (mot de passe ≥ 8 caractères).",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    router.push(redirect);
    router.refresh();
  }

  async function handleGoogle() {
    await authClient.signIn.social({ provider: "google", callbackURL: redirect });
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <h2 className="font-syne text-2xl font-black">Créer un compte</h2>

      <form onSubmit={handleSignup} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Mot de passe (8 caractères min.)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          S{"'"}inscrire
        </Button>
      </form>

      <Button type="button" variant="outline" onClick={handleGoogle} disabled={isLoading}>
        Continuer avec Google
      </Button>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Créer `app/inscription/page.tsx`**

```tsx
import { SignupForm } from "@/components/auth/SignupForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Inscription · QuiRamèneQuoi",
  robots: "noindex, nofollow",
};

export default function InscriptionPage() {
  return (
    <main className="m-auto flex min-h-[calc(100vh-68px)] w-full max-w-3xl flex-col items-center justify-center p-4">
      <Suspense>
        <SignupForm />
      </Suspense>
    </main>
  );
}
```

- [ ] **Step 3: Typecheck + lint**

Run :
```bash
npx tsc --noEmit && npm run lint
```
Expected : aucune erreur.

- [ ] **Step 4: Vérification manuelle**

Avec `npm run dev`, ouvrir `http://localhost:3000/inscription`, créer un compte avec un e-mail + mot de passe (≥ 8 caractères). Expected : redirection vers `/mes-listes` (qui peut afficher une erreur 404 tant que la page n'existe pas — normal à ce stade ; vérifier seulement qu'une ligne `User` est créée). Vérifier en base :
```bash
npx prisma studio
```
Expected : 1 ligne dans `User`, 1 ligne dans `Account` (providerId `credential`).

- [ ] **Step 5: Commit**

```bash
git add components/auth/SignupForm.tsx app/inscription
git commit -m "feat: page d'inscription (e-mail+mot de passe et Google)"
```

---

## Task 4: Page de connexion

**Files:**
- Create: `components/auth/LoginForm.tsx`
- Create: `app/connexion/page.tsx`

**Interfaces:**
- Consumes: `authClient.signIn.email`, `authClient.signIn.social`.
- Produces: route `/connexion` (supporte `?redirect=<path>`).

- [ ] **Step 1: Créer `components/auth/LoginForm.tsx`**

```tsx
"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/mes-listes";
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      toast({
        title: "Erreur",
        description: "E-mail ou mot de passe incorrect.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    router.push(redirect);
    router.refresh();
  }

  async function handleGoogle() {
    await authClient.signIn.social({ provider: "google", callbackURL: redirect });
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <h2 className="font-syne text-2xl font-black">Se connecter</h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
        />
        <input
          type="password"
          required
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Se connecter
        </Button>
      </form>

      <Button type="button" variant="outline" onClick={handleGoogle} disabled={isLoading}>
        Continuer avec Google
      </Button>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Créer `app/connexion/page.tsx`**

```tsx
import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Connexion · QuiRamèneQuoi",
  robots: "noindex, nofollow",
};

export default function ConnexionPage() {
  return (
    <main className="m-auto flex min-h-[calc(100vh-68px)] w-full max-w-3xl flex-col items-center justify-center p-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
```

- [ ] **Step 3: Typecheck + lint**

Run :
```bash
npx tsc --noEmit && npm run lint
```
Expected : aucune erreur.

- [ ] **Step 4: Vérification manuelle**

Avec `npm run dev`, ouvrir `http://localhost:3000/connexion`, se connecter avec le compte créé en Task 3. Expected : redirection vers `/mes-listes`. Tester aussi `http://localhost:3000/connexion?redirect=/about` → après connexion, redirection vers `/about`.

- [ ] **Step 5: Commit**

```bash
git add components/auth/LoginForm.tsx app/connexion
git commit -m "feat: page de connexion (e-mail+mot de passe et Google) avec redirect"
```

---

## Task 5: État d'authentification dans le header

**Files:**
- Create: `components/auth/HeaderAuth.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `auth.api.getSession` de `lib/auth.ts`.
- Produces: `<HeaderAuth />` (server component) affichant « Se connecter » (déconnecté) ou « Mes listes » (connecté).

- [ ] **Step 1: Créer `components/auth/HeaderAuth.tsx`**

```tsx
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
```

- [ ] **Step 2: Monter `<HeaderAuth />` dans le header de `app/layout.tsx`**

Remplacer le bloc header existant (la `<div className="p-4">` contenant `<ModeToggle />`) par une version incluant `HeaderAuth` :

```tsx
<div className="flex items-center gap-4 p-4">
  <HeaderAuth />
  <ModeToggle />
</div>
```

Et ajouter l'import en haut de `app/layout.tsx` :

```tsx
import { HeaderAuth } from "@/components/auth/HeaderAuth";
```

Note : lire la session dans le header rend le layout dynamique pour toutes les pages (plus de génération statique de `/`, `/about`, etc.). C'est un compromis assumé pour afficher l'état d'auth global ; acceptable vu la taille de l'app.

- [ ] **Step 3: Typecheck + lint**

Run :
```bash
npx tsc --noEmit && npm run lint
```
Expected : aucune erreur.

- [ ] **Step 4: Vérification manuelle**

Avec `npm run dev` : déconnecté, le header affiche « Se connecter » → mène à `/connexion`. Après connexion, le header affiche « Mes listes » → mène à `/mes-listes`.

- [ ] **Step 5: Commit**

```bash
git add components/auth/HeaderAuth.tsx app/layout.tsx
git commit -m "feat: lien d'auth dans le header (Se connecter / Mes listes)"
```

---

## Task 6: Tracking automatique à la visite

**Files:**
- Create: `actions/track-visit.ts`
- Create: `components/auth/TrackVisit.tsx`
- Modify: `app/[id]/page.tsx`

**Interfaces:**
- Consumes: `auth.api.getSession`, `prisma.userList.upsert` (clé composite `userId_listId`), `rateLimit`/`getClientIp`.
- Produces: `trackVisit(listId: string): Promise<{ success: boolean; tracked?: boolean }>` ; composant `<TrackVisit listId={string} />`.

- [ ] **Step 1: Créer `actions/track-visit.ts`**

```ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function trackVisit(listId: string) {
  try {
    if (!listId) return { success: false };

    const ip = await getClientIp();
    const limit = rateLimit(`track-visit:${ip}`, 60, 60_000);
    if (!limit.ok) return { success: false };

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: true, tracked: false };

    const list = await prisma.list.findUnique({
      where: { id: listId },
      select: { id: true },
    });
    if (!list) return { success: false };

    await prisma.userList.upsert({
      where: { userId_listId: { userId: session.user.id, listId } },
      create: { userId: session.user.id, listId },
      update: {},
    });

    return { success: true, tracked: true };
  } catch (error) {
    console.error("Failed to track visit:", error);
    return { success: false };
  }
}
```

- [ ] **Step 2: Créer `components/auth/TrackVisit.tsx`**

```tsx
"use client";

import { trackVisit } from "@/actions/track-visit";
import { useEffect } from "react";

export function TrackVisit({ listId }: { listId: string }) {
  useEffect(() => {
    trackVisit(listId);
  }, [listId]);

  return null;
}
```

- [ ] **Step 3: Monter `<TrackVisit />` dans `app/[id]/page.tsx`**

Importer le composant en haut :
```tsx
import { TrackVisit } from "@/components/auth/TrackVisit";
```

Dans la branche où la liste **existe** (rendu de la liste, pas `<E404 />`), ajouter le composant (il ne rend rien visuellement), par exemple juste après l'ouverture du `<main>` :
```tsx
<TrackVisit listId={list.id} />
```

(Ne PAS le monter dans la branche `<E404 />`.)

- [ ] **Step 4: Typecheck + lint**

Run :
```bash
npx tsc --noEmit && npm run lint
```
Expected : aucune erreur.

- [ ] **Step 5: Vérification manuelle**

Connecté, créer une liste puis ouvrir son URL `/{id}`. Dans `npx prisma studio`, vérifier qu'une ligne `UserList` (userId, listId) est apparue. Recharger la page → toujours **une seule** ligne (upsert idempotent). Se déconnecter, ouvrir une autre liste → **aucune** nouvelle ligne `UserList`.

- [ ] **Step 6: Commit**

```bash
git add actions/track-visit.ts components/auth/TrackVisit.tsx app/[id]/page.tsx
git commit -m "feat: rattachement automatique d'une liste au compte à la visite"
```

---

## Task 7: Tableau de bord « Mes listes » (retrait + déconnexion)

**Files:**
- Create: `actions/remove-from-my-lists.ts`
- Create: `components/auth/RemoveFromListButton.tsx`
- Create: `components/auth/SignOutButton.tsx`
- Create: `app/mes-listes/page.tsx`

**Interfaces:**
- Consumes: `auth.api.getSession`, `prisma.userList.findMany` / `deleteMany`, `authClient.signOut`.
- Produces: `removeFromMyLists(listId: string): Promise<{ success: boolean; error?: string }>` ; route `/mes-listes`.

- [ ] **Step 1: Créer `actions/remove-from-my-lists.ts`**

```ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function removeFromMyLists(listId: string) {
  try {
    const ip = await getClientIp();
    const limit = rateLimit(`remove-from-my-lists:${ip}`, 30, 60_000);
    if (!limit.ok) {
      return { success: false, error: "Trop de requêtes, réessayez dans une minute." };
    }

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Vous n'êtes pas connecté." };

    await prisma.userList.deleteMany({
      where: { userId: session.user.id, listId },
    });

    revalidatePath("/mes-listes");
    return { success: true };
  } catch (error) {
    console.error("Failed to remove from my lists:", error);
    return { success: false, error: "Impossible de retirer la liste. Réessayez." };
  }
}
```

- [ ] **Step 2: Créer `components/auth/RemoveFromListButton.tsx`**

```tsx
"use client";

import { removeFromMyLists } from "@/actions/remove-from-my-lists";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RemoveFromListButton({ listId }: { listId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function handleRemove() {
    setIsLoading(true);
    const res = await removeFromMyLists(listId);
    if (!res.success) {
      toast({
        title: "Erreur",
        description: res.error || "Réessayez.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleRemove} disabled={isLoading}>
      Retirer
    </Button>
  );
}
```

- [ ] **Step 3: Créer `components/auth/SignOutButton.tsx`**

```tsx
"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignOut() {
    setIsLoading(true);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut} disabled={isLoading}>
      Se déconnecter
    </Button>
  );
}
```

- [ ] **Step 4: Créer `app/mes-listes/page.tsx`**

```tsx
import { RemoveFromListButton } from "@/components/auth/RemoveFromListButton";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Mes listes · QuiRamèneQuoi",
  robots: "noindex, nofollow",
};

export default async function MesListesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/connexion?redirect=/mes-listes");

  const rows = await prisma.userList.findMany({
    where: { userId: session.user.id },
    select: {
      list: {
        select: {
          id: true,
          title: true,
          updateAt: true,
          _count: { select: { item: true } },
        },
      },
    },
    orderBy: { list: { updateAt: "desc" } },
  });

  return (
    <main className="m-auto flex min-h-[calc(100vh-68px)] w-full max-w-3xl flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-syne text-2xl font-black">Mes listes</h2>
        <SignOutButton />
      </div>

      {rows.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Aucune liste pour l{"'"}instant. Ouvrez ou créez une liste : elle apparaîtra ici
          automatiquement.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map(({ list }) => (
            <li
              key={list.id}
              className="flex items-center justify-between rounded-md border px-4 py-3"
            >
              <Link href={`/${list.id}`} className="flex flex-col">
                <span className="font-medium">{list.title}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {list._count.item} article{list._count.item > 1 ? "s" : ""} ·{" "}
                  {list.updateAt.toLocaleDateString("fr-FR")}
                </span>
              </Link>
              <RemoveFromListButton listId={list.id} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
```

- [ ] **Step 5: Typecheck + lint**

Run :
```bash
npx tsc --noEmit && npm run lint
```
Expected : aucune erreur.

- [ ] **Step 6: Vérification manuelle (parcours complet)**

Avec `npm run dev` :
1. Déconnecté, ouvrir `/mes-listes` → redirection vers `/connexion?redirect=/mes-listes`.
2. Se connecter → tableau de bord. Les listes visitées en Task 6 apparaissent, triées par date de modif (modifier le titre d'une liste la fait remonter en haut après refresh).
3. Cliquer « Retirer » sur une liste → elle disparaît du tableau de bord ; son URL `/{id}` reste accessible.
4. Cliquer « Se déconnecter » → retour à `/`, le header repasse à « Se connecter ».

- [ ] **Step 7: Commit**

```bash
git add actions/remove-from-my-lists.ts components/auth/RemoveFromListButton.tsx components/auth/SignOutButton.tsx app/mes-listes
git commit -m "feat: tableau de bord Mes listes (retrait + déconnexion)"
```

---

## Task 8: Vérification finale & build

**Files:** aucun (validation).

- [ ] **Step 1: Build complet**

Run :
```bash
npm run build
```
Expected : build réussi (inclut `prisma generate`, `prisma migrate deploy`, `next build`). Aucune erreur de type ni de compilation.

- [ ] **Step 2: Vérification de non-régression anonyme**

Avec `npm run start` (ou `npm run dev`), **sans être connecté** : créer une liste, ajouter/éditer/supprimer un item, modifier le titre. Expected : tout fonctionne exactement comme avant (aucune dépendance au compte).

- [ ] **Step 3: Parcours Google OAuth**

Avec les identifiants Google configurés (Step 3 de Task 1) : `/connexion` → « Continuer avec Google » → consentement → redirection vers `/mes-listes`. Expected : `User` + `Account` (providerId `google`) créés ; le tableau de bord s'affiche.

- [ ] **Step 4: Note de déploiement (pas de commit de code)**

Avant le déploiement Vercel, renseigner les variables d'environnement de production : `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=https://quiramenequoi.fr`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, et ajouter l'URI de redirection Google `https://quiramenequoi.fr/api/auth/callback/google`. La migration s'applique automatiquement via `prisma migrate deploy` (script `build`).

---

## Notes finales

- **Sécurité** : mots de passe hachés par better-auth (scrypt) ; sessions en cookies httpOnly signés via `BETTER_AUTH_SECRET` ; `trackVisit` et `removeFromMyLists` relisent toujours la session côté serveur. Le modèle d'accès aux listes (URL = capacité) est inchangé.
- **Limites assumées** : pas de « mot de passe oublié » ni de vérification d'e-mail (MVP) ; visites pré-connexion non rattrapées ; bucket de rate-limit process-local.
