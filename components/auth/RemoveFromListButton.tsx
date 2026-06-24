"use client";

import { removeFromMyLists } from "@/actions/remove-from-my-lists";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RemoveFromListButton({ listId }: { listId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function handleRemove() {
    setIsLoading(true);
    const res = await removeFromMyLists(listId);
    if (!res.success) {
      toast({
        title: "Erreur",
        description: res.error || "Réessayez.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleRemove} disabled={isLoading}>
      Retirer
    </Button>
  );
}
