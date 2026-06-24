import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Connexion · QuiRamèneQuoi",
  robots: "noindex, nofollow",
};

export default function ConnexionPage() {
  return (
    <main className="m-auto flex min-h-[calc(100vh-68px)] w-full max-w-3xl flex-col items-center justify-center p-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
