# Titre de liste dynamique en metadata — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Afficher le titre réel de la liste dans le `<title>` de la page `/[id]` via `generateMetadata`, au format `{titre} · QuiRamèneQuoi`.

**Architecture:** Remplacer l'export `metadata` statique de [app/[id]/page.tsx](../../../app/[id]/page.tsx) par une fonction `generateMetadata`. Mutualiser la requête Prisma entre `generateMetadata` et le composant `Page` via `cache()` (React) pour éviter un double fetch. Mise à jour du titre au prochain chargement uniquement (pas de MAJ client en direct).

**Tech Stack:** Next.js 16 App Router, React 19 `cache()`, Prisma 7.

---

### Task 1 : `generateMetadata` + requête Prisma mutualisée

**Files:**
- Modify: `app/[id]/page.tsx`

Pas de suite de tests dans le repo → vérification par lint, build et contrôle manuel du `<title>`.

- [ ] **Step 1 : Ajouter l'import `cache`**

En tête de fichier, ajouter `cache` à l'import React (il n'y a pas encore d'import depuis `"react"`, donc ajouter une ligne) :

```ts
import { cache } from "react";
```

- [ ] **Step 2 : Extraire la requête Prisma dans `getList` enveloppé de `cache()`**

Juste après les imports, avant l'ancien export `metadata`, ajouter :

```ts
const getList = cache((id: string) =>
  prisma.list.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      item: true,
    },
  }),
);
```

- [ ] **Step 3 : Remplacer l'export `metadata` statique par `generateMetadata`**

Supprimer :

```ts
export const metadata: Metadata = {
  robots: "noindex, nofollow",
};
```

Et le remplacer par :

```ts
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const list = await getList(id);
  return {
    title: list
      ? `${list.title} · QuiRamèneQuoi`
      : "Liste introuvable · QuiRamèneQuoi",
    robots: "noindex, nofollow",
  };
}
```

- [ ] **Step 4 : Faire appeler `getList` par le composant `Page`**

Dans `Page`, remplacer le `prisma.list.findUnique({ ... })` inline par :

```ts
const list = await getList(id);
```

(La sélection `{ id, title, item }` est désormais portée par `getList`, donc identique à l'existant — le rendu de `List` / `E404` ne change pas.)

- [ ] **Step 5 : Lint**

Run: `npm run lint`
Expected: aucune erreur (l'import `Metadata` reste utilisé par le type de retour de `generateMetadata`).

- [ ] **Step 6 : Build**

Run: `npm run build`
Expected: build réussi.

- [ ] **Step 7 : Contrôle manuel**

Run: `npm run dev`, ouvrir une liste, vérifier dans le source HTML que `<title>` vaut `{titre de la liste} · QuiRamèneQuoi`. Ouvrir un ID inexistant → `<title>` = `Liste introuvable · QuiRamèneQuoi`. Renommer le titre puis recharger → `<title>` reflète le nouveau titre.

- [ ] **Step 8 : Commit**

```bash
git add app/[id]/page.tsx docs/superpowers/specs/2026-06-07-metadata-titre-liste-design.md docs/superpowers/plans/2026-06-07-metadata-titre-liste.md
git commit -m "feat: titre de la liste en metadata sur /[id]"
```

---

## Self-Review

- **Couverture du spec :** `generateMetadata` (✓ Step 3), mutualisation `cache()` (✓ Steps 2 & 4), format `{titre} · QuiRamèneQuoi` (✓ Step 3), fallback liste inexistante + `noindex` conservé (✓ Step 3), vérif lint/build/manuel (✓ Steps 5-7). Tous les points du spec sont couverts.
- **Placeholders :** aucun ; chaque step contient le code exact.
- **Cohérence des types :** `getList` renvoie le même objet `{ id, title, item }` consommé par `Page` ; `generateMetadata` n'utilise que `list.title`. Signatures `params: Promise<{ id: string }>` identiques à l'existant.
