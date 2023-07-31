import stringHash from "string-hash";

export const colorFromStr = (str: string) =>
  `hsl(${stringHash(str) % 360}, 100%, 75%)`;
