"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type EtatFormulaire = {
  erreur?: string;
  champs?: Record<string, string>;
};

// Version des textes acceptés à l'inscription (à incrémenter si les CGU changent).
const VERSION_CGU = "2026-11";

export async function inscrire(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const prenom = String(formData.get("prenom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const motDePasse = String(formData.get("motDePasse") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  const genre = String(formData.get("genre") ?? "");
  const champs = { prenom, email, genre };

  if (!prenom || prenom.length > 50) {
    return { erreur: "Merci d'indiquer votre prénom (50 caractères maximum).", champs };
  }
  if (genre !== "femme" && genre !== "homme") {
    return { erreur: "Merci d'indiquer si vous êtes une femme ou un homme.", champs };
  }
  if (motDePasse.length < 8) {
    return { erreur: "Le mot de passe doit contenir au moins 8 caractères.", champs };
  }
  if (motDePasse !== confirmation) {
    return { erreur: "Les deux mots de passe ne correspondent pas.", champs };
  }
  if (
    formData.get("majeur") !== "on" ||
    formData.get("cgu") !== "on" ||
    formData.get("donneesSensibles") !== "on"
  ) {
    return { erreur: "Merci d'accepter les trois conditions pour créer votre compte.", champs };
  }

  const origine = (await headers()).get("origin");
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password: motDePasse,
    options: {
      emailRedirectTo: `${origine}/auth/confirm?suite=/espace`,
      data: {
        prenom,
        genre,
        // Trace du consentement (RGPD art. 9 : donnée sensible = conviction religieuse).
        consentements: {
          version: VERSION_CGU,
          majeur: true,
          cgu: true,
          donnees_sensibles: true,
          date: new Date().toISOString(),
        },
      },
    },
  });

  if (error) {
    if (error.code === "weak_password") {
      return { erreur: "Ce mot de passe est trop simple, choisissez-en un plus solide.", champs };
    }
    if (error.code === "over_email_send_rate_limit") {
      return { erreur: "Trop de tentatives, merci de réessayer dans quelques minutes.", champs };
    }
    return { erreur: "L'inscription n'a pas pu aboutir, merci de réessayer.", champs };
  }

  // Par confidentialité, on affiche le même message que l'email existe déjà ou non.
  redirect("/inscription/verifier-email");
}

export async function connecter(_: EtatFormulaire, formData: FormData): Promise<EtatFormulaire> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const motDePasse = String(formData.get("motDePasse") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        erreur: "Votre adresse email n'est pas encore confirmée. Vérifiez votre boîte de réception.",
        champs: { email },
      };
    }
    return { erreur: "Email ou mot de passe incorrect.", champs: { email } };
  }

  redirect("/espace");
}

export async function deconnecter() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
