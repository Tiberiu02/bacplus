"use client";

import { scoalaFromDataArray } from "~/data/data";
import type { ScoalaDataArray } from "~/data/data";
import { Table } from "~/components/Table";
import { nonBreakableName } from "~/data/nonBreakableName";

export function TabelScoli({ data }: { data: ScoalaDataArray[] }) {
  return (
    <Table
      data={data}
      decompressionFn={scoalaFromDataArray}
      searchPlaceholder="Caută școală"
      keyFn={(rowData) => rowData.id}
      columns={[
        {
          type: "number",
          decimals: 0,
          header: "",
          value: (_rowData, rowIndex) => rowIndex + 1,
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
              {nonBreakableName(rowData.numeScoala)}
            </>
          ),
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
