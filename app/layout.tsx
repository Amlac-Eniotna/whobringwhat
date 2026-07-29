import { HeaderAuth } from "@/components/auth/HeaderAuth";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ModeToggle } from "@/components/theme/toggle-theme";
import { Toaster } from "@/components/ui/toaster";
import { OpenPanelComponent } from "@openpanel/nextjs";
import type { Metadata } from "next";
import { Nunito, Nunito_Sans, Syne } from "next/font/google";
import Link from "next/link";
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

const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://quiramenequoi.fr"
).replace(/\/+$/, "");

const SITE_DESCRIPTION =
  "Créez une liste partagée pour savoir qui apporte quoi à votre repas, apéro ou anniversaire. Gratuit, sans inscription, un lien à partager.";

export const metadata: Metadata = {
  title: "QuiRamèneQuoi",
  description: SITE_DESCRIPTION,
  applicationName: "QuiRamèneQuoi",
  authors: [{ name: "Antoine Calma" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://quiramenequoi.fr",
  ),
  alternates: {
    canonical: "./",
  },
  // og:type / og:site_name / og:locale ne sont pas générés par Next.js sans un
  // bloc openGraph explicite ; og:url suit la même résolution relative que le
  // canonical ci-dessus, donc chaque page annonce sa propre URL.
  openGraph: {
    type: "website",
    siteName: "QuiRamèneQuoi",
    locale: "fr_FR",
    url: "./",
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
        {/*
          Balise <script> native volontairement, et non le composant <Script> de
          next/script : ce dernier est prévu pour des scripts exécutables et
          n'injecte son contenu qu'après hydratation côté client. Le JSON-LD
          n'apparaissait alors jamais dans le HTML servi, donc restait invisible
          pour tout crawler qui n'exécute pas de JS (GPTBot, ClaudeBot,
          PerplexityBot, validateurs tiers). Pas de nonce CSP ici : un bloc
          application/ld+json est une donnée, pas du code exécutable, et lire
          headers() pour récupérer le nonce rebasculerait tout le layout en
          rendu dynamique — exactement ce que HeaderAuth vient d'arrêter de faire.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  name: "QuiRamèneQuoi",
                  url: SITE_URL,
                  description: SITE_DESCRIPTION,
                  logo: {
                    "@type": "ImageObject",
                    "@id": `${SITE_URL}/#logo`,
                    url: `${SITE_URL}/icon.png`,
                    contentUrl: `${SITE_URL}/icon.png`,
                    width: 512,
                    height: 512,
                    caption: "QuiRamèneQuoi",
                  },
                  image: { "@id": `${SITE_URL}/#logo` },
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: "QuiRamèneQuoi",
                  description: SITE_DESCRIPTION,
                  inLanguage: "fr",
                  publisher: { "@id": `${SITE_URL}/#organization` },
                },
                {
                  // WebApplication plutôt que SoftwareApplication : sous-type
                  // plus précis pour un outil qui tourne entièrement dans le
                  // navigateur, sans installation.
                  "@type": "WebApplication",
                  "@id": `${SITE_URL}/#software`,
                  name: "QuiRamèneQuoi",
                  url: SITE_URL,
                  description: SITE_DESCRIPTION,
                  applicationCategory: "ProductivityApplication",
                  operatingSystem: "Web",
                  browserRequirements: "Requires JavaScript.",
                  isAccessibleForFree: true,
                  inLanguage: "fr",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "EUR",
                  },
                  author: { "@id": `${SITE_URL}/#organization` },
                  publisher: { "@id": `${SITE_URL}/#organization` },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${nunitoSans.variable} ${nunito.variable} ${syne.variable} font-nunito-sans antialiased`}
      >
        <OpenPanelComponent
          apiUrl="/api/op"
          scriptUrl="/api/op/op1.js"
          clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}
          trackScreenViews={true}
          trackOutgoingLinks={true}
          trackAttributes={true}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/*
            Le wordmark était un <h1>, donc chaque page portait deux h1 et le
            premier était toujours « QuiRamèneQuoi » plutôt que son sujet. C'est
            un <span> : le seul h1 d'une page appartient à son contenu.

            La somme wordmark + cluster d'actions dépassait la largeur d'écran
            (371px de contenu pour 320 à 375px de viewport), ce qui rendait tout
            le site scrollable latéralement. Trois leviers : taille réduite sous
            sm, paddings et gap resserrés, et surtout min-w-0 + truncate comme
            garde-fou — aucune largeur ne peut plus casser la mise en page.
            Mesuré : le nom s'affiche en entier dès 360px ; en dessous il se
            tronque, ce qui reste préférable à un débordement horizontal.
          */}
          <header className="relative m-auto flex w-full max-w-3xl justify-between">
            <Link href={"/"} className="flex min-w-0 items-center">
              <span className="font-syne truncate px-2 py-4 text-sm font-black sm:px-4 sm:text-3xl">
                QuiRamèneQuoi
              </span>
            </Link>
            <div className="flex shrink-0 items-center gap-2 px-2 py-4 sm:gap-4 sm:px-4">
              <HeaderAuth />
              <ModeToggle />
            </div>
          </header>
          {children}
          <footer className="m-auto mt-8 w-full max-w-3xl border-t border-gray-200 px-4 py-6 dark:border-gray-800">
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              <Link
                href="/about"
                className="py-1 hover:text-gray-700 dark:hover:text-gray-300"
              >
                À propos
              </Link>
              <Link
                href="/guide"
                className="py-1 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Guide
              </Link>
              <Link
                href="/qui-apporte-quoi"
                className="py-1 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Qui apporte quoi ?
              </Link>
              <Link
                href="/faq"
                className="py-1 hover:text-gray-700 dark:hover:text-gray-300"
              >
                FAQ
              </Link>
              <Link
                href="/privacy"
                className="py-1 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Confidentialité
              </Link>
              <Link
                href="/terms"
                className="py-1 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Conditions d{"'"}utilisation
              </Link>
              <Link
                href="/mentions-legales"
                className="py-1 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Mentions légales
              </Link>
            </nav>
          </footer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
