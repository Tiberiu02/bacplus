export function unidecode(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
