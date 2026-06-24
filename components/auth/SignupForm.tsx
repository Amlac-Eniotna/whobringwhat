"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/mes-listes";
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await authClient.signUp.email({
      email,
      password,
      name: email.split("@")[0],
    });
    if (error) {
      toast({
        title: "Erreur",
        description:
          error.message === "User already exists"
            ? "Un compte existe déjà avec cet e-mail."
            : "Inscription impossible. Vérifiez vos informations (mot de passe ≥ 8 caractères).",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    router.push(redirect);
    router.refresh();
  }

  async function handleGoogle() {
    setIsLoading(true);
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: redirect });
    } catch {
      toast({
        title: "Erreur",
        description: "Connexion Google impossible. Réessayez.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <h2 className="font-syne text-2xl font-black">Créer un compte</h2>

      <form onSubmit={handleSignup} className="flex flex-col gap-3">
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
          minLength={8}
          placeholder="Mot de passe (8 caractères min.)"
          aria-label="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border px-3 py-2 outline-none focus-visible:ring-2"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          S{"'"}inscrire
        </Button>
      </form>

      <Button type="button" variant="outline" onClick={handleGoogle} disabled={isLoading}>
        Continuer avec Google
      </Button>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
