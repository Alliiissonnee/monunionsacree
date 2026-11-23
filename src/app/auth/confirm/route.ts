import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Lien reçu par email (confirmation d'inscription, etc.).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const suite = cheminInterne(searchParams.get("suite"));

  const supabase = await createClient();
  let ok = false;

  if (tokenHash && type) {
    // Fonctionne même si le lien est ouvert sur un autre appareil.
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    ok = !error;
  } else if (code) {
    // Lien par défaut de Supabase (même navigateur que l'inscription).
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
  }

  return NextResponse.redirect(new URL(ok ? suite : "/connexion?erreur=lien", origin));
}

// Empêche une redirection vers un site externe.
function cheminInterne(chemin: string | null) {
  return chemin && chemin.startsWith("/") && !chemin.startsWith("//") ? chemin : "/espace";
}
