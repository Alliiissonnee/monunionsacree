"use client";

import Link from "next/link";
import { useActionState } from "react";
import { inscrire, type EtatFormulaire } from "@/app/actions/auth";
import { BoutonPrincipal, Champ, MessageErreur } from "@/components/ui/Champ";

export function InscriptionForm({ genreInitial }: { genreInitial?: string }) {
  const [etat, action, enCours] = useActionState<EtatFormulaire, FormData>(inscrire, {});
  const genre = etat.champs?.genre ?? genreInitial;

  return (
    <form action={action} className="flex flex-col gap-4">
      <MessageErreur message={etat.erreur} />

      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-sm font-semibold">Je suis</legend>
        <div className="grid grid-cols-2 gap-3">
          {[
            { valeur: "femme", label: "Une femme" },
            { valeur: "homme", label: "Un homme" },
          ].map((option) => (
            <label
              key={option.valeur}
              className="flex cursor-pointer items-center justify-center gap-2 rounded border border-bleu-gris bg-white px-3 py-2.5 has-[:checked]:border-terracotta has-[:checked]:bg-terracotta/10 has-[:checked]:text-terracotta"
            >
              <input
                type="radio"
                name="genre"
                value={option.valeur}
                defaultChecked={genre === option.valeur}
                required
                className="accent-terracotta"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Champ label="Prénom (ou prénom d'usage)" name="prenom" autoComplete="given-name" required maxLength={50} defaultValue={etat.champs?.prenom} />
      <Champ label="Email" name="email" type="email" autoComplete="email" required defaultValue={etat.champs?.email} />
      <Champ label="Mot de passe (8 caractères minimum)" name="motDePasse" type="password" autoComplete="new-password" required minLength={8} />
      <Champ label="Confirmer le mot de passe" name="confirmation" type="password" autoComplete="new-password" required minLength={8} />

      <div className="flex flex-col gap-3 pt-2 text-sm">
        <label className="flex gap-2">
          <input type="checkbox" name="majeur" required className="mt-0.5 accent-terracotta" />
          <span>Je certifie avoir 18 ans ou plus.</span>
        </label>
        <label className="flex gap-2">
          <input type="checkbox" name="cgu" required className="mt-0.5 accent-terracotta" />
          <span>
            J&apos;accepte les <Link href="/cgu" className="underline">conditions d&apos;utilisation</Link> et
            la <Link href="/charte" className="underline">charte de la communauté</Link>.
          </span>
        </label>
        <label className="flex gap-2">
          <input type="checkbox" name="donneesSensibles" required className="mt-0.5 accent-terracotta" />
          <span>
            J&apos;accepte que Mon Union Sacrée traite mes données, y compris des données révélant
            mes convictions religieuses, dans le seul but de me proposer des profils compatibles.
            Voir la <Link href="/confidentialite" className="underline">politique de confidentialité</Link>.
          </span>
        </label>
      </div>

      <BoutonPrincipal enCours={enCours}>Créer mon compte</BoutonPrincipal>

      <p className="text-center text-sm">
        Déjà inscrit(e) ?{" "}
        <Link href="/connexion" className="font-semibold text-terracotta underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
