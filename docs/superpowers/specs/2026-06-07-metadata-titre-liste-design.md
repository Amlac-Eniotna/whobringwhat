# Titre de liste dynamique en metadata — Design

**Date :** 2026-06-07
**Statut :** Validé

## Objectif

Sur la page `/[id]`, utiliser le titre réel de la liste (stocké en base, donc
reflétant les éditions) comme `title` des metadata, à la place du titre
statique « QuiRamèneQuoi » hérité du layout.

Le `<title>` se met à jour au **prochain chargement / navigation** de la page
(comportement natif de `generateMetadata`). Pas de mise à jour en direct côté
client pendant l'édition.

## Portée

- **Un seul fichier modifié :** [app/[id]/page.tsx](../../../app/[id]/page.tsx)
- Aucun changement côté client, aucune nouvelle dépendance, aucune constante
  partagée (un seul point d'usage du libellé).

## Conception

### 1. Mutualiser la requête Prisma avec `cache()`

Aujourd'hui, la requête `prisma.list.findUnique` est faite dans le composant
`Page`. Avec `generateMetadata`, on aurait deux requêtes par requête HTTP.

On extrait la requête dans une fonction enveloppée de `cache` (React), appelée
à la fois par `generateMetadata` et par `Page`. React déduplique l'appel sur la
durée de la requête → **une seule requête DB**.

```ts
import { cache } from "react";

const getList = cache((id: string) =>
  prisma.list.findUnique({
    where: { id },
    select: { id: true, title: true, item: true },
  }),
);
```

`Page` appelle `getList(id)` au lieu de faire sa propre requête.

### 2. Remplacer `metadata` statique par `generateMetadata`

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

Format retenu : **`{titre} · QuiRamèneQuoi`**.

L'ancien export `export const metadata` est supprimé (remplacé par
`generateMetadata`). Le `robots: "noindex, nofollow"` est conservé dans les
deux branches.

## Cas limites

- **Liste inexistante** (`getList` renvoie `null`) → titre
  « Liste introuvable · QuiRamèneQuoi », `noindex` conservé. La page rend déjà
  `<E404 />`.
- **Caractères spéciaux dans le titre** → Next.js échappe automatiquement le
  contenu du `<title>`, rien à gérer.
- Le titre est déjà borné côté action (`update-list-title` : 1–100 caractères),
  pas de garde supplémentaire nécessaire.

## Vérification

Pas de suite de tests dans le repo.

- `npm run lint`
- `npm run build`
- Contrôle manuel : `<title>` dans le source HTML d'une page de liste, et
  fallback sur un ID inexistant.
```
