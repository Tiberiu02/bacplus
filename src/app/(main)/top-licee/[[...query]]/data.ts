import { roundDecimals } from "~/data/roundDecimals";
import {
  type CompressedUrlData,
  getCompressedUrlData,
  getUrlFromCompressedData,
} from "~/data/institutie/compressedUrl";

export type Liceu = {
  medieBac?: number;
  numCandidati: number;
  numCandidatiValizi?: number;
  numeLiceu: string;
  urlId?: string;
  rataPromovare: number;
  medieAdm?: number;
  icon: boolean;
  siiir?: string;
};

export type LiceuDataArray = [
  string, // numeLiceu
  string | undefined, // siiir
  number | undefined, // medieBac
  number, // numCandidati
  number, // rataPromovare
  number | undefined, // medieAdm
  boolean, // icon
  CompressedUrlData // compressedUrlData
];

export function liceuToDataArray(liceu: Liceu): LiceuDataArray {
  return [
    liceu.numeLiceu,
    liceu.siiir,
    roundDecimals(liceu.medieBac, 3),
    liceu.numCandidati,
    liceu.rataPromovare,
    liceu.medieAdm,
    liceu.icon,
    getCompressedUrlData(liceu.urlId, liceu.numeLiceu, liceu.siiir),
  ];
}

export function liceuFromDataArray(dataArray: LiceuDataArray): Liceu {
  const [
    numeLiceu,
    siiir,
    medieBac,
    numCandidati,
    rataPromovare,
    medieAdm,
    icon,
    compressedUrlData,
  ] = dataArray;

  return {
    medieBac,
    numCandidati,
    rataPromovare,
    numeLiceu,
    medieAdm,
    icon,
    urlId: getUrlFromCompressedData(numeLiceu, siiir, compressedUrlData),
    siiir,
  };
}
