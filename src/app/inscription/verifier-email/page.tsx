import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { CarteFormulaire } from "@/components/ui/Champ";

export const metadata: Metadata = { title: "Vérifiez votre email" };

export default function PageVerifierEmail() {
  return (
    <>
      <SiteHeader />
      <CarteFormulaire titre="Vérifiez votre email">
        <div className="flex flex-col gap-4 text-center leading-relaxed">
          <p>
            Si cette adresse n&apos;est pas déjà utilisée, vous allez recevoir un email pour
            confirmer votre inscription.
          </p>
          <p>Cliquez sur le lien qu&apos;il contient pour activer votre compte.</p>
          <p className="text-sm">Pensez à vérifier vos courriers indésirables.</p>
          <Link href="/connexion" className="font-semibold text-terracotta underline">
            Retour à la connexion
          </Link>
        </div>
      </CarteFormulaire>
    </>
  );
}
