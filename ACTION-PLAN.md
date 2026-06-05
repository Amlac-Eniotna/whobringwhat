# Plan d'action SEO — quiramenequoi.fr

> 2026-05-30 · Score actuel : **72/100** → Cible réaliste : **88/100**
> Priorités : 🔴 Critique/Important · 🟠 Moyen · 🟢 Faible. Chaque item référence le fichier exact (accès au code source).

---

## 🔴 À faire en priorité (impact fort, effort faible — < 1 semaine)

### 1. Compléter le sitemap (5 pages manquantes)
**Pourquoi :** seule la home est listée ; les pages de contenu indexables n'y sont pas.
**Où :** [app/sitemap.ts](app/sitemap.ts)
```ts
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://quiramenequoi.fr";
  const now = new Date();
  const routes = [
    { path: "",         priority: 1.0,  changeFrequency: "monthly" as const },
    { path: "/guide",   priority: 0.8,  changeFrequency: "monthly" as const },
    { path: "/faq",     priority: 0.8,  changeFrequency: "monthly" as const },
    { path: "/about",   priority: 0.6,  changeFrequency: "yearly"  as const },
    { path: "/privacy", priority: 0.3,  changeFrequency: "yearly"  as const },
    { path: "/terms",   priority: 0.3,  changeFrequency: "yearly"  as const },
  ];
  return routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
```

