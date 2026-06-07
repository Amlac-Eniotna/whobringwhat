# Compteur de caractères sous les champs de saisie

## Contexte

L'app **QuiRamèneQuoi** possède 5 champs de saisie éditables, répartis dans 3 composants.
Chacun a une limite de longueur validée **uniquement côté serveur** (Zod), sans aucun
`maxLength` HTML ni retour visuel pendant la frappe. Conséquence : l'utilisateur ne
découvre qu'au moment de l'envoi qu'il a dépassé la limite (rejet Zod).

| Champ | Composant | Limite Zod | Schéma |
|---|---|---|---|
| Titre de liste | `components/list/ListTitle.tsx` (input ~ligne 306) | 100 | `actions/update-list-title.ts` |
| Nom d'article (ajout) | `components/list/CreateListItem.tsx` (input ~ligne 80) | 100 | `actions/add-item.ts` |
| Prénom (ajout) | `components/list/CreateListItem.tsx` (input ~ligne 91) | 50 | `actions/add-item.ts` |
| Nom d'article (édition) | `components/list/ListItem.tsx` (input ~ligne 140) | 100 | `actions/update-item.ts` |
| Prénom (édition) | `components/list/ListItem.tsx` (input ~ligne 151) | 50 | `actions/update-item.ts` |

Il n'existe **pas** de composant `Input` partagé dans `components/ui/` : chaque `<input>`
est défini inline.

## Objectif

Ajouter un petit compteur de caractères sous chaque champ de saisie, pour donner un retour
visuel en temps réel pendant la frappe.

## Décisions (validées avec l'utilisateur)

- **Affichage** : toujours visible (même champ vide → `0/100`).
- **Dépassement** : on **laisse dépasser** la limite (pas de `maxLength` HTML bloquant).
  Au-delà de la limite, le compteur passe en alerte visuelle (rouge). L'envoi reste protégé
  par la validation Zod côté serveur, inchangée.
- **Format** : « saisis / total », ex. `20/100`.
- **Approche** : composant réutilisable `CharCounter` (pas de refonte des inputs, pas de
  composant `Input` partagé).

## Conception

### Composant `CharCounter`

Fichier : `components/ui/char-counter.tsx`

- **Props** : `value: string`, `max: number`. (Le composant calcule `value.length` lui-même.)
- **Rendu** : `{value.length}/{max}`.
- **Style** : `text-xs`, aligné à droite, `tabular-nums` (évite le « saut » visuel quand le
  nombre change de largeur). Couleur discrète au repos (`text-muted-foreground`).
- **État d'alerte** : si `value.length > max`, la couleur passe en `text-destructive` (rouge).
- **Accessibilité** : `aria-live="polite"` pour que les lecteurs d'écran annoncent
  l'évolution sans être trop verbeux.
- Le composant est purement présentationnel : pas d'état interne, pas d'effet de bord.

Cohérence des compteurs : `value.length` compte en unités UTF-16, exactement comme le
`.max()` de Zod par défaut → le seuil affiché côté client correspond au seuil refusé côté
serveur.

### Intégration dans les 3 composants

Le compteur se place **juste sous chaque champ, aligné à droite** — et non sur la même ligne,
car les champs article + prénom sont déjà disposés côte à côte (`flex w-full gap-2`) et le
champ prénom est étroit (`max-w-24`).

Chaque `<input>` concerné est enveloppé dans un conteneur `flex-col` qui empile l'input puis
le `CharCounter`. Disposition cible :

```
Nom de l'article              Prénom (facult.)
[ Plateau de fromages___ ]    [ Léa_______ ]
                   20/100              3/50
```

Les 5 emplacements et leurs `max` :

- `ListTitle.tsx` — titre de liste, `max={100}`.
- `CreateListItem.tsx` — nom d'article `max={100}`, prénom `max={50}`.
- `ListItem.tsx` — nom d'article `max={100}`, prénom `max={50}`.

Les valeurs `max` reprennent exactement les limites Zod existantes (100 / 50).

## Hors périmètre

- Aucune modification des server actions ni des schémas Zod.
- Pas de `maxLength` HTML (choix « laisser dépasser »).
- Pas de composant `Input` partagé / refonte des inputs existants.
- Pas de nouvel endpoint.
- Pas de test (le dépôt n'a pas de suite de tests).

## Critères de réussite

- Un compteur `X/Y` apparaît sous chacun des 5 champs, mis à jour à chaque frappe.
- Le compteur affiche `0/Y` quand le champ est vide.
- Le compteur devient rouge dès que la longueur dépasse la limite.
- Aucune régression de la validation serveur existante.
- `npm run lint` passe.
