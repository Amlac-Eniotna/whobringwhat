# Compteur de caractères — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un petit compteur de caractères `X/Y` sous chacun des 5 champs de saisie de l'app, mis à jour à chaque frappe.

**Architecture:** Un composant présentationnel réutilisable `CharCounter` (`components/ui/char-counter.tsx`) est inséré sous chaque `<input>`. Chaque input concerné est enveloppé dans un conteneur `flex-col` pour empiler input + compteur. Aucune server action ni schéma Zod n'est modifié.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, helper `cn` (`clsx` + `tailwind-merge`).

> **Pas de tests automatisés :** ce dépôt n'a aucune suite de tests (cf. `CLAUDE.md`). Le TDD ne s'applique pas. Chaque tâche est vérifiée par `npm run lint` (zéro erreur/warning nouveau) et la Tâche 5 fait une vérification visuelle dans le navigateur. Ne pas introduire de framework de test.

---

## Décisions de design (rappel du spec)

- Compteur **toujours visible** (champ vide → `0/100`).
- On **laisse dépasser** la limite : pas de `maxLength` HTML. Au-delà de la limite, le compteur passe en **rouge** (`text-destructive`). La validation serveur Zod reste inchangée.
- Format **« saisis / total »**, ex. `20/100`.
- Limites : `100` pour les titres/articles, `50` pour les prénoms (identiques aux schémas Zod existants).

## Structure des fichiers

