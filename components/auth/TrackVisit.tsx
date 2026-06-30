"use client";

import { trackVisit } from "@/actions/track-visit";
import { PENDING_LIST_KEY } from "@/lib/pending-list";
import { useEffect } from "react";

export function TrackVisit({ listId }: { listId: string }) {
  useEffect(() => {
    trackVisit(listId).then((res) => {
      if (!res?.success) return;
      try {
        if (res.tracked) {
          // Déjà connecté : la liste vient d'être liée au compte, plus rien
          // n'est en attente.
          localStorage.removeItem(PENDING_LIST_KEY);
        } else {
          // Visiteur non connecté : on retient cette liste pour l'ajouter à
          // « Mes listes » dès qu'il se connectera (cf. ClaimPendingList).
          localStorage.setItem(PENDING_LIST_KEY, listId);
        }
      } catch {
        // localStorage indisponible (mode privé strict) : on ignore.
      }
    });
  }, [listId]);

  return null;
}
