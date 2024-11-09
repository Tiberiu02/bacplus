export function formatNumber(
  value: number | null | undefined,
  maxDecimals: number,
  minDecimals?: number,
  fallback: string = ""
) {
  if (value === undefined || value === null) return fallback;

  return value.toLocaleString("ro-RO", {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits:
      minDecimals === undefined ? maxDecimals : minDecimals,
  });
}
