"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  enregistrerInformations,
  enregistrerPresentation,
  enregistrerProjet,
  enregistrerRecherche,
  type EtatProfil,
} from "@/app/actions/profil";
import { ChoixMultiple, ChoixUnique, Liste } from "@/components/ui/Choix";
import { BoutonPrincipal, Champ, MessageErreur } from "@/components/ui/Champ";
import type { Tables } from "@/lib/supabase/database.types";
import {
  DELAIS_MARIAGE,
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
} from "@/lib/profil/options";

type Profil = Tables<"profiles">;
type Criteres = Tables<"criteria">;

// Après une erreur, on réaffiche ce que la personne avait saisi ;
// sinon, ce qui est enregistré en base.
function lecteur(etat: EtatProfil) {
  return {
    un(nom: string, defaut: string | null | undefined) {
      if (!etat.valeurs) return defaut ?? "";
      const v = etat.valeurs[nom];
      return Array.isArray(v) ? v[0] : (v ?? "");
    },
    plusieurs(nom: string, defaut: string[]) {
      if (!etat.valeurs) return defaut;
      const v = etat.valeurs[nom];
      return v === undefined ? [] : Array.isArray(v) ? v : [v];
    },
  };
}

const ouiNon = (b: boolean | null) => (b === null ? null : b ? "oui" : "non");

function Pied({ etapePrecedente, enCours, dernier }: { etapePrecedente?: number; enCours: boolean; dernier?: boolean }) {
  return (
    <div className="flex flex-col-reverse items-center gap-3 pt-2 sm:flex-row sm:justify-between">
      {etapePrecedente ? (
        <Link href={`/espace/profil?etape=${etapePrecedente}`} className="text-sm font-semibold underline">
          ← Étape précédente
        </Link>
      ) : (
        <span />
      )}
      <div className="w-full sm:w-auto sm:min-w-64">
        <BoutonPrincipal enCours={enCours}>
          {dernier ? "Enregistrer mon profil" : "Enregistrer et continuer"}
        </BoutonPrincipal>
      </div>
    </div>
  );
}

// --- Étape 1 -----------------------------------------------------------------

export function EtapeInformations({ profil }: { profil: Profil }) {
  const [etat, action, enCours] = useActionState(enregistrerInformations, {});
  const v = lecteur(etat);

  const max = new Date();
  max.setFullYear(max.getFullYear() - 18);
  const dateMax = max.toISOString().slice(0, 10);

  return (
    <form action={action} className="flex flex-col gap-5">
      <MessageErreur message={etat.erreur} />
      <Champ
        label="Date de naissance"
        name="date_naissance"
        type="date"
        required
        max={dateMax}
        defaultValue={v.un("date_naissance", profil.date_naissance)}
      />
      <ChoixUnique legende="Territoire" name="territoire" options={TERRITOIRES} colonnes={3} requis valeur={v.un("territoire", profil.territoire)} />
      <Champ label="Ville" name="ville" required maxLength={80} placeholder="ex. Mamoudzou, Saint-Denis…" defaultValue={v.un("ville", profil.ville)} />
      <ChoixUnique legende="Situation matrimoniale" name="situation" options={SITUATIONS} colonnes={3} requis valeur={v.un("situation", profil.situation)} />
      <Champ label="Profession" name="profession" maxLength={80} defaultValue={v.un("profession", profil.profession)} />
      <Liste label="Niveau d'études" name="niveau_etudes" options={NIVEAUX_ETUDES} valeur={v.un("niveau_etudes", profil.niveau_etudes)} />
      <ChoixMultiple legende="Langues parlées" name="langues" options={LANGUES} valeurs={v.plusieurs("langues", profil.langues)} />
      <Pied enCours={enCours} />
    </form>
  );
}

// --- Étape 2 -----------------------------------------------------------------

