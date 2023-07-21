export function formtaNumber(value: number, decimals: number) {
  return value.toLocaleString("ro-RO", {
    maximumFractionDigits: decimals,
  });
}
