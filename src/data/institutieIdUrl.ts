import { judetDupaCod } from "./coduriJudete";
import { query } from "./dbQuery";

function getUrlName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .trim()
    .replace(/ +/g, "-");
}

const occurences = new Map<string, number>();

query.institutii.forEach((i) => {
  const nume = getUrlName(i.nume);
  occurences.set(nume, (occurences.get(nume) ?? 0) + 1);
});

const urlNames = new Map<string, string>();

query.institutii.forEach((i) => {
  const nume = getUrlName(i.nume);
  if (occurences.get(nume) == 1) {
    urlNames.set(i.id, nume);
  } else {
    const judet = judetDupaCod(i.id.split("_").at(-1) || "");
    urlNames.set(i.id, nume + "-" + judet.nume.toLowerCase());
  }
});

export function institutieIdUrl(id: string) {
  const idUrl = urlNames.get(id);
  if (!idUrl) throw new Error("Instituția nu are ID URL: " + id);
  return idUrl;
}
