"use client";

import Link from "next/link";
import { useActionState } from "react";
import { connecter, type EtatFormulaire } from "@/app/actions/auth";
import { BoutonPrincipal, Champ, MessageErreur } from "@/components/ui/Champ";
import { CLE_DERNIERE_ACTIVITE } from "@/components/DeconnexionInactivite";

const MESSAGES: Record<string, string> = {
  lien: "Ce lien de confirmation est invalide ou a expiré. Essayez de vous connecter, ou inscrivez-vous à nouveau.",
  inactivite: "Vous avez été déconnecté(e) après 30 minutes d'inactivité. Merci de vous reconnecter.",
};

export function ConnexionForm({ erreurInitiale }: { erreurInitiale?: string }) {
  const [etat, action, enCours] = useActionState<EtatFormulaire, FormData>(connecter, {});
  const erreur = etat.erreur ?? (erreurInitiale ? MESSAGES[erreurInitiale] : undefined);

  return (
    <form
      action={action}
      // Nouvelle connexion : on repart d'un compteur d'inactivité vierge.
      onSubmit={() => {
        try {
          localStorage.removeItem(CLE_DERNIERE_ACTIVITE);
        } catch {
          /* stockage indisponible */
        }
      }}
      className="flex flex-col gap-4"
    >
      <MessageErreur message={erreur} />
      <Champ label="Email" name="email" type="email" autoComplete="email" required defaultValue={etat.champs?.email} />
      <Champ label="Mot de passe" name="motDePasse" type="password" autoComplete="current-password" required />
      <BoutonPrincipal enCours={enCours}>Se connecter</BoutonPrincipal>
      <p className="text-center text-sm">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-semibold text-terracotta underline">
          S&apos;inscrire
        </Link>
      </p>
    </form>
  );
}
