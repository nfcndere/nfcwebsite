import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Partners from '@/components/sections/Partners';
import { PartnersStrip } from '@/components/layout/PartnersStrip';
import { SponsorsStrip } from '@/components/layout/SponsorsStrip';

export const metadata: Metadata = {
  title: "Ngaoundéré Football Club (NFC) — Site Officiel",
  description: "Site officiel du Ngaoundéré Football Club (NFC). Actualités, effectif, résultats, classement MTN Elite, et inscriptions à l'Académie de football à Ngaoundéré, Adamaoua, Cameroun.",
  keywords: ["Ngaoundéré Football Club", "NFC", "Football Cameroun", "Adamaoua", "MTN Elite One", "Académie Football Ngaoundéré"],
  openGraph: {
    title: "Ngaoundéré Football Club (NFC) — Site Officiel",
    description: "Le club phare de la région de l'Adamaoua. Actualités, effectif, calendrier et académie.",
    url: "https://ngaoundere-fc.cm",
    siteName: "Ngaoundéré FC",
    locale: "fr_CM",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
        <html lang="fr" className="scroll-smooth">
          <body className="antialiased bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] flex flex-col min-h-screen font-body">
        <Navbar />
        <main className="flex-grow">{children}</main>
        {/* 4. PARTENAIRES SECTION */}
        <Partners />
        <Footer />
      </body>
    </html>
  );
}
