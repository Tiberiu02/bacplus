import { getUrlFromName } from "./urlFromName";

export type CompressedUrlData = 0 | 1 | 2 | string;

export function getUrlFromCompressedData(
  name: string,
  siiir: string | undefined,
  data: CompressedUrlData
) {
  if (data == 0 || !siiir) {
    // No URL
    return undefined;
  } else if (data == 1) {
    // Basic URL (= name)
    return getUrlFromName(name);
  } else if (data == 2) {
    // URL with SIIIR
    return getUrlFromName(name) + "-" + siiir;
  } else {
    // URL with custom data (county name, etc.)
    return getUrlFromName(name) + "-" + data;
  }
}

export function getCompressedUrlData(
  url: string | undefined,
  name: string,
  siiir: string | undefined
): CompressedUrlData {
  if (!url || !siiir) return 0;

  const basicUrl = getUrlFromName(name);
  if (url == basicUrl) return 1;

  if (!url.startsWith(basicUrl + "-")) {
    console.error(`Malformed URL '${url}' for ${name}`);
  }

  const suffix = url.slice(basicUrl.length + 1);
  if (suffix == siiir) return 2;

  return suffix;
}
