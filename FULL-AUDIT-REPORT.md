# Audit SEO complet — quiramenequoi.fr

> Date de l'audit : 2026-05-30 · Méthode : crawl live + analyse du code source (Next.js 16 / App Router)
> Type de site détecté : **Application web gratuite (SoftwareApplication / outil de productivité)** — pas de business local, pas d'e-commerce.
> Audit précédent (2026-04-03) : 48/100 → **progression nette** (sécurité, redirections, OG images, pages de contenu désormais en place).

## Score de santé SEO global : **72 / 100** 🟡

| Catégorie | Poids | Score | Pondéré |
|-----------|:----:|:----:|:------:|
| Technical SEO | 22 % | 82 | 18,0 |
| Content Quality | 23 % | 72 | 16,6 |
| On-Page SEO | 20 % | 66 | 13,2 |
| Schema / Données structurées | 10 % | 60 | 6,0 |
| Performance (CWV) | 10 % | 80 | 8,0 |
| AI Search Readiness | 10 % | 58 | 5,8 |
| Images | 5 % | 85 | 4,3 |
| **Total** | **100 %** | | **≈ 72** |

---

## Résumé exécutif

QuiRamèneQuoi est un site techniquement sain et propre : HTTPS, redirections canoniques correctes, en-têtes de sécurité solides, contenu en français de bonne qualité sur les pages statiques. Les faiblesses se concentrent sur **trois leviers à fort impact et faible effort** : un sitemap incomplet, un `<title>` d'accueil non optimisé, et l'absence de schema FAQ. Le site est petit (6 pages indexables) — chaque optimisation compte.

### Top 5 problèmes critiques / importants
1. **Sitemap incomplet** — seule la home y figure ; les 5 pages de contenu (`/about`, `/guide`, `/faq`, `/privacy`, `/terms`) sont absentes. → [app/sitemap.ts](app/sitemap.ts)
2. **Soft-404** — toute URL inexistante (ex. `/llms.txt`, `/nimportequoi`) renvoie **HTTP 200** au lieu de 404. → [app/[id]/page.tsx](app/[id]/page.tsx)
3. **`<title>` d'accueil non optimisé** — « QuiRamèneQuoi » seul, sans mot-clé. Aucune cible sémantique (« qui ramène quoi », « liste apéro », « organiser soirée »). → [app/layout.tsx](app/layout.tsx)
4. **Deux `<h1>` par page** — le wordmark du header global est un `<h1>`, qui s'ajoute au `<h1>` propre de chaque page. → [app/layout.tsx](app/layout.tsx#L90)
5. **Schema FAQPage absent** — la page FAQ a un contenu Q/R idéal mais aucun balisage `FAQPage` (perte de rich results + citabilité IA). → [app/faq/page.tsx](app/faq/page.tsx)

### Top 5 quick wins
1. Ajouter les 5 pages au sitemap (5 lignes de code).
2. Réécrire `metadata.title` de la home avec un template + un titre descriptif.
3. Ajouter le JSON-LD `FAQPage` sur `/faq`.
4. Transformer le wordmark du header en `<span>`/`<p>` (supprime le doublon de `h1`).
5. Créer un vrai `/llms.txt` (route ou fichier `public/`).

---

## 1. Technical SEO — 82/100

### Points forts ✅
- **HTTPS + redirections** toutes en 308 et cohérentes :
  - `http://` → `https://` ✅
  - `www.` → apex (non-www) ✅
  - trailing slash `/about/` → `/about` ✅
