"use client";

import { trackVisit } from "@/actions/track-visit";
import { PENDING_LIST_KEY } from "@/lib/pending-list";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Monté sur /mes-listes (page garantie connectée). Si le visiteur consultait
 * une liste avant de se connecter, on la rattache à son compte puis on
 * rafraîchit pour qu'elle apparaisse dans la liste.
 */
export function ClaimPendingList() {
  const router = useRouter();

  useEffect(() => {
    let pending: string | null = null;
    try {
      pending = localStorage.getItem(PENDING_LIST_KEY);
      localStorage.removeItem(PENDING_LIST_KEY);
    } catch {
      // localStorage indisponible : rien à réclamer.
    }
    if (!pending) return;

    trackVisit(pending).then((res) => {
      if (res?.tracked) router.refresh();
    });
  }, [router]);

  return null;
}
