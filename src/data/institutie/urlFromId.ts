import { judetDupaCod } from "../coduriJudete";
import { query } from "../dbQuery";
import { getUrlFromName } from "./urlFromName";

const occurences = new Map<string, number>();
const occurencesWithCounty = new Map<string, number>();

query.institutii.forEach((i) => {
  const url = getUrlFromName(i.nume);
  const judet = judetDupaCod(i.cod_judet);
  const urlWithCounty = url + "-" + judet.nume.toLowerCase();
  const schoolId = i.cod_siiir;
  if (!schoolId) return;
  occurences.set(url, (occurences.get(url) || 0) + 1);
  occurencesWithCounty.set(
    urlWithCounty,
    (occurencesWithCounty.get(urlWithCounty) || 0) + 1
  );
});

const urlFromId = new Map<string, string>();
const urlTypeFromId = new Map<string, "basic" | "judet" | "siiir">();
const idFromUrl = new Map<string, string>();

[...query.institutii].forEach((i) => {
  const url = getUrlFromName(i.nume);
  const judet = judetDupaCod(i.cod_judet);
  const urlWithCounty = url + "-" + judet.nume.toLowerCase();
  const id = i.cod_siiir;
  if (!id) return;
  if (occurences.get(url) == 1) {
    urlFromId.set(id, url);
    idFromUrl.set(url, id);
    urlTypeFromId.set(id, "basic");
  } else if (occurencesWithCounty.get(urlWithCounty) == 1) {
    urlFromId.set(id, urlWithCounty);
    idFromUrl.set(urlWithCounty, id);
    urlTypeFromId.set(id, "judet");
  } else {
    const newUrl = `${url}-${id}`;
    urlFromId.set(id, newUrl);
    idFromUrl.set(newUrl, id);
    urlTypeFromId.set(id, "siiir");
    // console.log("Collision: " + newUrl);
  }
});

export function getUrlFromId(id: string) {
  const url = urlFromId.get(id);
  if (!url) throw new Error("Instituția nu are ID URL: " + id);
  return url;
}

export function getIdFromUrl(url: string) {
  const id = idFromUrl.get(url);
  if (!id) {
    console.log("Instituția nu are URL ID: " + url);
    return undefined;
  }
  return id;
}