- **En-têtes de sécurité** présents : `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- **CSP** présente en mode `report-only` avec nonce + `strict-dynamic` (bonne hygiène, non bloquante pour le SEO).
- **robots.txt** correct : `Allow: /`, `Disallow: /api/`, lien vers le sitemap. → [app/robots.ts](app/robots.ts)
- **Canonicals** auto-référencés et corrects sur toutes les pages (sans trailing slash, cohérent avec les redirections).
- **Rendu** : pages prérendues statiquement, servies par le CDN Vercel (`x-vercel-cache: HIT`), HTML léger (~36 Ko).
- `noindex, nofollow` correctement appliqué sur les pages liste `/[id]` (évite le bloat d'index sur des URL privées). → [app/[id]/page.tsx](app/[id]/page.tsx#L9-L11)

### Problèmes ⚠️
| Sévérité | Problème | Détail |
|----------|----------|--------|
| **High** | Soft-404 | Le segment catch-all `/[id]` rend `<E404 />` mais renvoie **HTTP 200**. N'importe quelle URL invalide est donc un « 200 OK » trompeur. Mitigé par le `noindex`, mais Google peut signaler des soft-404 dans la Search Console. Correctif : appeler `notFound()` quand `list === null`. |
| **Low** | HSTS incomplet | En-tête live : `strict-transport-security: max-age=63072000` — **sans** `includeSubDomains` ni `preload`. Le CLAUDE.md mentionne « HSTS preload » mais le site n'est pas éligible au préchargement en l'état (l'en-tête provient de Vercel, pas de `next.config.ts`). |
| **Low** | CSP non appliquée | La CSP est en `report-only` uniquement : elle journalise sans bloquer. Sans impact SEO, mais à activer pour la sécurité réelle. |

---

## 2. Content Quality — 72/100

### E-E-A-T & profondeur
- **Pages de contenu réelles et utiles** : `/about` (problème → solution → philosophie), `/guide` (pas-à-pas), `/faq` (Q/R claires). Ton naturel, français idiomatique, bien aligné avec l'intention « organiser qui ramène quoi ».
- Home : section « À propos » riche (~**797 mots**), structure claire (Comment ça marche / Pourquoi / Cas d'usage / CTA).

### Problèmes ⚠️
| Sévérité | Problème | Détail |
|----------|----------|--------|
| **Medium** | Signaux E-E-A-T faibles | Pas de bio auteur, pas de page contact, pas de dates de publication/mise à jour. Le code contient même `authors: [{ name: "Antoine Calma" }] // Presumed author` → auteur incertain. → [app/layout.tsx](app/layout.tsx#L29) |
| **Medium** | Couverture sémantique limitée | Aucun contenu ciblant les requêtes de longue traîne du créneau : « liste apéro à imprimer », « organiser un barbecue entre amis », « qui apporte quoi application », « répartir les courses soirée ». Un mini-blog / guides thématiques capterait du trafic informationnel. |
| **Low** | Pas de maillage contextuel | Les pages ne se citent pas entre elles dans le corps de texte (uniquement via le footer). Ex. : `/guide` devrait lier `/faq`, la home devrait lier `/guide`. |

---

## 3. On-Page SEO — 66/100

### État des balises par page
| Page | `<title>` | Meta description | Canonical | Verdict |
|------|-----------|:----------------:|:---------:|---------|
| `/` | `QuiRamèneQuoi` | ✅ (descriptive) | ✅ | ⚠️ titre non optimisé |
| `/about` | `À propos \| QuiRamèneQuoi` | ✅ | ✅ | ✅ |
| `/guide` | `Guide de démarrage \| QuiRamèneQuoi` | ✅ | ✅ | ✅ |
| `/faq` | `FAQ - Questions fréquentes \| QuiRamèneQuoi` | ✅ | ✅ | ✅ |
| `/privacy` | `Politique de Confidentialité - QuiRamèneQuoi` | ✅ | ✅ | ✅ |
| `/terms` | `Conditions d'Utilisation - QuiRamèneQuoi` | ✅ | ✅ | ✅ |

