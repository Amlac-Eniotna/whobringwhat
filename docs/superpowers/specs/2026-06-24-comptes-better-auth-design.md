# Design — Comptes & connexion (better-auth) pour sauvegarder les listes collaborées

**Date :** 2026-06-24
**Statut :** validé (brainstorming), prêt pour plan d'implémentation

## Objectif

Permettre à un utilisateur de **créer un compte** et de **se connecter** afin de retrouver, dans un
tableau de bord personnel « Mes listes », toutes les listes avec lesquelles il a collaboré.

Aujourd'hui l'app n'a **aucune authentification ni notion de propriétaire** : quiconque détient l'URL
d'une liste peut la lire et l'éditer. Cette fonctionnalité **ne change pas** ce modèle d'accès — elle
ajoute uniquement un **carnet de favoris personnel** par-dessus.

## Principe directeur

Les comptes n'ajoutent **aucune barrière d'accès** aux listes :

- L'URL non devinable reste la **seule capacité** d'accès et d'édition.
- Être connecté ne verrouille rien ; figurer dans le « Mes listes » de quelqu'un ne donne aucun
  droit exclusif sur la liste.
- L'usage **anonyme** actuel reste 100 % fonctionnel et inchangé.

Un compte = un carnet de favoris personnel des listes touchées.

## Décisions de design

| Sujet | Décision |
|-------|----------|
| Lien liste ↔ compte | **Automatique à chaque visite** d'une liste en étant connecté |
| Méthodes d'auth | **E-mail + mot de passe** et **Google OAuth** |
| E-mails (vérif. / reset) | **Reportés** — pas de fournisseur d'e-mail dans ce lot |
| UI d'auth | **Pages dédiées** `/connexion` et `/inscription` |
| Gestion « Mes listes » | **Retirer** une liste + **tri par date de modification** |
| Déconnexion | Bouton **sur la page `/mes-listes`** (pas dans le header) |

## Architecture

### Better-auth (couche lib)

