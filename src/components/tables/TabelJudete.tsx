"use client";

import type { Judet } from "~/data/data";
import { Table } from "~/components/Table";

export function TabelJudete({ data }: { data: Judet[] }) {
  return (
    <Table
      data={data}
      searchPlaceholder="Caută județ"
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
          header: "Nume județ",
          value: (rowData) => rowData.numeIntreg,
          href: (rowData) => `/judet/${rowData.nume}`,
          widthGrow: true,
          textAlign: "left",
          searchable: true,
        },
        {
          type: "number",
          decimals: 2,
          header: "Medie Bacalaureat",
          value: (rowData) => rowData.medieBac,
          sortable: true,
          defaultSortingColumn: true,
        },
        {
          type: "percentage",
          header: "Rata de promovare Bacalaureat",
          value: (rowData) => rowData.rataPromovareBac,
          sortable: true,
        },
        {
          type: "number",
          decimals: 0,
          header: "Candidați Bacalaureat",
          value: (rowData) => rowData.numCandidatiBac,
          sortable: true,
        },
        data.some((rowData) => rowData.medieEn != undefined) && {
          type: "number",
          header: "Medie Evaluare Națională",
          decimals: 2,
          value: (rowData) => rowData.medieEn,
          sortable: true,
        },
        data.some((rowData) => rowData.numCandidatiEn != undefined) && {
          type: "number",
          header: "Candidați Evaluare Națională",
          decimals: 0,
          value: (rowData) => rowData.numCandidatiEn,
          sortable: true,
        },
      ]}
    />
  );
}
