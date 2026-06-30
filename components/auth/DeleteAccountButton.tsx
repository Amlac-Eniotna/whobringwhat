"use client";

import { deleteAccount } from "@/actions/delete-account";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteAccountButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    const res = await deleteAccount();
    if (!res.success) {
      toast({
        title: "Erreur",
        description: res.error || "Réessayez.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    // La session est déjà supprimée côté serveur ; on nettoie le cookie au mieux.
    await authClient.signOut().catch(() => {});
    router.push("/");
    router.refresh();
  }

  if (!confirming) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="text-destructive hover:bg-destructive/10 cursor-pointer"
        onClick={() => setConfirming(true)}
      >
        Supprimer mon compte
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Cette action est définitive. Confirmer ?
      </span>
      <Button
        variant="outline"
        size="sm"
        className="text-destructive hover:bg-destructive/10 cursor-pointer"
        onClick={handleDelete}
        disabled={isLoading}
      >
        {isLoading ? "Suppression…" : "Oui, supprimer"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={() => setConfirming(false)}
        disabled={isLoading}
      >
        Annuler
      </Button>
    </div>
  );
}
