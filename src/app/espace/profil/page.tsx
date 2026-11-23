import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { calculerCompletion, ETAPES } from "@/lib/profil/completion";
import { getMonProfil } from "@/lib/profil/data";
import { EtapeInformations, EtapePresentation, EtapeProjet, EtapeRecherche } from "./EtapesProfil";

export const metadata: Metadata = { title: "Mon profil" };

export default function PageProfil({ searchParams }: PageProps<"/espace/profil">) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-8 text-center font-serif text-3xl sm:text-4xl">Mon profil</h1>
      <Suspense fallback={<p className="text-center opacity-75">Chargement de votre profil…</p>}>
        <ContenuProfil searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ContenuProfil({ searchParams }: Pick<PageProps<"/espace/profil">, "searchParams">) {
  const [{ etape: brut }, { profil, criteres }] = await Promise.all([searchParams, getMonProfil()]);
  const etape = Math.min(4, Math.max(1, Number(brut) || 1));
  const { pourcentage, etapesIncompletes } = calculerCompletion(profil, criteres);

  return (
    <>
      <div className="mb-6">
        <div className="mb-1 flex justify-between text-sm">
          <span className="font-semibold">Profil complété</span>
          <span>{pourcentage} %</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-bleu-gris-clair">
          <div className="h-full rounded-full bg-terracotta transition-all" style={{ width: `${pourcentage}%` }} />
        </div>
      </div>

      <nav aria-label="Étapes du profil" className="mb-6 grid grid-cols-4 gap-2 text-center text-xs sm:text-sm">
        {ETAPES.map((e) => {
          const active = e.numero === etape;
          const aFaire = etapesIncompletes.includes(e.numero);
          return (
            <Link
              key={e.numero}
              href={`/espace/profil?etape=${e.numero}`}
              aria-current={active ? "step" : undefined}
              className={`rounded px-1 py-2 font-semibold ${
                active ? "bg-terracotta text-creme" : "bg-bleu-gris-clair hover:bg-bleu-gris"
              }`}
            >
              <span className="block">
                {aFaire ? e.numero : "✓"}
              </span>
              <span className="hidden sm:block">{e.titre}</span>
            </Link>
          );
        })}
      </nav>

      <section className="rounded-lg bg-white/70 p-5 shadow-sm sm:p-8">
        <h2 className="mb-5 font-serif text-2xl">{ETAPES[etape - 1].titre}</h2>
        {etape === 1 && <EtapeInformations profil={profil} />}
        {etape === 2 && <EtapeProjet profil={profil} />}
        {etape === 3 && <EtapePresentation profil={profil} />}
        {etape === 4 && <EtapeRecherche criteres={criteres} />}
      </section>
    </>
  );
}
