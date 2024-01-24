export function nonBreakableName(name: string) {
  if (name.includes("„")) {
    const [p1, p2] = name.split("„");

    if (!p1 || !p2) return name;

    const [p3, p4] = p2.split("”");

    if (!p3 || !p4) return name;

    return `${p1}„${p3.split(" ").join("\u00A0")}”${p4}`;
  }
  return name;
}
