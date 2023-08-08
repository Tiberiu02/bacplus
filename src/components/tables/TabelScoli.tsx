"use client";

import { scoalaFromDataArray } from "~/data/data";
import type { Scoala, ScoalaDataArray } from "~/data/data";
import { Table } from "~/components/Table";
import { judetDupaCod } from "~/data/coduriJudete";

export function TabelScoli({
  data,
  arataJudet,
}: {
  data: ScoalaDataArray[];
  arataJudet?: boolean;
}) {
  return (
    <Table
      data={data}
      decompressionFn={scoalaFromDataArray}
      searchPlaceholder="Caută școală"
      columns={[
        {
          type: "number",
          header: "Loc",
          value: (rowData, rowIndex) => rowIndex + 1,
        },
        {
          type: "text",
          header: "Nume școală",
          value: (rowData) => rowData.numeScoala,
          href: (rowData) => `/scoala/${rowData.id}`,
          widthGrow: true,
          textAlign: "left",
          searchable: true,
        },
        ...(arataJudet
          ? ([
              {
                type: "text",
                header: "Județ",
                value: (rowData: Scoala) =>
                  judetDupaCod(rowData.codJudet).numeIntreg,
                href: (rowData: Scoala) =>
                  `/judet/${judetDupaCod(rowData.codJudet).nume}`,
              },
            ] as const)
          : []),
        {
          type: "number",
          header: "Medie Evaluare Națională",
          value: (rowData) => rowData.medieEvaluareNationala,
          sortable: true,
          defaultSortingColumn: true,
        },
        {
          type: "number",
          header: "Medie Limba Română",
          value: (rowData) => rowData.medieLimbaRomana,
          sortable: true,
        },
        {
          type: "number",
          header: "Medie Matematică",
          value: (rowData) => rowData.medieMatematica,
          sortable: true,
        },
        {
          type: "number",
          header: "Absolvenți",
          value: (rowData) => rowData.numCandidati,
          sortable: true,
        },
      ]}
    />
  );
}
