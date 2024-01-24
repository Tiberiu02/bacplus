export function nonBreakableName(name: string) {
  if (name.includes("„")) {
    const [p1, p2] = name.split("„");

    if (!p1 || !p2) return name;

    const [p3, p4] = p2.split("”");

    if (!p3 || !p4) return name;

    return `${p1}„${p3.length > 25 ? p3 : p3.replaceAll(" ", "\u00A0")}”${p4}`;
  }
  return name;
}
