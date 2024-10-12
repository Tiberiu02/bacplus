export type Ierarhie = { [judet: string]: number[] };

export type DateLicee = {
  [liceu: string]: {
    nume: string;
    codJudet: string;
    rezultate: {
      an: number;
      specializare: string;
      locuri: number;
      medie: number;
      pozitie: number;
    }[];
  };
};
