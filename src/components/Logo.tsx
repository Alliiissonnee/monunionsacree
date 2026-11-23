import Link from "next/link";

// Logo en texte : lettrine « M » en Passions Conflict + DM Serif Display.
export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-baseline font-serif text-2xl text-terracotta sm:text-3xl"
      aria-label="Mon Union Sacrée — accueil"
    >
      <span className="font-script text-6xl leading-none sm:text-7xl" aria-hidden="true">
        M
      </span>
      <span aria-hidden="true">on Union Sacrée</span>
    </Link>
  );
}
