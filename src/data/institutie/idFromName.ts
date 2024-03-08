import { unidecode } from "../unidecode";

export function getId(nume: string, codJudet: string) {
  return (
    unidecode(nume)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, " ")
      .trim()
      .replace(/ +/g, "_") +
    "_" +
    codJudet
  );
}
