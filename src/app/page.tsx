import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import heroCouple from "@/assets/hero-couple.jpg";

function IconePersonne({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="4.5" />
      <path d="M3 21c0-4.4 4-7.5 9-7.5s9 3.1 9 7.5z" />
    </svg>
  );
}

export default function Accueil() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Hero : photo + accroche */}
        <section className="grid md:grid-cols-2">
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[480px]">
            <Image
              src={heroCouple}
              alt="Un couple de jeunes mariés musulmans montrant leurs alliances"
              fill
              preload
              placeholder="blur"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
            <h1 className="text-center font-serif text-4xl sm:text-5xl">S&apos;unir autrement</h1>
            <p className="mt-10 text-lg font-semibold text-terracotta">
              Une rencontre pensée pour le mariage.
            </p>
            <p className="mt-4 leading-relaxed">
              Mon Union Sacrée accompagne les femmes et les hommes musulmans dans leur
              recherche d&apos;une union sérieuse, fondée sur les valeurs, la compatibilité
              et un projet de vie commun.
            </p>
          </div>
        </section>

        {/* Choix du parcours */}
        <section className="relative grid sm:grid-cols-2">
          <div className="flex flex-col items-center gap-4 bg-terracotta px-6 py-14 text-creme">
            <IconePersonne className="h-12 w-12 text-terracotta-fonce" />
            <p className="font-semibold">Je suis une femme</p>
            <Link
              href="/inscription?profil=femme"
              className="rounded bg-creme px-5 py-2 text-sm font-semibold text-terracotta hover:bg-white"
            >
              Commencer
            </Link>
          </div>

          <div className="flex flex-col items-center gap-4 bg-bleu-gris px-6 py-14">
            <IconePersonne className="h-12 w-12 text-bleu-gris-clair" />
            <p className="font-semibold">Je suis un homme</p>
            <Link
              href="/inscription?profil=homme"
              className="rounded bg-anthracite px-5 py-2 text-sm font-semibold text-creme hover:bg-black"
            >
              Commencer
            </Link>
          </div>

          {/* Losange ∞ à la jonction (desktop) */}
          <div
            className="absolute left-1/2 top-0 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 rotate-45 items-center justify-center bg-anthracite sm:flex"
            aria-hidden="true"
          >
            <span className="-rotate-45 text-2xl text-creme">∞</span>
          </div>
        </section>
      </main>
    </>
  );
}
