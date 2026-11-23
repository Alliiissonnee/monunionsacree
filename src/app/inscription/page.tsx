import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { CarteFormulaire } from "@/components/ui/Champ";
import { InscriptionForm } from "./InscriptionForm";

export const metadata: Metadata = { title: "Créer mon compte" };

export default function PageInscription({ searchParams }: PageProps<"/inscription">) {
  return (
    <>
      <SiteHeader />
      <CarteFormulaire titre="Créer mon compte">
        <Suspense fallback={<InscriptionForm />}>
          <FormulaireAvecGenre searchParams={searchParams} />
        </Suspense>
      </CarteFormulaire>
    </>
  );
}

// Pré-sélectionne femme / homme quand on vient des boutons de l'accueil.
async function FormulaireAvecGenre({ searchParams }: Pick<PageProps<"/inscription">, "searchParams">) {
  const { profil } = await searchParams;
  return <InscriptionForm genreInitial={typeof profil === "string" ? profil : undefined} />;
}
