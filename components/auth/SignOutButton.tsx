"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignOut() {
    setIsLoading(true);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut} disabled={isLoading}>
      Se déconnecter
    </Button>
  );
}
