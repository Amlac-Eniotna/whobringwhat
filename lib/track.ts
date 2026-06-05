// Helper d'analytics OpenPanel côté client.
//
// On appelle window.op("track", ...) DIRECTEMENT plutôt que via
// useOpenPanel().track : ce dernier fait `window.op?.(...)`, que le build de prod
// minifie en `window.op.call(...)`. Or window.op est un Proxy qui ne fournit pas
// de propriété "call", d'où le crash "t.call is not a function". L'appel direct
// passe par le trap apply du Proxy (et par la file d'attente avant le chargement
// d'op1.js), ce qui rend le tracking fiable.
//
// Ne jamais envoyer de PII (prénoms, contenu des articles) : uniquement le listId
// et des booléens / énums.
export function trackEvent(
  name: string,
  properties?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;
  const op = (window as unknown as { op?: (...args: unknown[]) => void }).op;
  if (typeof op === "function") op("track", name, properties);
}
