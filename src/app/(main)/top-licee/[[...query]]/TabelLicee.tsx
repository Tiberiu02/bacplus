"use client";

import { Table } from "~/components/Table";
import { nonBreakableName } from "~/data/nonBreakableName";
import { type LiceuDataArray, liceuFromDataArray } from "./data";
import { StaticData } from "~/static-data/staticData";
import { useStaticData } from "~/static-data/useStaticData";

export function TabelLicee({
  data: staticData,
  anAdmitere,
  anBac,
}: {
  data: StaticData<LiceuDataArray[]>;
  anAdmitere: number;
  anBac: number;
}) {
  const data = useStaticData(staticData);
  const licee = data.map(liceuFromDataArray);

  return (
    <Table
      data={licee}
      searchPlaceholder="Caută liceu"
      keyFn={(rowData) => rowData.siiir || JSON.stringify(rowData)}
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
          href: (rowData) =>
            rowData.urlId ? `/i/${rowData.urlId}` : undefined,
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
              {nonBreakableName(rowData.numeLiceu)}
            </>
          ),
        },
        {
          type: "number",
          header: `Medie Bac ${anBac}`,
          decimals: 2,
          value: (rowData) => rowData.medieBac,
          sortable: true,
          defaultSortingColumn: true,
        },
        {
          type: "number",
          decimals: 2,
          header: `Medie Admitere ${anAdmitere}`,
          value: (rowData) => rowData.medieAdm,
          sortable: true,
        },
        {
          type: "percentage",
          header: `Rată de promovare ${anBac}`,
          value: (rowData) => rowData.rataPromovare,
          sortable: true,
        },
        {
          type: "number",
          decimals: 0,
          header: `Elevi Bac ${anBac}`,
          value: (rowData) => rowData.numCandidati,
          sortable: true,
        },
      ]}
    />
  );
}
