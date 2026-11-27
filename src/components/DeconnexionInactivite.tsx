"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export const CLE_DERNIERE_ACTIVITE = "mus-derniere-activite";

const DELAI_INACTIVITE = 30 * 60 * 1000; // 30 minutes
const INTERVALLE_VERIFICATION = 30 * 1000; // toutes les 30 secondes
const EVENEMENTS = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];

function lireDerniereActivite(): number | null {
  try {
    return Number(localStorage.getItem(CLE_DERNIERE_ACTIVITE)) || null;
  } catch {
    return null; // stockage indisponible (navigation privée…)
  }
}

function noterActivite() {
  try {
    localStorage.setItem(CLE_DERNIERE_ACTIVITE, String(Date.now()));
  } catch {
    /* stockage indisponible */
  }
}

/** Déconnecte le membre après 30 minutes sans activité. N'affiche rien. */
export function DeconnexionInactivite() {
  useEffect(() => {
    let deconnexionEnCours = false;
    let derniereEcriture = 0;

    async function verifier() {
      const derniere = lireDerniereActivite();
      if (derniere === null || deconnexionEnCours) return;
      if (Date.now() - derniere < DELAI_INACTIVITE) return;

      deconnexionEnCours = true;
      try {
        localStorage.removeItem(CLE_DERNIERE_ACTIVITE);
      } catch {
        /* stockage indisponible */
      }
      // scope "local" : déconnecte cet appareil seulement
      await createClient().auth.signOut({ scope: "local" });
      // Rechargement complet (vide la mémoire de l'espace membre) ;
      // replace : le bouton « Retour » ne ramène pas vers la page quittée.
      window.location.replace("/connexion?erreur=inactivite");
    }

    // Écrit au plus une fois toutes les 10 s (mousemove se déclenche sans arrêt).
    function surActivite() {
      const maintenant = Date.now();
      if (maintenant - derniereEcriture < 10_000) return;
      derniereEcriture = maintenant;
      noterActivite();
    }

    // Retour sur le site après une longue absence : on vérifie d'abord.
    verifier().then(() => {
      if (!deconnexionEnCours) noterActivite();
    });

    function surVisibilite() {
      if (document.visibilityState === "visible") verifier();
    }

    EVENEMENTS.forEach((e) => window.addEventListener(e, surActivite, { passive: true }));
    document.addEventListener("visibilitychange", surVisibilite);
    const intervalle = setInterval(verifier, INTERVALLE_VERIFICATION);

    return () => {
      EVENEMENTS.forEach((e) => window.removeEventListener(e, surActivite));
      document.removeEventListener("visibilitychange", surVisibilite);
      clearInterval(intervalle);
    };
  }, []);

  return null;
}