- **Créer** `components/ui/char-counter.tsx` — composant `CharCounter` (responsabilité unique : afficher `value.length/max` avec état d'alerte).
- **Modifier** `components/list/ListTitle.tsx` — compteur sous le champ titre de liste (`max=100`).
- **Modifier** `components/list/CreateListItem.tsx` — compteurs sous article (`max=100`) et prénom (`max=50`).
- **Modifier** `components/list/ListItem.tsx` — compteurs sous article (`max=100`) et prénom (`max=50`).

---

### Task 1 : Composant `CharCounter`

**Files:**
- Create: `components/ui/char-counter.tsx`

- [ ] **Step 1 : Créer le fichier du composant**

Créer `components/ui/char-counter.tsx` avec ce contenu exact :

```tsx
import { cn } from "@/lib/utils";

interface CharCounterProps {
  value: string;
  max: number;
  className?: string;
}

export function CharCounter({ value, max, className }: CharCounterProps) {
  const count = value.length;
  const isOver = count > max;

  return (
    <span
      aria-live="polite"
      className={cn(
        "mt-0.5 block text-right text-xs tabular-nums",
        isOver ? "text-destructive" : "text-muted-foreground",
        className,
      )}
    >
      {count}/{max}
    </span>
  );
}
```

Notes :
- `block` + `text-right` garantit l'alignement à droite aussi bien dans un conteneur `flex-col` (stretch) que dans un `<div>` block.
- `tabular-nums` empêche le « saut » horizontal quand le nombre change de largeur (ex. `9` → `10`).
- `value.length` compte en unités UTF-16, comme le `.max()` de Zod par défaut → seuil affiché = seuil refusé côté serveur.

- [ ] **Step 2 : Vérifier le lint**

Run: `npm run lint`
Expected: aucune nouvelle erreur ni warning (le fichier compile, l'import `@/lib/utils` se résout).

- [ ] **Step 3 : Commit**

```bash
git add components/ui/char-counter.tsx
git commit -m "feat: ajoute le composant CharCounter"
```

---

### Task 2 : Compteur sous le titre de liste

**Files:**
- Modify: `components/list/ListTitle.tsx` (bloc input ~lignes 305-327, + import en tête)

- [ ] **Step 1 : Ajouter l'import**

En haut de `components/list/ListTitle.tsx`, parmi les imports existants, ajouter :

```tsx
import { CharCounter } from "@/components/ui/char-counter";
```

- [ ] **Step 2 : Insérer le compteur sous l'input**

Dans le `return` du mode édition, le bloc actuel est :

```tsx
      <div className="w-full">
        <input
          ref={inputRef}
          type="text"
          placeholder="Titre de la liste"
          className="text-center text-foreground focus:border-primary focus:ring-primary h-9 w-full rounded-md border bg-transparent p-2 text-lg font-medium backdrop-blur-xs outline-none focus:ring-1"
          value={titleText}
          onChange={(e) => setTitleText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleUpdate();
            } else if (e.key === "Escape") {
              e.preventDefault();
              handleCancel();
            }
          }}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-destructive mt-1 text-xs">{errors.title[0]}</p>
        )}
      </div>
```

Le remplacer par (ajout de `<CharCounter ... />` juste après l'input) :

```tsx
      <div className="w-full">
        <input
          ref={inputRef}
          type="text"
          placeholder="Titre de la liste"
          className="text-center text-foreground focus:border-primary focus:ring-primary h-9 w-full rounded-md border bg-transparent p-2 text-lg font-medium backdrop-blur-xs outline-none focus:ring-1"
          value={titleText}
          onChange={(e) => setTitleText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleUpdate();
            } else if (e.key === "Escape") {
              e.preventDefault();
              handleCancel();
            }
          }}
          disabled={isSubmitting}
        />
        <CharCounter value={titleText} max={100} />
        {errors.title && (
          <p className="text-destructive mt-1 text-xs">{errors.title[0]}</p>
        )}
      </div>
```

> ⚠️ Attention au `onBlur={handleBlur}` : si `handleBlur` enregistre/ferme l'édition au blur, le compteur n'est visible que pendant l'édition active — c'est le comportement attendu (le champ n'existe qu'en mode édition). Ne pas modifier `handleBlur`.

- [ ] **Step 3 : Vérifier le lint**

Run: `npm run lint`
Expected: aucune nouvelle erreur ni warning.

- [ ] **Step 4 : Commit**

```bash
git add components/list/ListTitle.tsx
git commit -m "feat: compteur de caractères sous le titre de liste"
```

---

### Task 3 : Compteurs sous les champs d'ajout d'article

**Files:**
- Modify: `components/list/CreateListItem.tsx` (groupe d'inputs ~lignes 79-102, + import en tête)

- [ ] **Step 1 : Ajouter l'import**

En haut de `components/list/CreateListItem.tsx`, parmi les imports existants, ajouter :

```tsx
import { CharCounter } from "@/components/ui/char-counter";
```

- [ ] **Step 2 : Envelopper les inputs et insérer les compteurs**

Le bloc actuel du groupe d'inputs est :

```tsx
      <div className="flex w-full gap-2">
        <input
          type="text"
          placeholder="Nom de l'article"
          className="text-foreground focus:border-primary focus:ring-primary h-9 w-full rounded-md border bg-transparent p-2 backdrop-blur-xs outline-none focus:ring-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-destructive mt-1 text-xs">{errors.title[0]}</p>
        )}
        <input
          type="text"
          placeholder="Prénom (facultatif)"
          className="text-foreground focus:border-primary focus:ring-primary h-9 w-full max-w-24 rounded-md border bg-transparent p-2 backdrop-blur-xs outline-none focus:ring-1"
          value={who}
          onChange={(e) => setWho(e.target.value)}
          disabled={isSubmitting}
        />
        {errors.who && (
          <p className="text-destructive mt-1 text-xs">{errors.who[0]}</p>
        )}
      </div>
```

Le remplacer par (chaque input enveloppé dans un `flex-col`, `max-w-24` déplacé de l'input prénom vers son wrapper) :

```tsx
      <div className="flex w-full gap-2">
        <div className="flex w-full flex-col">
          <input
            type="text"
            placeholder="Nom de l'article"
            className="text-foreground focus:border-primary focus:ring-primary h-9 w-full rounded-md border bg-transparent p-2 backdrop-blur-xs outline-none focus:ring-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
          <CharCounter value={title} max={100} />
          {errors.title && (
            <p className="text-destructive mt-1 text-xs">{errors.title[0]}</p>
          )}
        </div>
        <div className="flex w-full max-w-24 flex-col">
          <input
            type="text"
            placeholder="Prénom (facultatif)"
            className="text-foreground focus:border-primary focus:ring-primary h-9 w-full rounded-md border bg-transparent p-2 backdrop-blur-xs outline-none focus:ring-1"
            value={who}
            onChange={(e) => setWho(e.target.value)}
            disabled={isSubmitting}
          />
          <CharCounter value={who} max={50} />
          {errors.who && (
            <p className="text-destructive mt-1 text-xs">{errors.who[0]}</p>
          )}
        </div>
      </div>
```

> Le `max-w-24` qui était sur l'`<input>` prénom est désormais sur son wrapper `div`, et l'input devient `w-full` : la colonne prénom conserve la même largeur plafonnée qu'avant.

- [ ] **Step 3 : Vérifier le lint**

Run: `npm run lint`
Expected: aucune nouvelle erreur ni warning.

- [ ] **Step 4 : Commit**

```bash
git add components/list/CreateListItem.tsx
git commit -m "feat: compteurs de caractères sur l'ajout d'article"
```

---

### Task 4 : Compteurs sous les champs d'édition d'article

**Files:**
- Modify: `components/list/ListItem.tsx` (groupe d'inputs ~lignes 139-162, + import en tête)

- [ ] **Step 1 : Ajouter l'import**

En haut de `components/list/ListItem.tsx`, parmi les imports existants, ajouter :

```tsx
import { CharCounter } from "@/components/ui/char-counter";
```

- [ ] **Step 2 : Envelopper les inputs et insérer les compteurs**

Le bloc actuel du groupe d'inputs est (noter `px-3`, différent de la Task 3) :

```tsx
        <div className="flex w-full gap-2">
          <input
            type="text"
            placeholder="Article"
            className="text-foreground focus:border-primary focus:ring-primary h-9 w-full rounded-md border bg-transparent px-3 backdrop-blur-xs outline-none focus:ring-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-destructive mt-1 text-xs">{errors.title[0]}</p>
          )}
          <input
            type="text"
            placeholder="Prénom (facultatif)"
            className="text-foreground focus:border-primary focus:ring-primary h-9 w-full max-w-24 rounded-md border bg-transparent px-3 backdrop-blur-xs outline-none focus:ring-1"
            value={who}
            onChange={(e) => setWho(e.target.value)}
            disabled={isSubmitting}
          />
          {errors.who && (
            <p className="text-destructive mt-1 text-xs">{errors.who[0]}</p>
          )}
        </div>
```

Le remplacer par :

```tsx
        <div className="flex w-full gap-2">
          <div className="flex w-full flex-col">
            <input
              type="text"
              placeholder="Article"
              className="text-foreground focus:border-primary focus:ring-primary h-9 w-full rounded-md border bg-transparent px-3 backdrop-blur-xs outline-none focus:ring-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
            <CharCounter value={title} max={100} />
            {errors.title && (
              <p className="text-destructive mt-1 text-xs">{errors.title[0]}</p>
            )}
          </div>
          <div className="flex w-full max-w-24 flex-col">
            <input
              type="text"
              placeholder="Prénom (facultatif)"
              className="text-foreground focus:border-primary focus:ring-primary h-9 w-full rounded-md border bg-transparent px-3 backdrop-blur-xs outline-none focus:ring-1"
              value={who}
              onChange={(e) => setWho(e.target.value)}
              disabled={isSubmitting}
            />
            <CharCounter value={who} max={50} />
            {errors.who && (
              <p className="text-destructive mt-1 text-xs">{errors.who[0]}</p>
            )}
          </div>
        </div>
```

- [ ] **Step 3 : Vérifier le lint**

Run: `npm run lint`
Expected: aucune nouvelle erreur ni warning.

- [ ] **Step 4 : Commit**

```bash
git add components/list/ListItem.tsx
git commit -m "feat: compteurs de caractères sur l'édition d'article"
```

---

### Task 5 : Vérification visuelle de bout en bout

**Files:** aucun (vérification manuelle).

- [ ] **Step 1 : Lancer le serveur de dev**

Run: `npm run dev`
Ouvrir l'URL affichée, créer une liste (bouton de la page d'accueil).

- [ ] **Step 2 : Vérifier les 5 champs**

Contrôler visuellement :
- Titre de liste (clic sur le titre pour éditer) : compteur `N/100` visible sous le champ, aligné à droite, `0/100` quand vide.
- Ajout d'article : compteurs `N/100` (article) et `N/50` (prénom) visibles, le champ prénom reste étroit (~96px).
- Édition d'un article existant : mêmes compteurs `N/100` et `N/50`.
- Taper au-delà de la limite (ex. coller >100 caractères) : le compteur vire au **rouge**.
- Vérifier en thème clair ET sombre (toggle de thème) que le compteur reste lisible.

- [ ] **Step 3 : Vérifier que la validation serveur est intacte**

Avec un titre dépassant 100 caractères, valider : l'envoi est toujours refusé par Zod (message d'erreur existant), comme avant. Aucune régression.

- [ ] **Step 4 : Lint final**

Run: `npm run lint`
Expected: aucune erreur.

---

## Self-Review (rempli par l'auteur du plan)

- **Couverture du spec :** les 5 champs (Tasks 2-4) + composant (Task 1) + comportement « toujours visible / laisser dépasser / rouge en dépassement / format X/Y » (Task 1) + cohérence des limites 100/50 + non-modification des actions/Zod (aucune task ne touche `actions/`) → couvert.
- **Placeholders :** aucun « TBD/TODO », tout le code est fourni en intégralité.
- **Cohérence des types :** le composant exporte `CharCounter` avec les props `value: string`, `max: number` ; les 5 appels respectent exactement cette signature (`value={...}` = un state string, `max={100|50}`).
- **Pas de test automatisé :** assumé et justifié en tête (dépôt sans suite de tests) ; vérification par lint + visuel.
