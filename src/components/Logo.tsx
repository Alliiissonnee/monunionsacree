import Link from "next/link";

// Logo provisoire en texte, à remplacer par le fichier SVG officiel.
export function Logo() {
  return (
    <Link
      href="/"
      className="font-serif text-2xl text-terracotta sm:text-3xl"
      aria-label="Mon Union Sacrée — accueil"
    >
      <span className="text-4xl sm:text-5xl">M</span>on Union Sacrée
    </Link>
  );
}
