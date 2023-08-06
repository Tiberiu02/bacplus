"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import type { ChangeEventHandler } from "react";
import { LinkText } from "~/components/LinkText";
import unidecode from "unidecode";
import type { Judet } from "~/data/data";
import { formtaNumber } from "~/data/formatNumber";
import { PercentageBar } from "~/components/ProgressBar";

export function TabelJudete({ data }: { data: Judet[] }) {
  const [sortField, setSortField] = useState<keyof Judet>("medieBac");
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

  const judete = data
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const aNull = aVal === undefined;
      const bNull = bVal === undefined;

      return sortOrder == 1
        ? bNull || (!aNull && aVal < bVal)
          ? -1
          : aNull || aVal > bVal
          ? 1
          : 0
        : bNull || (!aNull && aVal > bVal)
        ? -1
        : aNull || aVal > bVal
        ? 1
        : 0;
    })
    .map((row, ix) => ({
      ...row,
      rowIndex: ix + 1,
      key: unidecode(row.nume).toLowerCase(),
    }));

  const header = (
    <div className="flex justify-end">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Caută județ"
          aria-label="Caută județ"
        />
      </span>
    </div>
  );

  const colStyle: React.CSSProperties = {
    textAlign: "center",
    width: "0px",
    padding: "0.5rem 1rem",
  };

  return (
    <DataTable
      value={judete}
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
        setSortField(e.sortField as keyof Judet);
      }}
    >
      <Column
        header="Loc"
        style={colStyle}
        body={({ rowIndex }: { rowIndex: number }) => rowIndex}
      />
      <Column
        field="numeIntreg"
        header="Nume județ"
        body={({ nume, numeIntreg }: Judet) => (
          <LinkText href={`/judet/${nume}`}>{numeIntreg}</LinkText>
        )}
        style={{
          padding: "0.5rem 1rem",
        }}
      />
      <Column
        field="medieBac"
        sortable
        header="Medie Bacalaureat"
        style={colStyle}
        body={(rowData: Judet) => formtaNumber(rowData["medieBac"], 2)}
      />
      <Column
        sortable
        field="rataPromovareBac"
        header={<>Rata de promovare Bacalaureat</>}
        style={colStyle}
        body={(rowData: Judet) => (
          <PercentageBar value={rowData["rataPromovareBac"] * 100} />
        )}
      />
      <Column
        field="numCandidatiBac"
        sortable
        header="Candidați Bacalaureat"
        style={colStyle}
      />
      {judete.some((judet) => judet.numCandidatiEn !== undefined) && (
        <Column
          sortable
          field="medieEn"
          header="Medie Evaluare Națională"
          style={colStyle}
          body={(rowData: Judet) => formtaNumber(rowData["medieEn"], 2)}
        />
      )}
      {judete.some((judet) => judet.numCandidatiEn !== undefined) && (
        <Column
          field="numCandidatiEn"
          sortable
          header="Candidați Evaluare Națională"
          style={colStyle}
        />
      )}
    </DataTable>
  );
}
