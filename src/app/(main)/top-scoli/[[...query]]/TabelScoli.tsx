"use client";

import { scoalaFromDataArray } from "./data";
import type { ScoalaDataArray } from "./data";
import { Table } from "~/components/Table";
import { nonBreakableName } from "~/data/nonBreakableName";
import { StaticData } from "~/static-data/staticData";
import { useStaticData } from "~/static-data/useStaticData";

export function TabelScoli({
  data: staticData,
  an,
}: {
  data: StaticData<ScoalaDataArray[]>;
  an: number;
}) {
  const data = useStaticData(staticData);

  return (
    <Table
      data={data}
      decompressionFn={scoalaFromDataArray}
      searchPlaceholder="Caută școală"
      keyFn={(rowData) => rowData.siiir ?? JSON.stringify(rowData)}
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
          href: (rowData) =>
            rowData.url
              ? `/i/${rowData.url}${rowData.liceu ? "/gimnaziu" : ""}`
              : "",
          widthGrow: true,
          searchable: true,
          textAlign: "left",
          tdClassName: "min-w-[14rem] [text-wrap:balance]",
          customRender: (rowData) => (
            <>
              {rowData.icon && rowData.siiir && (
                <img
                  src={`https://assets.bacplus.ro/institutii/${rowData.siiir}/sigla-xs.webp`}
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
          header: `Medie Evaluare ${an}`,
          value: (rowData) => rowData.medieEvaluareNationala,
          sortable: true,
          defaultSortingColumn: true,
        },
        {
          type: "number",
          decimals: 2,
          header: `Medie Română ${an}`,
          value: (rowData) => rowData.medieLimbaRomana,
          sortable: true,
        },
        {
          type: "number",
          decimals: 2,
          header: `Medie Matematică ${an}`,
          value: (rowData) => rowData.medieMatematica,
          sortable: true,
        },
        {
          type: "number",
          decimals: 0,
          header: `Elevi ${an}`,
          value: (rowData) => rowData.numCandidati,
          sortable: true,
        },
      ]}
    />
  );
}
