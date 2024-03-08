import { unidecode } from "../unidecode";

/** This is an auxiliary function. Do not use to get the url of an institution. Only use getUrlFromId. */
export function getUrlFromName(name: string) {
  return unidecode(name)
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .trim()
    .replace(/ +/g, "-");
}
