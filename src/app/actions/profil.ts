"use server";

import { redirect } from "next/navigation";
import { getMembreConnecte } from "@/lib/auth";
import {
  DELAIS_MARIAGE,
  estDans,
  LANGUES,
  MAX_PRESENTATION,
  MAX_VALEURS,
  MIN_PRESENTATION,
  MOBILITES,
  NIVEAUX_ETUDES,
  SITUATIONS,
  SOUHAITS_ENFANTS,
  TERRITOIRES,
  VALEURS,
  type Option,
} from "@/lib/profil/options";
import { createClient } from "@/lib/supabase/server";

export type Valeurs = Record<string, string | string[]>;
export type EtatProfil = { erreur?: string; valeurs?: Valeurs };

// --- Lecture du formulaire -------------------------------------------------

function lireTout(formData: FormData): Valeurs {
  const valeurs: Valeurs = {};
  for (const cle of new Set(formData.keys())) {
    if (cle.startsWith("$")) continue; // champs internes de React
    const tout = formData.getAll(cle).map(String);
    valeurs[cle] = tout.length > 1 ? tout : tout[0];
  }
  return valeurs;
}

const texte = (fd: FormData, nom: string) => String(fd.get(nom) ?? "").trim();

// Garde uniquement les valeurs autorisées (protège contre un formulaire trafiqué).
function liste<T extends string>(fd: FormData, nom: string, autorisees: Option<T>[]): T[] {
  return [...new Set(fd.getAll(nom).map(String))].filter((v): v is T => estDans(autorisees, v));
}

function choix<T extends string>(fd: FormData, nom: string, autorisees: Option<T>[]): T | null {
  const v = texte(fd, nom);
  return estDans(autorisees, v) ? v : null;
}

function ageDepuis(dateIso: string) {
  const naissance = new Date(`${dateIso}T00:00:00`);
  const aujourdHui = new Date();
  let age = aujourdHui.getFullYear() - naissance.getFullYear();
  const m = aujourdHui.getMonth() - naissance.getMonth();
  if (m < 0 || (m === 0 && aujourdHui.getDate() < naissance.getDate())) age--;
  return age;
}

async function contexte() {
  const membre = await getMembreConnecte();
  const supabase = await createClient();
  return { membre, supabase };
}

const ERREUR_ENREGISTREMENT = "L'enregistrement a échoué, merci de réessayer.";

// --- Étape 1 : informations ------------------------------------------------

export async function enregistrerInformations(_: EtatProfil, fd: FormData): Promise<EtatProfil> {
  const valeurs = lireTout(fd);
  const dateNaissance = texte(fd, "date_naissance");
  const territoire = choix(fd, "territoire", TERRITOIRES);
  const situation = choix(fd, "situation", SITUATIONS);
  const ville = texte(fd, "ville");
  const profession = texte(fd, "profession");
  const niveau = choix(fd, "niveau_etudes", NIVEAUX_ETUDES);
  const langues = liste(fd, "langues", LANGUES);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateNaissance) || Number.isNaN(Date.parse(dateNaissance))) {
    return { erreur: "Merci d'indiquer votre date de naissance.", valeurs };
  }
  const age = ageDepuis(dateNaissance);
  if (age < 18) return { erreur: "Mon Union Sacrée est réservée aux personnes majeures.", valeurs };
  if (age > 100) return { erreur: "La date de naissance semble incorrecte.", valeurs };
  if (!territoire) return { erreur: "Merci d'indiquer votre territoire.", valeurs };
  if (!ville || ville.length > 80) return { erreur: "Merci d'indiquer votre ville (80 caractères maximum).", valeurs };
  if (!situation) return { erreur: "Merci d'indiquer votre situation matrimoniale.", valeurs };
  if (profession.length > 80) return { erreur: "La profession est limitée à 80 caractères.", valeurs };

  const { membre, supabase } = await contexte();
  const { error } = await supabase
    .from("profiles")
    .update({
      date_naissance: dateNaissance,
      territoire,
      ville,
      situation,
      profession: profession || null,
      niveau_etudes: niveau,
      langues,
    })
    .eq("id", membre.id);

  if (error) return { erreur: ERREUR_ENREGISTREMENT, valeurs };
  redirect("/espace/profil?etape=2");
}