### Problèmes ⚠️
| Sévérité | Problème | Détail |
|----------|----------|--------|
| **High** | Titre d'accueil pauvre | `<title>QuiRamèneQuoi</title>` ne contient aucun mot-clé. C'est la page la plus importante du site. Cible suggérée : `QuiRamèneQuoi — Qui ramène quoi ? Listes partagées pour soirées & événements`. |
| **High** | Doublon de `<h1>` | Chaque page rend **deux `<h1>`** : le wordmark global du header (`<h1>QuiRamèneQuoi</h1>`, [app/layout.tsx](app/layout.tsx#L90)) **+** le `<h1>` propre de la page. Sur la home, deux `<h1>` cohabitent (wordmark + « L'art de l'organisation partagée »). À garder : 1 `<h1>` par page. |
| **Medium** | H1 d'accueil sous la ligne de flottaison | Le seul `<h1>` descriptif (« QuiRamèneQuoi - L'art de l'organisation partagée ») est dans la section `About`, après le scroll. Au-dessus de la ligne de flottaison : juste un bouton + un disclaimer. |
| **Low** | Cohérence des séparateurs de titre | Mélange ` \| ` et ` - ` entre les pages (`À propos | …` vs `Politique de Confidentialité - …`). Cosmétique. |

### Points forts ✅
- Open Graph **complet** : `og:title`, `og:description`, `og:image` (1200×630, type/dimensions/alt déclarés).
- Twitter Card `summary_large_image` complète.
- `lang="fr"` correct, viewport présent, meta description sur **toutes** les pages.

---

## 4. Schema / Données structurées — 60/100

### Implémenté ✅
- `Organization` (JSON-LD) — global. → [app/layout.tsx](app/layout.tsx#L45-L57)
- `SoftwareApplication` (JSON-LD) avec `offers` price 0 EUR — global, **valide**. → [app/layout.tsx](app/layout.tsx#L58-L77)
- 2 blocs JSON-LD confirmés sur le HTML rendu, sans erreur de syntaxe.

### Opportunités manquées ⚠️
| Sévérité | Opportunité | Page |
|----------|-------------|------|
| **High** | `FAQPage` | La page `/faq` a un tableau `faqs[]` parfaitement structuré mais aucun balisage. Gros gain rich results + citabilité IA. → [app/faq/page.tsx](app/faq/page.tsx) |
| **Medium** | `HowTo` | `/guide` est un pas-à-pas numéroté (étapes 1-2-3) : candidat idéal au schema `HowTo`. → [app/guide/page.tsx](app/guide/page.tsx) |
| **Low** | `BreadcrumbList` | Aucun fil d'Ariane structuré sur les pages internes. |
| **Low** | `WebSite` | Optionnel (peu utile sans recherche interne). |

---

## 5. Performance (Core Web Vitals) — 80/100

> ⚠️ Pas de données terrain (CrUX/field) disponibles dans cet audit — estimation basée sur l'architecture.

### Points forts ✅
- Pages **statiques prérendues** + CDN Vercel (`HIT`). HTML 36 Ko.
- **Polices préchargées** (`rel=preload` woff2 pour Nunito / Nunito Sans / Syne, self-hosted via `next/font`).
- `optimizePackageImports: ["lucide-react", "date-fns"]` → tree-shaking des icônes. → [next.config.ts](next.config.ts#L16)
- `output: "standalone"`.
- **Aucune image bitmap** sur la home (icônes en SVG inline) → LCP léger.

### À surveiller ⚠️
| Sévérité | Point | Détail |
|----------|-------|--------|
| **Low** | Animation de fond | `<div id="bg-animate">` (animation plein écran) — vérifier l'impact sur INP/CLS et la consommation CPU mobile. → [app/page.tsx](app/page.tsx#L9) |
| **Low** | 3 familles de polices | Nunito + Nunito Sans + Syne. Envisager de réduire à 2 si l'usage de l'une est marginal. |
| **Info** | Pas de field data | Brancher CrUX / Search Console pour mesurer LCP, INP, CLS réels. |

---

## 6. Images — 85/100

### Points forts ✅
- **Aucune image de contenu sans alt** (le site n'utilise pas de `<img>` en contenu — tout est texte + SVG).
- `og:image` générée dynamiquement (1200×630, PNG ~25 Ko) avec `alt` déclaré (« QuiRamèneQuoi - Organisez vos soirées »). → [app/opengraph-image.tsx](app/opengraph-image.tsx)
- Favicon, icône PWA et apple-icon générées.

### Points d'attention ⚠️
| Sévérité | Point | Détail |
|----------|-------|--------|
| **Low** | Tailles d'icônes du manifest | Le manifest déclare `/icon.png` en **192×192 ET 512×512** alors que c'est le même fichier — vérifier que le fichier source fait bien 512px (sinon le 192 ou le 512 est faux). → [app/manifest.ts](app/manifest.ts#L18-L27) |
| **Low** | OG image — polices runtime | `opengraph-image.tsx` fetch les polices Google **au runtime** ; un échec réseau côté edge casserait l'image sociale. Mise en cache OK, mais fragile. |

---

## 7. AI Search Readiness (GEO) — 58/100

### Points forts ✅
- **Crawlers IA autorisés** : `User-Agent: *` / `Allow: /` n'exclut ni GPTBot, ni ClaudeBot, ni PerplexityBot.
- Contenu FAQ en **Q/R concises** → format idéal pour la citation par les moteurs génératifs.
- HTML sémantique, contenu rendu côté serveur (accessible sans JS).

### Problèmes ⚠️
| Sévérité | Problème | Détail |
|----------|----------|--------|
| **Medium** | Pas de `llms.txt` | `/llms.txt` renvoie 200 mais c'est le **soft-404** (HTML de la route `/[id]`), pas un vrai fichier. Créer un vrai `/llms.txt` listant les pages clés. |
| **Medium** | Pas de `FAQPage` schema | Réduit la probabilité de citation passage-level (voir §4). |
| **Medium** | Faible signal de marque | « QuiRamèneQuoi » a peu de mentions off-site / backlinks → autorité faible pour les LLM. Levier : annuaires d'outils gratuits, Product Hunt, articles « apps pour organiser une soirée ». |

---

## Annexe — Méthodologie & couverture du crawl
- **Pages indexables découvertes : 6** (`/`, `/about`, `/guide`, `/faq`, `/privacy`, `/terms`). Site sous le plafond de 500 pages → crawl exhaustif.
- **Pages non indexables (volontaire) :** `/[id]` (listes utilisateur, `noindex,nofollow`), `/api/*` (bloqué robots).
- Données croisées entre le rendu HTTP live et le code source du dépôt (`app/`, `next.config.ts`, `actions/`).
- Limites : pas de données de champ CWV (CrUX/GSC), pas de profil de backlinks (aucun outil tiers connecté).
