"use client";
import { updateListTitle } from "@/actions/update-list-title";
import { useToast } from "@/components/ui/use-toast";
import { Check, Loader2, Pen, Share2, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

// Define proper types for the error structure
type FieldErrors = {
  title?: string[];
  _form?: string[];
};

export interface ListTitleProps {
  title: string;
}

export function ListTitle({ title }: ListTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [titleText, setTitleText] = useState(title);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [canShare, setCanShare] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const params = useParams();
  const listId = params.id as string;
  const { toast } = useToast();

  // Check if sharing is available when component mounts
  useEffect(() => {
    // Check if navigator.share exists AND is a function
    // Using try-catch to handle cases where some browsers might throw on property access
    try {
      // Détection d'une capacité navigateur au montage (impossible au rendu SSR).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanShare(
        typeof navigator !== "undefined" &&
          "share" in navigator &&
          typeof navigator.share === "function",
      );
    } catch (e) {
      console.warn("Error detecting share capability:", e);
      setCanShare(false);
    }
  }, []);

  // Auto-focus input when editing mode is activated
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Optionally, select all text for easier editing
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await updateListTitle({
        id: listId,
        title: titleText,
      });

      if (!result.success) {
        setErrors(result.error as FieldErrors);
        setIsSubmitting(false);
        return;
      }

      setIsEditing(false);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error updating list title:", error);
      setErrors({ _form: ["An unexpected error occurred"] });
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset to original value
    setTitleText(title);
    setErrors({});
    setIsEditing(false);
  };

  const handleBlur = () => {
    // Validate on blur (clicking outside the input)
    // Use a small timeout to allow button clicks to execute first
    setTimeout(() => {
      if (isEditing && !isSubmitting) {
        handleUpdate();
      }
    }, 150);
  };

  const copyToClipboardFallback = (text: string) => {
    // Create a temporary input element
    const tempInput = document.createElement("input");
    tempInput.value = text;
    tempInput.setAttribute("readonly", "");
    tempInput.style.position = "absolute";
    tempInput.style.left = "-9999px";
    tempInput.style.opacity = "0";
    tempInput.style.userSelect = "text"; // Ensure text can be selected
    document.body.appendChild(tempInput);

    let copySuccess = false;

    // Special handling for iOS
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);

    if (isIOS) {
      // iOS needs specific approach
      const range = document.createRange();
      range.selectNodeContents(tempInput);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        tempInput.setSelectionRange(0, text.length); // For iOS

        try {
          copySuccess = document.execCommand("copy");
        } catch (err) {
          console.error("iOS fallback copy failed:", err);
        }

        selection.removeAllRanges();
      }
    } else {
      // Standard approach for other devices
      tempInput.focus();
      tempInput.select();
      tempInput.setSelectionRange(0, text.length);

      try {
        copySuccess = document.execCommand("copy");
      } catch (err) {
        console.error("Standard fallback copy failed:", err);
      }
    }

    // Remove the temporary input
    document.body.removeChild(tempInput);
    return copySuccess;
  };

  const handleShare = async () => {
    setIsSharing(true);

    try {
      const url = window.location.href;

      // Try Web Share API first (primarily for mobile)
      if (canShare) {
        try {
          // Double-check if navigator.share is available right at the moment of use
          if (typeof navigator.share === "function") {
            await navigator.share({
              title: `BringWhat: ${title}`,
              text: `Check out this list: ${title}`,
              url: url,
            });

            // Success message after share
            toast({
              title: "Shared successfully!",
              description: "Thank you for sharing this list.",
              duration: 2000,
            });

            setIsSharing(false);
            return; // Exit early if sharing was successful
          } else {
            console.warn("Web Share API unavailable at time of use");
            // Fall through to clipboard methods
          }
        } catch (error) {
          console.log("Share API error:", error);
          // Only treat it as a real error if it's not just the user canceling
          if (error instanceof Error && error.name !== "AbortError") {
            // Fall through to clipboard methods
            console.warn("Share API failed:", error);
          } else {
            // Just a cancellation, no error to show
            setIsSharing(false);
            return;
          }
        }
      }

      // Clipboard API as second choice
      if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        try {
          await navigator.clipboard.writeText(url);
          // Force React to complete any pending state updates
          setTimeout(() => {
            toast({
              title: "Link copied!",
              description: "The list URL has been copied to your clipboard.",
              duration: 2000,
            });
          }, 0);
          setIsSharing(false);
          return;
        } catch (clipboardError) {
          console.warn("Clipboard API failed:", clipboardError);
          // Fall through to manual method
        }
      }

      // Last resort: manual copy method
      const copySuccess = copyToClipboardFallback(url);

      if (copySuccess) {
        // Force React to complete any pending state updates
        setTimeout(() => {
          toast({
            title: "Link copied!",
            description: "The list URL has been copied to your clipboard.",
            duration: 2000,
          });
        }, 0);
      } else {
        // If all methods fail, show instructions
        setTimeout(() => {
          toast({
            title: "Manual copy needed",
            description: "Please copy this URL manually: " + url,
            duration: 5000,
          });
        }, 0);
      }
    } catch (error) {
      console.error("Error in sharing process:", error);
      setTimeout(() => {
        toast({
          title: "Failed to share",
          description: "There was an error sharing this list.",
          variant: "destructive",
          duration: 2000,
        });
      }, 0);
    } finally {
      setIsSharing(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full items-center justify-between gap-2">
          <h1 
            className="m-auto w-full text-center text-xl text-black dark:text-white cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsEditing(true)}
            title="Cliquer pour modifier"
          >
            {title}
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="cursor-pointer backdrop-blur-xs"
              onClick={() => setIsEditing(true)}
            >
              <Pen className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer backdrop-blur-xs"
              onClick={handleShare}
              disabled={isSharing}
            >
              {isSharing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full gap-2 rounded-md">
      <div className="w-full">
        <input
          ref={inputRef}
          type="text"
          placeholder="Titre de la liste"
          className="text-center text-foreground focus:border-primary focus:ring-primary h-9 w-full rounded-md border bg-transparent p-2 text-lg font-medium backdrop-blur-xs outline-none focus:ring-1"
          value={titleText}
          onChange={(e) => setTitleText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleUpdate();
            } else if (e.key === "Escape") {
              e.preventDefault();
              handleCancel();
            }
          }}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-destructive mt-1 text-xs">{errors.title[0]}</p>
        )}
      </div>

      {errors._form && (
        <p className="text-destructive text-xs">{errors._form[0]}</p>
      )}

      <div className="flex gap-2">
        <Button
          onMouseDown={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
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
          variant="outline"
          className="backdrop-blur-xs"
          onMouseDown={(e) => {
            e.preventDefault();
            handleCancel();
          }}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
