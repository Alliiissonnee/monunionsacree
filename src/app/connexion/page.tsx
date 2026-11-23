import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { CarteFormulaire } from "@/components/ui/Champ";
import { ConnexionForm } from "./ConnexionForm";

export const metadata: Metadata = { title: "Se connecter" };

export default function PageConnexion({ searchParams }: PageProps<"/connexion">) {
  return (
    <>
      <SiteHeader />
      <CarteFormulaire titre="Se connecter">
        <Suspense fallback={<ConnexionForm />}>
          <FormulaireAvecErreur searchParams={searchParams} />
        </Suspense>
      </CarteFormulaire>
    </>
  );
}

async function FormulaireAvecErreur({ searchParams }: Pick<PageProps<"/connexion">, "searchParams">) {
  const { erreur } = await searchParams;
  return <ConnexionForm erreurInitiale={typeof erreur === "string" ? erreur : undefined} />;
}
