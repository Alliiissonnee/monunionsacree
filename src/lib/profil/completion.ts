import type { Tables } from "@/lib/supabase/database.types";
import { MIN_PRESENTATION } from "./options";

type Profil = Tables<"profiles">;
type Criteres = Tables<"criteria">;

export const ETAPES = [
  { numero: 1, titre: "Informations" },
  { numero: 2, titre: "Mon projet" },
  { numero: 3, titre: "À propos de moi" },
  { numero: 4, titre: "Ma recherche" },
] as const;

/**
 * Calcule le pourcentage de complétion du profil et les étapes à reprendre.
 * `validable` = le minimum exigé par la base pour qu'un profil soit validé.
 */
export function calculerCompletion(profil: Profil, criteres: Criteres) {
  const verifications: { etape: number; ok: boolean }[] = [
    { etape: 1, ok: !!profil.date_naissance },
    { etape: 1, ok: !!profil.territoire },
    { etape: 1, ok: !!profil.ville },
    { etape: 1, ok: !!profil.situation },
    { etape: 1, ok: !!profil.profession },
    { etape: 1, ok: !!profil.niveau_etudes },
    { etape: 1, ok: profil.langues.length > 0 },
    { etape: 2, ok: profil.a_enfants !== null },
    { etape: 2, ok: !!profil.souhait_enfants },
    { etape: 2, ok: !!profil.delai_mariage },
    { etape: 2, ok: !!profil.mobilite },
    { etape: 3, ok: (profil.presentation?.trim().length ?? 0) >= MIN_PRESENTATION },
    { etape: 3, ok: profil.valeurs.length > 0 },
    { etape: 4, ok: criteres.territoires.length > 0 },
    { etape: 4, ok: criteres.situations_acceptees.length > 0 },
  ];

  const remplis = verifications.filter((v) => v.ok).length;
  const etapesIncompletes = [...new Set(verifications.filter((v) => !v.ok).map((v) => v.etape))];

  return {
    pourcentage: Math.round((remplis / verifications.length) * 100),
    etapesIncompletes,
    complet: etapesIncompletes.length === 0,
    validable: !!profil.genre && !!profil.date_naissance && !!profil.territoire,
  };
}
