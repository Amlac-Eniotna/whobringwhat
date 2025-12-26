"use client";
import { redirectList } from "@/actions/create-list";
import { Loader2, NotebookPen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

export function StartButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleCreateList() {
    try {
      setIsLoading(true);
      const result = await redirectList();
      if (result.success && result.listId) {
        router.push(`/${result.listId}`);
      } else {
        alert("Erreur: " + (result.error || "Une erreur inconnue est survenue"));
        setIsLoading(false);
      }
    } catch (error) {
      alert("Erreur critique: " + error);
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleCreateList}
      disabled={isLoading}
      className={isLoading ? "cursor-default" : "cursor-pointer"}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <NotebookPen className="mr-2" />
      )}
      {isLoading ? "Création en cours..." : "Créer une liste"}
    </Button>
  );
}
