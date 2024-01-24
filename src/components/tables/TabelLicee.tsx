"use client";

import { liceuFromDataArray } from "~/data/data";
import type { LiceuDataArray } from "~/data/data";
import { Table } from "~/components/Table";
import { nonBreakableName } from "~/data/nonBreakableName";

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
          decimals: 0,
          header: "",
          value: (_rowData, rowIndex) => rowIndex + 1,
          tdClassName: "text-gray-500 pr-",
        },
        {
          type: "text",
          header: "Nume liceu",
          value: (rowData) => rowData.numeLiceu,
          href: (rowData) => `/liceu/${rowData.id}`,
          widthGrow: true,
          searchable: true,
          textAlign: "left",
          tdClassName: "min-w-[14rem] [text-wrap:balance]",
          customRender: (rowData) => (
            <>
              {rowData.icon && (
                <img
                  src={`/icons-xs/${rowData.id}.webp`}
                  alt=""
                  className="mr-2 inline-block h-5 w-5 translate-y-[-1px] transition-opacity duration-200 group-hover:opacity-50"
                />
              )}
              {nonBreakableName(rowData.numeLiceu)}
            </>
          ),
        },
        {
          type: "number",
          header: "Medie Bac",
          decimals: 2,
          value: (rowData) => rowData.medieBac,
          sortable: true,
          defaultSortingColumn: true,
        },
        {
          type: "number",
          decimals: 2,
          header: `Medie admitere ${anAdmitere ?? ""}`,
          value: (rowData) => rowData.medieAdm,
          sortable: true,
        },
        {
          type: "percentage",
          header: "Rată de promovare",
          value: (rowData) => rowData.rataPromovare,
          sortable: true,
        },
        {
          type: "number",
          decimals: 0,
          header: "Elevi Bac",
          value: (rowData) => rowData.numCandidati,
          sortable: true,
        },
      ]}
    />
  );
}
