import { judetDupaCod } from "../coduriJudete";
import { query } from "../dbQuery";
import { getUrlFromName } from "./urlFromName";

const occurences = new Map<string, string>();

query.institutii.forEach((i) => {
  const url = getUrlFromName(i.nume);
  const schoolId = i.cod_siiir;
  const o = occurences.get(url);
  if (!schoolId) return;
  if (o == undefined) {
    occurences.set(url, schoolId);
  } else if (o != schoolId) {
    occurences.set(url, "collision");
  }
});

const urlFromId = new Map<string, string>();
const idFromUrl = new Map<string, string>();

[...query.institutii]
  .sort((a, b) => (b.rank ?? 1e9) - (a.rank ?? 1e9))
  .forEach((i) => {
    const url = getUrlFromName(i.nume);
    const id = i.cod_siiir;
    if (!id) return;
    if (occurences.get(url) != "collision") {
      if (idFromUrl.has(url)) {
        registerFakeCollision(idFromUrl.get(url) || "", id);
      }
      urlFromId.set(id, url);
      idFromUrl.set(url, id);
    } else {
      const newUrl = `${url}-${id}`;
      urlFromId.set(id, newUrl);
      idFromUrl.set(newUrl, id);
    }
  });

export function getUrlFromId(id: string) {
  const url = urlFromId.get(id);
  if (!url) {
    console.log("Instituția nu are ID URL: " + id);
    return undefined;
  }
  if (!url) throw new Error("Instituția nu are ID URL: " + id);
  return url;
}

export function getIdFromUrl(url: string) {
  const id = idFromUrl.get(url);
  if (!id) {
    console.log("Instituția nu are URL ID: " + url);
    return undefined;
  }
  if (!id) throw new Error("Instituția nu are URL ID: " + url);
  return id;
}

function registerFakeCollision(correct: string, alternative: string) {
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
