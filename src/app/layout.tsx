import type { Metadata } from "next";
import { DM_Serif_Display, Manrope, Passions_Conflict } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin"],
});

// Police script des lettrines (M du logo, B de Bienvenue).
const passionsConflict = Passions_Conflict({
  variable: "--font-passions",
  weight: "400",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mon Union Sacrée — Agence matrimoniale musulmane",
    template: "%s | Mon Union Sacrée",
  },
  description:
    "Mon Union Sacrée accompagne les musulmans de Mayotte et de La Réunion dans leur recherche d'une union sérieuse, fondée sur les valeurs, la compatibilité et un projet de vie commun.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${dmSerif.variable} ${manrope.variable} ${passionsConflict.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
