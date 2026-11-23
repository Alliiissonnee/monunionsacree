import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { calculerCompletion } from "@/lib/profil/completion";
import { getMonProfil } from "@/lib/profil/data";

export const metadata: Metadata = { title: "Mon espace" };

export default function TableauDeBord() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <h1 className="mb-8 text-center font-serif text-3xl text-terracotta sm:text-4xl">
        <span className="font-script text-7xl leading-none sm:text-8xl">B</span>ienvenue{" "}
        <Suspense fallback={null}>
          <PrenomMembre />
        </Suspense>
      </h1>

      <Suspense fallback={null}>
        <BandeauStatut />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-3">
        <Tuile href="/espace/profil" titre="Mon profil" className="bg-bleu-gris">
          <Suspense fallback={null}>
            <CompletionProfil />
          </Suspense>
        </Tuile>
        <Tuile href="/espace/matchs" titre="Mes matchs" className="bg-bleu-gris-clair" />
        <Tuile href="/espace/actualites" titre="Actualités" className="bg-bleu-gris md:row-span-3" />
        <Tuile
          href="/espace/messages"
          titre="Mes messages"
          className="bg-terracotta text-creme md:col-span-2 md:min-h-40"
        />
        <Tuile href="/espace/matchs" titre="Intérêts reçus" className="bg-bleu-gris-clair md:col-span-2" />
      </div>
    </div>
  );
}

// Les composants suivants lisent la session : ils restent derrière <Suspense>.
// getMonProfil n'interroge la base qu'une fois par requête grâce au cache React.

async function PrenomMembre() {
  const { profil } = await getMonProfil();
  return <>{profil.prenom}</>;
}

async function CompletionProfil() {
  const { profil, criteres } = await getMonProfil();
  const { pourcentage } = calculerCompletion(profil, criteres);
  return <span className="mt-2 block text-sm">Complété à {pourcentage} %</span>;
}

async function BandeauStatut() {
  const { profil, criteres } = await getMonProfil();
  const { complet, etapesIncompletes } = calculerCompletion(profil, criteres);

  if (profil.statut === "valide") return null;

  if (profil.statut === "suspendu") {
    return (
      <Bandeau>
        Votre compte est suspendu. Pour toute question, contactez l&apos;équipe Mon Union Sacrée.
      </Bandeau>
    );
  }

  if (!complet) {
    return (
      <Bandeau>
        Complétez votre profil pour qu&apos;il puisse être validé par l&apos;équipe.{" "}
        <Link href={`/espace/profil?etape=${etapesIncompletes[0]}`} className="font-semibold underline">
          Continuer
        </Link>
      </Bandeau>
    );
  }

  return (
    <Bandeau>
      Merci ! Votre profil est complet et <strong>en attente de validation</strong> par l&apos;équipe.
      Vous serez prévenu(e) dès qu&apos;il sera visible des autres membres.
    </Bandeau>
  );
}

function Bandeau({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" className="mb-6 rounded-lg border border-terracotta/30 bg-white/70 px-4 py-3 text-center">
      {children}
    </p>
  );
}

function Tuile({
  href, titre, className, children,
}: { href: string; titre: string; className: string; children?: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`min-h-28 rounded-lg p-4 transition hover:brightness-95 ${className}`}
    >
      <span className="text-xl sm:text-2xl">{titre}</span>
      {children}
    </Link>
  );
}
