"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { LinkText } from "~/components/LinkText";
import unidecode from "unidecode";
import { Liceu, decompressLicee } from "~/data/licee";
import { PercentageBar } from "./ProgressBar";
import { formtaNumber } from "~/app/utils/formatNumber";
import { JUDETE_MAP } from "~/data/coduriJudete";

export function TabelLicee({
  data: dataCompressed,
  coloanaJudet,
}: {
  data: any[];
  coloanaJudet?: boolean;
}) {
  const [sortField, setSortField] = useState<keyof Liceu>("medieBac");
  const [sortOrder, setSortOrder] = useState<1 | -1>(-1);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({});

  const onGlobalFilterChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = unidecode(e.target.value);
    setFilters({
      key: { value, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue(value);
  };

  const data = decompressLicee(dataCompressed)
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      return (
        sortOrder *
        (!bVal || (aVal && aVal < bVal) ? -1 : !aVal || aVal > bVal ? 1 : 0)
      );
    })
    .map((row, ix) => ({
      ...row,
      rowIndex: ix + 1,
      key: unidecode(row.numeLiceu).toLowerCase(),
    }));

  const renderHeader = () => {
    return (
      <div className="justify-content-end flex">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Caută liceu"
          />
        </span>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      rowsPerPageOptions={[10, 25, 50, 100]}
      sortField={sortField}
      sortOrder={sortOrder}
      filters={filters}
      header={header}
      showGridlines
      onSort={(e) => {
        setSortOrder(
          sortField == e.sortField
            ? e.sortOrder == 1
              ? 1
              : -1
            : e.sortOrder == 1
            ? -1
            : 1
        );
        setSortField(e.sortField as keyof Liceu);
      }}
    >
      <Column
        header="Loc"
        style={{
          textAlign: "center",
          width: "10px",
          padding: "0.5rem 1rem",
        }}
        body={(rowData) => rowData["rowIndex"]}
      />
      <Column
        field="numeLiceu"
        header="Nume liceu"
        body={(rowData) => (
          <LinkText href={`/liceu/${rowData["id"]}`}>
            {rowData["numeLiceu"]}
          </LinkText>
        )}
        style={{
          padding: "0.5rem 1rem",
        }}
      />
      {coloanaJudet && (
        <Column
          field="codJudet"
          header={
            <div className="[span:has(&)]:w-full [span:has(&)]:text-center">
              Județ
            </div>
          }
          body={(rowData) => (
            <LinkText href={`/judet/${JUDETE_MAP[rowData["codJudet"]]?.nume}`}>
              {JUDETE_MAP[rowData["codJudet"]]?.numeIntreg}
            </LinkText>
          )}
          style={{
            width: "10px",
            padding: "0.5rem 1rem",
          }}
        />
      )}
      <Column
        field="numCandidati"
        sortable
        header="Elevi"
        style={{
          textAlign: "center",
          width: "10px",
          padding: "0.5rem 1rem",
        }}
      />
      <Column
        sortable
        field="rataPromovare"
        header={
          <span>
            Rata de
            <br />
            promovare
          </span>
        }
        style={{
          textAlign: "center",
          width: "100px",
          padding: "0.5rem 1rem",
        }}
        body={(rowData) => (
          <PercentageBar value={rowData["rataPromovare"] * 100} />
        )}
      />
      <Column
        field="medieBac"
        sortable
        header="Medie"
        style={{
          textAlign: "center",
          width: "10px",
          padding: "0.5rem 1rem",
        }}
        body={(rowData) => formtaNumber(rowData["medieBac"], 2)}
      />
    </DataTable>
  );
}
