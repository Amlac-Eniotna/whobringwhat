import { createRouteHandler } from "@openpanel/nextjs/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Proxy first-party pour OpenPanel : le navigateur parle à /api/op (même
// origine que l'app), ce qui évite le blocage par Brave Shields et autres
// bloqueurs de traceurs. Le serveur relaie ensuite le script et les events
// vers l'instance self-hosted (ANALYTICS_API_URL).
export const { GET, POST } = createRouteHandler({
  apiUrl: process.env.ANALYTICS_API_URL,
});
