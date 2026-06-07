"use client";
import { addItem } from "@/actions/add-item";
import { CharCounter } from "@/components/ui/char-counter";
import { trackEvent } from "@/lib/track";
import { Check, Loader2, Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

// Define proper types for the error structure
type FieldErrors = {
  title?: string[];
  who?: string[];
  listId?: string[];
  _form?: string[];
};

export function CreateListItem() {
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [title, setTitle] = useState("");
  const [who, setWho] = useState("");

  const params = useParams();
  const listId = params.id as string;

  const handleAddItem = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await addItem({
        listId,
        title,
        who: who || undefined,
      });

      if (!result.success) {
        setErrors(result.error as FieldErrors);
        setIsSubmitting(false);
        return;
      }

      trackEvent("item_added", { listId, has_who: Boolean(who) });

      // Reset form and close
      setTitle("");
      setWho("");
      setIsCreating(false);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error adding item:", error);
      setErrors({ _form: ["An unexpected error occurred"] });
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setWho("");
    setErrors({});
    setIsCreating(false);
  };

  if (!isCreating) {
    return (
      <Button
        variant="outline"
        className="w-full cursor-pointer backdrop-blur-xs"
        onClick={() => setIsCreating(true)}
      >
        <Plus />
      </Button>
    );
  }

  return (
    <div className="flex w-full gap-2">
      <div className="flex w-full gap-2">
        <div className="flex w-full flex-col">
          <input
            type="text"
            placeholder="Nom de l'article"
            className="text-foreground focus:border-primary focus:ring-primary h-9 w-full rounded-md border bg-transparent p-2 backdrop-blur-xs outline-none focus:ring-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
          <div className="flex w-full items-center justify-between">
            {errors.title && (
              <p className="text-destructive mt-1 text-xs whitespace-nowrap">
                {errors.title[0]}
              </p>
            )}
            <CharCounter value={title} max={100} />
          </div>
        </div>
        <div className="flex w-full max-w-24 flex-col">
          <input
            type="text"
            placeholder="Prénom (facultatif)"
            className="text-foreground focus:border-primary focus:ring-primary h-9 w-full rounded-md border bg-transparent p-2 backdrop-blur-xs outline-none focus:ring-1"
            value={who}
            onChange={(e) => setWho(e.target.value)}
            disabled={isSubmitting}
          />
          <div className="flex w-full items-center justify-between">
            {errors.who && (
              <p className="text-destructive mt-1 text-xs whitespace-nowrap">
                {errors.who[0]}
              </p>
            )}
            <CharCounter value={who} max={50} />
          </div>
        </div>
      </div>

      {errors._form && (
        <p className="text-destructive text-xs">{errors._form[0]}</p>
      )}

      <div className="flex justify-end gap-2">
        <Button
          onClick={handleAddItem}
          disabled={isSubmitting}
          className="border border-white"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </Button>
        <Button
          className="backdrop-blur-xs"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
