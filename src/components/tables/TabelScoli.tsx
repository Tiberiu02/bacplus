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
          header: "Elevi",
          value: (rowData) => rowData.numCandidati,
          sortable: true,
        },
      ]}
    />
  );
}
