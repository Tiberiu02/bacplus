import { judetDupaNume } from "./coduriJudete";

export function parseParamsTop(
  params: string[] | undefined,
  defaultAn: number
): [number, ReturnType<typeof judetDupaNume> | undefined, true?] {
  if (!params) {
    return [defaultAn, undefined];
  }

  const [p1, p2] = params;
  if (!p1) {
    return [defaultAn, undefined];
  } else if (!p2) {
    if (!Number.isNaN(parseInt(p1))) {
      return [parseInt(p1), undefined];
    } else {
      return [defaultAn, judetDupaNume(p1)];
    }
  } else {
    if (!Number.isNaN(parseInt(p2))) {
      return [parseInt(p2), judetDupaNume(p1)];
    } else {
      return [parseInt(p1), judetDupaNume(p2), true];
    }
  }
}
