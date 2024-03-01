export function getId(nume: string, codJudet: string) {
  return (
    nume
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, " ")
      .trim()
      .replace(/ +/g, "_") +
    "_" +
    codJudet
  );
}
