import "server-only";
import { cache } from "react";
import { getMembreConnecte } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/**
 * Profil + critères du membre connecté (redirige vers /connexion sinon).
 * `cache` : plusieurs composants d'une même page partagent une seule requête.
 */
export const getMonProfil = cache(async () => {
  const membre = await getMembreConnecte();
  const supabase = await createClient();

  const [profil, criteres] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", membre.id).single(),
    supabase.from("criteria").select("*").eq("user_id", membre.id).single(),
  ]);

  if (profil.error || criteres.error) {
    // Détail technique visible dans le terminal du serveur, pas par le membre.
    console.error("getMonProfil :", profil.error ?? criteres.error);
    throw new Error("Impossible de charger votre profil.");
  }

  return { profil: profil.data, criteres: criteres.data };
});
