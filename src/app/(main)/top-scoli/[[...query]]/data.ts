import { roundDecimals } from "../../../../data/roundDecimals";
import { getUrlFromName } from "~/data/institutie/urlFromName";

export type Scoala = {
  numeScoala: string;
  numCandidati: number;
  medieLimbaRomana?: number;
  medieLimbaMaterna?: number;
  medieMatematica?: number;
  medieAbsolvire?: number;
  medieEvaluareNationala?: number;
  icon: boolean;
  url?: string;
  liceu: boolean;
  siiir?: string;
};

export type ScoalaDataArray = [
  string, // numeScoala
  string | undefined, // siiir
  number, // numarCandidati
  number | undefined, // medieLimbaRomana
  number | undefined, // medieLimbaMaterna
  number | undefined, // medieMatematica
  number | undefined, // medieAbsolvire
  number | undefined, // medieEvaluareNationala
  boolean, // icon
  boolean, // hasUrl
  boolean, // urlContainsSiiir
  boolean // liceu
];

export function scoalaToDataArray(scoala: Scoala): ScoalaDataArray {
  const cannonicalUrl = getUrlFromName(scoala.numeScoala);
  const urlContainsSiiir =
    scoala.url != undefined && scoala.url !== cannonicalUrl;

  // Sanity check
  if (
    scoala.url &&
    scoala.url != cannonicalUrl &&
    scoala.url != `${cannonicalUrl}-${scoala.siiir}`
  ) {
    throw new Error(
      `Malformed url '${scoala.url}' for '${scoala.numeScoala}', siiir='${scoala.siiir}'`
    );
  }

  return [
    scoala.numeScoala,
    scoala.siiir,
    scoala.numCandidati,
    roundDecimals(scoala.medieLimbaRomana, 3),
    roundDecimals(scoala.medieLimbaMaterna, 3),
    roundDecimals(scoala.medieMatematica, 3),
    roundDecimals(scoala.medieAbsolvire, 3),
    roundDecimals(scoala.medieEvaluareNationala, 3),
    scoala.icon,
    scoala.url != undefined,
    urlContainsSiiir,
    scoala.liceu,
  ];
}

export function scoalaFromDataArray(dataArray: ScoalaDataArray): Scoala {
  const [
    numeScoala,
    siiir,
    numCandidati,
    medieLimbaRomana,
    medieLimbaMaterna,
    medieMatematica,
    medieAbsolvire,
    medieEvaluareNationala,
    icon,
    hasUrl,
    urlContainsSiiir,
    liceu,
  ] = dataArray;

  const cannonicalUrl = getUrlFromName(numeScoala);
  const url =
    siiir && hasUrl
      ? urlContainsSiiir
        ? cannonicalUrl + "-" + siiir
        : cannonicalUrl
      : undefined;

  return {
    numeScoala,
    siiir,
    numCandidati,
    medieLimbaRomana,
    medieLimbaMaterna,
    medieMatematica,
    medieAbsolvire,
    medieEvaluareNationala,
    icon,
    url,
    liceu,
  };
}