### 2. Optimiser le `<title>` d'accueil + template global
**Pourquoi :** le titre le plus important du site n'a aucun mot-clé.
**Où :** [app/layout.tsx](app/layout.tsx#L25-L35)
```ts
export const metadata: Metadata = {
  title: {
    default: "QuiRamèneQuoi — Qui ramène quoi ? Listes partagées pour soirées & événements",
    template: "%s | QuiRamèneQuoi",
  },
  // ...le reste inchangé
};
```
> Bonus : une fois le `template` en place, simplifier les titres enfants (`title: "À propos"`, `title: "Guide de démarrage"`, etc.) et uniformiser le séparateur (tout en ` | `) sur `/privacy` et `/terms`.

### 3. Supprimer le doublon de `<h1>` (wordmark du header)
**Pourquoi :** le logo `<h1>` du header s'ajoute au `<h1>` propre de chaque page → 2 `<h1>` partout.
**Où :** [app/layout.tsx](app/layout.tsx#L88-L93) — transformer le wordmark en `<span>`/`<p>` (le style reste identique). Garder un seul vrai `<h1>` par page.
```tsx
<Link href={"/"} className="flex items-center">
  <span className="font-syne p-4 font-black sm:text-3xl">QuiRamèneQuoi</span>
</Link>
```
> Sur la home, le `<h1>` descriptif devient alors celui de la section `About` ([layout/about/about.tsx](layout/about/about.tsx#L9)) — c'est le comportement voulu.

### 4. Ajouter le schema `FAQPage` sur /faq
**Pourquoi :** rich results Google + forte citabilité par les IA. Le tableau `faqs[]` est déjà prêt.
**Où :** [app/faq/page.tsx](app/faq/page.tsx)
```tsx
import Script from "next/script";
// ...
<Script id="schema-faq" type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  })}}
/>
```

### 5. Corriger le soft-404 sur /[id]
**Pourquoi :** toute URL invalide renvoie HTTP 200. Renvoyer un vrai 404 (+ page `not-found.tsx`).
**Où :** [app/[id]/page.tsx](app/[id]/page.tsx#L23-L27)
```tsx
import { notFound } from "next/navigation";
// ...
if (!list) notFound();   // remplace le rendu <E404 /> en 200
return <main ...><List data={list} /></main>;
```
> Créer un `app/not-found.tsx` reprenant le contenu actuel de `<E404 />` (bouton « Créer une liste » + disclaimer) pour conserver l'UX.

---

## 🟠 Important (impact moyen — < 1 mois)

### 6. Créer un vrai `/llms.txt`
**Pourquoi :** améliore la découvrabilité par les moteurs IA ; supprime le faux 200 actuel.
**Où :** `public/llms.txt` (fichier statique) ou `app/llms.txt/route.ts`.
```
# QuiRamèneQuoi
> Application web gratuite et sans inscription pour créer et partager des listes « qui ramène quoi » lors de soirées, apéros, barbecues et événements entre amis.

## Pages
- [Accueil](https://quiramenequoi.fr/): créer une liste partagée
- [Guide de démarrage](https://quiramenequoi.fr/guide): tutoriel pas-à-pas
- [FAQ](https://quiramenequoi.fr/faq): questions fréquentes
- [À propos](https://quiramenequoi.fr/about): concept et philosophie
```

### 7. Ajouter le schema `HowTo` sur /guide
**Pourquoi :** la page est un pas-à-pas numéroté → éligible au rich result « HowTo ».
**Où :** [app/guide/page.tsx](app/guide/page.tsx) — JSON-LD `HowTo` avec un `HowToStep` par étape.

### 8. Renforcer le maillage interne contextuel
**Pourquoi :** actuellement les liens internes ne passent que par le footer.
- Home → lien vers `/guide` (« Voir le guide ») et `/faq` dans la section `About`. → [layout/about/about.tsx](layout/about/about.tsx)
- `/guide` ↔ `/faq` : se lier mutuellement en fin de page.
- Ancres descriptives (éviter « cliquez ici »).

### 9. Solidifier les signaux E-E-A-T
**Pourquoi :** crédibilité (mise à jour Déc. 2025 : E-E-A-T étendu à toutes les requêtes compétitives).
- Confirmer/retirer l'auteur « présumé » → [app/layout.tsx](app/layout.tsx#L29).
- Ajouter une page/section **Contact** (email ou formulaire).
- Dates de « dernière mise à jour » sur `/privacy` et `/terms`.

---

## 🟢 À planifier (backlog)

### 10. Contenu de longue traîne (acquisition organique)
Créer 3-5 guides ciblant l'intention informationnelle du créneau :
- « Liste type pour un apéro entre amis (à copier) »
- « Comment organiser un barbecue : qui ramène quoi »
- « Idées de répartition pour un pique-nique / Noël en famille »
Chaque guide se conclut par un CTA « Créer ma liste ». → fort potentiel de citation IA + longue traîne.

### 11. Autorité de marque / off-site
- Soumettre à Product Hunt, AlternativeTo, annuaires d'outils gratuits FR.
- Viser des mentions dans des articles « apps pour organiser une soirée ».

### 12. HSTS preload + CSP appliquée (sécurité)
- Ajouter l'en-tête HSTS dans [next.config.ts](next.config.ts) : `max-age=63072000; includeSubDomains; preload`, puis soumettre sur hstspreload.org.
- Passer la CSP de `report-only` à appliquée une fois les rapports vérifiés.

### 13. Détails images / PWA
- Vérifier que `/icon.png` fait réellement 512×512, sinon fournir des fichiers distincts 192 et 512. → [app/manifest.ts](app/manifest.ts#L18-L27)
- Mettre les polices de l'OG image en cache local (éviter le fetch Google runtime). → [app/opengraph-image.tsx](app/opengraph-image.tsx#L15-L34)

### 14. Mesure & suivi
- Brancher Google Search Console (couverture, soft-404, requêtes) + données CrUX (LCP/INP/CLS réels).
- Re-mesurer après les correctifs 🔴.

---

## Impact estimé par lot

| Lot | Items | Effort | Gain de score estimé |
|-----|-------|--------|:---:|
| 🔴 Priorité | 1-5 | ~1/2 journée | **+10 à +12 pts** |
| 🟠 Important | 6-9 | ~1-2 jours | +4 à +6 pts |
| 🟢 Backlog | 10-14 | continu | +2 à +4 pts + trafic longue traîne |

**Cible après lots 🔴 + 🟠 : ≈ 86-88/100.**
