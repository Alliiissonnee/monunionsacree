import Link from "next/link";
import { Logo } from "./Logo";

const liens = [
  { href: "/", label: "Accueil" },
  { href: "/comment-ca-marche", label: "Comment ça marche ?" },
  { href: "/a-propos", label: "À propos" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-bleu-gris">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Logo />

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
          {liens.map((lien) => (
            <Link key={lien.href} href={lien.href} className="hover:text-terracotta">
              {lien.label}
            </Link>
          ))}
          <Link
            href="/connexion"
            className="rounded border border-terracotta px-3 py-1 text-terracotta hover:bg-terracotta hover:text-creme"
          >
            Se connecter
          </Link>
          <Link
            href="/inscription"
            className="rounded bg-terracotta px-4 py-1.5 text-creme hover:bg-terracotta-fonce"
          >
            S&apos;inscrire
          </Link>
        </nav>

        {/* Navigation mobile : menu dépliant sans JavaScript */}
        <details className="relative md:hidden">
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
            <Link href="/connexion" className="rounded px-3 py-2 text-terracotta hover:bg-bleu-gris-clair">
              Se connecter
            </Link>
            <Link href="/inscription" className="mt-1 rounded bg-terracotta px-3 py-2 text-center text-creme">
              S&apos;inscrire
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
