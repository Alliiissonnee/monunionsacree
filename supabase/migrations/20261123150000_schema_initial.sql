-- =====================================================================
-- Mon Union Sacrée — schéma initial
-- Profils, critères, consentements, blocages, signalements.
-- (Photos, intérêts / matchs et messages : migrations suivantes.)
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Types énumérés
-- ---------------------------------------------------------------------
create type public.genre as enum ('femme', 'homme');
create type public.territoire as enum ('mayotte', 'reunion', 'autre');
create type public.situation_matrimoniale as enum ('celibataire', 'divorce', 'veuf');
create type public.statut_compte as enum ('en_attente', 'valide', 'suspendu', 'masque');
create type public.role_membre as enum ('membre', 'moderateur', 'admin');
create type public.souhait_enfants as enum ('oui', 'non', 'ouvert');
create type public.delai_mariage as enum ('moins_6_mois', '6_12_mois', '1_2_ans', 'plus_2_ans');
create type public.mobilite as enum ('meme_ville', 'meme_territoire', 'mayotte_reunion', 'partout');
create type public.motif_signalement as enum (
  'faux_profil', 'harcelement', 'comportement_inapproprie',
  'demande_argent', 'propos_deplaces', 'spam', 'autre'
);
create type public.statut_signalement as enum ('en_attente', 'en_cours', 'traite', 'rejete');


-- ---------------------------------------------------------------------
-- 2. Tables
-- ---------------------------------------------------------------------

-- Profil visible par les autres membres (selon les règles RLS plus bas).
create table public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  prenom           text not null check (char_length(prenom) between 1 and 50),
  genre            public.genre,
  date_naissance   date check (date_naissance <= current_date - interval '18 years'),
  territoire       public.territoire,
  ville            text check (char_length(ville) <= 80),
  situation        public.situation_matrimoniale,
  profession       text check (char_length(profession) <= 80),
  niveau_etudes    text check (char_length(niveau_etudes) <= 80),
  langues          text[] not null default '{}',
  presentation     text check (char_length(presentation) <= 2000),
  valeurs          text[] not null default '{}',
  a_enfants        boolean,
  souhait_enfants  public.souhait_enfants,
  delai_mariage    public.delai_mariage,
  mobilite         public.mobilite,
  statut           public.statut_compte not null default 'en_attente',
  role             public.role_membre not null default 'membre',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  -- Un profil ne peut être validé que s'il contient l'essentiel.
  constraint profil_valide_complet check (
    statut <> 'valide'
    or (genre is not null and date_naissance is not null and territoire is not null)
  )
);
comment on table public.profiles is 'Profil public d''un membre (visible selon RLS).';

-- Données privées : jamais visibles par les autres membres.
create table public.profile_private (
  id         uuid primary key references public.profiles (id) on delete cascade,
  telephone  text check (char_length(telephone) <= 20),
  updated_at timestamptz not null default now()
);
comment on table public.profile_private is 'Données privées : le membre et l''équipe uniquement.';

-- Critères de recherche (servent au calcul de compatibilité).
create table public.criteria (
  user_id               uuid primary key references public.profiles (id) on delete cascade,
  age_min               int not null default 18 check (age_min >= 18),
  age_max               int not null default 99 check (age_max <= 120),
  territoires           public.territoire[] not null default '{}',
  situations_acceptees  public.situation_matrimoniale[] not null default '{}',
  accepte_enfants       boolean,
  valeurs_importantes   text[] not null default '{}',
  updated_at            timestamptz not null default now(),
  constraint ages_coherents check (age_min <= age_max)
);

-- Historique des consentements (RGPD : preuve, date, version).
create table public.consents (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  type        text not null check (type in ('majeur', 'cgu', 'charte', 'donnees_sensibles')),
  version     text not null,
  accepte_le  timestamptz not null default now(),
  retire_le   timestamptz
);
create index consents_user_id_idx on public.consents (user_id);

