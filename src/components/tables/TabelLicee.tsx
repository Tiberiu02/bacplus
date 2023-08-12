"use client";

import { liceuFromDataArray } from "~/data/data";
import type { LiceuDataArray } from "~/data/data";
import { Table } from "~/components/Table";

export function TabelLicee({
  data,
  anAdmitere,
}: {
  data: LiceuDataArray[];
  anAdmitere?: number;
}) {
  return (
    <Table
      data={data}
      decompressionFn={liceuFromDataArray}
      searchPlaceholder="Caută liceu"
      columns={[
        {
          type: "number",
          header: "",
          value: (rowData, rowIndex) => rowIndex + 1,
          tdClassName: "text-gray-500",
        },
        {
          type: "text",
          header: "Nume liceu",
          value: (rowData) => rowData.numeLiceu,
          href: (rowData) => `/liceu/${rowData.id}`,
          widthGrow: true,
          searchable: true,
          textAlign: "left",
        },
        {
          type: "number",
          header: "Medie Bac",
          value: (rowData) => rowData.medieBac,
          sortable: true,
          defaultSortingColumn: true,
        },
        {
          type: "percentage",
          header: "Rata de promovare",
          value: (rowData) => rowData.rataPromovare,
          sortable: true,
        },
        {
          type: "number",
          header: "Candidați Bac",
          value: (rowData) => rowData.numCandidati,
          sortable: true,
        },
        {
          type: "number",
          header: `Medie admitere ${anAdmitere ?? ""}`,
          value: (rowData) => rowData.medieAdm,
          sortable: true,
        },
      ]}
    />
  );
}
