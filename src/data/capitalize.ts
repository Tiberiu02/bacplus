const specialWords = ["si", "ale", "MI", "C/C++", "TEO", "I/II", "ST-NAT", "SN", "MATE-INFO", "Matematica-Informatica"];

const specialWordsMap = specialWords.reduce((acc, word) => {
    acc[word.toLowerCase()] = word;
    return acc;
}, {} as Record<string, string>);

export function capitalize(s: string) {
    return s
        .toLowerCase()
        .split(" ")
        .map((word) => {
            if (specialWordsMap[word]) {
                return specialWordsMap[word];
            }

            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}