-- Blocages : A bloque B.
create table public.blocks (
  blocker_id  uuid not null references public.profiles (id) on delete cascade,
  blocked_id  uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint pas_soi_meme check (blocker_id <> blocked_id)
);
create index blocks_blocked_id_idx on public.blocks (blocked_id);

-- Signalements.
create table public.reports (
  id           bigint generated always as identity primary key,
  reporter_id  uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  reported_id  uuid not null references public.profiles (id) on delete cascade,
  motif        public.motif_signalement not null,
  details      text check (char_length(details) <= 2000),
  statut       public.statut_signalement not null default 'en_attente',
  traite_par   uuid references public.profiles (id) on delete set null,
  traite_le    timestamptz,
  created_at   timestamptz not null default now(),
  constraint pas_soi_meme check (reporter_id <> reported_id)
);
create index reports_statut_idx on public.reports (statut);
create index reports_reported_id_idx on public.reports (reported_id);


-- ---------------------------------------------------------------------
-- 3. Fonctions utilitaires (security definer = contournent RLS,
--    donc search_path vide et noms qualifiés).
-- ---------------------------------------------------------------------

-- Le membre connecté est-il modérateur ou admin ?
create function public.est_moderateur()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('moderateur', 'admin')
  );
$$;

-- Le membre connecté est-il admin ?
create function public.est_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- Existe-t-il un blocage entre a et b (dans un sens ou dans l'autre) ?
create function public.est_bloque(a uuid, b uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.blocks
    where (blocker_id = a and blocked_id = b)
       or (blocker_id = b and blocked_id = a)
  );
$$;

-- Le membre connecté peut-il voir ce profil ?
-- Règle V1 : les deux profils sont validés, de sexe opposé, sans blocage.
create function public.peut_voir_profil(
  cible_id uuid, cible_genre public.genre, cible_statut public.statut_compte
)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select cible_statut = 'valide'
     and exists (
       select 1 from public.profiles moi
       where moi.id = (select auth.uid())
         and moi.statut = 'valide'
         and moi.genre is not null
         and moi.genre <> cible_genre
     )
     and not public.est_bloque((select auth.uid()), cible_id);
$$;

-- Met à jour updated_at automatiquement.
create function public.maj_updated_at()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.maj_updated_at();
create trigger profile_private_updated_at before update on public.profile_private
  for each row execute function public.maj_updated_at();
create trigger criteria_updated_at before update on public.criteria
  for each row execute function public.maj_updated_at();


-- ---------------------------------------------------------------------
-- 4. Création automatique du profil à l'inscription
--    (à partir des métadonnées envoyées par le formulaire d'inscription)
-- ---------------------------------------------------------------------
create function public.creer_profil_membre(u auth.users)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  meta jsonb := coalesce(u.raw_user_meta_data, '{}'::jsonb);
  c    jsonb := meta -> 'consentements';
  g    text  := meta ->> 'genre';
begin
  insert into public.profiles (id, prenom, genre)
  values (
    u.id,
    left(coalesce(nullif(trim(meta ->> 'prenom'), ''), 'Membre'), 50),
    case when g in ('femme', 'homme') then g::public.genre end
  )
  on conflict (id) do nothing;

  insert into public.profile_private (id) values (u.id) on conflict (id) do nothing;
  insert into public.criteria (user_id) values (u.id) on conflict (user_id) do nothing;

  if c is not null then
    insert into public.consents (user_id, type, version, accepte_le)
    select u.id, t.type, coalesce(c ->> 'version', 'inconnue'),
           coalesce((c ->> 'date')::timestamptz, now())
    from (values ('majeur'), ('cgu'), ('charte'), ('donnees_sensibles')) as t (type)
    where (c ->> case t.type when 'charte' then 'cgu' else t.type end)::boolean is true;
  end if;
end;
$$;

create function public.apres_inscription()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  perform public.creer_profil_membre(new);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.apres_inscription();

-- Rattrapage : comptes créés avant cette migration.
select public.creer_profil_membre(u) from auth.users u;


-- ---------------------------------------------------------------------
-- 5. Droits et Row Level Security
-- ---------------------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.profile_private enable row level security;
alter table public.criteria        enable row level security;
alter table public.consents        enable row level security;
alter table public.blocks          enable row level security;
alter table public.reports         enable row level security;

-- Aucun accès pour les visiteurs non connectés.
revoke all on public.profiles, public.profile_private, public.criteria,
              public.consents, public.blocks, public.reports
  from anon;

-- Fonctions internes : non appelables depuis l'API.
revoke execute on function public.creer_profil_membre(auth.users) from public, anon, authenticated;
revoke execute on function public.apres_inscription() from public, anon, authenticated;
revoke execute on function public.est_bloque(uuid, uuid) from public, anon;
revoke execute on function public.est_moderateur() from public, anon;
revoke execute on function public.est_admin() from public, anon;
revoke execute on function public.peut_voir_profil(uuid, public.genre, public.statut_compte) from public, anon;

-- profiles ------------------------------------------------------------
-- Le membre ne peut modifier QUE ces colonnes (pas statut, role, id…).
revoke insert, update, delete on public.profiles from authenticated;
grant update (
  prenom, genre, date_naissance, territoire, ville, situation, profession,
  niveau_etudes, langues, presentation, valeurs, a_enfants, souhait_enfants,
  delai_mariage, mobilite
) on public.profiles to authenticated;

create policy "profiles : lecture"
  on public.profiles for select to authenticated
  using (
    id = (select auth.uid())
    or (select public.est_moderateur())
    or public.peut_voir_profil(id, genre, statut)
  );

create policy "profiles : modification de son profil"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- profile_private -----------------------------------------------------
revoke insert, delete on public.profile_private from authenticated;

create policy "profile_private : lecture"
  on public.profile_private for select to authenticated
  using (id = (select auth.uid()) or (select public.est_admin()));

create policy "profile_private : modification"
  on public.profile_private for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- criteria ------------------------------------------------------------
revoke insert, delete on public.criteria from authenticated;

create policy "criteria : lecture"
  on public.criteria for select to authenticated
  using (user_id = (select auth.uid()));

create policy "criteria : modification"
  on public.criteria for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- consents ------------------------------------------------------------
-- Ajout et lecture de ses propres consentements ; pas de modification
-- directe (le retrait passera par une fonction dédiée).
revoke update, delete on public.consents from authenticated;

create policy "consents : lecture"
  on public.consents for select to authenticated
  using (user_id = (select auth.uid()) or (select public.est_admin()));

create policy "consents : ajout"
  on public.consents for insert to authenticated
  with check (user_id = (select auth.uid()));

-- blocks --------------------------------------------------------------
revoke update on public.blocks from authenticated;

create policy "blocks : lecture de mes blocages"
  on public.blocks for select to authenticated
  using (blocker_id = (select auth.uid()));

create policy "blocks : bloquer"
  on public.blocks for insert to authenticated
  with check (blocker_id = (select auth.uid()));

create policy "blocks : débloquer"
  on public.blocks for delete to authenticated
  using (blocker_id = (select auth.uid()));

-- reports -------------------------------------------------------------
revoke delete on public.reports from authenticated;
revoke update on public.reports from authenticated;
grant update (statut, traite_par, traite_le) on public.reports to authenticated;

create policy "reports : lecture"
  on public.reports for select to authenticated
  using (reporter_id = (select auth.uid()) or (select public.est_moderateur()));

create policy "reports : signaler"
  on public.reports for insert to authenticated
  with check (
    reporter_id = (select auth.uid())
    and statut = 'en_attente'
    and traite_par is null
    and traite_le is null
  );

create policy "reports : traitement par la modération"
  on public.reports for update to authenticated
  using ((select public.est_moderateur()))
  with check ((select public.est_moderateur()));
