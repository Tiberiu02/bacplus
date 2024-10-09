import { unidecode } from "../unidecode";

export function beautifyNameNullable(name: string | undefined | null) {
  if (!name) return name;
  else return beautifyName(name);
}

export function beautifyName(name: string): string {
  // List of common Romanian link words
  const linkWords = [
    "din",
    "de",
    "la",
    "al",
    "si",
    "ale",
    "cu",
    "pe",
    "in",
    "cel",
  ];

  // Unify quotes
  name = name
    .replace(/’|‘/g, "'")
    .replace(/''|,,|„|”|“/g, '"')
    .replace(/""/g, '"')
    .replace(/'/g, '"');

  // Replace first and second quotes with „ and ”
  const quoteCount = (name.match(/"/g) || []).length;
  if (quoteCount === 2) {
    name = name.replace('"', "„").replace('"', "”");
  } else if (quoteCount > 2) {
    name = name.replace(/"/g, ""); // Remove all quotes if invalid number
  }

  // Unify Romanian diacritics
  name = name.toLowerCase();
  const diacriticsMap: [string, string][] = [
    ["ş", "ș"],
    ["ţ", "ț"],
  ];
  diacriticsMap.forEach(([a, b]) => {
    name = name
      .replace(new RegExp(a, "g"), b)
      .replace(new RegExp(a.toLowerCase(), "g"), b.toLowerCase());
  });

  // Prepare an unidecoded version for processing
  const unidecodedLiceu = unidecode(name);

  // Find all words (with their indices) using unidecoded version
  const wordsWithIndices: { word: string; index: number }[] = [];
  const wordRegex = /\b(\w+)\b/g;
  let match;

  while ((match = wordRegex.exec(unidecodedLiceu)) !== null) {
    wordsWithIndices.push({ word: match[0], index: match.index });
  }

  wordsWithIndices.forEach(({ word, index }, wordPosition) => {
    const originalWord = name.slice(index, index + word.length);
    const isLinkWord = linkWords.includes(word.toLowerCase());

    // Check if the word is a link word and not the first word
    if (!isLinkWord) {
      // Capitalize the first character and leave the rest as-is
      const newWord = originalWord[0]?.toUpperCase() + originalWord.slice(1);
      name = name.slice(0, index) + newWord + name.slice(index + word.length);
    }
  });

  // Fix whitespaces
  name = name.replace(/ +/g, " ").trim();

  return name;
}