// --- Étape 2 : mon projet --------------------------------------------------

export async function enregistrerProjet(_: EtatProfil, fd: FormData): Promise<EtatProfil> {
  const valeurs = lireTout(fd);
  const aEnfants = texte(fd, "a_enfants");
  const souhait = choix(fd, "souhait_enfants", SOUHAITS_ENFANTS);
  const delai = choix(fd, "delai_mariage", DELAIS_MARIAGE);
  const mobilite = choix(fd, "mobilite", MOBILITES);

  if (aEnfants !== "oui" && aEnfants !== "non") {
    return { erreur: "Merci d'indiquer si vous avez des enfants.", valeurs };
  }
  if (!souhait || !delai || !mobilite) {
    return { erreur: "Merci de répondre à toutes les questions.", valeurs };
  }

  const { membre, supabase } = await contexte();
  const { error } = await supabase
    .from("profiles")
    .update({ a_enfants: aEnfants === "oui", souhait_enfants: souhait, delai_mariage: delai, mobilite })
    .eq("id", membre.id);

  if (error) return { erreur: ERREUR_ENREGISTREMENT, valeurs };
  redirect("/espace/profil?etape=3");
}

// --- Étape 3 : à propos de moi ---------------------------------------------

export async function enregistrerPresentation(_: EtatProfil, fd: FormData): Promise<EtatProfil> {
  const valeurs = lireTout(fd);
  const presentation = texte(fd, "presentation");
  const mesValeurs = liste(fd, "valeurs", VALEURS);

  if (presentation.length < MIN_PRESENTATION) {
    return { erreur: `Votre présentation doit faire au moins ${MIN_PRESENTATION} caractères.`, valeurs };
  }
  if (presentation.length > MAX_PRESENTATION) {
    return { erreur: `Votre présentation est limitée à ${MAX_PRESENTATION} caractères.`, valeurs };
  }
  if (mesValeurs.length === 0 || mesValeurs.length > MAX_VALEURS) {
    return { erreur: `Choisissez entre 1 et ${MAX_VALEURS} valeurs.`, valeurs };
  }

  const { membre, supabase } = await contexte();
  const { error } = await supabase
    .from("profiles")
    .update({ presentation, valeurs: mesValeurs })
    .eq("id", membre.id);

  if (error) return { erreur: ERREUR_ENREGISTREMENT, valeurs };
  redirect("/espace/profil?etape=4");
}

// --- Étape 4 : ma recherche ------------------------------------------------

export async function enregistrerRecherche(_: EtatProfil, fd: FormData): Promise<EtatProfil> {
  const valeurs = lireTout(fd);
  const ageMin = Number(texte(fd, "age_min"));
  const ageMax = Number(texte(fd, "age_max"));
  const territoires = liste(fd, "territoires", TERRITOIRES);
  const situations = liste(fd, "situations_acceptees", SITUATIONS);
  const enfants = texte(fd, "accepte_enfants");

  if (!Number.isInteger(ageMin) || !Number.isInteger(ageMax) || ageMin < 18 || ageMax > 99) {
    return { erreur: "Les âges doivent être compris entre 18 et 99 ans.", valeurs };
  }
  if (ageMin > ageMax) return { erreur: "L'âge minimum doit être inférieur à l'âge maximum.", valeurs };
  if (territoires.length === 0) return { erreur: "Choisissez au moins un territoire.", valeurs };
  if (situations.length === 0) return { erreur: "Choisissez au moins une situation matrimoniale.", valeurs };

  const { membre, supabase } = await contexte();
  const { error } = await supabase
    .from("criteria")
    .update({
      age_min: ageMin,
      age_max: ageMax,
      territoires,
      situations_acceptees: situations,
      accepte_enfants: enfants === "oui" ? true : enfants === "non" ? false : null,
    })
    .eq("user_id", membre.id);

  if (error) return { erreur: ERREUR_ENREGISTREMENT, valeurs };
  redirect("/espace?profil=enregistre");
}
