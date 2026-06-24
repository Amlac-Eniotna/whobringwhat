import { SignupForm } from "@/components/auth/SignupForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Inscription · QuiRamèneQuoi",
  robots: "noindex, nofollow",
};

export default function InscriptionPage() {
  return (
    <main className="m-auto flex min-h-[calc(100vh-68px)] w-full max-w-3xl flex-col items-center justify-center p-4">
      <Suspense>
        <SignupForm />
      </Suspense>
    </main>
  );
}
