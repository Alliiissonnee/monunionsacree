import type { Enums } from "@/lib/supabase/database.types";

// Listes de choix du profil, avec leurs libellés affichés.
// Les clés des enums doivent correspondre exactement à la base (vérifié par TypeScript).

export type Option<T extends string = string> = { valeur: T; label: string };

function options<T extends string>(libelles: Record<T, string>): Option<T>[] {
  return (Object.keys(libelles) as T[]).map((valeur) => ({ valeur, label: libelles[valeur] }));
}

export const TERRITOIRES = options<Enums<"territoire">>({
  mayotte: "Mayotte",
  reunion: "La Réunion",
  autre: "Autre",
});

export const SITUATIONS = options<Enums<"situation_matrimoniale">>({
  celibataire: "Célibataire",
  divorce: "Divorcé(e)",
  veuf: "Veuf / veuve",
});

export const SOUHAITS_ENFANTS = options<Enums<"souhait_enfants">>({
  oui: "Je souhaite avoir des enfants",
  non: "Je ne souhaite pas d'enfants",
  ouvert: "Je suis ouvert(e) à en discuter",
});

export const DELAIS_MARIAGE = options<Enums<"delai_mariage">>({
  moins_6_mois: "Dans moins de 6 mois",
  "6_12_mois": "Dans 6 à 12 mois",
  "1_2_ans": "Dans 1 à 2 ans",
  plus_2_ans: "Dans plus de 2 ans",
});

export const MOBILITES = options<Enums<"mobilite">>({
  meme_ville: "Rester dans ma ville",
  meme_territoire: "Rester sur mon territoire",
  mayotte_reunion: "Entre Mayotte et La Réunion",
  partout: "Partout",
});

export const NIVEAUX_ETUDES = options({
  sans_diplome: "Sans diplôme",
  cap_bep: "CAP / BEP",
  bac: "Bac",
  bac2: "Bac +2",
  bac3: "Bac +3",
  bac5: "Bac +5",
  doctorat: "Doctorat",
});

export const LANGUES = options({
  francais: "Français",
  shimaore: "Shimaoré",
  kibushi: "Kibushi",
  creole: "Créole réunionnais",
  comorien: "Comorien",
  malgache: "Malgache",
  arabe: "Arabe",
  anglais: "Anglais",
});

export const VALEURS = options({
  famille: "Famille",
  foi: "Foi",
  respect: "Respect",
  communication: "Communication",
  bienveillance: "Bienveillance",
  patience: "Patience",
  ambition: "Ambition",
  simplicite: "Simplicité",
  stabilite: "Stabilité",
  generosite: "Générosité",
  humour: "Humour",
  voyage: "Voyage",
  education: "Éducation",
  entrepreneuriat: "Entrepreneuriat",
});

export const MAX_VALEURS = 6;
export const MIN_PRESENTATION = 30;
export const MAX_PRESENTATION = 2000;

// Vérifie qu'une valeur reçue du formulaire fait partie de la liste.
export function estDans<T extends string>(liste: Option<T>[], valeur: string): valeur is T {
  return liste.some((o) => o.valeur === valeur);
}

export function libelle(liste: Option[], valeur: string | null | undefined) {
  return liste.find((o) => o.valeur === valeur)?.label ?? "";
}
