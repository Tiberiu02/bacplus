"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import type { ChangeEventHandler } from "react";
import { LinkText } from "~/components/LinkText";
import unidecode from "unidecode";
import { liceuFromDataArray } from "~/data/data";
import type { Liceu, LiceuDataArray } from "~/data/data";
import { PercentageBar } from "~/components/ProgressBar";
import { formtaNumber } from "~/data/formatNumber";
import { judetDupaCod } from "~/data/coduriJudete";

export function TabelLicee({
  data,
  anAdmitere,
}: {
  data: LiceuDataArray[];
  anAdmitere?: number;
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

  const licee = data
    .map(liceuFromDataArray)
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
      key: unidecode(row.numeLiceu).toLowerCase(),
    }));

  const doarUnJudet = licee.every(
    (liceu) => liceu.codJudet == licee[0]?.codJudet
  );

  const header = (
    <div className="flex justify-end">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Caută liceu"
          aria-label="Caută liceu"
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
      value={licee}
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
        style={colStyle}
        body={({ rowIndex }: { rowIndex: number }) => rowIndex}
      />
      <Column
        field="numeLiceu"
        header="Nume liceu"
        body={({ id, numeLiceu }: Liceu) => (
          <LinkText href={`/liceu/${id}`}>{numeLiceu}</LinkText>
        )}
        style={{
          padding: "0.5rem 1rem",
        }}
      />
      {!doarUnJudet && (
        <Column
          field="codJudet"
          header={
            <div className="[span:has(&)]:w-full [span:has(&)]:text-center">
              Județ
            </div>
          }
          body={({ codJudet }: Liceu) => (
            <LinkText href={`/judet/${judetDupaCod(codJudet).nume}`}>
              {judetDupaCod(codJudet).numeIntreg}
            </LinkText>
          )}
          style={colStyle}
        />
      )}
      <Column
        field="medieBac"
        sortable
        header="Medie"
        style={colStyle}
        body={(rowData: Liceu) => formtaNumber(rowData["medieBac"], 2)}
      />
      <Column
        sortable
        field="rataPromovare"
        header={
          <>
            Rata de
            <br />
            promovare
          </>
        }
        style={colStyle}
        body={(rowData: Liceu) => (
          <PercentageBar value={rowData["rataPromovare"] * 100} />
        )}
      />
      <Column
        field="numCandidati"
        sortable
        header="Candidați Bac"
        style={colStyle}
      />
      <Column
        field="medieAdm"
        sortable
        header={`Medie admitere ${anAdmitere ?? ""}`}
        style={colStyle}
        body={(rowData: Liceu) => formtaNumber(rowData["medieAdm"], 2)}
      />
    </DataTable>
  );
}
