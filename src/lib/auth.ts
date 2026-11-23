import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Membre = {
  id: string;
  email: string;
  prenom: string;
};

/**
 * Renvoie le membre connecté, ou redirige vers /connexion.
 * À appeler dans chaque page / action réservée aux membres :
 * le proxy seul ne suffit pas comme contrôle d'accès.
 */
export async function getMembreConnecte(): Promise<Membre> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    redirect("/connexion");
  }

  return {
    id: claims.sub,
    email: (claims.email as string | undefined) ?? "",
    prenom: (claims.user_metadata?.prenom as string | undefined) ?? "",
  };
}
