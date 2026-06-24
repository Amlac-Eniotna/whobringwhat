"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/mes-listes";
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      toast({
        title: "Erreur",
        description: "E-mail ou mot de passe incorrect.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    router.push(redirect);
    router.refresh();
  }

  async function handleGoogle() {
    await authClient.signIn.social({ provider: "google", callbackURL: redirect });
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <h2 className="font-syne text-2xl font-black">Se connecter</h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="E-mail"
          aria-label="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
        />
        <input
          type="password"
          required
          placeholder="Mot de passe"
          aria-label="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Se connecter
        </Button>
      </form>

      <Button type="button" variant="outline" onClick={handleGoogle} disabled={isLoading}>
        Continuer avec Google
      </Button>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
