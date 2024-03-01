import { getId } from "~/data/institutie/idFromName";
import { roundDecimals } from "../../../../data/roundDecimals";
import { getUrlFromName } from "~/data/institutie/urlFromName";
import { judetDupaCod } from "~/data/coduriJudete";

export type Scoala = {
  id: string;
  numeScoala: string;
  codJudet: string;
  numCandidati: number;
  medieLimbaRomana?: number;
  medieLimbaMaterna?: number;
  medieMatematica?: number;
  medieAbsolvire?: number;
  medieEvaluareNationala?: number;
  icon: boolean;
  url: string;
  liceu: boolean;
};

export type ScoalaDataArray = [
  string, // numeScoala
  string, // codJudet
  number, // numarCandidati
  number | undefined, // medieLimbaRomana
  number | undefined, // medieLimbaMaterna
  number | undefined, // medieMatematica
  number | undefined, // medieAbsolvire
  number | undefined, // medieEvaluareNationala
  string | undefined, // idScoala
  boolean, // icon
  boolean, // url contains judet
  boolean // liceu
];

export function scoalaToDataArray(scoala: Scoala): ScoalaDataArray {
  const idSintetic = getId(scoala.numeScoala, scoala.codJudet);

  return [
    scoala.numeScoala,
    scoala.codJudet,
    scoala.numCandidati,
    roundDecimals(scoala.medieLimbaRomana, 3),
    roundDecimals(scoala.medieLimbaMaterna, 3),
    roundDecimals(scoala.medieMatematica, 3),
    roundDecimals(scoala.medieAbsolvire, 3),
    roundDecimals(scoala.medieEvaluareNationala, 3),
    idSintetic == scoala.id ? undefined : scoala.id,
    scoala.icon,
    scoala.url !== getUrlFromName(scoala.numeScoala),
    scoala.liceu,
  ];
}

export function scoalaFromDataArray(dataArray: ScoalaDataArray): Scoala {
  const judet = judetDupaCod(dataArray[1]);
  const url = dataArray[10]
    ? getUrlFromName(dataArray[0]) + "-" + judet.nume.toLowerCase()
    : getUrlFromName(dataArray[0]);

  return {
    id: dataArray[8] ?? getId(dataArray[0], dataArray[1]),
    numeScoala: dataArray[0],
    codJudet: dataArray[1],
    numCandidati: dataArray[2],
    medieLimbaRomana: dataArray[3],
    medieLimbaMaterna: dataArray[4],
    medieMatematica: dataArray[5],
    medieAbsolvire: dataArray[6],
    medieEvaluareNationala: dataArray[7],
    icon: dataArray[9],
    url,
    liceu: dataArray[11],
  };
}
