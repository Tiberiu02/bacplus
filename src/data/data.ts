export type Liceu = {
  id: string;
  medieBac?: number;
  numCandidati: number;
  numCandidatiValizi?: number;
  numeLiceu: string;
  rataPromovare: number;
  codJudet: string;
  medieAdm?: number;
};

export type LiceuDataArray = [
  number | undefined, // medieBac
  number, // numCandidati
  number, // rataPromovare
  string, // numeLiceu
  string, // codJudet
  number | undefined // medieAdm
];

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
};

export type ScoalaDataArray = [
  string, // numeScoala
  string, // codJudet
  number, // numarCandidati
  number | undefined, // medieLimbaRomana
  number | undefined, // medieLimbaMaterna
  number | undefined, // medieMatematica
  number | undefined, // medieAbsolvire
  number | undefined // medieEvaluareNationala
];

export type Judet = {
  id: string;
  nume: string;
  numeIntreg: string;
  medieBac?: number;
  numCandidatiBac: number;
  numCandidatiValiziBac: number;
  rataPromovareBac: number;
  medieEn?: number;
  numCandidatiEn?: number;
};

function getId(numeLiceu: string, codJudet: string) {
  return (
    numeLiceu
      .normalize("NFD")
      .toUpperCase()
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Z0-9]/g, " ")
      .trim()
      .replace(/ +/g, "_") +
    "_" +
    codJudet
  );
}

function round(num: number | undefined, decimals: number) {
  if (!num) return undefined;

  const p10 = 10 ** decimals;
  return Math.round(num * p10) / p10;
}

export function liceuToDataArray(liceu: Liceu): LiceuDataArray {
  return [
    liceu.medieBac ? round(liceu.medieBac, 3) : undefined,
    liceu.numCandidati,
    liceu.rataPromovare,
    liceu.numeLiceu,
    liceu.codJudet,
    liceu.medieAdm,
  ];
}

export function liceuFromDataArray(dataArray: LiceuDataArray): Liceu {
  return {
    id: getId(dataArray[3], dataArray[4]),
    medieBac: dataArray[0],
    numCandidati: dataArray[1],
    rataPromovare: dataArray[2],
    numeLiceu: dataArray[3],
    codJudet: dataArray[4],
    medieAdm: dataArray[5],
  };
}

export function scoalaToDataArray(scoala: Scoala): ScoalaDataArray {
  return [
    scoala.numeScoala,
    scoala.codJudet,
    scoala.numCandidati,
    round(scoala.medieLimbaRomana, 3),
    round(scoala.medieLimbaMaterna, 3),
    round(scoala.medieMatematica, 3),
    round(scoala.medieAbsolvire, 3),
    round(scoala.medieEvaluareNationala, 3),
  ];
}

export function scoalaFromDataArray(dataArray: ScoalaDataArray): Scoala {
  return {
    id: getId(dataArray[0], dataArray[1]),
    numeScoala: dataArray[0],
    codJudet: dataArray[1],
    numCandidati: dataArray[2],
    medieLimbaRomana: dataArray[3],
    medieLimbaMaterna: dataArray[4],
    medieMatematica: dataArray[5],
    medieAbsolvire: dataArray[6],
    medieEvaluareNationala: dataArray[7],
  };
}