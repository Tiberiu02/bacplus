"use client";

import { scoalaFromDataArray } from "~/data/data";
import type { ScoalaDataArray } from "~/data/data";
import { Table } from "~/components/Table";

export function TabelScoli({ data }: { data: ScoalaDataArray[] }) {
  return (
    <Table
      data={data}
      decompressionFn={scoalaFromDataArray}
      searchPlaceholder="Caută școală"
      columns={[
        {
          type: "number",
          decimals: 0,
          header: "",
          value: (rowData, rowIndex) => rowIndex + 1,
          tdClassName: "text-gray-500",
        },
        {
          type: "text",
          header: "Nume școală",
          value: (rowData) => rowData.numeScoala,
          href: (rowData) => `/scoala/${rowData.id}`,
          widthGrow: true,
          searchable: true,
          textAlign: "left",
        },
        {
          type: "number",
          decimals: 2,
          header: "Medie Evaluare Națională",
          value: (rowData) => rowData.medieEvaluareNationala,
          sortable: true,
          defaultSortingColumn: true,
        },
        {
          type: "number",
          decimals: 2,
          header: "Medie Limba Română",
          value: (rowData) => rowData.medieLimbaRomana,
          sortable: true,
        },
        {
          type: "number",
          decimals: 2,
          header: "Medie Matematică",
          value: (rowData) => rowData.medieMatematica,
          sortable: true,
        },
        {
          type: "number",
          decimals: 0,
          header: "Elevi",
          value: (rowData) => rowData.numCandidati,
          sortable: true,
        },
      ]}
    />
  );
}
