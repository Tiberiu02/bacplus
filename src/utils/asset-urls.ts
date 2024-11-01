const baseAssetsUrl = "https://bacplus-assets.b-cdn.net";

export function getRawFileUrl(fileName: string, pathOnly = false) {
  return pathOnly ? `files/${fileName}` : `${baseAssetsUrl}/files/${fileName}`;
}

export function getPhotoUrl(id: number, size: "lg" | "xs", pathOnly = false) {
  return pathOnly
    ? `photos/${id}-${size}.webp`
    : `${baseAssetsUrl}/photos/${id}-${size}.webp`;
}

export function getUrlSigla(
  idInstitutie: string,
  size: "lg" | "xs",
  pathOnly = false
) {
  const path = `institutii/${idInstitutie}/sigla-${size}.webp`;

  if (pathOnly) {
    return path;
  } else {
    return baseAssetsUrl + "/" + path;
  }
}
