"use client";

import { trackVisit } from "@/actions/track-visit";
import { useEffect } from "react";

export function TrackVisit({ listId }: { listId: string }) {
  useEffect(() => {
    trackVisit(listId);
  }, [listId]);

  return null;
}
