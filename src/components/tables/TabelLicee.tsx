"use client";

import { liceuFromDataArray } from "~/data/data";
import type { Liceu, LiceuDataArray } from "~/data/data";
import { judetDupaCod } from "~/data/coduriJudete";
import { Table } from "~/components/Table";

export function TabelLicee({
  data,
  anAdmitere,
  arataJudet,
}: {
  data: LiceuDataArray[];
  arataJudet: boolean;
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
          header: "Loc",
          value: (rowData, rowIndex) => rowIndex + 1,
        },
        {
          type: "text",
          header: "Nume liceu",
          value: (rowData) => rowData.numeLiceu,
          href: (rowData) => `/liceu/${rowData.id}`,
          widthGrow: true,
          textAlign: "left",
          searchable: true,
        },
        ...(arataJudet
          ? ([
              {
                type: "text",
                header: "Județ",
                value: (rowData: Liceu) =>
                  judetDupaCod(rowData.codJudet).numeIntreg,
                href: (rowData: Liceu) =>
                  `/judet/${judetDupaCod(rowData.codJudet).nume}`,
              },
            ] as const)
          : []),
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
