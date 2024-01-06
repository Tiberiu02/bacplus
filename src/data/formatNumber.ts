export function formtaNumber(
  value: number | null | undefined,
  maxDecimals: number,
  minDecimals?: number
) {
  if (value === undefined || value === null) return "";

  return value.toLocaleString("ro-RO", {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits:
      minDecimals === undefined ? maxDecimals : minDecimals,
  });
}
