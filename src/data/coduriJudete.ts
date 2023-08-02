type Judet = {
  id: string;
  nume: string;
  numeIntreg: string;
};

export const JUDETE = [
  {
    id: "AB",
    nume: "ALBA",
    numeIntreg: "Alba",
  },
  {
    id: "AG",
    nume: "ARGES",
    numeIntreg: "Argeș",
  },
  {
    id: "AR",
    nume: "ARAD",
    numeIntreg: "Arad",
  },
  {
    id: "B",
    nume: "BUCURESTI",
    numeIntreg: "București",
  },
  {
    id: "BC",
    nume: "BACAU",
    numeIntreg: "Bacău",
  },
  {
    id: "BH",
    nume: "BIHOR",
    numeIntreg: "Bihor",
  },
  {
    id: "BN",
    nume: "BISTRITA",
    numeIntreg: "Bistrița-Năsăud",
  },
  {
    id: "BR",
    nume: "BRAILA",
    numeIntreg: "Brăila",
  },
  {
    id: "BT",
    nume: "BOTOSANI",
    numeIntreg: "Botoșani",
  },
  {
    id: "BV",
    nume: "BRASOV",
    numeIntreg: "Brașov",
  },
  {
    id: "BZ",
    nume: "BUZAU",
    numeIntreg: "Buzău",
  },
  {
    id: "CJ",
    nume: "CLUJ",
    numeIntreg: "Cluj",
  },
  {
    id: "CL",
    nume: "CALARASI",
    numeIntreg: "Călărași",
  },
  {
    id: "CS",
    nume: "CARAS",
    numeIntreg: "Caraș-Severin",
  },
  {
    id: "CT",
    nume: "CONSTANTA",
    numeIntreg: "Constanța",
  },
  {
    id: "CV",
    nume: "COVASNA",
    numeIntreg: "Covasna",
  },
  {
    id: "DB",
    nume: "DAMBOVITA",
    numeIntreg: "Dâmbovița",
  },
  {
    id: "DJ",
    nume: "DOLJ",
    numeIntreg: "Dolj",
  },
  {
    id: "GJ",
    nume: "GORJ",
    numeIntreg: "Gorj",
  },
  {
    id: "GL",
    nume: "GALATI",
    numeIntreg: "Galați",
  },
  {
    id: "GR",
    nume: "GIURGIU",
    numeIntreg: "Giurgiu",
  },
  {
    id: "HD",
    nume: "HUNEDOARA",
    numeIntreg: "Hunedoara",
  },
  {
    id: "HR",
    nume: "HARGHITA",
    numeIntreg: "Harghita",
  },
  {
    id: "IF",
    nume: "ILFOV",
    numeIntreg: "Ilfov",
  },
  {
    id: "IL",
    nume: "IALOMITA",
    numeIntreg: "Ialomița",
  },
  {
    id: "IS",
    nume: "IASI",
    numeIntreg: "Iași",
  },
  {
    id: "MH",
    nume: "MEHEDINTI",
    numeIntreg: "Mehedinți",
  },
  {
    id: "MM",
    nume: "MARAMURES",
    numeIntreg: "Maramureș",
  },
  {
    id: "MS",
    nume: "MURES",
    numeIntreg: "Mureș",
  },
  {
    id: "NT",
    nume: "NEAMT",
    numeIntreg: "Neamț",
  },
  {
    id: "OT",
    nume: "OLT",
    numeIntreg: "Olt",
  },
  {
    id: "PH",
    nume: "PRAHOVA",
    numeIntreg: "Prahova",
  },
  {
    id: "SB",
    nume: "SIBIU",
    numeIntreg: "Sibiu",
  },
  {
    id: "SJ",
    nume: "SALAJ",
    numeIntreg: "Sălaj",
  },
  {
    id: "SM",
    nume: "SATU",
    numeIntreg: "Satu Mare",
  },
  {
    id: "SV",
    nume: "SUCEAVA",
    numeIntreg: "Suceava",
  },
  {
    id: "TL",
    nume: "TULCEA",
    numeIntreg: "Tulcea",
  },
  {
    id: "TM",
    nume: "TIMIS",
    numeIntreg: "Timiș",
  },
  {
    id: "TR",
    nume: "TELEORMAN",
    numeIntreg: "Teleorman",
  },
  {
    id: "VL",
    nume: "VALCEA",
    numeIntreg: "Vâlcea",
  },
  {
    id: "VN",
    nume: "VRANCEA",
    numeIntreg: "Vrancea",
  },
  {
    id: "VS",
    nume: "VASLUI",
    numeIntreg: "Vaslui",
  },
];

export const JUDETE_MAP_ID = JUDETE.reduce((acc, judet) => {
  acc[judet.id] = judet;
  return acc;
}, {} as { [id: string]: Judet });
