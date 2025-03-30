import {
  type CompressedUrlData,
  getCompressedUrlData,
  getUrlFromCompressedData,
} from "~/data/institutie/compressedUrl";
import { roundDecimals } from "../../../../data/roundDecimals";

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
  CompressedUrlData, // url
  boolean // liceu
];

export function scoalaToDataArray(scoala: Scoala): ScoalaDataArray {
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
    getCompressedUrlData(scoala.url, scoala.numeScoala, scoala.siiir),
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
    compressedUrlData,
    liceu,
  ] = dataArray;

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
    url: getUrlFromCompressedData(numeScoala, siiir, compressedUrlData),
    liceu,
  };
}
