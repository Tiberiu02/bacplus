export function roundDecimals(num: number | undefined, decimals: number) {
  if (!num) return undefined;

  const p10 = 10 ** decimals;
  return Math.round(num * p10) / p10;
}
