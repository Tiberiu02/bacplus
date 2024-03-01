import { judetDupaCod } from "../coduriJudete";
import { query } from "../dbQuery";
import { getUrlFromName } from "./urlFromName";

const occurences = new Map<string, string>();

query.institutii.forEach((i) => {
  const nume = getUrlFromName(i.nume);
  const judet = judetDupaCod(i.id.split("_").at(-1) || "");
  const o = occurences.get(nume);
  if (o == undefined) {
    occurences.set(nume, judet.id);
  } else if (o != judet.id) {
    occurences.set(nume, "collision");
  }
});

const urlFromId = new Map<string, string>();
const idFromUrl = new Map<string, string>();

[...query.institutii]
  .sort((a, b) => (b.rank ?? 1e9) - (a.rank ?? 1e9))
  .forEach((i) => {
    const nume = getUrlFromName(i.nume);
    if (occurences.get(nume) != "collision") {
      if (idFromUrl.has(nume)) {
        fakeCollision(idFromUrl.get(nume) || "", i.id);
      }
      urlFromId.set(i.id, nume);
      idFromUrl.set(nume, i.id);
    } else {
      const judet = judetDupaCod(i.id.split("_").at(-1) || "");
      urlFromId.set(i.id, nume + "-" + judet.nume.toLowerCase());
      idFromUrl.set(nume + "-" + judet.nume.toLowerCase(), i.id);
    }
  });

export function getUrlFromId(id: string) {
  const url = urlFromId.get(id);
  if (!url) throw new Error("Instituția nu are ID URL: " + id);
  return url;
}

export function getIdFromUrl(url: string) {
  const id = idFromUrl.get(url);
  if (!id) throw new Error("Instituția nu are URL ID: " + url);
  return id;
}

function fakeCollision(correct: string, alternative: string) {
  if (correct.replace(/[AI]/g, "*") == alternative.replace(/[AI]/g, "*")) {
    if (
      (correct.match(/A/g) || []).length <
      (alternative.match(/A/g) || []).length
    ) {
      [correct, alternative] = [alternative, correct];
    }
  }
  console.log(alternative, correct);
}
