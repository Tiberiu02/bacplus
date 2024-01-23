"use client";

import { Table } from "../Table";

export function TabelDateIstoriceScoala({
  rezultateEn: data,
  ierarhie,
}: {
  rezultateEn: {
    [an: string]: {
      candidati: number;
      medieEvaluareNationala?: number;
      medieLimbaRomana?: number;
      medieMatematica?: number;
      medieLimbaMaterna?: number;
      medieAbsolvire?: number;
    };
  };
  ierarhie: {
    [an: string]: number;
  };
}) {
  const entries = Object.entries(data).sort(
    (a, b) => parseInt(b[0]) - parseInt(a[0])
  );

  return (
    <Table
      data={entries}
      searchable={false}
      columns={[
        {
          type: "text",
          value: (e) => e[0],
          header: "", // An
          tdClassName: "font-medium",
          textAlign: "left",
        },
        {
          type: "number",
          value: (e) => e[1].medieEvaluareNationala,
          decimals: 2,
          header: "Medie Evaluare",
        },
        {
          type: "number",
          value: (e) => ierarhie[e[0]],
          decimals: 0,
          header: "Poziție națională",
        },
        {
          type: "number",
          value: (e) => e[1].medieLimbaRomana,
          decimals: 2,
          header: "Medie Română",
        },
        {
          type: "number",
          value: (e) => e[1].medieMatematica,
          decimals: 2,
          header: "Medie Matematică",
        },
        entries.some((e) => e[1].medieLimbaMaterna !== undefined) && {
          type: "number",
          value: (e) => e[1].medieLimbaMaterna,
          decimals: 2,
          header: "Medie Matematică",
        },
        {
          type: "number",
          value: (e) => e[1].medieAbsolvire,
          decimals: 2,
          header: "Medie Absolvire",
        },
        {
          type: "number",
          value: (e) => e[1].candidati,
          decimals: 0,
          header: "Absolvenți",
        },
      ]}
    />
  );
}
