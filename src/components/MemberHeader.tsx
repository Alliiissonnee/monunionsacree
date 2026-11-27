import Link from "next/link";
import { deconnecter } from "@/app/actions/auth";
import { Logo } from "./Logo";

const liens = [
  { href: "/espace", label: "Accueil" },
  { href: "/espace/decouvrir", label: "Découvrir" },
  { href: "/espace/matchs", label: "Matchs" },
  { href: "/espace/messages", label: "Messages" },
  { href: "/espace/profil", label: "Profil" },
];

function BoutonDeconnexion({ className }: { className: string }) {
  return (
    <form action={deconnecter}>
      <button type="submit" className={className}>
        Se déconnecter
      </button>
    </form>
  );
}

export function MemberHeader() {
  return (
    <header className="sticky top-0 z-30 bg-bleu-gris">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex">
          {liens.map((lien) => (
            <Link key={lien.href} href={lien.href} className="hover:text-terracotta">
              {lien.label}
            </Link>
          ))}
          <BoutonDeconnexion className="rounded border border-terracotta px-3 py-1 text-terracotta hover:bg-terracotta hover:text-creme" />
        </nav>

        <details className="relative lg:hidden">
          <summary
            className="flex cursor-pointer list-none items-center rounded p-2 [&::-webkit-details-marker]:hidden"
            aria-label="Ouvrir le menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </summary>
          <nav className="absolute right-0 z-10 mt-2 flex w-56 flex-col gap-1 rounded-lg bg-creme p-3 text-sm font-semibold shadow-lg">
            {liens.map((lien) => (
              <Link key={lien.href} href={lien.href} className="rounded px-3 py-2 hover:bg-bleu-gris-clair">
                {lien.label}
              </Link>
            ))}
            <BoutonDeconnexion className="w-full rounded px-3 py-2 text-left text-terracotta hover:bg-bleu-gris-clair" />
          </nav>
        </details>
      </div>
    </header>
  );
}
