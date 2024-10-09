import { judetDupaCod } from "~/data/coduriJudete";
import { roundDecimals } from "~/data/roundDecimals";
import { getUrlFromName } from "~/data/institutie/urlFromName";
import { getId } from "../../../../data/institutie/idFromName";

export type Liceu = {
  medieBac?: number;
  numCandidati: number;
  numCandidatiValizi?: number;
  numeLiceu: string;
  url?: string;
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
  boolean // urlContainsSiiir
];

export function liceuToDataArray(liceu: Liceu): LiceuDataArray {
  const cannonicalUrl = getUrlFromName(liceu.numeLiceu);
  const urlContainsSiiir =
    liceu.url != undefined && liceu.url !== cannonicalUrl;

  // Sanity check
  if (
    liceu.siiir &&
    liceu.url != cannonicalUrl &&
    liceu.url != `${cannonicalUrl}-${liceu.siiir}`
  ) {
    throw new Error(
      `Malformed url '${liceu.url}' for '${liceu.numeLiceu}', siiir='${liceu.siiir}'`
    );
  }

  return [
    liceu.numeLiceu,
    liceu.siiir,
    roundDecimals(liceu.medieBac, 3),
    liceu.numCandidati,
    liceu.rataPromovare,
    liceu.medieAdm,
    liceu.icon,
    urlContainsSiiir,
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
    urlContainsSiiir,
  ] = dataArray;

  const cannonicalUrl = getUrlFromName(numeLiceu);
  const url = siiir
    ? urlContainsSiiir
      ? cannonicalUrl + "-" + siiir
      : cannonicalUrl
    : undefined;

  return {
    medieBac,
    numCandidati,
    rataPromovare,
    numeLiceu,
    medieAdm,
    icon,
    url,
    siiir,
  };
}
