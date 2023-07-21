export type Liceu = {
  id: string;
  medieBac: number | null;
  numCandidati: number;
  numPromovati: number;
  numeLiceu: string;
  rataPromovare: number;
  codJudet?: string;
};

const schema: (keyof Liceu)[] = [
  "id",
  "medieBac",
  "numCandidati",
  "rataPromovare",
  "numeLiceu",
  "codJudet",
];

export function compressLicee(data: Liceu[]): any[][] {
  return data.map((liceu) => schema.map((key) => liceu[key]));
}

export function decompressLicee(data: any[][]): Liceu[] {
  return data.map((liceu) => {
    const obj = {} as any;
    schema.forEach((key, index) => {
      obj[key] = liceu[index];
    });
    return obj;
  });
}
