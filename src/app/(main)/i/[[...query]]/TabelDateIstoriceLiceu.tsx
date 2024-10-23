"use client";

import { Table } from "~/components/Table";

export function TabelDateIstoriceLiceu({
  rezultateBac: data,
  admitere: dataAdm,
  ierarhie,
}: {
  rezultateBac: {
    [an: string]: {
      medie?: number;
      candidati: number;
      candidatiValizi: number;
      rataPromovare?: number;
    };
  };
  admitere: {
    [an: string]: number | undefined;
  };
  ierarhie: {
    [an: string]: number;
  };
}) {
  const ani = [...new Set(Object.keys(data).concat(Object.keys(dataAdm)))].sort(
    (a, b) => parseInt(b) - parseInt(a)
  );

  const entries = ani.map((an) => ({
    an,
    ...data[an],
    medieAdm: dataAdm[an],
    pozitieBac: ierarhie[an] ?? undefined,
  }));

  return (
    <div className="flex w-full flex-col items-center gap-8 p-0">
      <Table
        data={entries}
        searchable={false}
        columns={[
          {
            type: "text",
            value: (e) => e.an.toString(),
            header: "", // An
            tdClassName: "font-semibold",
            textAlign: "left",
          },
          entries.some((e) => e.medieAdm !== undefined) && {
            type: "number",
            decimals: 2,
            value: (e) => e.medieAdm ?? undefined,
            header: "Medie Admitere",
          },
          {
            type: "number",
            value: (e) => e.medie ?? undefined,
            decimals: 2,
            header: "Medie Bac",
          },
          {
            type: "number",
            value: (e) => e.pozitieBac ?? undefined,
            decimals: 0,
            header: "Poziție Națională Bac",
          },
          {
            type: "number",
            value: (e) => e.candidati ?? undefined,
            decimals: 0,
            header: "Elevi Bac",
          },
          {
            type: "percentage",
            value: (e) => e.rataPromovare ?? undefined,
            header: "Rată de promovare",
          },
        ]}
      />
    </div>
  );
}
