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

export function liceuToDataArray(liceu: Liceu): LiceuDataArray {
  return [
    liceu.medieBac ? Math.round(liceu.medieBac * 1000) / 1000 : undefined,
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
