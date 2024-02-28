export type Ierarhie = { [judet: string]: number[] };

export type DateLicee = {
  [liceu: string]: {
    an: number;
    specializare: string;
    locuri: number;
    medie: number;
    pozitie: number;
  }[];
};
