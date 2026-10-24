import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Partners from '@/components/sections/Partners';
import PageTransition from '@/components/ui/PageTransition';
import { ClubOverviewProvider } from '@/components/providers/ClubOverviewProvider';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ngaounderefc.cm';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ngaoundéré Football Club (NFC) — Site Officiel",
  description: "Site officiel du Ngaoundéré Football Club (NFC). Actualités, effectif, résultats, classement de la Ligue Régionale de l'Adamaoua, et inscriptions à l'Académie de football à Ngaoundéré, Adamaoua, Cameroun.",
  keywords: ["Ngaoundéré Football Club", "NFC", "Football Cameroun", "Adamaoua", "Ligue Régionale de l'Adamaoua", "Académie Football Ngaoundéré"],
  openGraph: {
    title: "Ngaoundéré Football Club (NFC) — Site Officiel",
    description: "Le club phare de la région de l'Adamaoua. Actualités, effectif, calendrier et académie.",
    url: siteUrl,
    siteName: "Ngaoundéré FC",
    locale: "fr_CM",
    type: "website",
  },
  alternates: { canonical: '/' },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="antialiased bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] flex flex-col min-h-screen font-body">
        <ClubOverviewProvider>
          <Navbar />
          <main className="flex-grow">
            <PageTransition>{children}</PageTransition>
          </main>
          <Partners />
          <Footer />
        </ClubOverviewProvider>
      </body>
    </html>
  );
}