export function EtapeProjet({ profil }: { profil: Profil }) {
  const [etat, action, enCours] = useActionState(enregistrerProjet, {});
  const v = lecteur(etat);

  return (
    <form action={action} className="flex flex-col gap-5">
      <MessageErreur message={etat.erreur} />
      <ChoixUnique
        legende="Avez-vous des enfants ?"
        name="a_enfants"
        options={[{ valeur: "oui", label: "Oui" }, { valeur: "non", label: "Non" }]}
        requis
        valeur={v.un("a_enfants", ouiNon(profil.a_enfants))}
      />
      <ChoixUnique legende="Souhait d'enfants" name="souhait_enfants" options={SOUHAITS_ENFANTS} colonnes={1} requis valeur={v.un("souhait_enfants", profil.souhait_enfants)} />
      <ChoixUnique legende="Quand envisagez-vous de vous marier ?" name="delai_mariage" options={DELAIS_MARIAGE} requis valeur={v.un("delai_mariage", profil.delai_mariage)} />
      <ChoixUnique legende="Après le mariage, je souhaite vivre…" name="mobilite" options={MOBILITES} requis valeur={v.un("mobilite", profil.mobilite)} />
      <Pied etapePrecedente={1} enCours={enCours} />
    </form>
  );
}

// --- Étape 3 -----------------------------------------------------------------

export function EtapePresentation({ profil }: { profil: Profil }) {
  const [etat, action, enCours] = useActionState(enregistrerPresentation, {});
  const v = lecteur(etat);
  const [longueur, setLongueur] = useState(v.un("presentation", profil.presentation).length);

  return (
    <form action={action} className="flex flex-col gap-5">
      <MessageErreur message={etat.erreur} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="presentation" className="text-sm font-semibold">
          Quelques mots sur moi
        </label>
        <p className="text-xs opacity-75">
          Votre caractère, ce qui compte pour vous, le foyer que vous souhaitez construire…
        </p>
        <textarea
          id="presentation"
          name="presentation"
          rows={7}
          required
          minLength={MIN_PRESENTATION}
          maxLength={MAX_PRESENTATION}
          defaultValue={v.un("presentation", profil.presentation)}
          onChange={(e) => setLongueur(e.target.value.length)}
          placeholder="Je suis une personne calme, sociable et attachée à ma famille…"
          className="rounded border border-bleu-gris bg-white px-3 py-2.5 leading-relaxed outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
        />
        <p className={`text-right text-xs ${longueur < MIN_PRESENTATION ? "text-terracotta" : "opacity-75"}`}>
          {longueur} / {MAX_PRESENTATION}
          {longueur < MIN_PRESENTATION && ` (minimum ${MIN_PRESENTATION})`}
        </p>
      </div>
      <ChoixMultiple
        legende="Mes valeurs"
        name="valeurs"
        aide={`Choisissez jusqu'à ${MAX_VALEURS} valeurs qui vous ressemblent.`}
        options={VALEURS}
        valeurs={v.plusieurs("valeurs", profil.valeurs)}
      />
      <Pied etapePrecedente={2} enCours={enCours} />
    </form>
  );
}

// --- Étape 4 -----------------------------------------------------------------

export function EtapeRecherche({ criteres }: { criteres: Criteres }) {
  const [etat, action, enCours] = useActionState(enregistrerRecherche, {});
  const v = lecteur(etat);

  return (
    <form action={action} className="flex flex-col gap-5">
      <MessageErreur message={etat.erreur} />
      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-sm font-semibold">Âge recherché</legend>
        <div className="grid grid-cols-2 gap-3">
          <Champ label="De" name="age_min" type="number" min={18} max={99} required defaultValue={v.un("age_min", String(criteres.age_min))} />
          <Champ label="À" name="age_max" type="number" min={18} max={99} required defaultValue={v.un("age_max", String(criteres.age_max))} />
        </div>
      </fieldset>
      <ChoixMultiple legende="Territoires" name="territoires" options={TERRITOIRES} valeurs={v.plusieurs("territoires", criteres.territoires)} />
      <ChoixMultiple legende="Situations acceptées" name="situations_acceptees" options={SITUATIONS} valeurs={v.plusieurs("situations_acceptees", criteres.situations_acceptees)} />
      <ChoixUnique
        legende="La personne peut-elle déjà avoir des enfants ?"
        name="accepte_enfants"
        options={[
          { valeur: "oui", label: "Oui" },
          { valeur: "non", label: "Non" },
          { valeur: "indifferent", label: "Peu importe" },
        ]}
        colonnes={3}
        valeur={v.un("accepte_enfants", ouiNon(criteres.accepte_enfants) ?? "indifferent")}
      />
      <Pied etapePrecedente={3} enCours={enCours} dernier />
    </form>
  );
}
