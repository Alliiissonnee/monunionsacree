import type { Option } from "@/lib/profil/options";

const styleCase =
  "flex cursor-pointer items-center gap-2 rounded border border-bleu-gris bg-white px-3 py-2.5 text-sm " +
  "has-[:checked]:border-terracotta has-[:checked]:bg-terracotta/10 has-[:checked]:text-terracotta " +
  "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-terracotta/30";

type BaseProps = {
  legende: string;
  name: string;
  options: Option[];
  aide?: string;
  colonnes?: 1 | 2 | 3;
};

const grilles = { 1: "grid-cols-1", 2: "grid-cols-1 sm:grid-cols-2", 3: "grid-cols-2 sm:grid-cols-3" };

/** Boutons radio (un seul choix). */
export function ChoixUnique({
  legende, name, options, aide, colonnes = 2, valeur, requis,
}: BaseProps & { valeur?: string | null; requis?: boolean }) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-semibold">{legende}</legend>
      {aide && <p className="-mt-1 mb-1 text-xs opacity-75">{aide}</p>}
      <div className={`grid gap-2 ${grilles[colonnes]}`}>
        {options.map((o) => (
          <label key={o.valeur} className={styleCase}>
            <input
              type="radio"
              name={name}
              value={o.valeur}
              defaultChecked={valeur === o.valeur}
              required={requis}
              className="accent-terracotta"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Cases à cocher (plusieurs choix). */
export function ChoixMultiple({
  legende, name, options, aide, colonnes = 3, valeurs = [],
}: BaseProps & { valeurs?: string[] }) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-semibold">{legende}</legend>
      {aide && <p className="-mt-1 mb-1 text-xs opacity-75">{aide}</p>}
      <div className={`grid gap-2 ${grilles[colonnes]}`}>
        {options.map((o) => (
          <label key={o.valeur} className={styleCase}>
            <input
              type="checkbox"
              name={name}
              value={o.valeur}
              defaultChecked={valeurs.includes(o.valeur)}
              className="accent-terracotta"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Liste déroulante. */
export function Liste({
  label, name, options, valeur, requis,
}: { label: string; name: string; options: Option[]; valeur?: string | null; requis?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-semibold">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={valeur ?? ""}
        required={requis}
        className="rounded border border-bleu-gris bg-white px-3 py-2.5 outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
      >
        <option value="">— Choisir —</option>
        {options.map((o) => (
          <option key={o.valeur} value={o.valeur}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
