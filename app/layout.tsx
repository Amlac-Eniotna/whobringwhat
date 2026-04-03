import { ThemeProvider } from "@/components/theme/theme-provider";
import { ModeToggle } from "@/components/theme/toggle-theme";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Nunito, Nunito_Sans, Syne } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuiRamèneQuoi",
  description: "L'application simple pour gérer les listes de courses et d'organisation pour vos soirées, week-ends et événements entre amis.",
  applicationName: "QuiRamèneQuoi",
  authors: [{ name: "Antoine Calma" }], // Presumed author from context, adjustable
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://quiramenequoi.fr"),
  keywords: ["soirée", "amis", "liste", "courses", "organisation", "événements", "partage"],
  alternates: {
    canonical: "./",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "QuiRamèneQuoi",
              url: "https://quiramenequoi.fr",
              description: "L'application simple pour gérer les listes de courses et d'organisation pour vos soirées, week-ends et événements entre amis.",
            }),
          }}
        />
        <Script
          id="schema-software-app"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "QuiRamèneQuoi",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web",
              url: "https://quiramenequoi.fr",
              description: "L'application simple pour gérer les listes de courses et d'organisation pour vos soirées, week-ends et événements entre amis.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "EUR",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${nunitoSans.variable} ${nunito.variable} ${syne.variable} font-nunito-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="relative m-auto flex w-full max-w-3xl justify-between">
            <Link href={"/"} className="flex items-center">
              <h1 className="font-syne p-4 font-black sm:text-3xl">
                QuiRamèneQuoi
              </h1>
            </Link>
            <div className="p-4">
              <ModeToggle />
            </div>
          </header>
          {children}
          <footer className="m-auto mt-8 w-full max-w-3xl border-t border-gray-200 px-4 py-6 dark:border-gray-800">
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/about" className="hover:text-gray-700 dark:hover:text-gray-300">
                À propos
              </Link>
              <Link href="/guide" className="hover:text-gray-700 dark:hover:text-gray-300">
                Guide
              </Link>
              <Link href="/faq" className="hover:text-gray-700 dark:hover:text-gray-300">
                FAQ
              </Link>
              <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">
                Confidentialité
              </Link>
              <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">
                Conditions d{"'"}utilisation
              </Link>
            </nav>
          </footer>
          <Toaster />
        </ThemeProvider>
        <SpeedInsights/>
      </body>
    </html>
  );
}
