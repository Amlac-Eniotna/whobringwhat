"use client";

import { removeFromMyLists } from "@/actions/remove-from-my-lists";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Trash2 } from "lucide-react";
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
    <Button
      variant="outline"
      className="text-destructive hover:bg-destructive/10 cursor-pointer backdrop-blur-xs"
      onClick={handleRemove}
      disabled={isLoading}
      aria-label="Retirer de mes listes"
      title="Retirer de mes listes"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
