import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Pages réservées aux membres connectés.
const PAGES_MEMBRES = ["/espace"];
// Pages inutiles quand on est déjà connecté.
const PAGES_INVITES = ["/connexion", "/inscription"];

/**
 * Rafraîchit la session Supabase à chaque requête et fait une première
 * vérification d'accès. Ce n'est qu'un filtre rapide : chaque page membre
 * revérifie l'utilisateur côté serveur (voir lib/auth.ts).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    },
  );

  // Ne rien mettre entre createServerClient et getClaims : c'est cet appel
  // qui rafraîchit le jeton si besoin.
  const { data } = await supabase.auth.getClaims();
  const connecte = Boolean(data?.claims);
  const chemin = request.nextUrl.pathname;

  const commencePar = (prefixes: string[]) =>
    prefixes.some((p) => chemin === p || chemin.startsWith(`${p}/`));

  if (!connecte && commencePar(PAGES_MEMBRES)) {
    return rediriger(request, response, "/connexion");
  }
  if (connecte && PAGES_INVITES.includes(chemin)) {
    return rediriger(request, response, "/espace");
  }

  return response;
}

// Redirige en conservant les cookies de session éventuellement rafraîchis.
function rediriger(request: NextRequest, response: NextResponse, chemin: string) {
  const url = request.nextUrl.clone();
  url.pathname = chemin;
  url.search = "";
  const redirection = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => redirection.cookies.set(cookie));
  return redirection;
}
