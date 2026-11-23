import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

export function Champ({ label, name, id, ...props }: Props) {
  const idChamp = id ?? name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={idChamp} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={idChamp}
        name={name}
        className="rounded border border-bleu-gris bg-white px-3 py-2.5 outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
        {...props}
      />
    </div>
  );
}

export function BoutonPrincipal({
  children,
  enCours,
}: {
  children: React.ReactNode;
  enCours?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={enCours}
      className="w-full rounded bg-terracotta px-4 py-3 font-semibold text-creme hover:bg-terracotta-fonce disabled:opacity-60"
    >
      {enCours ? "Un instant…" : children}
    </button>
  );
}

export function MessageErreur({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded border border-terracotta/40 bg-terracotta/10 px-3 py-2 text-sm text-terracotta">
      {message}
    </p>
  );
}

export function CarteFormulaire({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-md rounded-lg bg-white/70 p-6 shadow-sm sm:p-8">
        <h1 className="mb-6 text-center font-serif text-3xl">{titre}</h1>
        {children}
      </div>
    </main>
  );
}
