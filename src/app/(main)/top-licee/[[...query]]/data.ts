import { judetDupaCod } from "~/data/coduriJudete";
import { roundDecimals } from "~/data/roundDecimals";
import { getUrlFromName } from "~/data/institutie/urlFromName";
import { getId } from "../../../../data/institutie/idFromName";

export type Liceu = {
  id: string;
  medieBac?: number;
  numCandidati: number;
  numCandidatiValizi?: number;
  numeLiceu: string;
  url: string;
  rataPromovare: number;
  codJudet: string;
  medieAdm?: number;
  icon: boolean;
};

export type LiceuDataArray = [
  number | undefined, // medieBac
  number, // numCandidati
  number, // rataPromovare
  string, // numeLiceu
  string, // codJudet
  // codJudet
  number | undefined, // medieAdm
  // medieAdm
  string | undefined, // idLiceu
  boolean, // icon
  boolean // url contains judet
];

export function liceuToDataArray(liceu: Liceu): LiceuDataArray {
  const idSintetic = getId(liceu.numeLiceu, liceu.codJudet);

  const urlContainsJudet = liceu.url !== getUrlFromName(liceu.numeLiceu);

  return [
    liceu.medieBac ? roundDecimals(liceu.medieBac, 3) : undefined,
    liceu.numCandidati,
    liceu.rataPromovare,
    liceu.numeLiceu,
    liceu.codJudet,
    liceu.medieAdm,
    idSintetic == liceu.id ? undefined : liceu.id,
    liceu.icon,
    urlContainsJudet,
  ];
}

export function liceuFromDataArray(dataArray: LiceuDataArray): Liceu {
  const judet = judetDupaCod(dataArray[4]);
  const url = dataArray[8]
    ? getUrlFromName(dataArray[3]) + "-" + judet.nume.toLowerCase()
    : getUrlFromName(dataArray[3]);

  return {
    id: dataArray[6] ?? getId(dataArray[3], dataArray[4]),
    medieBac: dataArray[0],
    numCandidati: dataArray[1],
    rataPromovare: dataArray[2],
    numeLiceu: dataArray[3],
    codJudet: dataArray[4],
    medieAdm: dataArray[5],
    icon: dataArray[7],
    url,
  };
}
