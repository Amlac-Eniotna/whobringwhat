# Design : suite de tests Vitest + convention TDD

**Date** : 2026-07-02
**Statut** : validé

## Contexte et objectif

Le projet n'a aucun framework de test. Objectif : mettre en place une première
suite de tests couvrant les server actions et les helpers de `lib/`, puis
inscrire dans `CLAUDE.md` la convention de travailler en TDD pour toute
logique métier future.

Décisions prises pendant le brainstorm :

- **Périmètre** : server actions (`actions/`) + helpers (`lib/`). Pas de tests
  composants, pas d'E2E.
- **Base de données** : Prisma est mocké — aucun Postgres requis pour lancer
  les tests.
- **Framework** : Vitest (TypeScript/ESM natifs, `vi.mock`, alias `@/*`).
- **Règle TDD** : pragmatique — obligatoire pour la logique métier, exemptée
  pour le JSX/styling, la copy, les pages statiques et la config.

## Outillage

- `vitest` ajouté en `devDependency` (seul nouveau paquet).
- `vitest.config.ts` à la racine :
  - environnement `node` (pas de jsdom — aucun test de composant) ;
  - alias `@` → racine du repo, aligné sur `tsconfig.json` ;
  - inclusion `**/*.test.ts` (hors `node_modules`, `lib/generated`).
- Scripts npm : `"test": "vitest run"`, `"test:watch": "vitest"`.
- Le script `build` reste inchangé : Vercel ne lance pas les tests.

## Organisation des tests

Tests colocalisés avec le code testé : `actions/add-item.test.ts` à côté de
`actions/add-item.ts`, `lib/rate-limit.test.ts` à côté de
`lib/rate-limit.ts`, etc.

## Stratégie de mock

Dans les tests d'actions, on mocke les frontières du module :

| Module mocké | Rôle dans les tests |
|---|---|
| `@/lib/prisma` | Singleton remplacé par un objet de `vi.fn()` par méthode utilisée (`list.create`, `list.findUnique`, `item.count`, `item.create`, `item.deleteMany`, `item.updateMany`, `user.delete`, `userList.upsert`, `userList.deleteMany`). |
| `@/lib/rate-limit` | `getClientIp` renvoie une IP fixe ; `rateLimit` est pilotable pour tester la branche « Trop de requêtes ». |
| `next/cache` | `revalidatePath` espionné pour vérifier qu'il est appelé avec le bon chemin. |
| `next/headers` | `headers()` renvoie des en-têtes contrôlés (utile aux actions authentifiées). |
| `@/lib/auth` | `auth.api.getSession` pilotable : session présente ou `null`. |

Cas particuliers :

- `lib/rate-limit.ts` est testé **sans mock** dans son propre fichier, avec
  `vi.useFakeTimers` pour contrôler les fenêtres de temps. Chaque test utilise
  des clés distinctes pour éviter la pollution du `Map` module-level.
- Le retry P2002 de `create-list` se teste en faisant rejeter le premier
  `prisma.list.create` avec une vraie `Prisma.PrismaClientKnownRequestError`
  (code `P2002`, `meta.target: ["id"]`) construite depuis le client généré,
  puis en laissant le second appel réussir.
- `lib/track.ts` se teste en environnement node : sans `window` la fonction
  sort silencieusement ; avec `vi.stubGlobal("window", …)` on vérifie l'appel
  `op("track", name, properties)`.

## Couverture visée

### lib/

- `rate-limit.test.ts` : autorise sous la limite ; bloque à la limite ;
  `remaining` décroît ; reset après expiration de la fenêtre ; éviction quand
  `MAX_KEYS` (5000) est atteint ; `getClientIp` — premier élément de
  `x-forwarded-for`, repli sur `x-real-ip`, puis `"unknown"`.
- `utils.test.ts` : `cn` fusionne les classes et résout les conflits Tailwind
  (minimal).
- `track.test.ts` : no-op sans `window` ; no-op si `window.op` absent ; appelle
  `op("track", …)` sinon.

### actions/ (un fichier de test par action)

Cas communs à chaque action : refus rate-limit → message « Trop de
requêtes… » ; erreurs de validation Zod (champs vides, dépassements de
longueur) ; parsing `FormData` et objet typé ; cas « not found » ; succès avec
`revalidatePath` appelé sur le bon chemin ; exception Prisma → retour
`{ success: false }` générique.

Cas spécifiques :

- `add-item` : plafond `MAX_ITEMS_PER_LIST` (500) atteint → erreur dédiée ;
  `who` optionnel.
- `create-list` : collision P2002 → nouvel essai avec un autre ID ; autre
  erreur Prisma → échec générique.
- `delete-item` / `update-item` : `deleteMany`/`updateMany` avec `count: 0` →
  « Item not found » ; l'id doit être un entier positif.
- `update-list-title` : liste inexistante → « List not found » ; titre max
  100 caractères.
- `delete-account` : sans session → « Vous n'êtes pas connecté. » ; avec
  session → `prisma.user.delete` appelé avec l'id de session.
- `track-visit` : `listId` vide → échec silencieux ; sans session →
  `{ success: true, tracked: false }` ; liste inexistante → échec ; sinon
  `userList.upsert`.
- `remove-from-my-lists` : sans session → erreur ; succès →
  `revalidatePath("/mes-listes")`.

## Modifications de CLAUDE.md

1. Section **Commands** : ajouter `npm test` et `npm run test:watch` ;
   supprimer la phrase « There is no test suite configured in this
   repository. »
2. Nouvelle section **Tests & TDD** :
   - TDD obligatoire pour toute logique métier (server actions, helpers
     `lib/`, routes API) : écrire d'abord un test qui échoue, le voir échouer,
     écrire le minimum pour le faire passer, refactorer (red → green →
     refactor).
   - Exemptés : JSX/styling, copy, pages statiques, configuration.
   - Note : la présente suite initiale teste du code déjà écrit (tests de
     caractérisation) ; la règle red → green → refactor s'applique à tout
     nouveau développement à partir de maintenant.
   - Conventions : Vitest en environnement node, tests colocalisés `*.test.ts`,
     Prisma/rate-limit/next-cache/auth mockés aux frontières (table ci-dessus),
     jamais de vraie base de données dans les tests.

## Hors périmètre

- Tests de composants React et E2E Playwright.
- CI GitHub Actions (les tests se lancent manuellement via `npm test`).
- Seuil de couverture imposé.
