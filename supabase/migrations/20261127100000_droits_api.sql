-- =====================================================================
-- Droits d'accès explicites pour les membres connectés (rôle authenticated).
--
-- Les projets Supabase récents ne donnent plus aucun droit par défaut sur
-- les nouvelles tables et fonctions : sans ces GRANT, toute requête de
-- l'application échoue avec « permission denied ».
--
-- Les GRANT disent QUELLES opérations sont possibles ; les politiques RLS
-- (migration précédente) disent SUR QUELLES LIGNES.
-- ⚠️ Chaque future table devra avoir ses propres GRANT.
-- =====================================================================

grant usage on schema public to authenticated;

-- profiles : lecture ; modification limitée à certaines colonnes
grant select on public.profiles to authenticated;
grant update (
  prenom, genre, date_naissance, territoire, ville, situation, profession,
  niveau_etudes, langues, presentation, valeurs, a_enfants, souhait_enfants,
  delai_mariage, mobilite
) on public.profiles to authenticated;

-- profile_private : lecture ; seul le téléphone est modifiable
grant select on public.profile_private to authenticated;
grant update (telephone) on public.profile_private to authenticated;

-- criteria : lecture ; tout sauf user_id est modifiable
grant select on public.criteria to authenticated;
grant update (
  age_min, age_max, territoires, situations_acceptees, accepte_enfants, valeurs_importantes
) on public.criteria to authenticated;

-- consents : lecture et ajout (jamais de modification ni suppression)
grant select, insert on public.consents to authenticated;

-- blocks : lecture, blocage, déblocage
grant select, insert, delete on public.blocks to authenticated;

-- reports : lecture, signalement ; traitement limité à 3 colonnes
grant select on public.reports to authenticated;
grant insert (reported_id, motif, details) on public.reports to authenticated;
grant update (statut, traite_par, traite_le) on public.reports to authenticated;

-- Fonctions utilisées dans les politiques RLS
grant execute on function public.est_moderateur() to authenticated;
grant execute on function public.est_admin() to authenticated;
grant execute on function public.est_bloque(uuid, uuid) to authenticated;
grant execute on function public.peut_voir_profil(uuid, public.genre, public.statut_compte) to authenticated;
