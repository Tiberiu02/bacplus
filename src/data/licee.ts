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
  string, // id
  number | undefined, // medieBac
  number, // numCandidati
  number, // rataPromovare
  string, // numeLiceu
  string, // codJudet
  number | undefined // medieAdm
];

export function liceuToDataArray(liceu: Liceu): LiceuDataArray {
  return [
    liceu.id,
    liceu.medieBac,
    liceu.numCandidati,
    liceu.rataPromovare,
    liceu.numeLiceu,
    liceu.codJudet,
    liceu.medieAdm,
  ];
}

export function liceuFromDataArray(dataArray: LiceuDataArray): Liceu {
  return {
    id: dataArray[0],
    medieBac: dataArray[1],
    numCandidati: dataArray[2],
    rataPromovare: dataArray[3],
    numeLiceu: dataArray[4],
    codJudet: dataArray[5],
    medieAdm: dataArray[6],
  };
}
