import { query } from "./dbQuery";

export const ierarhieLicee = {} as Record<string, Record<number, number>>;

for (const an of query.aniBac) {
  const liceeSortate = query.bac
    .filter((b) => b.an === an.an)
    .sort((a, b) => {
      const aVal = a._avg.my_medie;
      const bVal = b._avg.my_medie;

      const aNull = aVal === null;
      const bNull = bVal === null;

      return bNull || (!aNull && aVal > bVal)
        ? -1
        : aNull || aVal < bVal
        ? 1
        : 0;
    });

  let pos = 1;
  liceeSortate.forEach((liceu, i) => {
    if (liceu._avg.my_medie !== liceeSortate[i - 1]?._avg.my_medie) {
      pos = i + 1;
    }
    const idLiceu = liceu.id_liceu;
    if (!idLiceu) return;

    const ierarhieLiceu =
      ierarhieLicee[idLiceu] || (ierarhieLicee[idLiceu] = {});
    ierarhieLiceu[an.an] = pos;
  });
}

export const ierarhieScoli = {} as Record<string, Record<number, number>>;

for (const an of query.aniEn) {
  const scoliSortate = query.en
    .filter((b) => b.an === an.an)
    .sort((a, b) => {
      const aVal = a._avg.medie_en;
      const bVal = b._avg.medie_en;

      const aNull = aVal === null;
      const bNull = bVal === null;

      return bNull || (!aNull && aVal > bVal)
        ? -1
        : aNull || aVal < bVal
        ? 1
        : 0;
    });

  let pos = 1;
  scoliSortate.forEach((scoala, i) => {
    if (scoala._avg.medie_en !== scoliSortate[i - 1]?._avg.medie_en) {
      pos = i + 1;
    }
    const idScoala = scoala.id_scoala;
    if (!idScoala) return;

    const ierarhieScoala =
      ierarhieScoli[idScoala] || (ierarhieScoli[idScoala] = {});
    ierarhieScoala[an.an] = pos;
  });
}
