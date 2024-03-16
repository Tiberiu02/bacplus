import { query } from "./dbQuery";

export const smallIcons = Object.fromEntries(
  query.institutii.map((i) => [i.id, !!i.sigla_xs] as [string, boolean])
) as Record<string, boolean>;

export const largeIcons = Object.fromEntries(
  query.institutii.map((i) => [i.id, !!i.sigla_lg] as [string, boolean])
) as Record<string, boolean>;
