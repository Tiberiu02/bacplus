export function formtaNumber(
  value: number | null | undefined,
  decimals: number
) {
  if (value === undefined || value === null) return "";

  return value.toLocaleString("ro-RO", {
    maximumFractionDigits: decimals,
  });
}