- **`lib/auth.ts`** — configuration `betterAuth()` :
  - `database: prismaAdapter(prisma, { provider: "postgresql" })` (réutilise le singleton
    `prisma` exporté par `lib/prisma.ts`, ne pas instancier `PrismaClient` directement).
  - `emailAndPassword: { enabled: true, requireEmailVerification: false }` (connexion immédiate,
    pas d'e-mail de vérification).
  - `socialProviders: { google: { clientId, clientSecret } }`.
  - Rate-limiting intégré de better-auth activé sur ses endpoints.
- **`lib/auth-client.ts`** — `createAuthClient()` exposant `signIn` / `signUp` / `signOut` /
  `useSession` pour les composants client.
- **`app/api/auth/[...all]/route.ts`** — handler unique des routes d'auth via `toNextJsHandler(auth)`.

### Modèle de données (Prisma → PostgreSQL)

Ajout des **4 tables standard de better-auth** : `User`, `Session`, `Account`, `Verification`.
Elles sont **générées via `npx @better-auth/cli generate`** (et non écrites à la main) pour rester
fidèles au schéma attendu par better-auth, puis intégrées à `prisma/schema.prisma`.

Ajout d'une table de jointure pour la collaboration :

```prisma
model UserList {
  id      String   @id @default(cuid())
  userId  String
  listId  String
  addedAt DateTime @default(now())
  user    User @relation(fields: [userId], references: [id], onDelete: Cascade)
  list    List @relation(fields: [listId], references: [id], onDelete: Cascade)
  @@unique([userId, listId])
}
```

- `List` reçoit la relation inverse `collaborators UserList[]`.
- `User` reçoit `lists UserList[]`.
- `onDelete: Cascade` côté `list` : la purge cron (suppression des listes > 2 ans) nettoie
  automatiquement les liens `UserList` associés.
- `onDelete: Cascade` côté `user` : la suppression d'un utilisateur supprime ses `Session`,
  `Account` et `UserList`, **sans toucher** aux listes partagées.
- Tri du tableau de bord par `List.updateAt` (champ déjà existant) — pas besoin de stocker une
  date de dernière visite.

### Variables d'environnement (nouvelles)

- `BETTER_AUTH_SECRET` — secret de signature des sessions (obligatoire).
- `BETTER_AUTH_URL` — URL de base (= `NEXT_PUBLIC_APP_URL`, défaut `https://quiramenequoi.fr`).
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — identifiants OAuth Google (créés dans Google Cloud
  Console).

La migration s'applique via le `prisma migrate deploy` déjà présent dans le script `build`.

## Flux UX

### Pages d'authentification

- **`/inscription`** (composant client) : e-mail + mot de passe + bouton « Continuer avec Google ».
  Appelle `authClient.signUp.email` ; le champ `name` requis par better-auth est dérivé de la partie
  locale de l'e-mail (pas de champ « nom » demandé, pour rester minimal). Redirection vers
  `/mes-listes` au succès.
- **`/connexion`** (composant client) : e-mail + mot de passe + « Continuer avec Google ».
  Supporte un paramètre `?redirect=/<id>` : si l'utilisateur a cliqué « Se connecter » depuis une
  liste, il y est ramené après connexion ; sinon redirection vers `/mes-listes`.
- Les deux pages sont marquées `noindex, nofollow` (cohérent avec le reste de l'app).

### Header (`app/layout.tsx`)

La session est lue **côté serveur** (`auth.api.getSession({ headers })`). Le header rend, à côté du
`ModeToggle` :

- **Déconnecté** : un lien « Se connecter » (vers `/connexion`).
- **Connecté** : un simple lien « Mes listes » (vers `/mes-listes`). Pas de dropdown.

### Tableau de bord — `/mes-listes`

- **Server component**. Si pas de session → `redirect("/connexion?redirect=/mes-listes")`.
- Requête : `UserList` filtré par `userId`, jointure `List` (id, title, updateAt, nombre d'items),
  trié par `List.updateAt` desc.
- Rendu : cartes cliquables (titre, nombre d'items, date de modification) menant vers `/[id]`,
  chacune avec un bouton **« Retirer »**.
- **Bouton « Se déconnecter »** sur cette page (composant client appelant `authClient.signOut`,
  puis redirection vers `/`).
- **État vide** : message invitant à créer ou ouvrir une liste.

### Tracking « auto à la visite »

Next.js **précharge** les liens au survol ; écrire directement dans le render du server component
`/[id]` ajouterait des listes simplement survolées. Pour l'éviter :

- Un petit composant client `<TrackVisit listId={id} />` est monté dans `app/[id]/page.tsx` et
  appelle, **au montage réel** (`useEffect`), la server action `trackVisit(listId)`.
- **`actions/track-visit.ts`** : lit la session côté serveur ; **si connecté**, fait un `upsert` du
  `UserList(userId, listId)` ; **si anonyme, no-op**. Rate-limité par IP comme les autres actions.

### Retrait d'une liste

- **`actions/remove-from-my-lists.ts`** : exige une session, supprime la ligne
  `UserList(userId, listId)`, puis `revalidatePath("/mes-listes")`. Rate-limité par IP.

## Sécurité

- **Mots de passe** : hachés par better-auth (scrypt par défaut), jamais stockés en clair.
- **Sessions** : cookies httpOnly/secure signés via `BETTER_AUTH_SECRET`.
- **Confiance serveur** : `trackVisit` et `remove-from-my-lists` revérifient **toujours** la session
  côté serveur ; aucun `userId` n'est accepté depuis le client.
- **Modèle d'accès inchangé** : aucune action existante (`add-item`, `update-item`, `delete-item`,
  `update-list-title`, `create-list`) n'est restreinte par compte. L'URL reste la capacité unique.
- **Rate-limiting** : bucket IP existant conservé sur les nouvelles actions ; rate-limiting intégré
  de better-auth activé sur ses endpoints.

## Contraintes & comportements assumés

- Les visites faites **avant** connexion ne sont pas rattrapées (tracking uniquement si une session
  est active au moment du montage de `<TrackVisit />`).
- Le bucket de rate-limit reste **process-local** (réinitialisé aux cold starts, non partagé entre
  instances Vercel) — comportement existant inchangé.
- Pas de « mot de passe oublié » ni de vérification d'e-mail dans le MVP ; Google reste l'option
  sans-mot-de-passe.

## Hors-périmètre (YAGNI pour ce lot)

Renommage personnel d'une liste, épinglage/favori, partage par e-mail / invitations, rôles ou
permissions, distinction créateur vs simple collaborateur, suppression d'une liste depuis le compte,
intégration d'un fournisseur d'e-mail.

## Vérification

Pas de suite de tests dans le repo. Vérification **manuelle** :

1. Inscription e-mail + mot de passe → visite d'une liste → la liste apparaît dans `/mes-listes`.
2. Bouton « Retirer » → la liste disparaît du tableau de bord (mais reste accessible par URL).
3. Déconnexion depuis `/mes-listes` → retour à l'accueil, header repasse en « Se connecter ».
4. Parcours **Google OAuth** complet (connexion → tableau de bord).
5. Usage **anonyme** d'une liste inchangé (aucune régression).
6. `npm run build` et `npm run lint` passent.

## Risques connus

- **Prisma 7 + better-auth** : Prisma 7 (avec `driverAdapters` et client généré dans
  `lib/generated/prisma`) est récent ; la compatibilité de l'adaptateur Prisma de better-auth est à
  confirmer lors de l'implémentation (provider `postgresql`, chemin de client custom).
