# Suite de tests Vitest + convention TDD — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mettre en place Vitest, couvrir les 8 server actions et les helpers de `lib/` par des tests (Prisma mocké), et inscrire la convention TDD dans CLAUDE.md.

**Architecture:** Tests colocalisés (`*.test.ts` à côté du code testé), environnement node, mocks partagés dans `lib/__mocks__/` pour `@/lib/prisma`, `@/lib/rate-limit` et `@/lib/auth` ; `next/cache` et `next/headers` mockés inline. `lib/rate-limit.ts` est le seul module testé sans mock (avec fake timers).

**Tech Stack:** Vitest (seule nouvelle dépendance), TypeScript strict, Next.js 16 server actions, Prisma 7 (client généré dans `lib/generated/prisma`).

**Spec:** `docs/superpowers/specs/2026-07-02-test-suite-tdd-design.md`

## Global Constraints

- Une seule nouvelle dépendance autorisée : `vitest` (devDependency).
- Jamais de vraie base de données dans les tests ; ne jamais instancier `PrismaClient`.
- Les tests doivent passer `npx tsc --noEmit` (TypeScript `strict` ; les fichiers de test sont typechecked par `next build` sur Vercel).
- Pour caster un mock, utiliser systématiquement `as unknown as Mock` (import `type Mock` de vitest) — ne pas utiliser `vi.mocked()` sur les méthodes Prisma (leurs génériques cassent l'inférence).
- Descriptions de tests (`describe`/`it`) en français, comme le reste du repo.
- Les messages d'erreur vérifiés par les tests sont copiés **verbatim** depuis les actions (mélange français/anglais existant — ne pas "corriger").
- Style : double quotes, point-virgules (Prettier du repo).
- Le script `build` de package.json ne doit PAS être modifié.
- Commit après chaque fichier de test qui passe.

---

### Task 1: Setup Vitest + premier test (lib/utils)

**Files:**
- Modify: `package.json` (scripts)
- Create: `vitest.config.ts`
- Create: `lib/utils.test.ts`

**Interfaces:**
- Consumes: `cn(...inputs: ClassValue[]): string` de `lib/utils.ts`.
- Produces: config Vitest globale utilisée par toutes les tâches suivantes — alias `@` → racine, `environment: "node"`, `restoreMocks: true` (les implémentations d'origine des `vi.fn(impl)` sont restaurées avant chaque test), include `**/*.test.ts`. Scripts `npm test` / `npm run test:watch`.

- [ ] **Step 1: Installer vitest**

Run: `npm install -D vitest`
Expected: ajout de `"vitest"` dans `devDependencies` de package.json, exit 0.

- [ ] **Step 2: Créer la config Vitest**

Créer `vitest.config.ts` :

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: { "@": rootDir },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", "lib/generated/**", ".next/**"],
    restoreMocks: true,
  },
});
```

- [ ] **Step 3: Ajouter les scripts npm**

Dans `package.json`, section `scripts`, ajouter après `"lint": "eslint ."` :

```json
    "test": "vitest run",
    "test:watch": "vitest",
```

- [ ] **Step 4: Écrire le test de lib/utils**

Créer `lib/utils.test.ts` :

```ts
import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("fusionne les classes et ignore les valeurs falsy", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });

  it("résout les conflits Tailwind en faveur de la dernière classe", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
```

- [ ] **Step 5: Lancer le test**

Run: `npm test -- lib/utils.test.ts`
Expected: PASS — 2 tests verts. (Vérifie au passage que l'alias `@` fonctionne.)

- [ ] **Step 6: Vérifier le typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0, aucune erreur.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts lib/utils.test.ts
git commit -m "test: mise en place de Vitest + tests de lib/utils"
```

---

### Task 2: Tests de lib/rate-limit (sans mock, fake timers)

**Files:**
- Create: `lib/rate-limit.test.ts`
- Reference: `lib/rate-limit.ts` (module testé tel quel ; `MAX_KEYS = 5000`, Map module-level jamais vidée → chaque test utilise des clés uniques)

**Interfaces:**
- Consumes: `rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; remaining: number }` et `getClientIp(): Promise<string>`.
- Produces: rien (feuille).

- [ ] **Step 1: Écrire les tests**

Créer `lib/rate-limit.test.ts` :

```ts
import { headers } from "next/headers";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

vi.mock("next/headers", () => ({ headers: vi.fn() }));

const headersMock = headers as unknown as Mock;

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("autorise sous la limite et décrémente remaining", () => {
    expect(rateLimit("t1", 3, 60_000)).toEqual({ ok: true, remaining: 2 });
    expect(rateLimit("t1", 3, 60_000)).toEqual({ ok: true, remaining: 1 });
    expect(rateLimit("t1", 3, 60_000)).toEqual({ ok: true, remaining: 0 });
  });

  it("bloque une fois la limite atteinte", () => {
    rateLimit("t2", 1, 60_000);
    expect(rateLimit("t2", 1, 60_000)).toEqual({ ok: false, remaining: 0 });
  });

  it("réinitialise le compteur après expiration de la fenêtre", () => {
    rateLimit("t3", 1, 60_000);
    expect(rateLimit("t3", 1, 60_000).ok).toBe(false);
    vi.advanceTimersByTime(60_001);
    expect(rateLimit("t3", 1, 60_000).ok).toBe(true);
  });

  it("évince la plus ancienne clé quand MAX_KEYS (5000) est atteint", () => {
    // "evict-target" est épuisée (limit 1). On insère ensuite 5000 clés :
    // la Map plafonne à 5000 entrées en évinçant les plus anciennes (FIFO),
    // donc "evict-target" est évincée. Un nouvel appel repart alors de zéro.
    rateLimit("evict-target", 1, 60_000);
    expect(rateLimit("evict-target", 1, 60_000).ok).toBe(false);
    for (let i = 0; i < 5000; i++) {
      rateLimit(`filler-${i}`, 1, 60_000);
    }
    expect(rateLimit("evict-target", 1, 60_000).ok).toBe(true);
  });
});

describe("getClientIp", () => {
  it("prend la première IP de x-forwarded-for", async () => {
    headersMock.mockResolvedValueOnce(
      new Headers({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" }),
    );
    expect(await getClientIp()).toBe("1.2.3.4");
  });

  it("se replie sur x-real-ip", async () => {
    headersMock.mockResolvedValueOnce(new Headers({ "x-real-ip": "9.8.7.6" }));
    expect(await getClientIp()).toBe("9.8.7.6");
  });

  it('renvoie "unknown" sans en-tête IP', async () => {
    headersMock.mockResolvedValueOnce(new Headers());
    expect(await getClientIp()).toBe("unknown");
  });
});
```

- [ ] **Step 2: Lancer le test**

Run: `npm test -- lib/rate-limit.test.ts`
Expected: PASS — 7 tests verts (le test d'éviction boucle 5000 fois, il reste < 1 s).

- [ ] **Step 3: Commit**

```bash
git add lib/rate-limit.test.ts
git commit -m "test: couverture de lib/rate-limit (fenêtres, blocage, éviction, getClientIp)"
```

---

### Task 3: Tests de lib/track

**Files:**
- Create: `lib/track.test.ts`
- Reference: `lib/track.ts` (`trackEvent(name, properties?)` — no-op sans `window` ou sans `window.op` fonction, sinon appelle `op("track", name, properties)`)

**Interfaces:**
- Consumes: `trackEvent(name: string, properties?: Record<string, unknown>): void`.
- Produces: rien (feuille).

- [ ] **Step 1: Écrire les tests**

Créer `lib/track.test.ts` :

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { trackEvent } from "@/lib/track";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("trackEvent", () => {
  it("ne fait rien sans window (environnement serveur)", () => {
    expect(() => trackEvent("evt")).not.toThrow();
  });

  it("ne fait rien si window.op n'est pas une fonction", () => {
    vi.stubGlobal("window", {});
    expect(() => trackEvent("evt")).not.toThrow();
  });

  it("appelle window.op('track', name, properties)", () => {
    const op = vi.fn();
    vi.stubGlobal("window", { op });
    trackEvent("list_created", { listId: "abc" });
    expect(op).toHaveBeenCalledWith("track", "list_created", {
      listId: "abc",
    });
  });
});
```

- [ ] **Step 2: Lancer le test**

Run: `npm test -- lib/track.test.ts`
Expected: PASS — 3 tests verts.

- [ ] **Step 3: Commit**

```bash
git add lib/track.test.ts
git commit -m "test: couverture de lib/track (garde window, appel op)"
```

---

### Task 4: Mocks partagés + tests de actions/add-item

**Files:**
- Create: `lib/__mocks__/prisma.ts`
- Create: `lib/__mocks__/rate-limit.ts`
- Create: `lib/__mocks__/auth.ts`
- Create: `actions/add-item.test.ts`
- Reference: `actions/add-item.ts` (schéma Zod : `listId` min 1, `title` min 1 / max 100, `who` max 50 optionnel ; plafond `MAX_ITEMS_PER_LIST = 500`)

**Interfaces:**
- Consumes: `addItem(formData: FormData | AddItemInput)` de `actions/add-item.ts`.
- Produces (pour les Tasks 5 à 10): convention `vi.mock("@/lib/prisma")` / `vi.mock("@/lib/rate-limit")` / `vi.mock("@/lib/auth")` **sans factory** → Vitest résout automatiquement `lib/__mocks__/<module>.ts`. Exports des mocks :
  - `lib/__mocks__/prisma.ts` → `prisma` avec `list.create/findUnique/update`, `item.count/create/deleteMany/updateMany`, `user.delete`, `userList.upsert/deleteMany`, tous `vi.fn()` sans implémentation (chaque test définit la sienne).
  - `lib/__mocks__/rate-limit.ts` → `getClientIp` (résout `"203.0.113.1"`) et `rateLimit` (retourne `{ ok: true, remaining: 10 }`). Grâce à `restoreMocks: true`, ces implémentations par défaut sont restaurées avant chaque test ; utiliser `mockReturnValueOnce({ ok: false, remaining: 0 })` pour tester la branche rate-limit.
  - `lib/__mocks__/auth.ts` → `auth.api.getSession`, `vi.fn()` sans implémentation.
  - `next/cache` et `next/headers` se mockent inline : `vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))` et `vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Headers()) }))`.

- [ ] **Step 1: Créer le mock partagé de prisma**

Créer `lib/__mocks__/prisma.ts` :

```ts
import { vi } from "vitest";

export const prisma = {
  list: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  item: {
    count: vi.fn(),
    create: vi.fn(),
    deleteMany: vi.fn(),
    updateMany: vi.fn(),
  },
  user: {
    delete: vi.fn(),
  },
  userList: {
    upsert: vi.fn(),
    deleteMany: vi.fn(),
  },
} as unknown as (typeof import("@/lib/prisma"))["prisma"];
```

- [ ] **Step 2: Créer le mock partagé de rate-limit**

Créer `lib/__mocks__/rate-limit.ts` :

```ts
import { vi } from "vitest";

export const getClientIp = vi.fn(async () => "203.0.113.1");
export const rateLimit = vi.fn(() => ({ ok: true, remaining: 10 }));
```

- [ ] **Step 3: Créer le mock partagé de auth**

Créer `lib/__mocks__/auth.ts` :

```ts
import { vi } from "vitest";

export const auth = {
  api: {
    getSession: vi.fn(),
  },
} as unknown as (typeof import("@/lib/auth"))["auth"];
```

- [ ] **Step 4: Écrire les tests de addItem**

Créer `actions/add-item.test.ts` :

```ts
import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { addItem } from "@/actions/add-item";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

vi.mock("@/lib/prisma");
vi.mock("@/lib/rate-limit");
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const rateLimitMock = rateLimit as unknown as Mock;
const findList = prisma.list.findUnique as unknown as Mock;
const countItems = prisma.item.count as unknown as Mock;
const createItem = prisma.item.create as unknown as Mock;
const revalidatePathMock = revalidatePath as unknown as Mock;

const fakeList = {
  id: "list_1",
  title: "Courses",
  createdAt: new Date("2026-01-01"),
  updateAt: new Date("2026-01-01"),
};

const fakeItem = {
  id: 1,
  listId: "list_1",
  title: "Pain",
  who: "Zoé",
  createdAt: new Date("2026-01-01"),
  updateAt: new Date("2026-01-01"),
};

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("addItem", () => {
  it("refuse quand la limite de requêtes est atteinte", async () => {
    rateLimitMock.mockReturnValueOnce({ ok: false, remaining: 0 });

    const result = await addItem({ listId: "list_1", title: "Pain" });

    expect(result).toEqual({
      success: false,
      error: { _form: ["Trop de requêtes, réessayez dans une minute."] },
    });
    expect(findList).not.toHaveBeenCalled();
  });

  it("rejette un titre vide", async () => {
    const result = await addItem({ listId: "list_1", title: "" });

    expect(result).toEqual({
      success: false,
      error: { title: ["Le nom de l'article est requis"] },
    });
  });

  it("rejette un titre de plus de 100 caractères", async () => {
    const result = await addItem({
      listId: "list_1",
      title: "a".repeat(101),
    });

    expect(result).toEqual({
      success: false,
      error: { title: ["Le nom de l'article est trop long"] },
    });
  });

  it("rejette un prénom de plus de 50 caractères", async () => {
    const result = await addItem({
      listId: "list_1",
      title: "Pain",
      who: "a".repeat(51),
    });

    expect(result).toEqual({
      success: false,
      error: { who: ["Prénom trop long"] },
    });
  });

  it("échoue si la liste n'existe pas", async () => {
    findList.mockResolvedValueOnce(null);

    const result = await addItem({ listId: "absente", title: "Pain" });

    expect(result).toEqual({
      success: false,
      error: { listId: ["List not found"] },
    });
    expect(createItem).not.toHaveBeenCalled();
  });

  it("refuse d'ajouter au-delà de 500 articles", async () => {
    findList.mockResolvedValueOnce(fakeList);
    countItems.mockResolvedValueOnce(500);

    const result = await addItem({ listId: "list_1", title: "Pain" });

    expect(result).toEqual({
      success: false,
      error: {
        _form: ["Cette liste a atteint la limite de 500 articles."],
      },
    });
    expect(createItem).not.toHaveBeenCalled();
  });

  it("crée l'article et revalide la page de la liste", async () => {
    findList.mockResolvedValueOnce(fakeList);
    countItems.mockResolvedValueOnce(0);
    createItem.mockResolvedValueOnce(fakeItem);

    const result = await addItem({
      listId: "list_1",
      title: "Pain",
      who: "Zoé",
    });

    expect(result).toEqual({ success: true, data: fakeItem });
    expect(createItem).toHaveBeenCalledWith({
      data: { listId: "list_1", title: "Pain", who: "Zoé" },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/list_1");
  });

  it("accepte un FormData (who absent → undefined)", async () => {
    findList.mockResolvedValueOnce(fakeList);
    countItems.mockResolvedValueOnce(0);
    createItem.mockResolvedValueOnce({ ...fakeItem, who: null });

    const formData = new FormData();
    formData.append("listId", "list_1");
    formData.append("title", "Pain");

    const result = await addItem(formData);

    expect(result).toEqual({
      success: true,
      data: { ...fakeItem, who: null },
    });
    expect(createItem).toHaveBeenCalledWith({
      data: { listId: "list_1", title: "Pain", who: undefined },
    });
  });

  it("renvoie une erreur générique si Prisma échoue", async () => {
    findList.mockRejectedValueOnce(new Error("db down"));

    const result = await addItem({ listId: "list_1", title: "Pain" });

    expect(result).toEqual({
      success: false,
      error: { _form: ["Failed to add item. Please try again."] },
    });
  });
});
```

- [ ] **Step 5: Lancer le test**

Run: `npm test -- actions/add-item.test.ts`
Expected: PASS — 9 tests verts.

- [ ] **Step 6: Vérifier le typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0 (les casts `as unknown as Mock` et les mocks `__mocks__` typent proprement).

- [ ] **Step 7: Commit**

```bash
git add lib/__mocks__ actions/add-item.test.ts
git commit -m "test: mocks partagés (prisma, rate-limit, auth) + couverture de addItem"
```

---

### Task 5: Tests de actions/create-list

**Files:**
- Create: `actions/create-list.test.ts`
- Reference: `actions/create-list.ts` (`redirectList()` — retry en boucle sur `Prisma.PrismaClientKnownRequestError` code `P2002` avec `meta.target` contenant `"id"` ; ID = 12 octets aléatoires en base64url, soit 16 caractères)

**Interfaces:**
- Consumes: `redirectList(): Promise<{ success: boolean; listId?: string; error?: string }>` ; mocks partagés de la Task 4 ; classe `Prisma.PrismaClientKnownRequestError` importée de `@/lib/generated/prisma` (le même module que celui utilisé par l'action — l'`instanceof` fonctionne).
- Produces: rien (feuille).

- [ ] **Step 1: Écrire les tests**

Créer `actions/create-list.test.ts` :

```ts
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { redirectList } from "@/actions/create-list";
import { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

vi.mock("@/lib/prisma");
vi.mock("@/lib/rate-limit");

const rateLimitMock = rateLimit as unknown as Mock;
const createList = prisma.list.create as unknown as Mock;

const fakeList = {
  id: "abc123abc123abc1",
  title: "Titre de la liste",
  createdAt: new Date("2026-01-01"),
  updateAt: new Date("2026-01-01"),
};

function collisionError() {
  return new Prisma.PrismaClientKnownRequestError(
    "Unique constraint failed on the fields: (`id`)",
    { code: "P2002", clientVersion: "7.8.0", meta: { target: ["id"] } },
  );
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("redirectList", () => {
  it("refuse quand la limite de requêtes est atteinte", async () => {
    rateLimitMock.mockReturnValueOnce({ ok: false, remaining: 0 });

    const result = await redirectList();

    expect(result).toEqual({
      success: false,
      error: "Trop de requêtes, réessayez dans une minute.",
    });
    expect(createList).not.toHaveBeenCalled();
  });

  it("crée une liste avec un ID base64url de 16 caractères et le titre par défaut", async () => {
    createList.mockResolvedValueOnce(fakeList);

    const result = await redirectList();

    expect(result).toEqual({ success: true, listId: "abc123abc123abc1" });
    expect(createList).toHaveBeenCalledTimes(1);
    const args = createList.mock.calls[0][0];
    expect(args.data.title).toBe("Titre de la liste");
    expect(args.data.id).toMatch(/^[A-Za-z0-9_-]{16}$/);
  });

  it("réessaie avec un nouvel ID en cas de collision P2002", async () => {
    createList
      .mockRejectedValueOnce(collisionError())
      .mockResolvedValueOnce(fakeList);

    const result = await redirectList();

    expect(result).toEqual({ success: true, listId: "abc123abc123abc1" });
    expect(createList).toHaveBeenCalledTimes(2);
    const [first, second] = createList.mock.calls;
    expect(first[0].data.id).not.toBe(second[0].data.id);
  });

  it("renvoie une erreur générique si la création échoue pour une autre raison", async () => {
    createList.mockRejectedValueOnce(new Error("db down"));

    const result = await redirectList();

    expect(result).toEqual({
      success: false,
      error: "Impossible de créer la liste. Réessayez.",
    });
  });
});
```

- [ ] **Step 2: Lancer le test**

Run: `npm test -- actions/create-list.test.ts`
Expected: PASS — 4 tests verts.

- [ ] **Step 3: Commit**

```bash
git add actions/create-list.test.ts
git commit -m "test: couverture de redirectList (succès, retry P2002, erreurs)"
```

---

### Task 6: Tests de actions/delete-item et actions/update-item

**Files:**
- Create: `actions/delete-item.test.ts`
- Create: `actions/update-item.test.ts`
- Reference: `actions/delete-item.ts` et `actions/update-item.ts` (tous deux utilisent `deleteMany`/`updateMany` filtrés par `{ id, listId }` et renvoient `{ id: ["Item not found"] }` quand `count === 0` ; id Zod : `z.number().int().positive("Item ID is required")`)

**Interfaces:**
- Consumes: `deleteItem(formData: FormData | DeleteItemInput)`, `updateItem(formData: FormData | UpdateItemInput)` ; mocks partagés de la Task 4.
- Produces: rien (feuilles).

- [ ] **Step 1: Écrire les tests de deleteItem**

Créer `actions/delete-item.test.ts` :

```ts
import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { deleteItem } from "@/actions/delete-item";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

vi.mock("@/lib/prisma");
vi.mock("@/lib/rate-limit");
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const rateLimitMock = rateLimit as unknown as Mock;
const deleteMany = prisma.item.deleteMany as unknown as Mock;
const revalidatePathMock = revalidatePath as unknown as Mock;

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("deleteItem", () => {
  it("refuse quand la limite de requêtes est atteinte", async () => {
    rateLimitMock.mockReturnValueOnce({ ok: false, remaining: 0 });

    const result = await deleteItem({ id: 5, listId: "list_1" });

    expect(result).toEqual({
      success: false,
      error: { _form: ["Trop de requêtes, réessayez dans une minute."] },
    });
    expect(deleteMany).not.toHaveBeenCalled();
  });

  it("rejette un id non positif", async () => {
    const result = await deleteItem({ id: 0, listId: "list_1" });

    expect(result).toEqual({
      success: false,
      error: { id: ["Item ID is required"] },
    });
  });

  it("parse un FormData et supprime l'item ciblé", async () => {
    deleteMany.mockResolvedValueOnce({ count: 1 });

    const formData = new FormData();
    formData.append("id", "5");
    formData.append("listId", "list_1");

    const result = await deleteItem(formData);

    expect(result).toEqual({ success: true });
    expect(deleteMany).toHaveBeenCalledWith({
      where: { id: 5, listId: "list_1" },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/list_1");
  });

  it("échoue si aucun item ne correspond (count 0)", async () => {
    deleteMany.mockResolvedValueOnce({ count: 0 });

    const result = await deleteItem({ id: 99, listId: "list_1" });

    expect(result).toEqual({
      success: false,
      error: { id: ["Item not found"] },
    });
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("renvoie une erreur générique si Prisma échoue", async () => {
    deleteMany.mockRejectedValueOnce(new Error("db down"));

    const result = await deleteItem({ id: 5, listId: "list_1" });

    expect(result).toEqual({
      success: false,
      error: { _form: ["Failed to delete item. Please try again."] },
    });
  });
});
```

- [ ] **Step 2: Lancer le test**

Run: `npm test -- actions/delete-item.test.ts`
Expected: PASS — 5 tests verts.

- [ ] **Step 3: Commit**

```bash
git add actions/delete-item.test.ts
git commit -m "test: couverture de deleteItem"
```

- [ ] **Step 4: Écrire les tests de updateItem**

Créer `actions/update-item.test.ts` :

```ts
import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { updateItem } from "@/actions/update-item";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

vi.mock("@/lib/prisma");
vi.mock("@/lib/rate-limit");
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const rateLimitMock = rateLimit as unknown as Mock;
const updateMany = prisma.item.updateMany as unknown as Mock;
const revalidatePathMock = revalidatePath as unknown as Mock;

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("updateItem", () => {
  it("refuse quand la limite de requêtes est atteinte", async () => {
    rateLimitMock.mockReturnValueOnce({ ok: false, remaining: 0 });

    const result = await updateItem({
      id: 5,
      listId: "list_1",
      title: "Fromage",
    });

    expect(result).toEqual({
      success: false,
      error: { _form: ["Trop de requêtes, réessayez dans une minute."] },
    });
    expect(updateMany).not.toHaveBeenCalled();
  });

  it("rejette un titre vide", async () => {
    const result = await updateItem({ id: 5, listId: "list_1", title: "" });

    expect(result).toEqual({
      success: false,
      error: { title: ["Item name is required"] },
    });
  });

  it("échoue si aucun item ne correspond (count 0)", async () => {
    updateMany.mockResolvedValueOnce({ count: 0 });

    const result = await updateItem({
      id: 99,
      listId: "list_1",
      title: "Fromage",
    });

    expect(result).toEqual({
      success: false,
      error: { id: ["Item not found"] },
    });
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("met à jour l'item et revalide la page de la liste", async () => {
    updateMany.mockResolvedValueOnce({ count: 1 });

    const result = await updateItem({
      id: 5,
      listId: "list_1",
      title: "Fromage",
      who: "Ana",
    });

    expect(result).toEqual({ success: true });
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: 5, listId: "list_1" },
      data: { title: "Fromage", who: "Ana" },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/list_1");
  });

  it("renvoie une erreur générique si Prisma échoue", async () => {
    updateMany.mockRejectedValueOnce(new Error("db down"));

    const result = await updateItem({
      id: 5,
      listId: "list_1",
      title: "Fromage",
    });

    expect(result).toEqual({
      success: false,
      error: { _form: ["Failed to update item. Please try again."] },
    });
  });
});
```

- [ ] **Step 5: Lancer le test**

Run: `npm test -- actions/update-item.test.ts`
Expected: PASS — 5 tests verts.

- [ ] **Step 6: Commit**

```bash
git add actions/update-item.test.ts
git commit -m "test: couverture de updateItem"
```

---

### Task 7: Tests de actions/update-list-title

**Files:**
- Create: `actions/update-list-title.test.ts`
- Reference: `actions/update-list-title.ts` (vérifie l'existence via `list.findUnique` puis `list.update` ; renvoie `{ success: true, data: list }`)

**Interfaces:**
- Consumes: `updateListTitle(formData: FormData | UpdateListTitleInput)` ; mocks partagés de la Task 4.
- Produces: rien (feuille).

- [ ] **Step 1: Écrire les tests**

Créer `actions/update-list-title.test.ts` :

```ts
import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { updateListTitle } from "@/actions/update-list-title";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

vi.mock("@/lib/prisma");
vi.mock("@/lib/rate-limit");
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const rateLimitMock = rateLimit as unknown as Mock;
const findList = prisma.list.findUnique as unknown as Mock;
const updateList = prisma.list.update as unknown as Mock;
const revalidatePathMock = revalidatePath as unknown as Mock;

const fakeList = {
  id: "list_1",
  title: "Courses",
  createdAt: new Date("2026-01-01"),
  updateAt: new Date("2026-01-01"),
};

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("updateListTitle", () => {
  it("refuse quand la limite de requêtes est atteinte", async () => {
    rateLimitMock.mockReturnValueOnce({ ok: false, remaining: 0 });

    const result = await updateListTitle({ id: "list_1", title: "Fête" });

    expect(result).toEqual({
      success: false,
      error: { _form: ["Trop de requêtes, réessayez dans une minute."] },
    });
    expect(findList).not.toHaveBeenCalled();
  });

  it("rejette un titre vide", async () => {
    const result = await updateListTitle({ id: "list_1", title: "" });

    expect(result).toEqual({
      success: false,
      error: { title: ["Le titre est requis"] },
    });
  });

  it("rejette un titre de plus de 100 caractères", async () => {
    const result = await updateListTitle({
      id: "list_1",
      title: "a".repeat(101),
    });

    expect(result).toEqual({
      success: false,
      error: { title: ["Titre est trop long"] },
    });
  });

  it("échoue si la liste n'existe pas", async () => {
    findList.mockResolvedValueOnce(null);

    const result = await updateListTitle({ id: "absente", title: "Fête" });

    expect(result).toEqual({
      success: false,
      error: { id: ["List not found"] },
    });
    expect(updateList).not.toHaveBeenCalled();
  });

  it("met à jour le titre et revalide la page de la liste", async () => {
    findList.mockResolvedValueOnce(fakeList);
    updateList.mockResolvedValueOnce({ ...fakeList, title: "Pique-nique" });

    const result = await updateListTitle({
      id: "list_1",
      title: "Pique-nique",
    });

    expect(result).toEqual({
      success: true,
      data: { ...fakeList, title: "Pique-nique" },
    });
    expect(updateList).toHaveBeenCalledWith({
      where: { id: "list_1" },
      data: { title: "Pique-nique" },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/list_1");
  });

  it("renvoie une erreur générique si Prisma échoue", async () => {
    findList.mockRejectedValueOnce(new Error("db down"));

    const result = await updateListTitle({ id: "list_1", title: "Fête" });

    expect(result).toEqual({
      success: false,
      error: { _form: ["Failed to update list title. Please try again."] },
    });
  });
});
```

- [ ] **Step 2: Lancer le test**

Run: `npm test -- actions/update-list-title.test.ts`
Expected: PASS — 6 tests verts.

- [ ] **Step 3: Commit**

```bash
git add actions/update-list-title.test.ts
git commit -m "test: couverture de updateListTitle"
```

---

### Task 8: Tests de actions/delete-account

**Files:**
- Create: `actions/delete-account.test.ts`
- Reference: `actions/delete-account.ts` (session via `auth.api.getSession({ headers })` ; supprime `prisma.user.delete({ where: { id: session.user.id } })` — la cascade DB fait le reste)

**Interfaces:**
- Consumes: `deleteAccount(): Promise<{ success: boolean; error?: string }>` ; mocks partagés de la Task 4 (`@/lib/auth` inclus) ; mock inline de `next/headers`.
- Produces: rien (feuille).

- [ ] **Step 1: Écrire les tests**

Créer `actions/delete-account.test.ts` :

```ts
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { deleteAccount } from "@/actions/delete-account";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

vi.mock("@/lib/auth");
vi.mock("@/lib/prisma");
vi.mock("@/lib/rate-limit");
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

const rateLimitMock = rateLimit as unknown as Mock;
const getSession = auth.api.getSession as unknown as Mock;
const deleteUser = prisma.user.delete as unknown as Mock;

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("deleteAccount", () => {
  it("refuse quand la limite de requêtes est atteinte", async () => {
    rateLimitMock.mockReturnValueOnce({ ok: false, remaining: 0 });

    const result = await deleteAccount();

    expect(result).toEqual({
      success: false,
      error: "Trop de requêtes, réessayez dans une minute.",
    });
    expect(getSession).not.toHaveBeenCalled();
  });

  it("refuse sans session", async () => {
    getSession.mockResolvedValueOnce(null);

    const result = await deleteAccount();

    expect(result).toEqual({
      success: false,
      error: "Vous n'êtes pas connecté.",
    });
    expect(deleteUser).not.toHaveBeenCalled();
  });

  it("supprime l'utilisateur de la session", async () => {
    getSession.mockResolvedValueOnce({ user: { id: "user_1" } });
    deleteUser.mockResolvedValueOnce({ id: "user_1" });

    const result = await deleteAccount();

    expect(result).toEqual({ success: true });
    expect(deleteUser).toHaveBeenCalledWith({ where: { id: "user_1" } });
  });

  it("renvoie une erreur générique si la suppression échoue", async () => {
    getSession.mockResolvedValueOnce({ user: { id: "user_1" } });
    deleteUser.mockRejectedValueOnce(new Error("db down"));

    const result = await deleteAccount();

    expect(result).toEqual({
      success: false,
      error: "Impossible de supprimer le compte. Réessayez.",
    });
  });
});
```

- [ ] **Step 2: Lancer le test**

Run: `npm test -- actions/delete-account.test.ts`
Expected: PASS — 4 tests verts.

- [ ] **Step 3: Commit**

```bash
git add actions/delete-account.test.ts
git commit -m "test: couverture de deleteAccount"
```

---

### Task 9: Tests de actions/track-visit

**Files:**
- Create: `actions/track-visit.test.ts`
- Reference: `actions/track-visit.ts` (`listId` vide → `{ success: false }` avant tout rate-limit ; sans session → `{ success: true, tracked: false }` ; sinon `userList.upsert` sur la clé composite `userId_listId`)

**Interfaces:**
- Consumes: `trackVisit(listId: string)` ; mocks partagés de la Task 4 ; mock inline de `next/headers`.
- Produces: rien (feuille).

- [ ] **Step 1: Écrire les tests**

Créer `actions/track-visit.test.ts` :

```ts
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { trackVisit } from "@/actions/track-visit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

vi.mock("@/lib/auth");
vi.mock("@/lib/prisma");
vi.mock("@/lib/rate-limit");
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

const rateLimitMock = rateLimit as unknown as Mock;
const getSession = auth.api.getSession as unknown as Mock;
const findList = prisma.list.findUnique as unknown as Mock;
const upsertUserList = prisma.userList.upsert as unknown as Mock;

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("trackVisit", () => {
  it("échoue silencieusement sans listId, avant même le rate-limit", async () => {
    const result = await trackVisit("");

    expect(result).toEqual({ success: false });
    expect(rateLimitMock).not.toHaveBeenCalled();
  });

  it("échoue silencieusement quand la limite de requêtes est atteinte", async () => {
    rateLimitMock.mockReturnValueOnce({ ok: false, remaining: 0 });

    const result = await trackVisit("list_1");

    expect(result).toEqual({ success: false });
    expect(getSession).not.toHaveBeenCalled();
  });

  it("ne trace rien sans session, sans échouer", async () => {
    getSession.mockResolvedValueOnce(null);

    const result = await trackVisit("list_1");

    expect(result).toEqual({ success: true, tracked: false });
    expect(findList).not.toHaveBeenCalled();
  });

  it("échoue si la liste n'existe pas", async () => {
    getSession.mockResolvedValueOnce({ user: { id: "user_1" } });
    findList.mockResolvedValueOnce(null);

    const result = await trackVisit("absente");

    expect(result).toEqual({ success: false });
    expect(upsertUserList).not.toHaveBeenCalled();
  });

  it("rattache la liste à l'utilisateur connecté (upsert idempotent)", async () => {
    getSession.mockResolvedValueOnce({ user: { id: "user_1" } });
    findList.mockResolvedValueOnce({ id: "list_1" });
    upsertUserList.mockResolvedValueOnce({});

    const result = await trackVisit("list_1");

    expect(result).toEqual({ success: true, tracked: true });
    expect(upsertUserList).toHaveBeenCalledWith({
      where: { userId_listId: { userId: "user_1", listId: "list_1" } },
      create: { userId: "user_1", listId: "list_1" },
      update: {},
    });
  });

  it("échoue silencieusement si Prisma échoue", async () => {
    getSession.mockResolvedValueOnce({ user: { id: "user_1" } });
    findList.mockRejectedValueOnce(new Error("db down"));

    const result = await trackVisit("list_1");

    expect(result).toEqual({ success: false });
  });
});
```

- [ ] **Step 2: Lancer le test**

Run: `npm test -- actions/track-visit.test.ts`
Expected: PASS — 6 tests verts.

- [ ] **Step 3: Commit**

```bash
git add actions/track-visit.test.ts
git commit -m "test: couverture de trackVisit"
```

---

### Task 10: Tests de actions/remove-from-my-lists

**Files:**
- Create: `actions/remove-from-my-lists.test.ts`
- Reference: `actions/remove-from-my-lists.ts` (supprime le lien `userList` puis `revalidatePath("/mes-listes")`)

**Interfaces:**
- Consumes: `removeFromMyLists(listId: string)` ; mocks partagés de la Task 4 ; mocks inline de `next/headers` et `next/cache`.
- Produces: rien (feuille).

- [ ] **Step 1: Écrire les tests**

Créer `actions/remove-from-my-lists.test.ts` :

```ts
import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { removeFromMyLists } from "@/actions/remove-from-my-lists";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

vi.mock("@/lib/auth");
vi.mock("@/lib/prisma");
vi.mock("@/lib/rate-limit");
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

const rateLimitMock = rateLimit as unknown as Mock;
const getSession = auth.api.getSession as unknown as Mock;
const deleteUserLists = prisma.userList.deleteMany as unknown as Mock;
const revalidatePathMock = revalidatePath as unknown as Mock;

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("removeFromMyLists", () => {
  it("refuse quand la limite de requêtes est atteinte", async () => {
    rateLimitMock.mockReturnValueOnce({ ok: false, remaining: 0 });

    const result = await removeFromMyLists("list_1");

    expect(result).toEqual({
      success: false,
      error: "Trop de requêtes, réessayez dans une minute.",
    });
    expect(getSession).not.toHaveBeenCalled();
  });

  it("refuse sans session", async () => {
    getSession.mockResolvedValueOnce(null);

    const result = await removeFromMyLists("list_1");

    expect(result).toEqual({
      success: false,
      error: "Vous n'êtes pas connecté.",
    });
    expect(deleteUserLists).not.toHaveBeenCalled();
  });

  it("retire le lien et revalide /mes-listes", async () => {
    getSession.mockResolvedValueOnce({ user: { id: "user_1" } });
    deleteUserLists.mockResolvedValueOnce({ count: 1 });

    const result = await removeFromMyLists("list_1");

    expect(result).toEqual({ success: true });
    expect(deleteUserLists).toHaveBeenCalledWith({
      where: { userId: "user_1", listId: "list_1" },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/mes-listes");
  });

  it("renvoie une erreur générique si Prisma échoue", async () => {
    getSession.mockResolvedValueOnce({ user: { id: "user_1" } });
    deleteUserLists.mockRejectedValueOnce(new Error("db down"));

    const result = await removeFromMyLists("list_1");

    expect(result).toEqual({
      success: false,
      error: "Impossible de retirer la liste. Réessayez.",
    });
  });
});
```

- [ ] **Step 2: Lancer le test**

Run: `npm test -- actions/remove-from-my-lists.test.ts`
Expected: PASS — 4 tests verts.

- [ ] **Step 3: Commit**

```bash
git add actions/remove-from-my-lists.test.ts
git commit -m "test: couverture de removeFromMyLists"
```

---

### Task 11: CLAUDE.md — commandes de test + section Tests & TDD

**Files:**
- Modify: `CLAUDE.md` (section `## Commands`, lignes 5-11)

**Interfaces:**
- Consumes: conventions établies dans les Tasks 1 et 4 (scripts npm, `lib/__mocks__/`, `restoreMocks`).
- Produces: la convention TDD que tout travail futur dans ce repo devra suivre.

- [ ] **Step 1: Ajouter la commande de test dans Commands**

Dans `CLAUDE.md`, remplacer :

```markdown
- Lint: `npm run lint`
- `coolify-build` is an alias of `build` kept for legacy Coolify deploys.

There is no test suite configured in this repository.
```

par :

```markdown
- Lint: `npm run lint`
- Tests: `npm test` (Vitest, single run) / `npm run test:watch` (watch mode)
- `coolify-build` is an alias of `build` kept for legacy Coolify deploys.
```

- [ ] **Step 2: Ajouter la section Tests & TDD**

Toujours dans `CLAUDE.md`, insérer immédiatement après la section `## Commands` (avant `## Deployment`) :

```markdown
## Tests & TDD
- **TDD is mandatory for all business logic** (server actions, `lib/` helpers, API routes): write a failing test first, watch it fail, write the minimal code to make it pass, then refactor (red → green → refactor).
- Exempt from TDD: JSX/styling, French copy, static pages, configuration.
- Runner: Vitest, `environment: "node"` (see [vitest.config.ts](vitest.config.ts)). Tests are colocated with the code they test (`actions/add-item.test.ts` next to `actions/add-item.ts`).
- Never hit a real database in tests. Mock at module boundaries with `vi.mock`: `@/lib/prisma`, `@/lib/rate-limit` and `@/lib/auth` have shared mocks in [lib/__mocks__/](lib/__mocks__/); `next/cache` and `next/headers` are mocked inline per test file.
- `restoreMocks: true` is set globally: default mock implementations are restored before each test — use `mockReturnValueOnce`/`mockResolvedValueOnce` for per-test behavior. Cast mocks with `as unknown as Mock` (Prisma generics break `vi.mocked` inference).
- Test files are typechecked by `next build` — they must pass `npx tsc --noEmit`.
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: commandes de test et convention TDD dans CLAUDE.md"
```

---

### Task 12: Vérification finale

**Files:**
- Aucun nouveau fichier — vérification globale.

**Interfaces:**
- Consumes: tout ce qui précède.
- Produces: preuve que la suite complète passe.

- [ ] **Step 1: Lancer toute la suite**

Run: `npm test`
Expected: PASS — 11 fichiers de test, 55 tests, 0 échec.

- [ ] **Step 2: Typecheck complet**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: exit 0, aucune erreur sur les nouveaux fichiers.

- [ ] **Step 4: Vérifier qu'il ne reste rien à committer**

Run: `git status --porcelain`
Expected: sortie vide (tout a été commité au fil des tâches). Si un fichier traîne, le committer avec un message approprié.
