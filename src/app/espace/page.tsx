import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getMembreConnecte } from "@/lib/auth";

export const metadata: Metadata = { title: "Mon espace" };

export default function TableauDeBord() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <h1 className="mb-10 text-center font-serif text-3xl text-terracotta sm:text-4xl">
        <Suspense fallback="Bienvenue">
          <Bienvenue />
        </Suspense>
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Tuile href="/espace/profil" titre="Mon profil" className="bg-bleu-gris" />
        <Tuile href="/espace/matchs" titre="Mes matchs" className="bg-bleu-gris-clair" />
        <Tuile
          href="/espace/actualites"
          titre="Actualités"
          className="bg-bleu-gris md:row-span-3"
        />
        <Tuile
          href="/espace/messages"
          titre="Mes messages"
          className="bg-terracotta text-creme md:col-span-2 md:min-h-40"
        />
        <Tuile
          href="/espace/matchs"
          titre="Intérêts reçus"
          className="bg-bleu-gris-clair md:col-span-2"
        />
      </div>
    </div>
  );
}

// Lit la session : doit rester derrière <Suspense> (Cache Components).
async function Bienvenue() {
  const membre = await getMembreConnecte();
  return <>Bienvenue {membre.prenom}</>;
}

function Tuile({ href, titre, className }: { href: string; titre: string; className: string }) {
  return (
    <Link
      href={href}
      className={`min-h-28 rounded-lg p-4 text-xl transition hover:brightness-95 sm:text-2xl ${className}`}
    >
      {titre}
    </Link>
  );
}
