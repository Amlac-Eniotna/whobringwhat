import { ThemeProvider } from "@/components/theme/theme-provider";
import { ModeToggle } from "@/components/theme/toggle-theme";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
          <Toaster />
        </ThemeProvider>
        <SpeedInsights/>
      </body>
    </html>
  );
}
